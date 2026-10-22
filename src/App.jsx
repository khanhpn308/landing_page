import React, { useEffect, useMemo, useState } from 'react';
import heroReference from '../references/01-hero.png';

const A = import.meta.env.BASE_URL + 'assets/';

const paths = {
  arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  chip: <><rect x="6" y="6" width="12" height="12" rx="1"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/></>,
  cloud: <path d="M20 17.6a4.7 4.7 0 0 0-.7-9.3 7 7 0 0 0-13.5 2 3.7 3.7 0 0 0 .5 7.3Z"/>,
  phone: <><rect x="6.7" y="2.7" width="10.6" height="18.6" rx="2"/><path d="M10 18.1h4"/></>,
  brain: <><path d="M12 7a4 4 0 0 0-7.6-1.4A4 4 0 0 0 4 12a4 4 0 0 0 3 6.6A3 3 0 0 0 12 21V7ZM12 7a4 4 0 0 1 7.6-1.4A4 4 0 0 1 20 12a4 4 0 0 1-3 6.6A3 3 0 0 1 12 21V7Z"/><path d="M8 9c2 0 2 2 4 2M16 9c-2 0-2 2-4 2M8 15c2 0 2-2 4-2M16 15c-2 0-2-2-4-2"/></>,
  people: <><path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20"/><circle cx="9.5" cy="7" r="3.3"/><path d="M22 20v-1.5a4 4 0 0 0-3.1-3.9M16 3.8a3.4 3.4 0 0 1 0 6.5"/></>,
  target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/></>,
  bulb: <><path d="M9 18h6M10 21h4M9 15.5c-1.6-1.2-3-3.2-3-5.5a6 6 0 1 1 12 0c0 2.3-1.3 4.3-3 5.5l-.4 1.2H9.4Z"/></>,
  play: <path d="m9 6 9 6-9 6Z"/>,
  book: <><path d="M12 6.5c-2.5-2-5.4-2.4-9-1v13c3.6-1.4 6.5-1 9 1 2.5-2 5.4-2.4 9-1v-13c-3.6-1.4-6.5-1-9 1Z"/><path d="M12 6.5v13"/></>,
  gear: <><path d="M10 2h4l.6 2.4 2 .8 2.1-1.3 2.8 2.8-1.3 2.1.8 2L23 11v4l-2.4.6-.8 2 1.3 2.1-2.8 2.8-2.1-1.3-2 .8L14 24h-4l-.6-2.4-2-.8-2.1 1.3-2.8-2.8 1.3-2.1-.8-2L1 15v-4l2.4-.6.8-2L2.9 6.3l2.8-2.8 2.1 1.3 2-.8Z" transform="translate(0 -1) scale(.96)"/><circle cx="12" cy="12" r="3"/></>,
  bars: <><path d="M4 19v-5h4v5ZM10 19V9h4v10ZM16 19V5h4v14Z"/></>,
  wrench: <><path d="M13.4 6.6 17 3a5 5 0 0 1 4 4l-3.6 3.6a5 5 0 0 1-6.8 6.8l-7 4-2-2 4-7a5 5 0 0 1 6.8-6.8Z"/></>,
  box: <><path d="m12 2 9 5-9 5-9-5 9-5ZM3 7v10l9 5 9-5V7M12 12v10"/></>,
  flask: <><path d="M9 2h6M10 2v7L4 20a1.4 1.4 0 0 0 1.3 2h13.4A1.4 1.4 0 0 0 20 20L14 9V2M7 16h10"/></>,
  thermometer: <><path d="M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0ZM12 9v8"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-5 3-7 8-7s8 2 8 7"/></>,
  email: <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="m3 7 9 7 9-7"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 10h18M8 14h3M14 14h3"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  wifi: <><path d="M2 9a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M9 16a4 4 0 0 1 6 0"/><circle cx="12" cy="20" r="1"/></>,
  network: <><circle cx="12" cy="4" r="2"/><circle cx="5" cy="20" r="2"/><circle cx="19" cy="20" r="2"/><path d="M12 6v6M12 12l-7 6M12 12l7 6"/></>
};
function Icon({name, size=24, stroke=1.8, className=''}) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.arrow}</svg>;
}
function Logo() {
  return <a href="#home" className="brand" aria-label="Lab for Autonomous Machines and IoT — Trang chủ">
    {/* Two replaceable vector assets, switched by the header theme in CSS. */}
    <img className="brand-mark brand-mark-light" src={A+'logo-light.svg'} alt="" width="45" height="45" />
    <img className="brand-mark brand-mark-dark" src={A+'logo-dark.svg'} alt="" width="45" height="45" />
    <span>Lab for Autonomous<br/>Machines &amp; IoT</span>
  </a>;
}
const navigation = [['Trang chủ','home'],['Giới thiệu','about'],['Chuyên môn','tracks'],['Học tập','learning'],['Dự án','projects'],['Lộ trình','roadmap']];
function Header() {
  const [active, setActive] = useState('home');
  const [open, setOpen] = useState(false);
  useEffect(() => {
    // A section is active when it crosses a line just below the sticky header.
    // Unlike intersection-ratio ranking, this does not highlight About while
    // the visitor is still viewing the Hero.
    const updateActive = () => {
      const cutoff = window.scrollY + 79 + Math.min(window.innerHeight * 0.15, 120);
      let current = 'home';
      for (const section of document.querySelectorAll('main > section[id]')) {
        const top = section.getBoundingClientRect().top + window.scrollY;
        if (top <= cutoff) current = section.id;
      }
      setActive(current);
    };
    updateActive();
    window.addEventListener('scroll', updateActive, {passive:true});
    window.addEventListener('resize', updateActive);
    window.addEventListener('hashchange', updateActive);
    return () => {
      window.removeEventListener('scroll', updateActive);
      window.removeEventListener('resize', updateActive);
      window.removeEventListener('hashchange', updateActive);
    };
  }, []);
  return <header className="site-header"><div className="container header-inner">
    <Logo />
    <button className="mobile-menu" type="button" onClick={()=>setOpen(!open)} aria-label="Mở hoặc đóng menu" aria-controls="primary-navigation" aria-expanded={open}>☰</button>
    <nav id="primary-navigation" className={'nav '+(open?'nav-open':'')} aria-label="Điều hướng chính">
      {navigation.map(([label,id])=><a key={id} className={active===id?'active':''} href={'#'+id} onClick={()=>{setActive(id);setOpen(false)}}>{label}</a>)}
      <a href="#join" className="mobile-nav-join" onClick={()=>setOpen(false)}>Tham gia</a>
    </nav>
    <a href="#join" className="btn btn-primary header-cta" onClick={()=>{setActive('join');setOpen(false)}}>Tham gia <Icon name="arrow" size={18}/></a>
  </div></header>;
}
function Cta({href,children,secondary=false}){return <a href={href} className={'btn '+(secondary?'btn-outline':'btn-primary')}>{children} <Icon name="arrow" size={18}/></a>}
const specializations = [
  { id: 'embedded', number: '01', icon: 'chip', name: 'Embedded Systems', scope: 'Hardware / Firmware', description: 'Thiết kế phần cứng, lập trình vi điều khiển, cảm biến và hệ thống nhúng.' },
  { id: 'web', number: '02', icon: 'cloud', name: 'Web Application', scope: 'Backend / Frontend / Database', description: 'Phát triển API, cơ sở dữ liệu, giao diện web và nền tảng quản lý thiết bị.' },
  { id: 'mobile', number: '03', icon: 'phone', name: 'Mobile Application', scope: 'Mobile / Cross-platform', description: 'Xây dựng ứng dụng di động để giám sát, điều khiển và tương tác với hệ thống.' },
  { id: 'ai', number: '04', icon: 'brain', name: 'AI & Predictive Maintenance', scope: 'Machine Learning / Data Analytics', description: 'Phân tích dữ liệu cảm biến, nhận diện bất thường và dự báo bảo trì.' }
];
const focus = specializations.map(({ icon, name }) => [icon, name]);
function Hero(){return <section id="home" className="hero">
  <div className="hero-bg" style={{backgroundImage:`url(${heroReference})`}} role="img" aria-label="Động cơ công nghiệp kết nối thiết bị IoT và bảng theo dõi trạng thái"/>
  <div className="container hero-content">
    <div className="hero-copy">
      <div className="kicker light">HỌC · XÂY DỰNG · TRIỂN KHAI</div>
      <h1>Lab for Autonomous<br/>Machines <span className="text-blue">&amp; IoT</span></h1>
      <p>Từ hệ thống nhúng đến bảo trì thông minh.</p>
      <a className="hero-track-notice" href="#tracks"><span className="hero-track-dot" aria-hidden="true"/><strong>4 hướng chuyên môn</strong><span>Chọn 1 khi ứng tuyển</span><Icon name="arrow" size={16}/></a>
      <div className="button-row"><Cta href="#projects">Khám phá dự án</Cta><a className="btn btn-dark-outline" href="#join">Tham gia</a></div>
    </div>
    <div className="hero-focus">{focus.map(([icon,label])=><div className="focus-item" key={label}><span className="focus-icon"><Icon name={icon} size={28}/></span><span>{label}</span></div>)}</div>
  </div>
  <svg className="hero-wave" viewBox="0 0 1536 50" preserveAspectRatio="none" aria-hidden="true"><path d="M0 22 C400 48 920 62 1536 22 L1536 50 L0 50 Z" fill="#fbfdff"/></svg>
</section>}

