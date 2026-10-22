import React, { useEffect, useMemo, useState } from 'react';

const A = '/assets/';

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
  return <a href="#home" className="brand" aria-label="Lab for Autonomous Machines and IoT — Home">
    <svg className="brand-mark" viewBox="0 0 58 58" aria-hidden="true"><defs><linearGradient id="logograd" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#43b7ff"/><stop offset=".55" stopColor="#2562f8"/><stop offset="1" stopColor="#6146ef"/></linearGradient></defs><path fill="url(#logograd)" d="M28 3 53 47l-11 8-14-24-14 24L3 47Z"/><path fill="#132d5b" d="m28 17 9 16-9-5-9 5Z"/><path fill="#5fb9ff" d="m19 33-7 14 16-6Z"/><path fill="#1c5bde" d="m37 33 7 14-16-6Z"/></svg>
    <span>Lab for Autonomous<br/>Machines &amp; IoT</span>
  </a>;
}
const navigation = [['Home','home'],['About','about'],['Learning','learning'],['Projects','projects'],['Roadmap','roadmap']];
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
    <button className="mobile-menu" type="button" onClick={()=>setOpen(!open)} aria-label="Toggle menu" aria-controls="primary-navigation" aria-expanded={open}>☰</button>
    <nav id="primary-navigation" className={'nav '+(open?'nav-open':'')} aria-label="Main navigation">
      {navigation.map(([label,id])=><a key={id} className={active===id?'active':''} href={'#'+id} onClick={()=>{setActive(id);setOpen(false)}}>{label}</a>)}
    </nav>
    <a href="#join" className="btn btn-primary header-cta" onClick={()=>{setActive('join');setOpen(false)}}>Join Us <Icon name="arrow" size={18}/></a>
  </div></header>;
}
function Cta({href,children,secondary=false}){return <a href={href} className={'btn '+(secondary?'btn-outline':'btn-primary')}>{children} <Icon name="arrow" size={18}/></a>}
const focus=[['chip','Embedded Systems'],['cloud','IoT Backend'],['phone','Mobile Applications'],['bars','AI & Smart Maintenance']];
function Hero(){return <section id="home" className="hero">
  <div className="hero-bg" role="img" aria-label="Industrial motor and monitoring devices"/>
  <div className="container hero-content">
    <div className="hero-copy">
      <div className="kicker light">LEARN · BUILD · DEPLOY</div>
      <h1>Lab for Autonomous<br/>Machines <span className="text-blue">&amp; IoT</span></h1>
      <p>From embedded systems to intelligent maintenance.</p>
      <div className="button-row"><Cta href="#projects">Explore Our Work</Cta><a className="btn btn-dark-outline" href="#join">Join Us</a></div>
    </div>
    <div className="hero-focus">{focus.map(([icon,label])=><div className="focus-item" key={label}><span className="focus-icon"><Icon name={icon} size={28}/></span><span>{label}</span></div>)}</div>
  </div>
</section>}
const aboutCards=[
  {title:'People',text:'A collaborative team of passionate learners and engineers.',icon:'people',image:'about-people.webp'},
  {title:'Purpose',text:'Connecting engineering knowledge with practical industrial applications.',icon:'bulb',image:'about-purpose.webp'},
  {title:'Long-term Vision',text:'Towards intelligent and autonomous machines.',icon:'target',image:'about-vision.webp'}
];
function About(){return <section id="about" className="section about-section"><div className="container">
  <div className="section-split about-top">
    <div className="intro-copy"><div className="kicker">ABOUT US <span className="kicker-line"/></div>
      <h2>A Team Passionate<br/>about{' '}<span className="text-blue">Real-World<br/>Impact</span></h2>
      <p>We are a group of engineers and students who believe hands-on learning and collaborative research can turn complex engineering challenges into practical solutions for a smarter, safer and more efficient industry.</p>
      <div className="button-row"><Cta href="#about-values">Our Story</Cta><a href="#learning" className="video-link"><span><Icon name="play" size={18}/></span> Explore Learning</a></div>
    </div>
    <div className="about-photo"><img src={A+'about-team.webp'} alt="Engineering students working on electronics in a laboratory" loading="lazy"/></div>
  </div>
  <div className="about-cards" id="about-values">{aboutCards.map(c=><article className="about-card" key={c.title}><img src={A+c.image} alt="" className="card-decoration" loading="lazy"/><div className="round-icon"><Icon name={c.icon} size={29}/></div><h3>{c.title}</h3><p>{c.text}</p><a href="#learning" aria-label={'Explore '+c.title} className="circle-link"><Icon name="arrow" size={20}/></a></article>)}</div>
</div></section>}
const learningCards=[
  {num:'01',icon:'chip',title:'Embedded Systems',tag:'Hardware foundation.',points:['MCU & RTOS','Sensors & Control'],image:'embedded.webp',theme:'blue'},
  {num:'02',icon:'cloud',title:'IoT & Backend',tag:'Connect devices and data.',points:['MQTT & APIs','Cloud & Databases'],image:'backend.webp',theme:'sand'},
  {num:'03',icon:'phone',title:'Mobile & Web Apps',tag:'Build monitoring tools.',points:['Flutter / React','UI for dashboards'],image:'mobile.webp',theme:'mint'},
  {num:'04',icon:'brain',title:'AI & Smart Maintenance',tag:'Turn data into insight.',points:['Predictive analytics','Fault detection'],image:'ai.webp',theme:'lilac'}
];
const journey=[['chip','Fundamentals','Core knowledge'],['wrench','Practice','Labs & mini-projects'],['box','Projects','Build real systems'],['bars','Grow','Collaborate & share']];
function Learning(){return <section id="learning" className="section learning-section"><div className="container">
  <div className="section-split learning-top"><div className="intro-copy"><div className="kicker">LEARNING PATHS <span className="kicker-line"/></div>
    <h2>Structured Paths<br/>to Build <span className="text-blue">Real Skills.</span></h2>
    <p>Choose a path, build fundamentals, practice through projects, and grow into real-world systems.</p>
    <div className="button-row"><Cta href="#learning-grid">Explore Paths</Cta><a className="video-link" href="#journey"><span><Icon name="play" size={18}/></span> View Journey</a></div>
  </div><div className="learning-art"><img src={A+'learning-system.webp'} alt="Hardware connected to a software development laptop and mobile monitoring dashboard" loading="lazy"/></div></div>
  <div className="learning-grid" id="learning-grid">{learningCards.map(c=><article className={'learning-card '+c.theme} key={c.num}>
    <div className="learning-card-head"><span className="number-icon">{c.num}</span><span className="round-icon"><Icon name={c.icon} size={31}/></span><a href="#join" aria-label={'Learn more about '+c.title} className="small-chevron"><Icon name="chevron" size={23}/></a></div>
    <h3>{c.title}</h3><p>{c.tag}</p><ul>{c.points.map(pt=><li key={pt}>{pt}</li>)}</ul><img className="learning-photo" src={A+c.image} alt="" loading="lazy"/>
  </article>)}</div>
  <div className="journey" id="journey"><div className="journey-label"><h3>Learning Journey</h3><p>A simple path from basics<br/>to real projects.</p></div>
    <div className="journey-steps">{journey.map(([icon,title,sub],i)=><div className="journey-step" key={title}><span className="step-number">{i+1}</span><Icon name={icon} size={29}/><div><strong>{title}</strong><small>{sub}</small></div></div>)}</div>
  </div>
</div></section>}
const projectCards=[
 {title:'Autonomous Robot Platform',text:'A modular platform for research and experimentation.',tags:['Embedded','Robotics'],type:'Systems',img:'project-robot.webp',icon:'chip'},
 {title:'LoRa P2P Sensor Network',text:'Long-range, low-power communication for remote sensing.',tags:['IoT','Wireless'],type:'IoT',img:'project-lora.webp',icon:'cloud'},
 {title:'Predictive Maintenance',text:'Turning sensor data into useful insights.',tags:['AI/ML','Analytics'],type:'AI & Software',img:'project-ai.webp',icon:'bars'},
 {title:'Research Prototypes',text:'Exploring new ideas and validating concepts.',tags:['Research','Prototyping'],type:'Research',img:'project-prototype.webp',icon:'flask'}
];
const filters=['All','Embedded','IoT','AI & Software','Systems','Research'];
function Projects(){const [filter,setFilter]=useState('All'); const cards=useMemo(()=>projectCards.filter(c=>filter==='All'||c.type===filter||c.tags.includes(filter)),[filter]);return <section id="projects" className="section projects-section"><div className="container">
 <div className="section-split projects-top"><div className="intro-copy"><div className="kicker">PROJECTS <span className="kicker-line"/></div>
  <h2>From Ideas<br/>to <span className="text-blue">Real Systems.</span></h2>
  <p>Selected projects that turn research and learning into practical, real-world solutions.</p>
  <div className="button-row"><Cta href="#projects-list">Explore All Projects</Cta></div>
 </div><div className="featured-project"><img src={A+'project-feature.webp'} alt="Industrial IoT sensor gateway hardware" loading="lazy"/><div className="featured-shade"/><div className="featured-content"><div className="kicker light">FEATURED PROJECT</div><h3>Industrial IoT<br/>Monitoring</h3><p>Industrial sensor networks<br/>and device monitoring.</p><div className="featured-tags"><span><Icon name="thermometer" size={20}/> Sensors</span><span><Icon name="cloud" size={20}/> IoT</span><span><Icon name="bars" size={20}/> Dashboard</span></div></div></div></div>
 <div className="project-filters" id="projects-list" role="group" aria-label="Filter projects">{filters.map(f=><button type="button" key={f} aria-pressed={filter===f} className={filter===f?'selected':''} onClick={()=>setFilter(f)}>{f}</button>)}</div>
 <div className="project-grid">{cards.map(c=><article key={c.title} className="project-card"><div className="project-image"><img src={A+c.img} alt="" loading="lazy"/><span className="project-type-icon"><Icon name={c.icon} size={28}/></span></div><div className="project-description"><h3>{c.title}</h3><p>{c.text}</p><div className="project-foot"><div className="tags">{c.tags.map(t=><span key={t}>{t}</span>)}</div><a href="#join" className="circle-link" aria-label={'Discuss '+c.title}><Icon name="arrow" size={18}/></a></div></div></article>)}</div>
 <div className="collab-banner"><span className="collab-icon"><Icon name="bulb" size={32}/></span><div><h3>Have an idea?</h3><p>We are open to collaboration and real-world challenges.</p></div><Cta href="#join">Work With Us</Cta></div>
 </div></section>}
