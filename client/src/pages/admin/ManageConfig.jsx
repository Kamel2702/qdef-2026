import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

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
  {
    label: 'Hero Section',
    fields: [
      { key: 'hero_headline', label: 'Headline', type: 'text' },
      { key: 'hero_subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'hero_cta_primary', label: 'Primary CTA Text', type: 'text' },
      { key: 'hero_cta_secondary', label: 'Secondary CTA Text', type: 'text' },
    ],
  },
  {
    label: 'Stats Bar',
    fields: [
      { key: 'stats_attendees', label: 'Attendees', type: 'text' },
      { key: 'stats_speakers', label: 'Speakers', type: 'text' },
      { key: 'stats_sessions', label: 'Sessions', type: 'text' },
      { key: 'stats_tracks', label: 'Tracks', type: 'text' },
      { key: 'stats_nations', label: 'Nations', type: 'text' },
    ],
  },
  {
    label: 'Footer',
    fields: [
      { key: 'footer_text', label: 'Footer Text', type: 'text' },
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1>Site Settings</h1>
          <p>Configure event information, contact details, and display settings.</p>
        </div>
        <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

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
    </>
  );
}
