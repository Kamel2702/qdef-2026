import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const TYPE_COLORS = {
  keynote: '#14b8a6',
  panel: '#3b82f6',
  workshop: '#f59e0b',
  presentation: '#8b5cf6',
  fireside: '#ec4899',
  break: '#6b7280',
};

export default function AgendaPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('timeline'); // 'timeline' | 'grid'

  useEffect(() => {
    fetch('/api/sessions')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const list = (Array.isArray(data) ? data : []).sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
        setSessions(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmt = (d) => d ? new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '';
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '';

  // Group sessions by hour
  const hours = {};
  sessions.forEach(s => {
    const h = fmt(s.start_time);
    if (!hours[h]) hours[h] = [];
    hours[h].push(s);
  });

  const getDuration = (s) => {
    if (!s.start_time || !s.end_time) return 0;
    return (new Date(s.end_time) - new Date(s.start_time)) / 60000;
  };

  const eventDate = sessions.length > 0 ? fmtDate(sessions[0].start_time) : '';

  return (
    <>
      <section className="page-hero page-hero--img" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&q=80)'
      }}>
        <div className="page-hero__overlay" />
        <div className="page-hero__content">
          <h1 className="page-hero__title">
            <span className="gradient-text">Agenda</span>
          </h1>
          <p className="page-hero__subtitle">{eventDate || 'Conference schedule'}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div>
          ) : sessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-gray-400)' }}>
              <h2>Agenda coming soon</h2>
            </div>
          ) : (
            <>
              {/* View toggle + legend */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setView('timeline')}
                    className={`filter-pill ${view === 'timeline' ? 'filter-pill--active' : ''}`}
                  >Timeline</button>
                  <button
                    onClick={() => setView('grid')}
                    className={`filter-pill ${view === 'grid' ? 'filter-pill--active' : ''}`}
                  >Grid</button>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {Object.entries(TYPE_COLORS).map(([type, color]) => (
                    <span key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Timeline view */}
              {view === 'timeline' && (
                <div style={{ position: 'relative', paddingLeft: '80px' }}>
                  {/* Vertical line */}
                  <div style={{
                    position: 'absolute', left: '38px', top: 0, bottom: 0, width: '2px',
                    background: 'linear-gradient(to bottom, var(--color-accent), transparent)',
                  }} />

                  {Object.entries(hours).map(([time, timeSessions]) => (
                    <div key={time} style={{ marginBottom: '0.5rem' }}>
                      {timeSessions.map((session, i) => {
                        const color = TYPE_COLORS[session.type] || '#6b7280';
                        const duration = getDuration(session);
                        const isSelected = selected === session.id;

                        return (
                          <div
                            key={session.id}
                            onClick={() => setSelected(isSelected ? null : session.id)}
                            style={{
                              position: 'relative',
                              marginBottom: '0.75rem',
                              cursor: 'pointer',
                            }}
                          >
                            {/* Time label */}
                            {i === 0 && (
                              <div style={{
                                position: 'absolute', left: '-80px', top: '0.5rem', width: '60px',
                                textAlign: 'right', fontSize: '0.85rem', fontWeight: 700,
                                color: 'var(--color-gray-700)',
                              }}>
                                {time}
                              </div>
                            )}

                            {/* Dot */}
                            <div style={{
                              position: 'absolute', left: '-49px', top: '0.65rem',
                              width: 14, height: 14, borderRadius: '50%',
                              background: color, border: '3px solid var(--color-bg)',
                              boxShadow: `0 0 0 2px ${color}40`,
                            }} />

                            {/* Card */}
                            <div style={{
                              padding: '1rem 1.25rem',
                              borderRadius: '10px',
                              background: isSelected ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                              border: `1px solid ${isSelected ? color : 'transparent'}`,
                              boxShadow: isSelected ? `0 4px 20px ${color}20` : 'none',
                              transition: 'all 0.2s',
                              borderLeft: `4px solid ${color}`,
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <span style={{
                                  padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem',
                                  fontWeight: 700, background: `${color}20`, color: color,
                                  textTransform: 'uppercase',
                                }}>
                                  {session.type}
                                </span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-400)' }}>
                                  {fmt(session.start_time)} — {fmt(session.end_time)}
                                  {duration > 0 && ` (${duration} min)`}
                                </span>
                              </div>
                              <h3 style={{ margin: '0.5rem 0 0', fontSize: '1.05rem' }}>
                                {session.title}
                              </h3>

                              {isSelected && (
                                <div style={{ marginTop: '0.75rem' }}>
                                  {session.description && (
                                    <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 0.75rem' }}>
                                      {session.description}
                                    </p>
                                  )}
                                  {session.speakers?.length > 0 && (
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                      {session.speakers.map((sp, si) => (
                                        <span key={si} style={{
                                          padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem',
                                          background: 'var(--color-accent-pale)', color: 'var(--color-accent)',
                                          fontWeight: 500,
                                        }}>
                                          {typeof sp === 'string' ? sp : sp.name}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  {session.location && (
                                    <p style={{ color: 'var(--color-gray-400)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                                      {session.location}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}

              {/* Grid view */}
              {view === 'grid' && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '1rem',
                }}>
                  {sessions.map(session => {
                    const color = TYPE_COLORS[session.type] || '#6b7280';
                    return (
                      <div
                        key={session.id}
                        onClick={() => setSelected(selected === session.id ? null : session.id)}
                        className="glass-card"
                        style={{
                          padding: '1.25rem',
                          cursor: 'pointer',
                          borderTop: `3px solid ${color}`,
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{
                            padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem',
                            fontWeight: 700, background: `${color}20`, color: color,
                            textTransform: 'uppercase',
                          }}>{session.type}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-400)', fontWeight: 600 }}>
                            {fmt(session.start_time)}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{session.title}</h3>
                        <p style={{ color: 'var(--color-gray-400)', fontSize: '0.8rem', margin: 0 }}>
                          {fmt(session.start_time)} — {fmt(session.end_time)}
                        </p>
                        {selected === session.id && session.description && (
                          <p style={{ color: 'var(--color-gray-500)', fontSize: '0.85rem', marginTop: '0.75rem', lineHeight: 1.6 }}>
                            {session.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* CTA */}
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <Link to="/register" className="btn btn-gradient btn--lg">Register Now</Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
