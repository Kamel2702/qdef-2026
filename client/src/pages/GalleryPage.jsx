import { useEffect, useState } from 'react';

export default function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.ok ? r.json() : [])
      .then(data => setPhotos(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ['all', ...new Set(photos.map(p => p.category).filter(Boolean))];
  const filtered = filter === 'all' ? photos : photos.filter(p => p.category === filter);

  return (
    <>
      <section className="page-hero page-hero--img" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80)'
      }}>
        <div className="page-hero__overlay" />
        <div className="page-hero__content">
          <h1 className="page-hero__title">
            <span className="gradient-text">Gallery</span>
          </h1>
          <p className="page-hero__subtitle">Photos from Q-DEF events</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div>
          ) : photos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-gray-400)' }}>
              <h2>Coming Soon</h2>
              <p>Photos will be available after the event.</p>
            </div>
          ) : (
            <>
              {/* Filter pills */}
              {categories.length > 2 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem', justifyContent: 'center' }}>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`filter-pill ${filter === cat ? 'filter-pill--active' : ''}`}
                    >
                      {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              )}

              {/* Photo grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem',
              }}>
                {filtered.map((photo, i) => (
                  <div
                    key={photo.id || i}
                    onClick={() => setLightbox(photo)}
                    style={{
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      position: 'relative',
                      aspectRatio: '4/3',
                      boxShadow: 'var(--shadow-card)',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
                  >
                    <img
                      src={photo.image_url}
                      alt={photo.caption || ''}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {photo.caption && (
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                        padding: '2rem 1rem 1rem',
                        color: 'white', fontSize: '0.85rem',
                      }}>
                        {photo.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: '2rem',
          }}
        >
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: 'absolute', top: '1.5rem', right: '1.5rem',
              background: 'none', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer',
            }}
          >&times;</button>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '85vh', textAlign: 'center' }}>
            <img
              src={lightbox.image_url}
              alt={lightbox.caption || ''}
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px' }}
            />
            {lightbox.caption && (
              <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '1rem', fontSize: '0.95rem' }}>
                {lightbox.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
