import { Link } from 'react-router-dom';
import TicketLink from '../components/TicketLink';

export default function AboutPage() {
  return (
    <>
      <section className="page-hero page-hero--img" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80)'
      }}>
        <div className="page-hero__overlay" />
        <div className="page-hero__content">
          <h1 className="page-hero__title">About <span className="gradient-text">Q-DEF</span></h1>
          <p className="page-hero__subtitle">Shaping the future of quantum-safe defense in Europe</p>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container">
          <div className="about-preview">
            <div className="about-preview__text">
              <span className="label-tag">Our mission</span>
              <h2>Defending tomorrow,<br />starting today.</h2>
              <p style={{ color: 'var(--color-gray-500)', lineHeight: 1.8 }}>
                Q-DEF Conference Luxembourg advances the understanding and preparedness
                of European defense communities in the face of quantum and emerging technologies.
                We bring together decision-makers, researchers, and industry innovators.
              </p>
              <p style={{ color: 'var(--color-gray-500)', lineHeight: 1.8 }}>
                Our 2026 edition focuses on the critical juncture where quantum computing
                meets national security — exploring both the threats and the transformative potential.
              </p>
              <TicketLink className="btn btn-gradient" style={{ marginTop: '1rem' }}>Attend the Event</TicketLink>
            </div>
            <div className="about-preview__image">
              <img src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80" alt="Q-DEF Conference" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="section section-dark">
        <div className="container">
          <span className="label-tag">Objectives</span>
          <h2 style={{ marginBottom: '2rem' }}>What we aim to achieve.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {[
              'Assess the impact of quantum computing on defense systems',
              'Explore post-quantum cryptography standards & migration',
              'Foster European cooperation on quantum-safe infrastructure',
              'Showcase emerging defense technologies & innovations',
              'Connect policy makers with technical experts',
              'Develop actionable strategies for quantum readiness',
            ].map((item, i) => (
              <div key={i} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
                <span style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--color-accent-pale)', color: 'var(--color-accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.8rem', flexShrink: 0,
                }}>{i + 1}</span>
                <span style={{ color: 'var(--color-gray-600)', fontSize: '0.95rem' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Themes */}
      <section className="section">
        <div className="container">
          <span className="label-tag">Conference themes</span>
          <h2 style={{ marginBottom: '2rem' }}>Four pillars of Q-DEF.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {[
              { title: 'Quantum Computing & Cryptography', desc: 'Post-quantum cryptography standards, quantum key distribution, and the timeline to cryptographically relevant quantum computers.' },
              { title: 'Cybersecurity & Resilience', desc: 'AI-driven threat detection, zero-trust architectures, and strategies for building cyber-resilient defense infrastructure.' },
              { title: 'Defense Technology & Innovation', desc: 'Autonomous systems, quantum sensing, electronic warfare, and AI-enhanced decision-making for military operations.' },
              { title: 'Policy, Ethics & Governance', desc: 'Regulatory frameworks, dual-use technology controls, ethics of autonomous weapons, and transatlantic cooperation.' },
            ].map((t, i) => (
              <div key={i} className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '0.75rem', color: 'var(--color-gray-900)' }}>{t.title}</h3>
                <p style={{ color: 'var(--color-gray-500)', margin: 0, lineHeight: 1.7, fontSize: '0.95rem' }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who should attend */}
      <section className="section section-dark">
        <div className="container">
          <span className="label-tag">Who should attend</span>
          <h2 style={{ marginBottom: '2rem' }}>Built for decision-makers.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              { title: 'Government & Defense', desc: 'Policy makers, defense officials, and intelligence professionals shaping quantum strategies.' },
              { title: 'Research & Academia', desc: 'Quantum scientists, cryptographers, and researchers at the forefront of discovery.' },
              { title: 'Industry & Technology', desc: 'CTOs, CISOs, and technology leaders building quantum-safe products and infrastructure.' },
            ].map((item, i) => (
              <div key={i} className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '0.75rem', color: 'var(--color-gray-900)' }}>{item.title}</h3>
                <p style={{ color: 'var(--color-gray-500)', margin: 0, lineHeight: 1.7, fontSize: '0.95rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <TicketLink className="btn btn-gradient btn--lg">Register Now</TicketLink>
          </div>
        </div>
      </section>
    </>
  );
}
