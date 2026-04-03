import { useState, useEffect } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [config, setConfig] = useState({});
  const location = useLocation();

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/config').then(r => r.ok ? r.json() : {}).then(setConfig).catch(() => {});
  }, []);

  const g = (key, fallback) => config[key] || fallback;
  const pageOn = (key) => { const v = config[key]; return v !== false && v !== 'false'; };

  const allNavLinks = [
    { to: '/', label: 'Home' },
    { to: '/programme', label: 'Programme', configKey: 'page_programme_visible' },
    { to: '/speakers', label: 'Speakers', configKey: 'page_speakers_visible' },
    { to: '/about', label: 'About', configKey: 'page_about_visible' },
    { to: '/venue', label: 'Venue', configKey: 'page_venue_visible' },
    { to: '/contact', label: 'Contact', configKey: 'page_contact_visible' },
  ];

  const navLinks = allNavLinks.filter(link => !link.configKey || pageOn(link.configKey));

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
        <div className="header__inner">
          <Link to="/" className="header__logo">
            {config.site_logo ? (
              <img src={config.site_logo} alt={g('hero_logo_text', 'Q-DEF')} className="header__logo-img" />
            ) : (
              <>
                <span className="logo-text">{g('hero_logo_text', 'Q-DEF')}</span>
                <span className="logo-year">{g('hero_logo_year', '2026')}</span>
              </>
            )}
          </Link>

          <nav className={`header__nav ${menuOpen ? 'open' : ''}`}>
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `header__nav-link ${isActive ? 'active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
            {pageOn('page_register_visible') && (
              <Link to="/register" className="header__cta">
                Get Tickets
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            )}
          </nav>

          <button
            className={`header__toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      <div className={`mobile-nav-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />

      <main><Outlet /></main>

      <footer className="footer">
        <div className="footer__gradient-line" />
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              <div className="footer__brand-name">
                {config.site_logo ? (
                  <img src={config.site_logo} alt={g('hero_logo_text', 'Q-DEF')} className="footer__logo-img" />
                ) : (
                  <>
                    <span className="logo-text" style={{ fontSize: '1.8rem' }}>{g('footer_logo_text', g('hero_logo_text', 'Q-DEF'))}</span>
                    <span className="logo-year" style={{ fontSize: '0.7rem' }}>{g('footer_logo_year', g('hero_logo_year', '2026'))}</span>
                  </>
                )}
              </div>
              <p className="footer__tagline">{g('footer_tagline', 'Quantum Defense & Emerging Technologies')}</p>
              <p className="footer__description">
                {g('footer_description', 'The premier European summit bringing together world-leading experts in quantum technologies, cybersecurity, and national defense.')}
              </p>
              <div className="footer__social">
                {g('social_linkedin', 'https://linkedin.com') && (
                  <a href={g('social_linkedin', 'https://linkedin.com')} target="_blank" rel="noopener noreferrer" className="footer__social-link">LinkedIn</a>
                )}
                {config.social_twitter && (
                  <a href={config.social_twitter} target="_blank" rel="noopener noreferrer" className="footer__social-link">Twitter/X</a>
                )}
              </div>
            </div>
            <div>
              <h4 className="footer__heading">Navigation</h4>
              <div className="footer__links">
                <Link to="/">Home</Link>
                <Link to="/programme">Programme</Link>
                <Link to="/speakers">Speakers</Link>
                <Link to="/about">About</Link>
                <Link to="/venue">Venue</Link>
              </div>
            </div>
            <div>
              <h4 className="footer__heading">Legal</h4>
              <div className="footer__links">
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/contact">Contact Us</Link>
                <Link to="/register">Register</Link>
              </div>
            </div>
            <div>
              <h4 className="footer__heading">Contact</h4>
              <div className="footer__contact-item"><span>{g('footer_email', g('contact_email', 'info@qdef-conference.lu'))}</span></div>
              <div className="footer__contact-item"><span>{g('footer_phone', g('contact_phone', '+352 123 456 789'))}</span></div>
              <div className="footer__contact-item"><span>{g('footer_address', g('event_location', 'Maison du Savoir, Esch-sur-Alzette'))}</span></div>
            </div>
          </div>
          <div className="footer__bottom">
            <p>&copy; {new Date().getFullYear()} {g('footer_copyright', 'Q-DEF Conference Luxembourg')}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
