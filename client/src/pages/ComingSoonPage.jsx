import { Link } from 'react-router-dom';

export default function ComingSoonPage() {
  return (
    <section style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1.5rem',
      textAlign: 'center',
    }}>
      <div>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 2rem', opacity: 0.9,
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
          Coming Soon
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-gray-400)', maxWidth: 480, margin: '0 auto 2rem' }}>
          This page is currently being prepared. Check back soon for updates.
        </p>
        <Link to="/" className="btn btn-gradient btn--lg">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
