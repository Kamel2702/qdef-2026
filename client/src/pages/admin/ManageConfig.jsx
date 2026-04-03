import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from '../../components/ImageUpload';

const CONFIG_GROUPS = [
  {
    label: 'Event Information',
    fields: [
      { key: 'event_name', label: 'Event Name', type: 'text' },
      { key: 'event_full_name', label: 'Full Name', type: 'text' },
      { key: 'event_tagline', label: 'Tagline', type: 'text' },
      { key: 'event_date', label: 'Event Date (display)', type: 'text' },
      { key: 'event_date_iso', label: 'Event Date (ISO)', type: 'date' },
      { key: 'countdown_target', label: 'Countdown Target (ISO datetime)', type: 'text' },
      { key: 'event_location', label: 'Location', type: 'text' },
      { key: 'event_address', label: 'Address', type: 'text' },
    ],
  },
  {
    label: 'Contact & Social',
    fields: [
      { key: 'contact_email', label: 'Contact Email', type: 'email' },
      { key: 'contact_phone', label: 'Contact Phone', type: 'text' },
      { key: 'ticket_url', label: 'Ticket URL', type: 'url' },
      { key: 'social_linkedin', label: 'LinkedIn URL', type: 'url' },
      { key: 'social_twitter', label: 'Twitter/X URL', type: 'url' },
    ],
  },
];

const SECTION_VISIBILITY = [
  { key: 'section_hero_visible', label: 'Hero Section' },
  { key: 'section_stats_visible', label: 'Stats Bar' },
  { key: 'section_about_visible', label: 'About & Speakers' },
  { key: 'section_exhibitions_visible', label: 'Exhibition Stands' },
  { key: 'section_programme_visible', label: 'Programme Preview' },
  { key: 'section_cta_visible', label: 'CTA Banner' },
  { key: 'section_themes_visible', label: 'Key Themes' },
  { key: 'section_final_cta_visible', label: 'Final CTA' },
  { key: 'section_partners_visible', label: 'Partners' },
];

