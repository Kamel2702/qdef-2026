import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const PAGE_SLUGS = [
  { slug: 'home', label: 'Home Page' },
  { slug: 'about', label: 'About Page' },
  { slug: 'venue', label: 'Venue Page' },
];

export default function ManagePages() {
  const { token } = useAuth();
  const [pages, setPages] = useState({});
  const [activeSlug, setActiveSlug] = useState('home');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editMode, setEditMode] = useState('visual');

  // Raw JSON string for raw editing
  const [rawJson, setRawJson] = useState('');

  useEffect(() => {
    Promise.all(
      PAGE_SLUGS.map(p =>
        fetch(`/api/pages/${p.slug}`)
          .then(r => r.ok ? r.json() : null)
          .catch(() => null)
      )
    ).then(results => {
      const map = {};
      PAGE_SLUGS.forEach((p, i) => {
        if (results[i]) {
          map[p.slug] = results[i];
        }
      });
      setPages(map);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const page = pages[activeSlug];
    if (page) {
      try {
        const content = typeof page.content === 'string' ? page.content : JSON.stringify(page.content, null, 2);
        setRawJson(content);
      } catch {
        setRawJson(page.content || '');
      }
    } else {
      setRawJson('{}');
    }
  }, [activeSlug, pages]);

  function getContentObj() {
    const page = pages[activeSlug];
    if (!page) return {};
    try {
      return typeof page.content === 'string' ? JSON.parse(page.content) : page.content;
    } catch {
      return {};
    }
  }

  function updateField(path, value) {
    const content = getContentObj();
    const keys = path.split('.');
    let obj = content;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj[keys[i]]) obj[keys[i]] = {};
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;

    setPages(prev => ({
      ...prev,
      [activeSlug]: {
        ...prev[activeSlug],
        content: JSON.stringify(content),
      },
    }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      let content;
      if (editMode === 'raw') {
        JSON.parse(rawJson); // validate
        content = rawJson;
      } else {
        content = pages[activeSlug]?.content || '{}';
      }

      const page = pages[activeSlug];
      const res = await fetch(`/api/pages/${activeSlug}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: page?.title || activeSlug,
          content,
        }),
      });
      if (!res.ok) throw new Error('Save failed');

      const updated = await res.json();
      setPages(prev => ({ ...prev, [activeSlug]: updated }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Failed to save page. ' + (err.message || ''));
    } finally {
      setSaving(false);
    }
  }

  const content = getContentObj();

  function renderFields(obj, prefix = '') {
    return Object.entries(obj).map(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return (
          <div key={path} style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-gray-600)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {label}
            </h3>
            <div style={{ paddingLeft: '1rem', borderLeft: '2px solid var(--color-gray-200)' }}>
              {renderFields(value, path)}
            </div>
          </div>
        );
      }

      if (Array.isArray(value)) {
        return (
          <div className="form-group" key={path} style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">{label} (JSON array)</label>
            <textarea
              className="form-textarea"
              value={JSON.stringify(value, null, 2)}
              onChange={e => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  updateField(path, parsed);
                } catch {}
              }}
              rows={Math.min(8, 2 + value.length)}
              style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
            />
          </div>
        );
      }

      const isLong = typeof value === 'string' && value.length > 100;
      return (
        <div className="form-group" key={path} style={isLong ? { gridColumn: '1 / -1' } : undefined}>
          <label className="form-label">{label}</label>
          {isLong ? (
            <textarea
              className="form-textarea"
              value={value || ''}
              onChange={e => updateField(path, e.target.value)}
              rows={3}
            />
          ) : (
            <input
              type="text"
              className="form-input"
              value={value || ''}
              onChange={e => updateField(path, e.target.value)}
            />
          )}
        </div>
      );
    });
  }

  if (loading) return <div className="loading">Loading pages...</div>;

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1>Page Content</h1>
          <p>Edit the content of each public page.</p>
        </div>
        <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Page tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {PAGE_SLUGS.map(p => (
          <button
            key={p.slug}
            className={`btn ${activeSlug === p.slug ? 'btn--primary btn--sm' : 'btn--ghost btn--sm'}`}
            onClick={() => setActiveSlug(p.slug)}
          >
            {p.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          className={`btn btn--sm ${editMode === 'visual' ? 'btn--primary' : 'btn--ghost'}`}
          onClick={() => setEditMode('visual')}
        >
          Visual
        </button>
        <button
          className={`btn btn--sm ${editMode === 'raw' ? 'btn--primary' : 'btn--ghost'}`}
          onClick={() => setEditMode('raw')}
        >
          Raw JSON
        </button>
      </div>

      <div className="admin-table-wrapper" style={{ padding: '1.5rem' }}>
        {editMode === 'raw' ? (
          <div className="form-group">
            <label className="form-label">Raw JSON Content</label>
            <textarea
              className="form-textarea"
              value={rawJson}
              onChange={e => setRawJson(e.target.value)}
              rows={25}
              style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
            />
          </div>
        ) : (
          <div className="form-grid">
            {Object.keys(content).length > 0
              ? renderFields(content)
              : <p style={{ color: 'var(--color-gray-400)' }}>No content for this page. Switch to Raw JSON to add content.</p>
            }
          </div>
        )}
      </div>
    </>
  );
}