function AboutPreview(){return <section className="about-preview"><div className="container about-preview-grid">
  <div className="about-preview-copy">
    <h2>Giải quyết bài toán thực tế<br/>bằng công nghệ ứng dụng</h2>
    <p>Chúng tôi là nhóm sinh viên và kỹ sư cùng nghiên cứu, xây dựng hệ thống máy tự động và IoT hướng tới công nghiệp thông minh.</p>
    <a href="#about" className="preview-learn">Tìm hiểu thêm <Icon name="arrow" size={18}/></a>
  </div>
  <div className="about-preview-photo" role="img" aria-label="Thực hành chế tạo mạch điện tử tại phòng nghiên cứu" style={{backgroundImage:`url(${heroReference})`}}/>
  <div className="about-preview-stats">
    <div className="preview-stat"><span className="preview-stat-icon"><Icon name="people" size={29}/></span><div><strong>10+</strong><span>Thành viên</span></div></div>
    <div className="preview-stat"><span className="preview-stat-icon"><Icon name="book" size={29}/></span><div><strong>4</strong><span>Lĩnh vực trọng tâm</span></div></div>
    <div className="preview-stat"><span className="preview-stat-icon"><Icon name="target" size={29}/></span><div><strong>1</strong><span>Mục tiêu chung<br/><b>Công nghiệp thông minh</b></span></div></div>
  </div>
</div></section>}
const aboutCards=[
  {title:'Con người',text:'Nhóm sinh viên và kỹ sư cùng học hỏi, hợp tác nghiên cứu.',icon:'people',image:'about-people.webp'},
  {title:'Sứ mệnh',text:'Kết nối kiến thức kỹ thuật với các ứng dụng công nghiệp thực tế.',icon:'bulb',image:'about-purpose.webp'},
  {title:'Tầm nhìn',text:'Hướng tới máy móc tự động và hệ thống công nghiệp thông minh.',icon:'target',image:'about-vision.webp'}
];
function About(){return <section id="about" className="section about-section"><div className="container">
  <div className="section-split about-top">
    <div className="intro-copy"><div className="kicker">VỀ CHÚNG TÔI <span className="kicker-line"/></div>
      <h2>Đam mê kỹ thuật<br/>Tạo <span className="text-blue">giá trị thực tiễn</span></h2>
      <p>Chúng tôi tin rằng học qua thực hành và nghiên cứu cùng nhau có thể biến những bài toán kỹ thuật phức tạp thành giải pháp hữu ích, giúp sản xuất an toàn và hiệu quả hơn.</p>
      <div className="button-row"><Cta href="#about-values">Câu chuyện của nhóm</Cta><a href="#learning" className="video-link"><span><Icon name="play" size={18}/></span> Khám phá lộ trình học</a></div>
    </div>
    <div className="about-photo"><img src={A+'about-team.webp'} alt="Sinh viên và kỹ sư nghiên cứu thiết bị điện tử trong phòng lab" loading="lazy"/><div className="glass-quote"><i/>Từ ý tưởng<br/>đến hệ thống thực tế</div></div>
  </div>
  <div className="about-cards" id="about-values">{aboutCards.map(c=><article className="about-card" key={c.title}><img src={A+c.image} alt="" className="card-decoration" loading="lazy"/><div className="round-icon"><Icon name={c.icon} size={29}/></div><h3>{c.title}</h3><p>{c.text}</p><a href="#learning" aria-label={'Tìm hiểu '+c.title} className="circle-link"><Icon name="arrow" size={20}/></a></article>)}</div>
</div></section>}

