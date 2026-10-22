"""Capture and compare one section against an approved mockup using its source dimensions.

Installation:
    pip install playwright pillow
    python -m playwright install chromium
Example:
    python scripts/visual_regression.py --url http://localhost:5173 --section learning \
        --reference references/03-learning.png
Output: artifacts/<section>-actual.png and <section>-overlay.png
"""
import argparse
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--url', default='http://localhost:5173')
parser.add_argument('--section', default='home', choices=['home','about','learning','projects','roadmap','join'])
parser.add_argument('--reference', required=True)
parser.add_argument('--out-dir', default='artifacts')
args = parser.parse_args()
out = Path(args.out_dir)
out.mkdir(parents=True, exist_ok=True)
ref = Image.open(args.reference).convert('RGBA')
actual = out / f'{args.section}-actual.png'
overlay = out / f'{args.section}-overlay.png'
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width':ref.width,'height':ref.height}, device_scale_factor=1)
    page.goto(args.url, wait_until='networkidle')
    page.evaluate('document.fonts.ready')
    if args.section != 'home':
        page.locator('#'+args.section).scroll_into_view_if_needed()
        page.evaluate(f"document.getElementById('{args.section}').scrollIntoView({{block:'start',behavior:'instant'}})")
        page.wait_for_timeout(250)
    page.screenshot(path=str(actual), full_page=False)
    browser.close()
cur = Image.open(actual).convert('RGBA')
if cur.size != ref.size:
    raise RuntimeError(f'Size mismatch {cur.size} != {ref.size}')
Image.blend(ref,cur,.5).save(overlay)
print(f'Actual: {actual}\n50% overlay: {overlay}')
