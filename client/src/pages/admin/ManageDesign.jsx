import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const COLOR_FIELDS = [
  { key: 'design_color_accent', label: 'Accent Color (buttons, links)', default: '#14b8a6' },
  { key: 'design_color_accent_hover', label: 'Accent Hover', default: '#0d9488' },
  { key: 'design_color_bg', label: 'Background', default: '#fafaf7' },
  { key: 'design_color_bg_alt', label: 'Background Alt (dark sections)', default: '#f0eeea' },
  { key: 'design_color_bg_dark', label: 'Background Dark (hero, footer)', default: '#0a0a0a' },
  { key: 'design_color_surface', label: 'Surface (cards)', default: '#ffffff' },
  { key: 'design_color_text', label: 'Text Color', default: '#6b655c' },
  { key: 'design_color_heading', label: 'Heading Color', default: '#0a0a0a' },
  { key: 'design_color_red', label: 'Red / Error', default: '#e63946' },
  { key: 'design_color_success', label: 'Success', default: '#16a34a' },
  { key: 'design_color_warning', label: 'Warning', default: '#d97706' },
];

const FONT_OPTIONS = [
  { label: 'Plus Jakarta Sans (default)', value: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif" },
  { label: 'Inter', value: "'Inter', -apple-system, sans-serif" },
  { label: 'Poppins', value: "'Poppins', sans-serif" },
  { label: 'Montserrat', value: "'Montserrat', sans-serif" },
  { label: 'Raleway', value: "'Raleway', sans-serif" },
  { label: 'DM Sans', value: "'DM Sans', sans-serif" },
  { label: 'Space Grotesk', value: "'Space Grotesk', sans-serif" },
  { label: 'Outfit', value: "'Outfit', sans-serif" },
  { label: 'Roboto', value: "'Roboto', sans-serif" },
  { label: 'Open Sans', value: "'Open Sans', sans-serif" },
  { label: 'Lato', value: "'Lato', sans-serif" },
  { label: 'Source Sans Pro', value: "'Source Sans 3', sans-serif" },
  { label: 'System Default', value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
];

const RADIUS_OPTIONS = [
  { label: 'None (sharp)', value: '0px' },
  { label: 'Small (4px)', value: '4px' },
  { label: 'Medium (8px)', value: '8px' },
  { label: 'Large (12px)', value: '12px' },
  { label: 'XL (16px)', value: '16px' },
  { label: 'XXL (20px)', value: '20px' },
  { label: 'Full (pill)', value: '9999px' },
];

const FONT_SIZE_OPTIONS = [
  { label: 'Small (14px)', value: '14px' },
  { label: 'Default (16px)', value: '16px' },
  { label: 'Large (18px)', value: '18px' },
  { label: 'XL (20px)', value: '20px' },
];

const HEADING_WEIGHT_OPTIONS = [
  { label: 'Normal (400)', value: '400' },
  { label: 'Medium (500)', value: '500' },
  { label: 'Semi-bold (600)', value: '600' },
  { label: 'Bold (700)', value: '700' },
  { label: 'Extra-bold (800)', value: '800' },
  { label: 'Black (900)', value: '900' },
];

const PRESETS = [
  {
    name: 'Default (Teal Editorial)',
    values: {
      design_color_accent: '#14b8a6', design_color_accent_hover: '#0d9488',
      design_color_bg: '#fafaf7', design_color_bg_alt: '#f0eeea', design_color_bg_dark: '#0a0a0a',
      design_color_surface: '#ffffff', design_color_text: '#6b655c', design_color_heading: '#0a0a0a',
    },
  },
  {
    name: 'Midnight Blue',
    values: {
      design_color_accent: '#3b82f6', design_color_accent_hover: '#2563eb',
      design_color_bg: '#f8fafc', design_color_bg_alt: '#f1f5f9', design_color_bg_dark: '#0f172a',
      design_color_surface: '#ffffff', design_color_text: '#64748b', design_color_heading: '#0f172a',
    },
  },
  {
    name: 'Purple Elegance',
    values: {
      design_color_accent: '#8b5cf6', design_color_accent_hover: '#7c3aed',
      design_color_bg: '#faf5ff', design_color_bg_alt: '#f3e8ff', design_color_bg_dark: '#1e1b4b',
      design_color_surface: '#ffffff', design_color_text: '#6b7280', design_color_heading: '#1e1b4b',
    },
  },
  {
    name: 'Military Green',
    values: {
      design_color_accent: '#22c55e', design_color_accent_hover: '#16a34a',
      design_color_bg: '#f7fdf9', design_color_bg_alt: '#ecfdf5', design_color_bg_dark: '#052e16',
      design_color_surface: '#ffffff', design_color_text: '#4b5563', design_color_heading: '#052e16',
    },
  },
  {
    name: 'Dark Mode',
    values: {
      design_color_accent: '#06b6d4', design_color_accent_hover: '#0891b2',
      design_color_bg: '#111827', design_color_bg_alt: '#1f2937', design_color_bg_dark: '#030712',
      design_color_surface: '#1f2937', design_color_text: '#9ca3af', design_color_heading: '#f9fafb',
    },
  },
  {
    name: 'Warm Corporate',
    values: {
      design_color_accent: '#f59e0b', design_color_accent_hover: '#d97706',
      design_color_bg: '#fffbeb', design_color_bg_alt: '#fef3c7', design_color_bg_dark: '#1c1917',
      design_color_surface: '#ffffff', design_color_text: '#57534e', design_color_heading: '#1c1917',
    },
  },
  {
    name: 'Rose',
    values: {
      design_color_accent: '#f43f5e', design_color_accent_hover: '#e11d48',
      design_color_bg: '#fff1f2', design_color_bg_alt: '#ffe4e6', design_color_bg_dark: '#1a1a2e',
      design_color_surface: '#ffffff', design_color_text: '#6b7280', design_color_heading: '#1a1a2e',
    },
  },
];

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const gg = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${gg}, ${b}, ${alpha})`;
}

export default function ManageDesign() {
  const { token } = useAuth();
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then(r => r.ok ? r.json() : {})
      .then(setConfig)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleChange(key, value) {
    setConfig(prev => ({ ...prev, [key]: value }));
    setSaved(false);
    // Live preview: apply immediately
    applyDesignVar(key, value);
  }

  function applyDesignVar(key, value) {
    const root = document.documentElement;
    const map = {
      design_color_accent: '--color-accent',
      design_color_accent_hover: '--color-accent-hover',
      design_color_bg: '--color-bg',
      design_color_bg_alt: '--color-bg-alt',
      design_color_bg_dark: '--color-bg-dark',
      design_color_surface: '--color-surface',
      design_color_text: null, // special
      design_color_heading: null, // special
      design_color_red: '--color-red',
      design_color_success: '--color-success',
      design_color_warning: '--color-warning',
      design_font_body: '--font-family',
      design_font_heading: '--font-display',
      design_font_size: null,
      design_radius_buttons: null,
      design_radius_cards: '--radius-md',
      design_heading_weight: null,
    };
    const cssVar = map[key];
    if (cssVar && value) {
      root.style.setProperty(cssVar, value);
    }
    if (key === 'design_color_accent' && value) {
      root.style.setProperty('--color-accent-pale', hexToRgba(value, 0.08));
      root.style.setProperty('--color-accent-glow', hexToRgba(value, 0.25));
      root.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${value}, ${config.design_color_accent_hover || '#0d9488'})`);
    }
    if (key === 'design_font_size' && value) {
      root.style.setProperty('font-size', value);
    }
  }

  function applyPreset(preset) {
    const next = { ...config, ...preset.values };
    setConfig(next);
    setSaved(false);
    Object.entries(preset.values).forEach(([k, v]) => applyDesignVar(k, v));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error('Save failed');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Failed to save design settings.');
    } finally {
      setSaving(false);
    }
  }

  function g(key, fallback) { return config[key] || fallback; }

  if (loading) return <div className="loading">Loading design settings...</div>;

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Design</h1>
          <p>Customize colors, fonts, and layout — changes preview live.</p>
        </div>
        <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Color Presets */}
      <div className="admin-table-wrapper" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-table-header"><h2>Color Presets</h2></div>
        <div style={{ padding: '1.5rem' }}>
          <p style={{ color: 'var(--color-gray-500)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Choose a preset as starting point, then customize individual colors below.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
            {PRESETS.map(preset => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--color-gray-200)',
                  cursor: 'pointer',
                  background: 'var(--color-surface)',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', gap: '4px', marginBottom: '0.5rem' }}>
                  {[preset.values.design_color_accent, preset.values.design_color_bg, preset.values.design_color_bg_dark, preset.values.design_color_heading].map((c, i) => (
                    <div key={i} style={{ width: 20, height: 20, borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,0.1)' }} />
                  ))}
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-gray-700)' }}>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="admin-table-wrapper" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-table-header"><h2>Colors</h2></div>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {COLOR_FIELDS.map(({ key, label, default: def }) => (
              <div key={key} className="form-group">
                <label className="form-label" style={{ fontSize: '0.85rem' }}>{label}</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={g(key, def)}
                    onChange={e => handleChange(key, e.target.value)}
                    style={{ width: 44, height: 36, padding: 2, border: '1px solid var(--color-gray-200)', borderRadius: 6, cursor: 'pointer', background: 'var(--color-surface)' }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={g(key, def)}
                    onChange={e => handleChange(key, e.target.value)}
                    placeholder={def}
                    style={{ flex: 1, fontSize: '0.85rem', fontFamily: 'monospace' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="admin-table-wrapper" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-table-header"><h2>Typography</h2></div>
        <div style={{ padding: '1.5rem' }}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Body Font</label>
              <select
                className="form-input"
                value={g('design_font_body', '')}
                onChange={e => handleChange('design_font_body', e.target.value)}
              >
                <option value="">Default (Plus Jakarta Sans)</option>
                {FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Heading Font</label>
              <select
                className="form-input"
                value={g('design_font_heading', '')}
                onChange={e => handleChange('design_font_heading', e.target.value)}
              >
                <option value="">Same as body font</option>
                {FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Base Font Size</label>
              <select
                className="form-input"
                value={g('design_font_size', '')}
                onChange={e => handleChange('design_font_size', e.target.value)}
              >
                <option value="">Default (16px)</option>
                {FONT_SIZE_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Heading Weight</label>
              <select
                className="form-input"
                value={g('design_heading_weight', '')}
                onChange={e => handleChange('design_heading_weight', e.target.value)}
              >
                <option value="">Default (800)</option>
                {HEADING_WEIGHT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Custom Google Font URL</label>
              <input
                type="text"
                className="form-input"
                value={g('design_google_font_url', '')}
                onChange={e => handleChange('design_google_font_url', e.target.value)}
                placeholder="https://fonts.googleapis.com/css2?family=YourFont:wght@400;600;800&display=swap"
              />
              <small style={{ color: 'var(--color-gray-500)', marginTop: 4, display: 'block' }}>
                Paste a Google Fonts URL to load a custom font, then select it in the dropdowns above.
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Layout & Shape */}
      <div className="admin-table-wrapper" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-table-header"><h2>Layout & Shape</h2></div>
        <div style={{ padding: '1.5rem' }}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Button Border Radius</label>
              <select
                className="form-input"
                value={g('design_radius_buttons', '')}
                onChange={e => handleChange('design_radius_buttons', e.target.value)}
              >
                <option value="">Default (8px)</option>
                {RADIUS_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Card Border Radius</label>
              <select
                className="form-input"
                value={g('design_radius_cards', '')}
                onChange={e => handleChange('design_radius_cards', e.target.value)}
              >
                <option value="">Default (8px)</option>
                {RADIUS_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Max Content Width</label>
              <select
                className="form-input"
                value={g('design_max_width', '')}
                onChange={e => handleChange('design_max_width', e.target.value)}
              >
                <option value="">Default (1200px)</option>
                <option value="960px">Narrow (960px)</option>
                <option value="1200px">Default (1200px)</option>
                <option value="1400px">Wide (1400px)</option>
                <option value="1600px">Extra Wide (1600px)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Section Spacing</label>
              <select
                className="form-input"
                value={g('design_section_padding', '')}
                onChange={e => handleChange('design_section_padding', e.target.value)}
              >
                <option value="">Default (6rem)</option>
                <option value="3rem">Compact (3rem)</option>
                <option value="4rem">Medium (4rem)</option>
                <option value="6rem">Default (6rem)</option>
                <option value="8rem">Spacious (8rem)</option>
                <option value="10rem">Very Spacious (10rem)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <div className="admin-table-wrapper" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-table-header"><h2>Custom CSS</h2></div>
        <div style={{ padding: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Additional CSS</label>
            <textarea
              className="form-textarea"
              value={g('design_custom_css', '')}
              onChange={e => handleChange('design_custom_css', e.target.value)}
              placeholder={`/* Your custom CSS here */\n.hero__title {\n  font-size: 4rem;\n}`}
              rows={8}
              style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
            />
            <small style={{ color: 'var(--color-gray-500)', marginTop: 4, display: 'block' }}>
              Advanced: add custom CSS to override any style on the site.
            </small>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="admin-table-wrapper" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-table-header"><h2>Preview</h2></div>
        <div style={{ padding: '1.5rem' }}>
          <div style={{
            background: g('design_color_bg', '#fafaf7'),
            padding: '2rem',
            borderRadius: g('design_radius_cards', '8px'),
            border: '1px solid var(--color-gray-200)',
          }}>
            <h2 style={{
              color: g('design_color_heading', '#0a0a0a'),
              fontWeight: g('design_heading_weight', '800'),
              marginBottom: '0.5rem',
            }}>
              Heading Preview
            </h2>
            <p style={{ color: g('design_color_text', '#6b655c'), marginBottom: '1rem' }}>
              This is how body text will look with your current settings. Lorem ipsum dolor sit amet.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button style={{
                background: `linear-gradient(135deg, ${g('design_color_accent', '#14b8a6')}, ${g('design_color_accent_hover', '#0d9488')})`,
                color: 'white', border: 'none', padding: '0.6rem 1.5rem',
                borderRadius: g('design_radius_buttons', '8px'), fontWeight: 600, cursor: 'pointer',
              }}>
                Primary Button
              </button>
              <button style={{
                background: 'transparent',
                color: g('design_color_accent', '#14b8a6'),
                border: `2px solid ${g('design_color_accent', '#14b8a6')}`,
                padding: '0.6rem 1.5rem',
                borderRadius: g('design_radius_buttons', '8px'), fontWeight: 600, cursor: 'pointer',
              }}>
                Outline Button
              </button>
            </div>
            <div style={{
              marginTop: '1rem', padding: '1rem',
              background: g('design_color_surface', '#ffffff'),
              borderRadius: g('design_radius_cards', '8px'),
              border: '1px solid rgba(0,0,0,0.05)',
            }}>
              <h3 style={{ color: g('design_color_heading', '#0a0a0a'), marginBottom: '0.25rem' }}>Card Preview</h3>
              <p style={{ color: g('design_color_text', '#6b655c'), margin: 0, fontSize: '0.9rem' }}>This is what a card looks like.</p>
            </div>
          </div>

          {/* Dark section preview */}
          <div style={{
            background: g('design_color_bg_dark', '#0a0a0a'),
            padding: '2rem', marginTop: '1rem',
            borderRadius: g('design_radius_cards', '8px'),
          }}>
            <h2 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Dark Section Preview</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>This is how dark sections (hero, footer) will look.</p>
            <button style={{
              background: `linear-gradient(135deg, ${g('design_color_accent', '#14b8a6')}, ${g('design_color_accent_hover', '#0d9488')})`,
              color: 'white', border: 'none', padding: '0.6rem 1.5rem',
              borderRadius: g('design_radius_buttons', '8px'), fontWeight: 600, cursor: 'pointer',
            }}>
              CTA Button
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