function Tracks({ selectedTrack, onSelectTrack }) {
  return <section id="tracks" className="section tracks-section" aria-labelledby="tracks-heading">
    <div className="container">
      <div className="tracks-intro">
        <div className="kicker light">CHỌN HƯỚNG CHUYÊN MÔN <span className="kicker-line"/></div>
        <h2 id="tracks-heading">One Lab. <span>Four Tracks.</span></h2>
        <p>Ngay khi đăng ký tham gia Lab, mỗi sinh viên <strong>phải chọn một trong bốn lĩnh vực chuyên môn chính</strong>. Bạn không cần thành thạo từ đầu, nhưng cần xác định hướng mình muốn phát triển.</p>
      </div>
      <div className="tracks-grid">
        {specializations.map(track => <a
          className={'track-card' + (selectedTrack === track.id ? ' track-card-selected' : '')}
          href="#join"
          key={track.id}
          onClick={() => onSelectTrack(track.id)}
          aria-label={'Chọn '+track.name+' và đến biểu mẫu đăng ký'}
        >
          <div className="track-card-top"><span className="track-card-icon"><Icon name={track.icon} size={30}/></span><span className="track-card-number">{track.number}</span></div>
          <h3>{track.name}</h3>
          <p className="track-card-scope">{track.scope}</p>
          <p className="track-card-description">{track.description}</p>
          <span className="track-card-action">{selectedTrack === track.id ? 'Đã chọn · Đi tới đăng ký' : 'Chọn hướng này'} <Icon name="arrow" size={18}/></span>
        </a>)}
      </div>
      <div className="tracks-bottom"><strong>Chọn một hướng để bắt đầu.</strong><span>Các thành viên sẽ phối hợp liên ngành để xây dựng một hệ thống hoàn chỉnh.</span><a href="#join">Đăng ký tham gia <Icon name="arrow" size={18}/></a></div>
    </div>
  </section>;
}