const SECTION_CONFIG = [
  {
    label: 'Logo & Branding',
    fields: [
      { key: 'site_logo', label: 'Site Logo (replaces text logo everywhere)', type: 'image' },
      { key: 'hero_logo_text', label: 'Logo Text (fallback if no image)', type: 'text', placeholder: 'Q-DEF' },
      { key: 'hero_logo_year', label: 'Logo Year', type: 'text', placeholder: '2026' },
    ],
  },
  {
    label: 'Hero Section',
    fields: [
      { key: 'hero_bg_image', label: 'Background Image', type: 'image' },
      { key: 'hero_date_badge', label: 'Date Badge', type: 'text', placeholder: 'Nov 25, 2026' },
      { key: 'hero_title', label: 'Title (supports <br> and <strong>)', type: 'textarea', placeholder: 'The summit<br />shaping <strong>quantum<br />defense.</strong>' },
      { key: 'hero_subtitle_text', label: 'Subtitle', type: 'textarea', placeholder: '300+ leaders in cybersecurity, quantum computing...' },
      { key: 'hero_cta_primary', label: 'Primary Button Text', type: 'text', placeholder: 'Attend the Event' },
      { key: 'hero_cta_secondary', label: 'Secondary Button Text', type: 'text', placeholder: 'Programme' },
      { key: 'hero_logo_text', label: 'Logo Text', type: 'text', placeholder: 'Q-DEF' },
      { key: 'hero_logo_year', label: 'Logo Year', type: 'text', placeholder: '2026' },
    ],
  },
  {
    label: 'Stats Bar',
    fields: [
      { key: 'stats_attendees', label: 'Attendees', type: 'text', placeholder: '300+' },
      { key: 'stats_speakers', label: 'Speakers', type: 'text', placeholder: '17' },
      { key: 'stats_sessions', label: 'Sessions', type: 'text', placeholder: '19' },
      { key: 'stats_tracks', label: 'Tracks', type: 'text', placeholder: '6' },
      { key: 'stats_nations', label: 'Nations', type: 'text', placeholder: '15+' },
    ],
  },
  {
    label: 'About & Speakers',
    fields: [
      { key: 'section_about_label', label: 'Label', type: 'text', placeholder: 'About the summit' },
      { key: 'section_about_title', label: 'Title (supports <br>)', type: 'text', placeholder: 'Where quantum meets security.' },
      { key: 'section_about_desc', label: 'Description', type: 'textarea', placeholder: "Q-DEF is Luxembourg's premier summit..." },
      { key: 'section_about_themes', label: 'Theme Pills (comma-separated)', type: 'text', placeholder: 'Quantum Computing, Post-Quantum Crypto, Cyber Defense, AI & Defense, Quantum Sensing, Policy & Ethics' },
      { key: 'section_about_cta1', label: 'Button 1 Text', type: 'text', placeholder: 'Get Your Ticket' },
      { key: 'section_about_cta2', label: 'Button 2 Text', type: 'text', placeholder: 'Learn More' },
    ],
  },
  {
    label: 'Exhibition Stands',
    fields: [
      { key: 'section_exhibitions_label', label: 'Label', type: 'text', placeholder: 'Exhibition Hall' },
      { key: 'section_exhibitions_title', label: 'Title', type: 'text', placeholder: '12 stands to explore.' },
      { key: 'section_exhibitions_subtitle', label: 'Subtitle', type: 'text', placeholder: 'Meet the companies building the future...' },
    ],
  },
  {
    label: 'Programme Preview',
    fields: [
      { key: 'section_programme_label', label: 'Label', type: 'text', placeholder: 'Programme' },
      { key: 'section_programme_title', label: 'Title', type: 'text', placeholder: 'Full-day schedule.' },
      { key: 'section_programme_subtitle', label: 'Subtitle', type: 'text', placeholder: 'Keynotes, panels, workshops, and networking...' },
    ],
  },
  {
    label: 'CTA Banner',
    fields: [
      { key: 'section_cta_title', label: 'Title', type: 'text', placeholder: 'Limited seats available.' },
      { key: 'section_cta_subtitle', label: 'Subtitle', type: 'text', placeholder: 'Join us November 25, 2026 at Maison du Savoir.' },
      { key: 'section_cta_button', label: 'Button Text', type: 'text', placeholder: 'Reserve Your Seat' },
    ],
  },
  {
    label: 'Key Themes — Card 1',
    fields: [
      { key: 'section_themes_label', label: 'Section Label', type: 'text', placeholder: 'Key themes' },
      { key: 'section_themes_title', label: 'Section Title (supports <br>)', type: 'text', placeholder: 'Three pillars of quantum defense.' },
      { key: 'theme1_image', label: 'Image', type: 'image' },
      { key: 'theme1_title', label: 'Title', type: 'text', placeholder: 'Quantum Threat Intelligence' },
      { key: 'theme1_desc', label: 'Description', type: 'text', placeholder: 'Understanding the quantum threat to encryption...' },
    ],
  },
  {
    label: 'Key Themes — Card 2',
    fields: [
      { key: 'theme2_image', label: 'Image', type: 'image' },
      { key: 'theme2_title', label: 'Title', type: 'text', placeholder: 'Cyber Defense Operations' },
      { key: 'theme2_desc', label: 'Description', type: 'text', placeholder: 'AI-powered defense, real-time threat response...' },
    ],
  },
  {
    label: 'Key Themes — Card 3',
    fields: [
      { key: 'theme3_image', label: 'Image', type: 'image' },
      { key: 'theme3_title', label: 'Title', type: 'text', placeholder: 'Post-Quantum Cryptography' },
      { key: 'theme3_desc', label: 'Description', type: 'text', placeholder: 'Deploying quantum-safe algorithms...' },
    ],
  },
  {
    label: 'Final CTA',
    fields: [
      { key: 'final_cta_bg_image', label: 'Background Image', type: 'image' },
      { key: 'section_final_cta_title', label: 'Title', type: 'text', placeholder: 'Secure your place.' },
      { key: 'section_final_cta_subtitle', label: 'Subtitle', type: 'text', placeholder: 'Join 300+ leaders shaping the future...' },
      { key: 'section_final_cta_button', label: 'Button Text', type: 'text', placeholder: 'Attend the Event' },
    ],
  },
  {
    label: 'Partners',
    fields: [
      { key: 'section_partners_label', label: 'Label', type: 'text', placeholder: 'Partners' },
      { key: 'section_partners_title', label: 'Title', type: 'text', placeholder: 'Trusted by leaders.' },
      { key: 'section_partners_list', label: 'Partner Names (comma-separated)', type: 'textarea', placeholder: 'NATO, European Commission, Luxembourg MoD, ESA, EDA, Thales, Airbus Defence, IBM Quantum' },
    ],
  },
  {
    label: 'Footer',
    fields: [
      { key: 'footer_logo_text', label: 'Logo Text', type: 'text', placeholder: 'Q-DEF' },
      { key: 'footer_logo_year', label: 'Logo Year', type: 'text', placeholder: '2026' },
      { key: 'footer_tagline', label: 'Tagline', type: 'text', placeholder: 'Quantum Defense & Emerging Technologies' },
      { key: 'footer_description', label: 'Description', type: 'textarea', placeholder: 'The premier European summit bringing together...' },
      { key: 'footer_email', label: 'Contact Email', type: 'text', placeholder: 'info@qdef-conference.lu' },
      { key: 'footer_phone', label: 'Contact Phone', type: 'text', placeholder: '+352 123 456 789' },
      { key: 'footer_address', label: 'Address', type: 'text', placeholder: 'Maison du Savoir, Esch-sur-Alzette' },
      { key: 'footer_copyright', label: 'Copyright Text', type: 'text', placeholder: 'Q-DEF Conference Luxembourg' },
      { key: 'footer_text', label: 'Extra Footer Text', type: 'text' },
    ],
  },
];

