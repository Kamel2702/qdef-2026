import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import TicketLink from '../components/TicketLink';

const AVATAR_IMAGES = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop&crop=face',
];

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [swiping, setSwiping] = useState(null); // 'left' | 'right' | null
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const cardRef = useRef(null);

  useEffect(() => {
    fetch('/api/speakers')
      .then(r => r.ok ? r.json() : [])
      .then(data => setSpeakers(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSwipe = useCallback((direction) => {
    setSwiping(direction);
    setTimeout(() => {
      setCurrent(prev => prev + 1);
      setSwiping(null);
      setDragX(0);
      setDragY(0);
    }, 400);
  }, []);

  const onPointerDown = (e) => {
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    setDragX(e.clientX - startPos.current.x);
    setDragY((e.clientY - startPos.current.y) * 0.3);
  };

  const onPointerUp = () => {
    setIsDragging(false);
    if (Math.abs(dragX) > 120) {
      handleSwipe(dragX > 0 ? 'right' : 'left');
    } else {
      setDragX(0);
      setDragY(0);
    }
  };

  const reset = () => {
    setCurrent(0);
    setSwiping(null);
    setDragX(0);
    setDragY(0);
  };

  const getImage = (idx) => AVATAR_IMAGES[idx % AVATAR_IMAGES.length];
  const rotation = dragX * 0.08;
  const opacity = 1 - Math.abs(dragX) / 500;

  return (
    <>
      <section className="page-hero page-hero--img" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&q=80)'
      }}>
        <div className="page-hero__overlay" />
        <div className="page-hero__content">
          <h1 className="page-hero__title">
            Our <span className="gradient-text">Speakers</span>
          </h1>
          <p className="page-hero__subtitle">Swipe to discover our expert speakers</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div>
          ) : current >= speakers.length ? (
            <div className="tinder-done">
              <h2>You've seen all <span className="gradient-text">{speakers.length}</span> speakers!</h2>
              <p>Ready to join them at Q-DEF 2026?</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                <button onClick={reset} className="btn btn-outline-glow">View Again</button>
                <TicketLink className="btn btn-gradient">Attend the Event</TicketLink>
              </div>
            </div>
          ) : (
            <div className="tinder-container">
              {/* Card Stack */}
              <div className="tinder-stack">
                {/* Background cards */}
                {speakers.slice(current + 1, current + 3).reverse().map((sp, i) => {
                  const offset = (2 - i);
                  return (
                    <div
                      key={sp.id}
                      className="tinder-card tinder-card--bg"
                      style={{
                        transform: `scale(${1 - offset * 0.05}) translateY(${offset * 12}px)`,
                        zIndex: 10 - offset,
                        opacity: 1 - offset * 0.15,
                      }}
                    >
                      <img src={getImage(speakers.indexOf(sp))} alt="" className="tinder-card__img" />
                      <div className="tinder-card__overlay" />
                    </div>
                  );
                })}

                {/* Active card */}
                <div
                  ref={cardRef}
                  className={`tinder-card tinder-card--active ${swiping ? `tinder-card--${swiping}` : ''}`}
                  style={{
                    transform: swiping
                      ? undefined
                      : `translateX(${dragX}px) translateY(${dragY}px) rotate(${rotation}deg)`,
                    transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                    zIndex: 20,
                    cursor: isDragging ? 'grabbing' : 'grab',
                  }}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                >
                  <img src={getImage(current)} alt={speakers[current].name} className="tinder-card__img" />
                  <div className="tinder-card__overlay" />

                  <div className="tinder-card__info">
                    <h2 className="tinder-card__name">{speakers[current].name}</h2>
                    <p className="tinder-card__title">{speakers[current].title}</p>
                    <p className="tinder-card__org">{speakers[current].organization}</p>
                    <p className="tinder-card__bio">{speakers[current].bio?.slice(0, 150)}...</p>
                  </div>
                </div>
              </div>

              {/* Navigation arrows */}
              <div className="tinder-actions">
                <button className="tinder-btn tinder-btn--prev" onClick={() => handleSwipe('left')}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button className="tinder-btn tinder-btn--next" onClick={() => handleSwipe('right')}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              {/* Counter */}
              <div className="tinder-counter">
                {current + 1} / {speakers.length}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Full speaker list below */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">All <span className="gradient-text">Speakers</span></h2>
          </div>
          <div className="speakers-grid-list">
            {speakers.map((sp, i) => (
              <div className="speaker-list-card" key={sp.id || i}>
                <img src={getImage(i)} alt={sp.name} className="speaker-list-card__img" />
                <div className="speaker-list-card__info">
                  <h3>{sp.name}</h3>
                  <p className="speaker-list-card__title">{sp.title}</p>
                  <p className="speaker-list-card__org">{sp.organization}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
