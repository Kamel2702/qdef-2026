import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }

  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    if (Object.keys(errs).length > 0) return setErrors(errs);

    setSubmitting(true);
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to send');
      setSubmitted(true);
    } catch {
      setErrors({ message: 'Failed to send message. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '0.85rem 1rem',
    borderRadius: '8px',
    border: '1px solid var(--color-gray-200)',
    background: 'var(--color-surface)',
    color: 'var(--color-gray-800)',
    fontSize: '0.95rem',
    fontFamily: 'var(--font-family)',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.4rem',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--color-gray-700)',
  };

  const groupStyle = { marginBottom: '1.25rem' };
  const errorStyle = { color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '0.3rem' };

  return (
    <>
      <section className="page-hero page-hero--img" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80)'
      }}>
        <div className="page-hero__overlay" />
        <div className="page-hero__content">
          <h1 className="page-hero__title">Contact <span className="gradient-text">Us</span></h1>
          <p className="page-hero__subtitle">Get in touch with the Q-DEF organizing team</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-preview">
            {/* Left — contact info */}
            <div className="about-preview__text">
              <span className="label-tag">Get in touch</span>
              <h2>We'd love to<br />hear from you.</h2>
              <p style={{ color: 'var(--color-gray-500)', lineHeight: 1.8, marginBottom: '2rem' }}>
                Have questions about the conference, registration, or sponsorship?
                Reach out using any of the methods below.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { label: 'Email', value: 'info@qdef-conference.lu', href: 'mailto:info@qdef-conference.lu' },
                  { label: 'Phone', value: '+352 123 456 789' },
                  { label: 'Address', value: 'Maison du Savoir\n2 avenue de l\'Université\n4365 Esch-sur-Alzette' },
                ].map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <span style={{
                      width: 40, height: 40, borderRadius: '8px',
                      background: 'var(--color-accent-pale)', color: 'var(--color-accent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
                    }}>{c.label[0]}</span>
                    <div>
                      <strong style={{ display: 'block', color: 'var(--color-gray-800)', fontSize: '0.9rem', marginBottom: '0.15rem' }}>{c.label}</strong>
                      {c.href
                        ? <a href={c.href} style={{ color: 'var(--color-accent)' }}>{c.value}</a>
                        : <span style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem', whiteSpace: 'pre-line' }}>{c.value}</span>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — form */}
            <div>
              {submitted ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                  <div style={{
                    width: 56, height: 56, fontSize: '1.5rem', margin: '0 auto 1rem',
                    background: 'rgba(20, 184, 166, 0.1)', color: 'var(--color-accent)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>&#10003;</div>
                  <h3 style={{ color: 'var(--color-gray-900)' }}>Message Sent!</h3>
                  <p style={{ color: 'var(--color-gray-500)', marginTop: '0.5rem' }}>
                    Thank you. We'll get back to you within 2 business days.
                  </p>
                </div>
              ) : (
                <div className="glass-card" style={{ padding: '2rem' }}>
                  <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-gray-900)' }}>Send a Message</h3>
                  <form onSubmit={handleSubmit} noValidate>
                    <div style={groupStyle}>
                      <label style={labelStyle}>Name *</label>
                      <input type="text" name="name" style={inputStyle} value={form.name} onChange={handleChange} placeholder="Your full name" />
                      {errors.name && <div style={errorStyle}>{errors.name}</div>}
                    </div>
                    <div style={groupStyle}>
                      <label style={labelStyle}>Email *</label>
                      <input type="email" name="email" style={inputStyle} value={form.email} onChange={handleChange} placeholder="your@email.com" />
                      {errors.email && <div style={errorStyle}>{errors.email}</div>}
                    </div>
                    <div style={groupStyle}>
                      <label style={labelStyle}>Subject *</label>
                      <input type="text" name="subject" style={inputStyle} value={form.subject} onChange={handleChange} placeholder="What is your inquiry about?" />
                      {errors.subject && <div style={errorStyle}>{errors.subject}</div>}
                    </div>
                    <div style={groupStyle}>
                      <label style={labelStyle}>Message *</label>
                      <textarea name="message" style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }} value={form.message} onChange={handleChange} placeholder="Your message..." rows={5} />
                      {errors.message && <div style={errorStyle}>{errors.message}</div>}
                    </div>
                    <button type="submit" className="btn btn-gradient" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>
                      {submitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
