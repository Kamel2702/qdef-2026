import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ComingSoonPage from './ComingSoonPage';

export default function CustomPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetch(`/api/custom-pages/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(data => setPage(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  if (notFound) return <ComingSoonPage />;

  const content = Array.isArray(page.content) ? page.content : [];

  return (
    <>
      {/* Hero */}
      <section className="page-hero page-hero--img" style={{
        backgroundImage: page.hero_image
          ? `url(${page.hero_image})`
          : 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80)',
      }}>
        <div className="page-hero__overlay" />
        <div className="page-hero__content">
          <h1 className="page-hero__title">{page.title}</h1>
        </div>
      </section>

      {/* Content blocks */}
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          {content.map((block, i) => {
            if (block.type === 'text') {
              return (
                <div key={i} style={{ marginBottom: '2.5rem' }}>
                  {block.heading && (
                    <h2 style={{ marginBottom: '0.75rem' }}>{block.heading}</h2>
                  )}
                  {block.body && (
                    <div style={{ color: 'var(--color-gray-600)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                      {block.body}
                    </div>
                  )}
                </div>
              );
            }

            if (block.type === 'image') {
              return (
                <div key={i} style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                  {block.url && (
                    <img
                      src={block.url}
                      alt={block.caption || ''}
                      style={{ maxWidth: '100%', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)' }}
                    />
                  )}
                  {block.caption && (
                    <p style={{ color: 'var(--color-gray-400)', fontSize: '0.875rem', marginTop: '0.75rem' }}>
                      {block.caption}
                    </p>
                  )}
                </div>
              );
            }

            if (block.type === 'cta') {
              return (
                <div key={i} style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                  <Link
                    to={block.link || '/'}
                    className="btn btn-gradient btn--lg"
                  >
                    {block.text || 'En savoir plus'}
                  </Link>
                </div>
              );
            }

            return null;
          })}

          {content.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--color-gray-400)', padding: '3rem 0' }}>
              Cette page est en cours de construction.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
