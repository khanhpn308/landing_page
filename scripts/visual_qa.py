"""Compare the five approved landing-page mockups and audit desktop/mobile.

Start Vite in another terminal:
    npm run dev
    source .venv/bin/activate
    pip install playwright pillow
    python -m playwright install chromium
    python scripts/visual_qa.py

Outputs screenshots, overlays, heatmaps and results.json in artifacts/visual-qa.
"""
import argparse
import json
import sys
from pathlib import Path
from urllib.request import urlopen
from PIL import Image, ImageChops, ImageEnhance, ImageStat
from playwright.sync_api import sync_playwright

SECTIONS = [
    ("home", "01-hero.png"),
    ("about", "02-about.png"),
    ("learning", "03-learning.png"),
    ("projects", "04-projects.png"),
    ("roadmap", "05-roadmap.png"),
]
MOBILE = [(1908, 960), (1792, 900), (768, 1024), (430, 932), (390, 844), (360, 780), (320, 700)]

def ready(page, url):
    page.goto(url, wait_until="domcontentloaded", timeout=15000)
    page.locator("#home").wait_for(timeout=10000)
    page.add_style_tag(content="html{scroll-behavior:auto!important}*,*::before,*::after{animation:none!important;transition:none!important}")
    page.evaluate("Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,3000))])")

def focus(page, section):
    page.evaluate("""id=>{
       const e=document.getElementById(id),h=document.querySelector('.site-header').offsetHeight;
       window.scrollTo(0,id==='home'?0:e.getBoundingClientRect().top+scrollY-h);
    }""",section)
    page.wait_for_timeout(220)
    page.evaluate("""async id=>{
       const imgs=[...document.getElementById(id).querySelectorAll('img')];
       imgs.forEach(img=>img.loading='eager');
       await Promise.race([Promise.all(imgs.map(img=>img.decode().catch(()=>null))),new Promise(r=>setTimeout(r,3500))]);
    }""",section)

def diagnose(page):
    return page.evaluate("""()=>{
      const width=document.documentElement.clientWidth;
      return {
        overflow:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)>width+2,
        clientWidth:width,
        bodyScrollWidth:document.body.scrollWidth,
        brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.getAttribute('src')),
        badAnchors:[...document.querySelectorAll('a[href^="#"]')]
          .map(a=>a.getAttribute('href')).filter(h=>h.length>1&&!document.getElementById(h.slice(1)))
      };
    }""")

def mobile_composition(page):
    """Structural checks that overflow-only QA missed on phones."""
    return page.evaluate("""() => {
      const rect = s => document.querySelector(s)?.getBoundingClientRect();
      const hero = rect('.hero'), cta = rect('.hero .button-row');
      const focus = rect('.hero-focus'), intro = rect('.join-intro p');
      const joinImg = rect('.join-intro>img'), project = rect('.featured-project');
      const projectCopy = rect('.featured-content');
      const overlap = (a,b) => Boolean(a && b &&
        Math.min(a.right,b.right)-Math.max(a.left,b.left)>4 &&
        Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>4);
      const inside = (inner,outer) => Boolean(inner && outer &&
        inner.left>=outer.left-2 && inner.right<=outer.right+2 &&
        inner.top>=outer.top-2 && inner.bottom<=outer.bottom+2);
      return {
        heroCtaNotCovered: !overlap(cta,focus),
        heroContentContained: inside(focus,hero),
        joinPhotoBelowCopy: !overlap(intro,joinImg) && joinImg.top>=intro.bottom-2,
        projectCopyContained: inside(projectCopy,project),
        mobileHeroUsesCleanAsset: getComputedStyle(document.querySelector('.hero-bg')).backgroundImage.includes('hero-machines.webp'),
        mobileAboutUsesCleanAsset: getComputedStyle(document.querySelector('.about-preview-photo')).backgroundImage.includes('join-hardware.webp')
      };
    }""")