export default function ManageConfig() {
  const { token } = useAuth();
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then(r => r.ok ? r.json() : {})
      .then(data => setConfig(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleChange(key, value) {
    setConfig(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleToggle(key) {
    const current = config[key];
    const newVal = current === false || current === 'false' ? true : false;
    handleChange(key, newVal);
  }

  function isOn(key) {
    const val = config[key];
    return val !== false && val !== 'false';
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error('Save failed');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Failed to save configuration.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="loading">Loading configuration...</div>;

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Site Settings</h1>
          <p>Configure every aspect of the site — text, images, visibility.</p>
        </div>
        <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* General config */}
      {CONFIG_GROUPS.map(group => (
        <div className="admin-table-wrapper" key={group.label} style={{ marginBottom: '1.5rem' }}>
          <div className="admin-table-header">
            <h2>{group.label}</h2>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div className="form-grid">
              {group.fields.map(field => (
                <div className="form-group" key={field.key} style={field.type === 'textarea' ? { gridColumn: '1 / -1' } : undefined}>
                  <label className="form-label">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      className="form-textarea"
                      value={config[field.key] || ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <input
                      type={field.type}
                      className="form-input"
                      value={config[field.key] || ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Section Visibility */}
      <div className="admin-table-wrapper" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-table-header">
          <h2>Section Visibility</h2>
        </div>
        <div style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--color-gray-500)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Toggle homepage sections on or off. Hidden sections won't appear for visitors.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {SECTION_VISIBILITY.map(({ key, label }) => (
              <label
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--color-gray-200)',
                  cursor: 'pointer',
                  background: isOn(key) ? 'var(--color-gray-50)' : 'transparent',
                  opacity: isOn(key) ? 1 : 0.5,
                  transition: 'all 0.2s',
                }}
              >
                <div
                  onClick={(e) => { e.preventDefault(); handleToggle(key); }}
                  style={{
                    width: 40, height: 22, borderRadius: 11,
                    background: isOn(key) ? 'var(--color-accent, #4f46e5)' : 'var(--color-gray-300)',
                    position: 'relative', transition: 'background 0.2s', flexShrink: 0, cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', background: 'white',
                    position: 'absolute', top: 2, left: isOn(key) ? 20 : 2,
                    transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </div>
                <span style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--color-gray-700)' }}>{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Section Configuration */}
      {SECTION_CONFIG.map(group => (
        <div className="admin-table-wrapper" key={group.label} style={{ marginBottom: '1.5rem' }}>
          <div className="admin-table-header">
            <h2>{group.label}</h2>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div className="form-grid">
              {group.fields.map(field => {
                if (field.type === 'image') {
                  return (
                    <div key={field.key} style={{ gridColumn: '1 / -1' }}>
                      <ImageUpload
                        label={field.label}
                        value={config[field.key] || ''}
                        onChange={url => handleChange(field.key, url)}
                      />
                    </div>
                  );
                }
                return (
                  <div className="form-group" key={field.key} style={field.type === 'textarea' ? { gridColumn: '1 / -1' } : undefined}>
                    <label className="form-label">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        className="form-textarea"
                        value={config[field.key] || ''}
                        onChange={e => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={2}
                      />
                    ) : (
                      <input
                        type="text"
                        className="form-input"
                        value={config[field.key] || ''}
                        onChange={e => handleChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
