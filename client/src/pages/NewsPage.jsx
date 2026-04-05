import { useEffect, useState } from 'react';

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const list = (Array.isArray(data) ? data : []).filter(n => n.published !== false);
        list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        setArticles(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const [expanded, setExpanded] = useState({});

  return (
    <>
      <section className="page-hero page-hero--img" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=1920&q=80)'
      }}>
        <div className="page-hero__overlay" />
        <div className="page-hero__content">
          <h1 className="page-hero__title">
            <span className="gradient-text">News</span>
          </h1>
          <p className="page-hero__subtitle">Latest updates from Q-DEF</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div>
          ) : articles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-gray-400)' }}>
              <h2>No news yet</h2>
              <p>Check back soon for updates about Q-DEF 2026.</p>
            </div>
          ) : (
            <div className="news-list">
              {articles.map(article => (
                <div key={article.id} className="news-article glass-card">
                  {article.image_url && (
                    <div className="news-article__img-wrap">
                      <img src={article.image_url} alt={article.title} loading="lazy" />
                    </div>
                  )}
                  <div className="news-article__body">
                    <div className="news-article__meta">
                      <span className="news-article__date">
                        {article.created_at ? new Date(article.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                      </span>
                    </div>
                    <h2 className="news-article__title">{article.title}</h2>
                    {article.excerpt && <p className="news-article__excerpt">{article.excerpt}</p>}
                    {article.content && (
                      <>
                        {expanded[article.id] && (
                          <div className="news-article__content" dangerouslySetInnerHTML={{ __html: article.content }} />
                        )}
                        <button
                          className="btn btn-outline-glow"
                          style={{ marginTop: '1rem', fontSize: '0.85rem' }}
                          onClick={() => setExpanded(p => ({ ...p, [article.id]: !p[article.id] }))}
                        >
                          {expanded[article.id] ? 'Show less' : 'Read more'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