def roadmap_text_geometry(page):
    """Guard against Vietnamese headline wrapping into milestone cards."""
    return page.evaluate("""() => {
      const section=document.querySelector('#roadmap');
      const heading=section.querySelector('.roadmap-top h2');
      const intro=section.querySelector('.roadmap-top>p');
      const milestones=[...section.querySelectorAll('.milestone')];
      const lh=parseFloat(getComputedStyle(heading).lineHeight);
      const lines=heading.getBoundingClientRect().height/lh;
      const overlap=(a,b)=>{
        const x=Math.min(a.right,b.right)-Math.max(a.left,b.left);
        const y=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);
        return x>6 && y>6;
      };
      const overlapTargets=[];
      for(const [n,element] of [['headline',heading],['intro',intro]]){
        for(const [i,stage] of milestones.entries()){
          const title=stage.querySelector('.milestone-head').getBoundingClientRect();
          const photo=stage.querySelector('.milestone-media').getBoundingClientRect();
          const rect=element.getBoundingClientRect();
          if(overlap(rect,title) || overlap(rect,photo)){
            overlapTargets.push(n + ' vs milestone ' + (i+1));
          }
        }
      }
      return {
        headingLines:Math.round(lines*100)/100,
        headlineBottom:Math.round(heading.getBoundingClientRect().bottom),
        introBottom:Math.round(intro.getBoundingClientRect().bottom),
        milestone2Top:Math.round(milestones[1].getBoundingClientRect().top),
        overlaps:overlapTargets
      };
    }""")