const learningCards=[
  {num:'01',icon:'chip',title:'Embedded Systems',tag:'Hardware & Firmware.',points:['Vi điều khiển & RTOS','Cảm biến & điều khiển'],image:'embedded.webp',theme:'blue'},
  {num:'02',icon:'cloud',title:'Web Application',tag:'Backend · Frontend · Database.',points:['MQTT, API & Backend','Giao diện web & cơ sở dữ liệu'],image:'backend.webp',theme:'sand'},
  {num:'03',icon:'phone',title:'Mobile Application',tag:'Ứng dụng giám sát di động.',points:['Flutter & ứng dụng đa nền tảng','Tương tác thiết bị từ xa'],image:'mobile.webp',theme:'mint'},
  {num:'04',icon:'brain',title:'AI & Predictive Maintenance',tag:'Biến dữ liệu thành tri thức.',points:['Phân tích & học máy','Phát hiện bất thường, dự báo'],image:'ai.webp',theme:'lilac'}
];
const journey=[['chip','Nền tảng','Kiến thức cốt lõi'],['wrench','Thực hành','Bài lab & dự án nhỏ'],['box','Dự án','Phát triển hệ thống'],['bars','Phát triển','Hợp tác & chia sẻ']];
function Learning(){return <section id="learning" className="section learning-section"><div className="container">
  <div className="section-split learning-top"><div className="intro-copy"><div className="kicker">LỘ TRÌNH HỌC TẬP <span className="kicker-line"/></div>
    <h2>Học bài bản<br/>Rèn <span className="text-blue">kỹ năng thực tế.</span></h2>
    <p>Mỗi thành viên chọn một hướng chuyên môn chính, học từ nền tảng đến dự án thực tế và phối hợp với các lĩnh vực khác khi phát triển hệ thống.</p>
    <div className="button-row"><Cta href="#learning-grid">Khám phá lộ trình</Cta><a className="video-link" href="#journey"><span><Icon name="play" size={18}/></span> Xem hành trình học</a></div>
  </div><div className="learning-art"><img src={A+'learning-system.webp'} alt="Vi điều khiển kết nối máy tính phát triển phần mềm và ứng dụng giám sát" loading="lazy"/></div></div>
  <div className="learning-grid" id="learning-grid">{learningCards.map(c=><article className={'learning-card '+c.theme} key={c.num}>
    <div className="learning-card-head"><span className="number-icon">{c.num}</span><span className="round-icon"><Icon name={c.icon} size={31}/></span><a href="#join" aria-label={'Tìm hiểu '+c.title} className="small-chevron"><Icon name="chevron" size={23}/></a></div>
    <h3>{c.title}</h3><p>{c.tag}</p><ul>{c.points.map(pt=><li key={pt}>{pt}</li>)}</ul><img className="learning-photo" src={A+c.image} alt="" loading="lazy"/>
  </article>)}</div>
  <div className="journey" id="journey"><div className="journey-label"><h3>Hành trình học tập</h3><p>Từ kiến thức cơ bản<br/>đến dự án thực tế.</p></div>
    <div className="journey-steps">{journey.map(([icon,title,sub],i)=><div className="journey-step" key={title}><span className="step-number">{i+1}</span><Icon name={icon} size={29}/><div><strong>{title}</strong><small>{sub}</small></div></div>)}</div>
  </div>
</div></section>}
const projectCards=[
 {title:'Nền tảng robot tự hành',text:'Hệ thống robot mô-đun phục vụ học tập và nghiên cứu.',tags:['Nhúng','Robot'],type:'Hệ thống',img:'project-robot.webp',icon:'chip'},
 {title:'Mạng cảm biến LoRa P2P',text:'Truyền dữ liệu cảm biến tầm xa với công suất thấp.',tags:['IoT','Không dây'],type:'IoT',img:'project-lora.webp',icon:'cloud'},
 {title:'Bảo trì dự đoán',text:'Phân tích dữ liệu thiết bị để hỗ trợ chẩn đoán sự cố.',tags:['AI/ML','Phân tích dữ liệu'],type:'AI & Phần mềm',img:'project-ai.webp',icon:'bars'},
 {title:'Nguyên mẫu nghiên cứu',text:'Thử nghiệm ý tưởng và kiểm chứng giải pháp kỹ thuật.',tags:['Nghiên cứu','Nguyên mẫu'],type:'Nghiên cứu',img:'project-prototype.webp',icon:'flask'}
];
const filters=['Tất cả','Nhúng','IoT','AI & Phần mềm','Hệ thống','Nghiên cứu'];
function Projects(){const [filter,setFilter]=useState('Tất cả'); const cards=useMemo(()=>projectCards.filter(c=>filter==='Tất cả'||c.type===filter||c.tags.includes(filter)),[filter]);return <section id="projects" className="section projects-section"><div className="container">
 <div className="section-split projects-top"><div className="intro-copy"><div className="kicker">DỰ ÁN <span className="kicker-line"/></div>
  <h2>Từ ý tưởng<br/>đến <span className="text-blue">hệ thống thật.</span></h2>
  <p>Những dự án kết nối kiến thức, nghiên cứu và ứng dụng thực tiễn.</p>
  <div className="button-row"><Cta href="#projects-list">Khám phá dự án</Cta></div>
 </div><div className="featured-project"><img src={A+'project-feature.webp'} alt="Thiết bị thu thập dữ liệu cảm biến IoT công nghiệp" loading="lazy"/><div className="featured-shade"/><div className="featured-content"><div className="kicker light">DỰ ÁN NỔI BẬT</div><h3>Giám sát thiết bị<br/>IoT công nghiệp</h3><p>Kết nối cảm biến, thu thập<br/>và theo dõi dữ liệu thiết bị.</p><div className="featured-tags"><span><Icon name="thermometer" size={20}/> Cảm biến</span><span><Icon name="cloud" size={20}/> IoT</span><span><Icon name="bars" size={20}/> Giám sát</span></div></div></div></div>
 <div className="project-filters" id="projects-list" role="group" aria-label="Lọc dự án">{filters.map(f=><button type="button" key={f} aria-pressed={filter===f} className={filter===f?'selected':''} onClick={()=>setFilter(f)}>{f}</button>)}</div>
 <div className="project-grid">{cards.map(c=><article key={c.title} className="project-card"><div className="project-image"><img src={A+c.img} alt="" loading="lazy"/><span className="project-type-icon"><Icon name={c.icon} size={28}/></span></div><div className="project-description"><h3>{c.title}</h3><p>{c.text}</p><div className="project-foot"><div className="tags">{c.tags.map(t=><span key={t}>{t}</span>)}</div><a href="#join" className="circle-link" aria-label={'Trao đổi về '+c.title}><Icon name="arrow" size={18}/></a></div></div></article>)}</div>
 <div className="collab-banner"><span className="collab-icon"><Icon name="bulb" size={32}/></span><div><h3>Bạn có ý tưởng?</h3><p>Cùng hợp tác giải quyết những bài toán kỹ thuật thực tế.</p></div><Cta href="#join">Hợp tác cùng nhóm</Cta></div>
 </div></section>}