const milestones=[
 {num:'01',name:'Learn & Build Foundations',sub:'Core skills and hands-on mini projects.',stage:'Foundation',pill:'Embedded · IoT',img:'roadmap-one.webp'},
 {num:'02',name:'Develop Real Systems',sub:'Build and integrate working prototypes.',stage:'Development',pill:'Robotics · LoRa',img:'roadmap-two.webp'},
 {num:'03',name:'Scale & Apply',sub:'Deploy in real environments and solve practical problems.',stage:'Application',pill:'Deployment · Data',img:'roadmap-three.webp'},
 {num:'04',name:'Create Lasting Impact',sub:'Open solutions, collaboration, and broader applications.',stage:'Long term',pill:'Industry · Research',img:'roadmap-four.webp'}
];
function Roadmap(){return <section id="roadmap" className="section roadmap-section"><div className="container">
  <div className="roadmap-top"><div className="kicker">ROADMAP <span className="kicker-line"/></div><h2>From Learning<br/>to <span className="text-blue">Real Impact</span></h2><p>A step-by-step journey to build skills, develop real systems, and create lasting impact.</p></div>
  <div className="roadmap-scene"><div className="roadmap-mountain"/><svg className="roadmap-path" viewBox="0 0 1400 290" preserveAspectRatio="none" aria-hidden="true"><path d="M-50 251 C150 282 200 285 360 254 S650 238 760 181 S970 160 1070 105 S1270 130 1440 3" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round"/><path d="M-50 251 C150 282 200 285 360 254 S650 238 760 181 S970 160 1070 105 S1270 130 1440 3" fill="none" stroke="#dee9fc" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 6"/></svg>
  <div className="roadmap-items">{milestones.map((m,i)=><article className={'milestone milestone-'+(i+1)} key={m.num}><div className="milestone-head"><span>{m.num}</span><div><h3>{m.name}</h3><p>{m.sub}</p></div></div><div className="milestone-media"><img src={A+m.img} alt="" loading="lazy"/><div className="milestone-tags">{m.pill.split(' · ').map(t=><span key={t}>{t}</span>)}</div></div><div className="milestone-dot"/><div className="milestone-stage">{m.stage}</div></article>)}</div>
  </div>
  <div className="roadmap-benefits">{[['bars','Skill Growth','From fundamentals to advanced systems.'],['gear','Real-world Projects','From ideas to working prototypes.'],['people','Long-term Impact','Research, collaboration and applications.']].map(([icon,title,desc])=><div className="benefit" key={title}><span className="round-icon"><Icon name={icon} size={31}/></span><div><h3>{title}</h3><p>{desc}</p></div></div>)}</div>
</div></section>}
function Join(){const [form,setForm]=useState({name:'',year:'',phone:'',email:''});const [submitted,setSubmitted]=useState(false);const change=(field,value)=>{setForm(o=>({...o,[field]:value}));setSubmitted(false);};const thisYear=new Date().getFullYear();return <section id="join" className="section join-section"><div className="container join-grid"><div className="join-intro"><div className="kicker">JOIN US <span className="kicker-line"/></div><h2>Be Part of<br/><span className="text-blue">Our Team</span></h2><p>Fill in the form to express your interest in joining our lab.</p><img src={A+'join-hardware.webp'} alt="Electronics prototyping equipment on a lab desk" loading="lazy"/></div>
 <form className="join-form" onSubmit={e=>{e.preventDefault();setSubmitted(true);}}><div className="form-title"><span className="round-icon"><Icon name="user" size={31}/></span><div><h3>Application Form</h3><p>Let us know a bit about you.</p></div></div>
  <label>Họ và tên<div className="input-wrap"><Icon name="user"/><input required autoComplete="name" placeholder="Nhập họ và tên của bạn" value={form.name} onChange={e=>change('name',e.target.value)}/></div></label>
  <label>Năm nhập học<div className="input-wrap"><Icon name="calendar"/><select required value={form.year} onChange={e=>change('year',e.target.value)}><option value="">Chọn năm nhập học</option>{Array.from({length:9},(_,i)=>thisYear+1-i).map(y=><option value={y} key={y}>{y}</option>)}</select></div></label>
  <label>Số điện thoại<div className="input-wrap"><Icon name="phone"/><input required inputMode="tel" type="tel" pattern="[+0-9() .-]{9,20}" autoComplete="tel" placeholder="Nhập số điện thoại" value={form.phone} onChange={e=>change('phone',e.target.value)}/></div></label>
  <label>Email<div className="input-wrap"><Icon name="email"/><input required type="email" autoComplete="email" placeholder="Nhập email của bạn" value={form.email} onChange={e=>change('email',e.target.value)}/></div></label>
  <button className="btn btn-primary submit-btn" type="submit">Gửi đăng ký <Icon name="arrow" size={21}/></button>
  {submitted && <div role="status" className="form-notice">Đây là bản demo giao diện. Chưa có dữ liệu nào được gửi hoặc lưu. Cần kết nối API để nhận đăng ký.</div>}
 </form></div></section>}
function Footer(){return <footer className="footer"><div className="container footer-inner"><Logo/><span>Learn · Build · Deploy</span><a href="#home">Back to top ↑</a></div></footer>}
export default function App(){return <><Header/><main><Hero/><About/><Learning/><Projects/><Roadmap/><Join/></main><Footer/></>}