def compare(ref_path, shot_path, out_base):
    ref=Image.open(ref_path).convert("RGB")
    actual=Image.open(shot_path).convert("RGB")
    if ref.size!=actual.size:
        raise ValueError(f"Dimensions differ: {actual.size} vs {ref.size}")
    Image.blend(ref,actual,.5).save(f"{out_base}-overlay.png")
    diff=ImageChops.difference(ref,actual)
    ImageEnhance.Contrast(diff).enhance(2.2).save(f"{out_base}-diff.png")
    mae=sum(ImageStat.Stat(diff).mean)/3
    return round(mae,2)

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--url",default="http://127.0.0.1:5173")
    parser.add_argument("--refs",type=Path,default=Path("references"))
    parser.add_argument("--out",type=Path,default=Path("artifacts/visual-qa"))
    args=parser.parse_args()
    try:
        urlopen(args.url,timeout=4).close()
    except Exception as exc:
        print(f"Vite server unavailable at {args.url}: {exc}\nRun npm run dev in another terminal.",file=sys.stderr)
        return 2
    args.out.mkdir(parents=True,exist_ok=True)
    report={"desktop":{},"responsive":{},"interactions":{},"findings":[]}
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True)
        for section,filename in SECTIONS:
            ref=args.refs/filename
            if not ref.exists():
                report["findings"].append(f"Missing reference: {ref}")
                continue
            with Image.open(ref) as img: w,h=img.size
            page=browser.new_page(viewport={"width":w,"height":h},device_scale_factor=1)
            errors=[]
            page.on("pageerror",lambda err:errors.append(str(err)))
            try:
                ready(page,args.url)
                focus(page,section)
                shot=args.out/f"{section}-actual.png"
                page.screenshot(path=str(shot),animations="disabled")
                metric=diagnose(page)
                metric["viewport"]=[w,h]
                metric["pixelMAE"]=compare(ref,shot,args.out/section)
                metric["pageErrors"]=errors
                if section=="roadmap":
                    layout=roadmap_text_geometry(page)
                    metric["roadmapTextGeometry"]=layout
                    if layout["headingLines"]>2.15 or layout["overlaps"]:
                        report["findings"].append(f"1536 desktop Vietnamese Roadmap collision: {layout}")
                report["desktop"][section]=metric
                if metric["overflow"] or metric["brokenImages"] or metric["badAnchors"] or errors:
                    report["findings"].append(f"{section}: review {metric}")
                print(f"{section}: MAE={metric['pixelMAE']} viewport={w}x{h}")
            except Exception as exc:
                report["findings"].append(f"{section}: {exc}")
            finally:
                page.close()
        for w,h in MOBILE:
            page=browser.new_page(viewport={"width":w,"height":h},device_scale_factor=1)
            key=f"{w}x{h}"
            try:
                ready(page,args.url)
                checks=[]
                for section,_ in SECTIONS+[("tracks",""),("join","")]:
                    focus(page,section)
                    page.screenshot(path=str(args.out/f"{key}-{section}.png"),animations="disabled")
                    check=diagnose(page)
                    if section=="roadmap" and w>900:
                        layout=roadmap_text_geometry(page)
                        if layout["headingLines"]>2.15 or layout["overlaps"]:
                            checks.append(f"Roadmap Vietnamese text collision: {layout}")
                        scenery=page.evaluate("""() => {
                          const b=document.querySelector('.roadmap-background');
                          const p=document.querySelector('.roadmap-path');
                          const nodes=document.querySelector('.roadmap-items');
                          const paths=[...p.querySelectorAll('path')];
                          const road=paths[0];
                          const v=road.getPointAtLength(road.getTotalLength());
                          const rect=b.getBoundingClientRect();
                          return {
                            endpoint:[Math.round(v.x),Math.round(v.y)],
                            pathCount:paths.length,
                            strokeWidth:parseFloat(getComputedStyle(road).strokeWidth),
                            stroke:getComputedStyle(road).stroke,
                            fullBleed: Math.abs(rect.left)<=2 && Math.abs(rect.right-innerWidth)<=2,
                            correctStack: Number(getComputedStyle(b).zIndex)<Number(getComputedStyle(p).zIndex) &&
                              Number(getComputedStyle(p).zIndex)<Number(getComputedStyle(nodes).zIndex),
                            oldMountainRemoved:document.querySelector('.roadmap-mountain, .roadmap-landscape')===null,
                            backgroundCSS:getComputedStyle(b).backgroundImage.includes('roadmap-landscape.svg')
                          };
                        }""")
                        if not all((scenery["fullBleed"],scenery["correctStack"],scenery["oldMountainRemoved"],scenery["backgroundCSS"])):
                            checks.append(f"Roadmap layers or panorama incorrect: {scenery}")
                        if scenery["pathCount"]!=1 or abs(scenery["strokeWidth"]-12)>0.2:
                            checks.append(f"Roadmap stroke should be a single uniform 12px path: {scenery}")
                        if abs(scenery["endpoint"][0]-1426)>2 or abs(scenery["endpoint"][1]-268)>2:
                            checks.append(f"Roadmap path must touch the summit at 1426,268: {scenery['endpoint']}")
                        clearance=page.evaluate("""()=>{
                          const bar=document.querySelector('.roadmap-benefits').getBoundingClientRect();
                          const years=[...document.querySelectorAll('.milestone-year')]
                             .map(el=>el.getBoundingClientRect().bottom);
                          return Math.round(bar.top-Math.max(...years));
                        }""")
                        if clearance<8:
                            checks.append(f"Roadmap year labels overlap benefits bar: clearance {clearance}px")
                    if check["overflow"]:
                        checks.append(f"Horizontal overflow in {section}")
                    if check["brokenImages"]:
                        checks.append(f"Broken images in {section}: {check['brokenImages']}")
                if w<=620:
                    composition=mobile_composition(page)
                    if not all(composition.values()):
                        checks.append(f"Mobile component collision or source-image regression: {composition}")
                    # Capture complete components as well as the initial viewport;
                    # the old tests took only the upper 700-844px of a long mobile page.
                    for label, selector in [
                        ("hero-full","#home"),
                        ("about-preview",".about-preview"),
                        ("tracks-full","#tracks"),
                        ("project-feature",".featured-project"),
                        ("join-intro",".join-intro"),
                        ("join-form",".join-form")
                    ]:
                        page.locator(selector).screenshot(
                            path=str(args.out/f"{key}-{label}.png"),
                            animations="disabled",timeout=15000
                        )
                if w<=1000:
                    if not page.locator(".mobile-menu").is_visible():
                        checks.append("Collapsed navigation toggle missing")
                    else:
                        page.locator(".mobile-menu").click()
                    if not page.locator(".nav").is_visible():
                        checks.append("Mobile menu failed to open")
                    page.locator('.nav a[href="#projects"]').click()
                    if page.locator(".nav").is_visible():
                        checks.append("Mobile menu failed to close")
                report["responsive"][key]={"issues":checks}
                report["findings"] += [f"{key}: {e}" for e in checks]
                print(key, "issues",len(checks))
            except Exception as exc:
                report["findings"].append(f"{key}: {exc}")
            finally:
                page.close()
        page=browser.new_page(viewport={"width":1366,"height":900})
        try:
            ready(page,args.url)
            # Confirm visible interface and document metadata are Vietnamese.
            locale=page.evaluate("""() => ({
                lang:document.documentElement.lang,
                labels:[...document.querySelectorAll('#primary-navigation>a')].map(e=>e.textContent.trim()),
                hasVietnameseHero:document.querySelector('#home p')?.textContent.includes('hệ thống nhúng'),
                hasVietnameseRoadmap:document.querySelector('#roadmap h2')?.textContent.includes('học tập'),
                hasVietnameseTracks:document.querySelector('#tracks .tracks-intro p')?.textContent.includes('chọn một trong bốn'),
                hasVietnameseForm:document.querySelector('.join-form .form-title h3')?.textContent.includes('Chọn lĩnh vực')
            })""")
            locale_ok=(locale["lang"]=="vi" and
                       all(label in locale["labels"] for label in ["Trang chủ","Giới thiệu","Chuyên môn","Học tập","Dự án","Lộ trình"]) and
                       locale["hasVietnameseHero"] and locale["hasVietnameseRoadmap"] and locale["hasVietnameseTracks"] and locale["hasVietnameseForm"])
            report["interactions"]["vietnameseLocale"]=locale_ok
            if not locale_ok:
                report["findings"].append(f"Vietnamese interface check failed: {locale}")
            # Branded SVGs must load and switch with the navbar color.
            focus(page, "home")
            light=page.locator(".site-header .brand-mark-light")
            dark=page.locator(".site-header .brand-mark-dark")
            home_ok=light.is_visible() and not dark.is_visible()
            focus(page, "roadmap")
            roadmap_ok=dark.is_visible() and not light.is_visible()
            assets_ok=page.evaluate("""()=>{
                return [...document.querySelectorAll('.site-header .brand-mark')]
                    .every(img => img.complete && img.naturalWidth > 0);
            }""")
            report["interactions"]["logoVariants"]=home_ok and roadmap_ok and assets_ok
            if not report["interactions"]["logoVariants"]:
                report["findings"].append("Logo theme switching or SVG loading failed")
            page.get_by_role("button",name="IoT",exact=True).click()
            count=page.locator(".project-grid .project-card").count()
            page.get_by_role("button",name="Tất cả",exact=True).click()
            reset=page.locator(".project-grid .project-card").count()
            report["interactions"]["projectFilters"]=(count==1 and reset==4)
            # Confirm the required first step and the preselection from a track card.
            next_button=page.get_by_role("button",name="Tiếp tục điền thông tin")
            must_select=next_button.is_disabled()
            page.locator('#tracks .track-card').nth(1).click()
            preselected=page.locator('#join input[type="radio"][value="web"]').is_checked()
            next_button.click()
            step2_visible=page.locator('#join input[autocomplete="name"]').is_visible()
            web_summary="Web Application" in page.locator('.join-selected-track strong').inner_text()

            # Go back, retain the selection, then switch to a different specialization.
            page.locator('.join-selected-track button').click()
            back_preserves_choice=page.locator('#join input[type="radio"][value="web"]').is_checked()
            page.locator('#join .join-track-option').filter(has_text="AI & Predictive Maintenance").click()
            page.get_by_role("button",name="Tiếp tục điền thông tin").click()
            ai_summary="AI & Predictive Maintenance" in page.locator('.join-selected-track strong').inner_text()
            payload_choice=page.locator('#join input[type="hidden"][name="specialization"]').input_value()=="ai"
            report["interactions"]["specializationFlow"]=all([
                must_select,preselected,step2_visible,web_summary,
                back_preserves_choice,ai_summary,payload_choice
            ])
            if not report["interactions"]["specializationFlow"]:
                report["findings"].append("Specialization selection or two-step flow failed")
            page.locator('#join input[autocomplete="name"]').fill("QA Test")
            page.locator('#join select').select_option(index=1)
            page.locator('#join input[type="tel"]').fill("0912345678")
            page.locator('#join input[type="email"]').fill("qa@example.com")
            page.locator('#join button[type="submit"]').click()
            notice=page.locator('#join [role="status"]')
            report["interactions"]["demoForm"]=(notice.is_visible() and
                "chưa được gửi hoặc lưu" in notice.inner_text())
            if not all(report["interactions"].values()):
                report["findings"].append("Interaction test failed")
        except Exception as exc:
            report["findings"].append(f"Interactions: {exc}")
        finally:
            page.close()
            browser.close()
    (args.out/"results.json").write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding="utf-8")
    lines=["# Visual QA report","","## Desktop reference comparison","","| Section | Pixel MAE | Overlay |","|---|---:|---|"]
    for name,r in report["desktop"].items():
        lines.append(f'| {name} | {r["pixelMAE"]} | [{name}-overlay.png]({name}-overlay.png) |')
    lines+=["","## Mobile and interaction findings",""]
    lines += [f"- {e}" for e in report["findings"]] or ["- No automated errors found."]
    lines += ["","The reference screenshots are English-language mockups. Pixel MAE will increase with Vietnamese localization and must not be used as an approval threshold. Check spacing, clipping, layout and responsive behavior manually.",""]
    (args.out/"REPORT.md").write_text("\n".join(lines),encoding="utf-8")
    print(f"Report saved to {args.out/'REPORT.md'}; findings={len(report['findings'])}")
    return 1 if report["findings"] else 0

if __name__=="__main__":
    raise SystemExit(main())