const milestones = [
  {num:'01',name:'Xây dựng nền tảng',lines:['Xây dựng','nền tảng'],sub:'Kiến thức cốt lõi và thực hành với dự án nhỏ.',year:'2025 – 2026',tags:['Hệ thống nhúng','IoT cơ bản'],img:'roadmap-one.webp',accent:'blue'},
  {num:'02',name:'Phát triển hệ thống',lines:['Phát triển','hệ thống'],sub:'Thiết kế, tích hợp và thử nghiệm nguyên mẫu.',year:'2026 – 2027',tags:['Robot','LoRa / Không dây'],img:'roadmap-two.webp',accent:'mint'},
  {num:'03',name:'Triển khai thực tế',lines:['Triển khai','thực tế'],sub:'Đưa giải pháp vào môi trường ứng dụng.',year:'2027 – 2028',tags:['Triển khai thực tế','Dữ liệu & AI'],img:'roadmap-three.webp',accent:'gold'},
  {num:'04',name:'Tạo tác động lâu dài',lines:['Tạo tác động','lâu dài'],sub:'Mở rộng ứng dụng, hợp tác và chia sẻ.',year:'2028+',tags:['Mã nguồn mở','Công nghiệp & Xã hội'],img:'roadmap-four.webp',accent:'purple'}
];
function Roadmap(){
  return <section id="roadmap" className="section roadmap-section">
    <div className="container roadmap-layout">
      <div className="roadmap-top">
        <div className="kicker">LỘ TRÌNH PHÁT TRIỂN <span className="kicker-line"/></div>
        <h2>Từ học tập<br/>đến <span className="text-blue">giá trị thực tiễn</span></h2>
        <p>Từng bước phát triển kỹ năng, xây dựng hệ thống và tạo ra giá trị lâu dài.</p>
      </div>
      <div className="roadmap-scene">
        <div className="roadmap-background" aria-hidden="true"/>
        <svg className="roadmap-path" viewBox="0 0 1536 786" preserveAspectRatio="none" aria-hidden="true">
          {/* One continuous curve uses a single stroke width from the first
              milestone to the alpine summit (1426,268). Segment boundaries
              are in the path's d attribute, not separately rendered paths. */}
          <path
            className="roadmap-path-route"
            d="M-20 705
               C105 715 173 712 226 707
               C362 706 453 686 573 682
               C710 676 805 620 904 643
               C1015 669 1093 599 1147 557
               C1190 523 1222 528 1253 517
               C1311 498 1343 484 1385 443
               C1406 422 1427 409 1424 392
               C1420 375 1397 380 1397 361
               C1397 342 1439 347 1440 327
               C1440 312 1425 297 1426 268"
          />
        </svg>
        <div className="roadmap-items">
          {milestones.map((m,i)=><article className={'milestone milestone-'+(i+1)} key={m.num}>
            <div className="milestone-head">
              <span className={'milestone-count milestone-count-'+m.accent}>{m.num}</span>
              <div><h3>{m.lines.map((line,index)=><React.Fragment key={line}>{index>0&&<br/>}{line}</React.Fragment>)}</h3><p>{m.sub}</p></div>
            </div>
            <div className="milestone-media">
              <img src={A+m.img} alt="" loading="lazy"/>
              <div className="milestone-tags">{m.tags.map(t=><span key={t}>{t}</span>)}</div>
            </div>
            <div className={'milestone-dot milestone-dot-'+m.accent}/>
            <div className={'milestone-year milestone-year-'+m.accent}>{m.year}</div>
          </article>)}
        </div>
      </div>
      <div className="roadmap-benefits">
        {[
          ['bars','Phát triển kỹ năng','Từ kiến thức cơ bản đến công nghệ chuyên sâu.'],
          ['gear','Dự án thực tế','Từ ý tưởng đến nguyên mẫu và hệ thống ứng dụng.'],
          ['people','Giá trị lâu dài','Đóng góp cho nghiên cứu và các ứng dụng thực tiễn.']
        ].map(([icon,title,desc])=><div className="benefit" key={title}>
          <span className="round-icon"><Icon name={icon} size={31}/></span>
          <div><h3>{title}</h3><p>{desc}</p></div>
        </div>)}
      </div>
    </div>
  </section>;
}
function Join({ selectedTrack, onSelectTrack }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({name:'',year:'',phone:'',email:''});
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [botField, setBotField] = useState('');
  const formspreeId = (import.meta.env.VITE_FORMSPREE_FORM_ID || 'xvkzejvy').trim();
  const formspreeEndpoint = formspreeId ? 'https://formspree.io/f/' + encodeURIComponent(formspreeId) : '';
  const change = (field,value) => {setForm(old => ({...old,[field]:value}));setSubmitStatus('idle');};
  const thisYear = new Date().getFullYear();
  const track = specializations.find(item => item.id === selectedTrack);
  const goNext = () => {if (track) {setStep(2);setSubmitStatus('idle');}};
  const submit = async (event) => {
    event.preventDefault();
    if (step !== 2 || !track || submitStatus === 'sending' || submitStatus === 'success') {
      if (step !== 2 || !track) setStep(1);
      return;
    }
    if (!formspreeEndpoint) {
      setSubmitStatus('unavailable');
      return;
    }
    setSubmitStatus('sending');
    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: new URLSearchParams({
          '_gotcha': botField,
          specialization: track.name,
          name: form.name.trim(),
          year: form.year,
          phone: form.phone.trim(),
          email: form.email.trim()
        }).toString()
      });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      setSubmitStatus('success');
    } catch (error) {
      console.error('Netlify Forms submission failed:', error);
      setSubmitStatus('error');
    }
  };
  return <section id="join" className="section join-section">
    <div className="container join-grid">
      <div className="join-intro">
        <div className="kicker">THAM GIA CÙNG CHÚNG TÔI <span className="kicker-line"/></div>
        <h2>Chọn hướng.<br/><span className="text-blue">Cùng phát triển.</span></h2>
        <p>Ứng tuyển vào Lab bắt đầu bằng việc chọn <strong>một lĩnh vực chuyên môn chính</strong>, sau đó cung cấp thông tin liên hệ.</p>
        <img src={A+'join-hardware.webp'} alt="Thiết bị điện tử thử nghiệm trên bàn làm việc tại phòng lab" loading="lazy"/>
      </div>
      <form className="join-form" name="join-us" method="POST" action={formspreeEndpoint || undefined} onSubmit={submit} aria-busy={submitStatus==='sending'}>
        <div style={{position:'absolute',left:'-9999px',width:1,height:1,overflow:'hidden'}} aria-hidden="true">
          <label>Không điền ô này <input name="_gotcha" type="text" autoComplete="off" tabIndex={-1} value={botField} onChange={e=>setBotField(e.target.value)}/></label>
        </div>
        <div className="join-step-header"><span>ĐĂNG KÝ THAM GIA</span><span>Bước {step} / 2</span></div>
        <div className="join-progress" aria-label={'Tiến độ đăng ký: bước '+step+' trên 2'}><span className={step >= 1 ? 'progress-on' : ''}/><span className={step === 2 ? 'progress-on' : ''}/></div>
        {step === 1 ? <>
          <div className="form-title"><span className="round-icon"><Icon name="target" size={28}/></span><div><h3>Chọn lĩnh vực của bạn</h3><p>Bắt buộc chọn 1 trong 4 hướng chuyên môn.</p></div></div>
          <fieldset className="join-track-fieldset">
            <legend className="visually-hidden">Lĩnh vực chuyên môn chính</legend>
            <div className="join-track-grid">{specializations.map(item => <label className={'join-track-option'+(selectedTrack===item.id?' is-selected':'')} key={item.id}>
              <input type="radio" name="specialization" value={item.id} checked={selectedTrack===item.id} onChange={()=>{onSelectTrack(item.id);setSubmitStatus('idle');}}/>
              <span className="join-track-icon"><Icon name={item.icon} size={24}/></span>
              <span className="join-track-text"><strong>{item.name}</strong><small>{item.scope}</small></span>
              <span className="join-track-indicator" aria-hidden="true"><Icon name="check" size={14}/></span>
            </label>)}</div>
          </fieldset>
          <p className="join-help">Bạn sẽ tập trung vào lĩnh vực đã chọn và có cơ hội hợp tác với các nhóm chuyên môn khác.</p>
          <button className="btn btn-primary submit-btn" type="button" onClick={goNext} disabled={!track}>Tiếp tục điền thông tin <Icon name="arrow" size={20}/></button>
        </> : <>
          <div className="form-title"><span className="round-icon"><Icon name="user" size={28}/></span><div><h3>Thông tin đăng ký</h3><p>Chia sẻ thông tin để nhóm liên hệ với bạn.</p></div></div>
          <div className="join-selected-track"><span><small>HƯỚNG CHUYÊN MÔN ĐÃ CHỌN</small><strong>{track?.name}</strong></span><button type="button" onClick={()=>{setStep(1);setSubmitStatus('idle');}}>Thay đổi</button></div>
          <input type="hidden" name="specialization" value={selectedTrack}/>
          <label>Họ và tên<div className="input-wrap"><Icon name="user"/><input name="name" required autoComplete="name" maxLength={120} placeholder="Nhập họ và tên của bạn" value={form.name} onChange={e=>change('name',e.target.value)}/></div></label>
          <label>Năm nhập học<div className="input-wrap"><Icon name="calendar"/><select name="year" required value={form.year} onChange={e=>change('year',e.target.value)}><option value="">Chọn năm nhập học</option>{Array.from({length:9},(_,i)=>thisYear+1-i).map(y=><option value={y} key={y}>{y}</option>)}</select></div></label>
          <label>Số điện thoại<div className="input-wrap"><Icon name="phone"/><input name="phone" required inputMode="tel" type="tel" pattern="[+0-9() .-]{9,20}" autoComplete="tel" maxLength={20} placeholder="Nhập số điện thoại" value={form.phone} onChange={e=>change('phone',e.target.value)}/></div></label>
          <label>Email<div className="input-wrap"><Icon name="email"/><input name="email" required type="email" autoComplete="email" maxLength={254} placeholder="Nhập email của bạn" value={form.email} onChange={e=>change('email',e.target.value)}/></div></label>
          <div className="join-form-actions"><button className="join-back" type="button" onClick={()=>{setStep(1);setSubmitStatus('idle');}}>Quay lại</button><button className="btn btn-primary submit-btn" type="submit" disabled={!formspreeEndpoint||submitStatus==='sending'||submitStatus==='success'}>{!formspreeEndpoint?'Chưa mở đăng ký':submitStatus==='sending'?'Đang gửi...':submitStatus==='success'?'Đã gửi đăng ký':'Gửi đăng ký'} <Icon name="arrow" size={20}/></button></div>
          {!formspreeEndpoint && <div role="status" className="form-notice">Chức năng đăng ký đang được cấu hình. Vui lòng quay lại sau.</div>}
          {submitStatus==='success' && <div role="status" className="form-notice">Đăng ký đã được gửi. Nhóm sẽ liên hệ với bạn qua thông tin đã cung cấp.</div>}
          {submitStatus==='error' && <div role="alert" className="form-notice" style={{color:'#a12a2a',background:'#fff2f2',borderColor:'#ffd0d0'}}>Không gửi được đăng ký. Vui lòng thử lại sau.</div>}
        </>}
        <p className="join-demo-note">Thông tin chỉ được sử dụng để liên hệ về việc tham gia Lab.</p>
      </form>
    </div>
  </section>;
}
function Footer(){return <footer className="footer"><div className="container footer-inner"><Logo/><span>Học · Xây dựng · Triển khai</span><a href="#home">Lên đầu trang ↑</a></div></footer>}
export default function App(){const [selectedTrack,setSelectedTrack]=useState('');return <><Header/><main><Hero/><AboutPreview/><About/><Tracks selectedTrack={selectedTrack} onSelectTrack={setSelectedTrack}/><Learning/><Projects/><Roadmap/><Join selectedTrack={selectedTrack} onSelectTrack={setSelectedTrack}/></main><Footer/></>}
