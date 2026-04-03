import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const PHOTOS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=500&fit=crop&crop=face',
];

function SpeakerTinderStack({ speakers, photos }) {
  const [current, setCurrent] = useState(0);
  const [swiping, setSwiping] = useState(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);

  const swipe = (dir) => {
    setSwiping(dir);
    setTimeout(() => {
      setCurrent(p => (p + 1) % speakers.length);
      setSwiping(null);
      setDragX(0);
    }, 350);
  };

  const onDown = e => { setDragging(true); startX.current = e.clientX; e.currentTarget.setPointerCapture(e.pointerId); };
  const onMove = e => { if (dragging) setDragX(e.clientX - startX.current); };
  const onUp = () => { setDragging(false); Math.abs(dragX) > 80 ? swipe(dragX > 0 ? 'right' : 'left') : setDragX(0); };

  return (
    <div className="mini-tinder">
      <div className="mini-tinder__stack">
        {[2, 1].map(offset => {
          const idx = (current + offset) % speakers.length;
          return (
            <div key={`bg-${offset}`} className="mini-tinder__card mini-tinder__card--bg" style={{
              transform: `scale(${1 - offset * 0.06}) translateY(${offset * 10}px)`,
              zIndex: 10 - offset, opacity: 1 - offset * 0.2,
            }}>
              <img src={speakers[idx]?.photo_url || photos[idx % photos.length]} alt="" />
              <div className="mini-tinder__card-overlay" />
            </div>
          );
        })}
        <div
          className={`mini-tinder__card mini-tinder__card--active ${swiping ? `mini-tinder__card--${swiping}` : ''}`}
          style={{
            transform: swiping ? undefined : `translateX(${dragX}px) rotate(${dragX * 0.06}deg)`,
            transition: dragging ? 'none' : 'transform 0.35s cubic-bezier(0.23,1,0.32,1)',
            zIndex: 20, cursor: dragging ? 'grabbing' : 'grab',
          }}
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}
        >
          <img src={speakers[current]?.photo_url || photos[current % photos.length]} alt={speakers[current].name} />
          <div className="mini-tinder__card-overlay" />
          <div className="mini-tinder__card-info">
            <h3>{speakers[current].name}</h3>
            <p>{speakers[current].title}</p>
            <span>{speakers[current].organization}</span>
          </div>
        </div>
      </div>
      <div className="mini-tinder__controls">
        <button className="mini-tinder__btn mini-tinder__btn--prev" onClick={() => swipe('left')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span className="mini-tinder__counter">{current + 1}/{speakers.length}</span>
        <button className="mini-tinder__btn mini-tinder__btn--next" onClick={() => swipe('right')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  );
}

const FALLBACK_PROGRAMME = [
  { id: 'p1', title: 'Opening Ceremony', type: 'keynote', start_time: '2026-11-25T09:00:00', end_time: '2026-11-25T09:20:00', speakers: [{ name: 'Yuriko Backes' }] },
  { id: 'p2', title: 'The Quantum Threat Horizon', type: 'keynote', start_time: '2026-11-25T09:20:00', end_time: '2026-11-25T10:00:00', speakers: [{ name: 'Gen. Philippe de Villiers' }] },
  { id: 'p3', title: 'AI-Powered Defence: Strategy to Battlefield', type: 'keynote', start_time: '2026-11-25T10:00:00', end_time: '2026-11-25T10:40:00', speakers: [{ name: 'Dr. Alexandr Wang' }] },
  { id: 'p4', title: 'Post-Quantum Cryptography: Securing NATO', type: 'panel', start_time: '2026-11-25T11:10:00', end_time: '2026-11-25T12:00:00', speakers: [{ name: 'Dr. Dustin Moody' }, { name: 'Dr. Marko Erman' }] },
  { id: 'p5', title: 'Quantum Computing for Defence Applications', type: 'workshop', start_time: '2026-11-25T11:10:00', end_time: '2026-11-25T12:00:00', speakers: [{ name: 'Dr. Jay Gambetta' }] },
  { id: 'p6', title: "Europe's Digital Sovereignty", type: 'fireside', start_time: '2026-11-25T12:00:00', end_time: '2026-11-25T12:40:00', speakers: [{ name: 'Thierry Breton' }, { name: 'Dr. Andrea Renda' }] },
];

const FALLBACK_SPEAKERS = [
  { id: 'f1', name: 'Gen. Philippe de Villiers', title: 'Supreme Allied Commander Transformation', organization: 'NATO' },
  { id: 'f2', name: 'Dr. Jay Gambetta', title: 'VP of Quantum Computing', organization: 'IBM Quantum' },
  { id: 'f3', name: 'Yuriko Backes', title: 'Minister of Defence', organization: 'Luxembourg Government' },
  { id: 'f4', name: 'George Kurtz', title: 'CEO & Co-Founder', organization: 'CrowdStrike' },
  { id: 'f5', name: 'Dr. Loïc Henriet', title: 'CTO', organization: 'Pasqal' },
  { id: 'f6', name: 'Sabine Klauke', title: 'CTO', organization: 'Airbus Defence & Space' },
];

const FALLBACK_EXHIBITIONS = [
  { name: 'IBM Quantum', description: 'Quantum computing platforms & enterprise solutions', image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80', tag: 'Quantum Computing' },
  { name: 'Thales', description: 'Cybersecurity, defense electronics & quantum-safe encryption', image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80', tag: 'Defense' },
  { name: 'Pasqal', description: 'Neutral atom quantum processors for defense applications', image_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80', tag: 'Quantum Hardware' },
  { name: 'CrowdStrike', description: 'AI-native cybersecurity & threat intelligence platform', image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=400&q=80', tag: 'Cybersecurity' },
  { name: 'Airbus Defence', description: 'Satellite communications & secure defense systems', image_url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80', tag: 'Aerospace' },
  { name: 'IQM', description: 'European quantum computers for research & industry', image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80', tag: 'Quantum Hardware' },
  { name: 'Palo Alto Networks', description: 'Next-gen firewalls & zero trust security architecture', image_url: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=400&q=80', tag: 'Cybersecurity' },
  { name: 'Rheinmetall', description: 'Defense technology, electronics & autonomous systems', image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80', tag: 'Defense Tech' },
  { name: 'QuSecure', description: 'Post-quantum cryptography solutions for enterprises', image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80', tag: 'PQC' },
  { name: 'Scale AI', description: 'AI data platform for defense & intelligence applications', image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80', tag: 'AI & Defense' },
  { name: 'LuxProvide', description: "Luxembourg's HPC & quantum computing national center", image_url: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?w=400&q=80', tag: 'HPC' },
  { name: 'Leonardo', description: 'Defense, security, aerospace electronics & cyber systems', image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80', tag: 'Defense' },
];

const DEFAULT_PARTNERS = ['NATO', 'European Commission', 'Luxembourg MoD', 'ESA', 'EDA', 'Thales', 'Airbus Defence', 'IBM Quantum'];

function g(config, key, fallback) { return config[key] || fallback; }
function show(config, key) { const v = config[key]; return v !== false && v !== 'false'; }

export default function HomePage() {
  const [sessions, setSessions] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [exhibitions, setExhibitions] = useState([]);
  const [config, setConfig] = useState({});
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [vis, setVis] = useState({});
  const refs = useRef({});

  useEffect(() => {
    fetch('/api/config').then(r => r.ok ? r.json() : {}).then(setConfig).catch(() => {});
    fetch('/api/sessions').then(r => r.ok ? r.json() : []).then(d => {
      const l = (Array.isArray(d) ? d : []).sort((a,b) => new Date(a.start_time) - new Date(b.start_time));
      setSessions(l.filter(s => s.type !== 'break').slice(0, 6));
    }).catch(() => {});
    fetch('/api/speakers').then(r => r.ok ? r.json() : []).then(d => setSpeakers((Array.isArray(d) ? d : []).slice(0, 8))).catch(() => {});
    fetch('/api/exhibitions').then(r => r.ok ? r.json() : []).then(d => setExhibitions(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  useEffect(() => {
    const target = new Date(config.countdown_target || '2026-11-25T09:00:00+01:00');
    const tick = () => {
      const d = target - new Date();
      if (d <= 0) return;
      setCountdown({ days: Math.floor(d/864e5), hours: Math.floor(d/36e5%24), minutes: Math.floor(d/6e4%60), seconds: Math.floor(d/1e3%60) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [config.countdown_target]);

  useEffect(() => {
    const obs = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) setVis(p => ({ ...p, [e.target.dataset.s]: true }));
    }), { threshold: 0.12 });
    Object.values(refs.current).forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, [sessions, speakers, exhibitions]);

  const fmt = d => d ? new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '';
  const r = k => el => { refs.current[k] = el; };
  const a = k => vis[k] ? 'fade-in-up visible' : 'fade-in-up';

  const themes = g(config, 'section_about_themes', 'Quantum Computing, Post-Quantum Crypto, Cyber Defense, AI & Defense, Quantum Sensing, Policy & Ethics')
    .split(',').map(t => t.trim()).filter(Boolean);

  const partners = g(config, 'section_partners_list', '')
    ? config.section_partners_list.split(',').map(p => p.trim()).filter(Boolean)
    : DEFAULT_PARTNERS;

  const stands = exhibitions.length > 0 ? exhibitions : FALLBACK_EXHIBITIONS;

  const featureCards = [
    {
      img: g(config, 'theme1_image', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80'),
      title: g(config, 'theme1_title', 'Quantum Threat Intelligence'),
      desc: g(config, 'theme1_desc', 'Understanding the quantum threat to encryption and national security.'),
    },
    {
      img: g(config, 'theme2_image', 'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=600&q=80'),
      title: g(config, 'theme2_title', 'Cyber Defense Operations'),
      desc: g(config, 'theme2_desc', 'AI-powered defense, real-time threat response, and next-gen strategies.'),
    },
    {
      img: g(config, 'theme3_image', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80'),
      title: g(config, 'theme3_title', 'Post-Quantum Cryptography'),
      desc: g(config, 'theme3_desc', 'Deploying quantum-safe algorithms for classified communications.'),
    },
  ];

  return (
    <>
      {/* ===== HERO ===== */}
      {show(config, 'section_hero_visible') && (
      <section className="hero hero--split" style={{
        backgroundImage: `url(${g(config, 'hero_bg_image', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80')})`
      }}>
        <div className="hero-overlay" />
        <div className="hero__content hero__content--split">
          <div className="hero__left">
            <div className="hero-badge">
              <span className="hero-badge__dot" />
              {g(config, 'hero_date_badge', 'Nov 25, 2026')}
            </div>
            <h1 className="hero__title" dangerouslySetInnerHTML={{
              __html: g(config, 'hero_title', 'The summit<br />shaping <strong>quantum<br />defense.</strong>')
            }} />
            <p className="hero__subtitle-text">
              {g(config, 'hero_subtitle_text', '300+ leaders in cybersecurity, quantum computing, and defense gather at Maison du Savoir, Esch-sur-Alzette.')}
            </p>
            <div className="hero__actions">
              <Link to="/register" className="btn btn-gradient btn--lg">{g(config, 'hero_cta_primary', 'Attend the Event')}</Link>
              <Link to="/programme" className="btn btn-outline-light btn--lg">{g(config, 'hero_cta_secondary', 'Programme')}</Link>
            </div>
            <div className="hero__countdown">
              {[{ v: countdown.days, l: 'days' }, { v: countdown.hours, l: 'hrs' }, { v: countdown.minutes, l: 'min' }, { v: countdown.seconds, l: 'sec' }].map(({ v, l }) => (
                <div className="hero__countdown-item" key={l}>
                  <span className="hero__countdown-val">{String(v).padStart(2, '0')}</span>
                  <span className="hero__countdown-lbl">{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero__right">
            <div className="hero-visual">
              <div className="hero-ring hero-ring--1" />
              <div className="hero-ring hero-ring--2" />
              <div className="hero-ring hero-ring--3" />
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="hero-particle" style={{
                  '--x': `${20 + Math.random() * 60}%`, '--y': `${15 + Math.random() * 70}%`,
                  '--delay': `${i * 0.4}s`, '--size': `${4 + Math.random() * 8}px`,
                }} />
              ))}
              <div className="hero-visual__core" />
              <div className="hero-visual__label">{g(config, 'hero_logo_text', 'Q-DEF')}<br /><span>{g(config, 'hero_logo_year', '2026')}</span></div>
              {speakers.slice(0, 4).map((sp, i) => (
                <div key={sp.id || i} className="hero-orbit-photo" style={{ '--orbit-delay': `${i * -2.5}s`, '--orbit-distance': `${38 + i * 4}%` }}>
                  <img src={sp.photo_url || PHOTOS[i]} alt={sp.name} />
                  <span className="hero-orbit-photo__name">{sp.name.split(' ').pop()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ===== STATS BAR ===== */}
      {show(config, 'section_stats_visible') && (
      <section className="stats-bar">
        <div className="container stats-bar__inner">
          {[
            { n: g(config, 'stats_attendees', '300+'), l: 'Attendees' },
            { n: g(config, 'stats_speakers', '17'), l: 'Speakers' },
            { n: g(config, 'stats_sessions', '19'), l: 'Sessions' },
            { n: g(config, 'stats_tracks', '6'), l: 'Tracks' },
            { n: g(config, 'stats_nations', '15+'), l: 'Nations' },
          ].map(({ n, l }) => (
            <div className="stats-bar__item" key={l}><span className="stats-bar__num">{n}</span><span className="stats-bar__lbl">{l}</span></div>
          ))}
        </div>
      </section>
      )}

      {/* ===== ABOUT + SPEAKERS ===== */}
      {show(config, 'section_about_visible') && (
      <section className="section" ref={r('split')} data-s="split">
        <div className="container">
          <div className={`home-split ${a('split')}`}>
            <div className="home-split__left">
              <span className="label-tag">{g(config, 'section_about_label', 'About the summit')}</span>
              <h2 dangerouslySetInnerHTML={{ __html: g(config, 'section_about_title', 'Where quantum<br />meets security.') }} />
              <p>{g(config, 'section_about_desc', "Q-DEF is Luxembourg's premier summit on quantum technologies and national defense. One day, three tracks, and the experts who are defining the future.")}</p>
              <div className="home-split__themes">
                {themes.map(t => <span className="theme-pill" key={t}>{t}</span>)}
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                <Link to="/register" className="btn btn-gradient">{g(config, 'section_about_cta1', 'Get Your Ticket')}</Link>
                <Link to="/about" className="btn btn-outline-glow">{g(config, 'section_about_cta2', 'Learn More')}</Link>
              </div>
            </div>
            <div className="home-split__right">
              <span className="label-tag">Featured speakers</span>
              <SpeakerTinderStack speakers={speakers.length > 0 ? speakers.slice(0, 6) : FALLBACK_SPEAKERS} photos={PHOTOS} />
              <Link to="/speakers" className="btn btn-outline-glow" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}>
                View all speakers &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ===== EXHIBITIONS (from database) ===== */}
      {show(config, 'section_exhibitions_visible') && (
      <section className="section section-dark" ref={r('stands')} data-s="stands">
        <div className="container">
          <div className={a('stands')}>
            <div className="section-header" style={{ textAlign: 'left' }}>
              <span className="label-tag">{g(config, 'section_exhibitions_label', 'Exhibition Hall')}</span>
              <h2>{g(config, 'section_exhibitions_title', `${stands.length} stands to explore.`)}</h2>
              <p className="section-subtitle">{g(config, 'section_exhibitions_subtitle', 'Meet the companies building the future of quantum defense.')}</p>
            </div>
            <div className="stands-grid">
              {stands.map((stand, i) => (
                <div className="stand-card" key={stand.id || i} style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="stand-card__img-wrap">
                    <img src={stand.image_url} alt={stand.name} className="stand-card__img" loading="lazy" />
                    <span className="stand-card__tag">{stand.tag}</span>
                  </div>
                  <div className="stand-card__body">
                    <h3 className="stand-card__name">{stand.name}</h3>
                    <p className="stand-card__desc">{stand.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ===== PROGRAMME ===== */}
      {show(config, 'section_programme_visible') && (
      <section className="section section-dark" ref={r('prog')} data-s="prog">
        <div className="container">
          <div className={a('prog')}>
            <div className="section-header" style={{ textAlign: 'left' }}>
              <span className="label-tag">{g(config, 'section_programme_label', 'Programme')}</span>
              <h2>{g(config, 'section_programme_title', 'Full-day schedule.')}</h2>
              <p className="section-subtitle">{g(config, 'section_programme_subtitle', 'Keynotes, panels, workshops, and networking — all in one day.')}</p>
            </div>
            <div className="programme-preview-grid">
              {(sessions.length > 0 ? sessions : FALLBACK_PROGRAMME).slice(0, 8).map((s, i) => (
                <div className="glass-card programme-preview-card" key={s.id || i}>
                  <div className="programme-preview-card__header">
                    <span className="programme-preview-card__time">{fmt(s.start_time)}{s.end_time ? ` — ${fmt(s.end_time)}` : ''}</span>
                    <span className={`badge badge--${(s.type||'').toLowerCase()}`}>{s.type}</span>
                  </div>
                  <h3 className="programme-preview-card__title">{s.title}</h3>
                  {s.speakers?.length > 0 && (
                    <div className="programme-preview-card__speakers">
                      {s.speakers.map((sp, si) => (
                        <span key={si} className="programme-preview-card__speaker-tag">{typeof sp === 'string' ? sp : sp.name}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: '2.5rem' }}>
              <Link to="/programme" className="btn btn-gradient">View Full Programme &rarr;</Link>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ===== CTA BANNER ===== */}
      {show(config, 'section_cta_visible') && (
      <section className="cta-banner">
        <div className="container cta-banner__inner">
          <div>
            <h3 className="cta-banner__title">{g(config, 'section_cta_title', 'Limited seats available.')}</h3>
            <p className="cta-banner__desc">{g(config, 'section_cta_subtitle', 'Join us November 25, 2026 at Maison du Savoir.')}</p>
          </div>
          <Link to="/register" className="btn btn-gradient btn--lg">{g(config, 'section_cta_button', 'Reserve Your Seat')}</Link>
        </div>
      </section>
      )}

      {/* ===== FEATURE CARDS ===== */}
      {show(config, 'section_themes_visible') && (
      <section className="section" ref={r('feat')} data-s="feat">
        <div className="container">
          <div className={a('feat')}>
            <div className="section-header" style={{ textAlign: 'left' }}>
              <span className="label-tag">{g(config, 'section_themes_label', 'Key themes')}</span>
              <h2 dangerouslySetInnerHTML={{ __html: g(config, 'section_themes_title', 'Three pillars of<br />quantum defense.') }} />
            </div>
            <div className="feature-cards-grid">
              {featureCards.map((card, i) => (
                <div className="feature-card" key={i}>
                  <div className="feature-card__bg" style={{ backgroundImage: `url(${card.img})` }} />
                  <div className="feature-card__overlay" />
                  <div className="feature-card__content">
                    <h3 className="feature-card__title">{card.title}</h3>
                    <p className="feature-card__desc">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ===== FINAL CTA ===== */}
      {show(config, 'section_final_cta_visible') && (
      <section className="section-cta" style={{
        backgroundImage: `url(${g(config, 'final_cta_bg_image', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&q=80')})`
      }}>
        <div className="section-cta__overlay" />
        <div className="container section-cta__content">
          <h2 className="section-cta__title" style={{ color: '#fff' }}>{g(config, 'section_final_cta_title', 'Secure your place.')}</h2>
          <p className="section-cta__desc" style={{ color: 'rgba(255,255,255,0.7)' }}>{g(config, 'section_final_cta_subtitle', 'Join 300+ leaders shaping the future of quantum defense in Europe.')}</p>
          <Link to="/register" className="btn btn-gradient btn--lg">{g(config, 'section_final_cta_button', 'Attend the Event')}</Link>
        </div>
      </section>
      )}

      {/* ===== PARTNERS ===== */}
      {show(config, 'section_partners_visible') && (
      <section className="section section-dark" ref={r('part')} data-s="part">
        <div className="container">
          <div className={a('part')}>
            <div className="section-header">
              <span className="label-tag">{g(config, 'section_partners_label', 'Partners')}</span>
              <h2>{g(config, 'section_partners_title', 'Trusted by leaders.')}</h2>
            </div>
            <div className="partners-row">
              {partners.map(p => <div className="partner-logo glass-card" key={p}>{p}</div>)}
            </div>
          </div>
        </div>
      </section>
      )}
    </>
  );
}
