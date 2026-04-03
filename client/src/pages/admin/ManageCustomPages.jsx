import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from '../../components/ImageUpload';

const emptyPage = {
  title: '',
  slug: '',
  hero_image: '',
  show_in_nav: true,
  nav_order: 99,
  published: true,
  content: [],
};

export default function ManageCustomPages() {
  const { token } = useAuth();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyPage);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const fetchPages = useCallback(() => {
    fetch('/api/custom-pages', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => setPages(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyPage, content: [] });
    setError('');
    setShowModal(true);
  }

  function openEdit(page) {
    setEditing(page);
    setForm({
      title: page.title || '',
      slug: page.slug || '',
      hero_image: page.hero_image || '',
      show_in_nav: page.show_in_nav !== false,
      nav_order: page.nav_order || 99,
      published: page.published !== false,
      content: Array.isArray(page.content) ? page.content : [],
    });
    setError('');
    setShowModal(true);
  }

  function handleChange(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function autoSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 50);
  }

  // Content block management
  function addBlock(type) {
    const block = type === 'text'
      ? { type: 'text', heading: '', body: '' }
      : type === 'image'
      ? { type: 'image', url: '', caption: '' }
      : { type: 'cta', text: '', link: '' };
    setForm(prev => ({ ...prev, content: [...prev.content, block] }));
  }

  function updateBlock(index, key, value) {
    setForm(prev => {
      const content = [...prev.content];
      content[index] = { ...content[index], [key]: value };
      return { ...prev, content };
    });
  }

  function removeBlock(index) {
    setForm(prev => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index),
    }));
  }

  function moveBlock(index, dir) {
    setForm(prev => {
      const content = [...prev.content];
      const target = index + dir;
      if (target < 0 || target >= content.length) return prev;
      [content[index], content[target]] = [content[target], content[index]];
      return { ...prev, content };
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) { setError('Le titre est requis.'); return; }
    if (!form.slug.trim()) { setError("L'URL est requise."); return; }

    setSaving(true);
    try {
      const url = editing ? `/api/custom-pages/${editing.id}` : '/api/custom-pages';
      const method = editing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur de sauvegarde.');
      }

      setShowModal(false);
      fetchPages();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Supprimer cette page ?')) return;
    try {
      await fetch(`/api/custom-pages/${id}`, { method: 'DELETE', headers });
      fetchPages();
    } catch { alert('Echec de la suppression.'); }
  }

  async function togglePublished(page) {
    try {
      await fetch(`/api/custom-pages/${page.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ published: !page.published }),
      });
      fetchPages();
    } catch {}
  }

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Pages personnalisees</h1>
          <p>Creez des pages supplementaires qui apparaissent dans le menu.</p>
        </div>
        <button className="btn btn--primary" onClick={openCreate}>+ Nouvelle page</button>
      </div>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h2>Pages ({pages.length})</h2>
        </div>

        {pages.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            Aucune page personnalisee. Cliquez sur "+ Nouvelle page" pour en creer une.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>URL</th>
                <th>Menu</th>
                <th>Statut</th>
                <th>Ordre</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map(page => (
                <tr key={page.id}>
                  <td style={{ fontWeight: 600 }}>{page.title}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>/{page.slug}</td>
                  <td>
                    <span style={{
                      padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                      background: page.show_in_nav ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)',
                      color: page.show_in_nav ? '#10b981' : '#64748b',
                    }}>
                      {page.show_in_nav ? 'Visible' : 'Cache'}
                    </span>
                  </td>
                  <td>
                    <span
                      onClick={() => togglePublished(page)}
                      style={{
                        padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                        background: page.published ? 'rgba(20,184,166,0.15)' : 'rgba(239,68,68,0.15)',
                        color: page.published ? '#14b8a6' : '#ef4444',
                      }}
                    >
                      {page.published ? 'Publie' : 'Brouillon'}
                    </span>
                  </td>
                  <td>{page.nav_order}</td>
                  <td>
                    <div className="table-actions">
                      <button onClick={() => openEdit(page)}>Edit</button>
                      <button className="delete" onClick={() => handleDelete(page.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 700, maxHeight: '90vh', overflow: 'auto' }}>
            <div className="modal__header">
              <h2>{editing ? 'Modifier la page' : 'Nouvelle page'}</h2>
              <button className="modal__close" onClick={() => setShowModal(false)}>&times;</button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal__body">
                {error && <div className="alert alert--error">{error}</div>}

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Titre *</label>
                    <input
                      type="text" className="form-input" value={form.title}
                      onChange={e => {
                        handleChange('title', e.target.value);
                        if (!editing) handleChange('slug', autoSlug(e.target.value));
                      }}
                      placeholder="Ma nouvelle page"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">URL *</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ color: '#64748b', fontSize: '0.85rem' }}>/</span>
                      <input
                        type="text" className="form-input" value={form.slug}
                        onChange={e => handleChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        placeholder="ma-page"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="checkbox" checked={form.show_in_nav} onChange={e => handleChange('show_in_nav', e.target.checked)} />
                      Afficher dans le menu
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="checkbox" checked={form.published} onChange={e => handleChange('published', e.target.checked)} />
                      Publiee
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ordre dans le menu</label>
                    <input type="number" className="form-input" value={form.nav_order} onChange={e => handleChange('nav_order', parseInt(e.target.value) || 99)} min={1} />
                  </div>
                </div>

                <ImageUpload
                  label="Image hero (bandeau en haut de page)"
                  value={form.hero_image}
                  onChange={url => handleChange('hero_image', url)}
                />

                {/* Content blocks */}
                <div style={{ marginTop: '1.5rem' }}>
                  <label className="form-label">Contenu de la page</label>

                  {form.content.map((block, i) => (
                    <div key={i} style={{
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
                      padding: '1rem', marginBottom: '0.75rem', background: 'rgba(255,255,255,0.02)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                          {block.type === 'text' ? 'Texte' : block.type === 'image' ? 'Image' : 'Bouton CTA'}
                        </span>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button type="button" onClick={() => moveBlock(i, -1)} disabled={i === 0}
                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1rem' }}>↑</button>
                          <button type="button" onClick={() => moveBlock(i, 1)} disabled={i === form.content.length - 1}
                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1rem' }}>↓</button>
                          <button type="button" onClick={() => removeBlock(i)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem', marginLeft: '0.5rem' }}>×</button>
                        </div>
                      </div>

                      {block.type === 'text' && (
                        <>
                          <input type="text" className="form-input" placeholder="Titre (optionnel)"
                            value={block.heading || ''} onChange={e => updateBlock(i, 'heading', e.target.value)}
                            style={{ marginBottom: '0.5rem' }} />
                          <textarea className="form-textarea" placeholder="Contenu texte..."
                            value={block.body || ''} onChange={e => updateBlock(i, 'body', e.target.value)} rows={4} />
                        </>
                      )}

                      {block.type === 'image' && (
                        <>
                          <ImageUpload label="" value={block.url || ''} onChange={url => updateBlock(i, 'url', url)} />
                          <input type="text" className="form-input" placeholder="Legende (optionnel)"
                            value={block.caption || ''} onChange={e => updateBlock(i, 'caption', e.target.value)}
                            style={{ marginTop: '0.5rem' }} />
                        </>
                      )}

                      {block.type === 'cta' && (
                        <div className="form-grid">
                          <div className="form-group">
                            <input type="text" className="form-input" placeholder="Texte du bouton"
                              value={block.text || ''} onChange={e => updateBlock(i, 'text', e.target.value)} />
                          </div>
                          <div className="form-group">
                            <input type="text" className="form-input" placeholder="Lien (ex: /register)"
                              value={block.link || ''} onChange={e => updateBlock(i, 'link', e.target.value)} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button type="button" className="btn btn--ghost" onClick={() => addBlock('text')} style={{ fontSize: '0.8rem' }}>+ Texte</button>
                    <button type="button" className="btn btn--ghost" onClick={() => addBlock('image')} style={{ fontSize: '0.8rem' }}>+ Image</button>
                    <button type="button" className="btn btn--ghost" onClick={() => addBlock('cta')} style={{ fontSize: '0.8rem' }}>+ Bouton CTA</button>
                  </div>
                </div>
              </div>

              <div className="modal__footer">
                <button type="button" className="btn btn--ghost" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? 'Sauvegarde...' : editing ? 'Modifier' : 'Creer la page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
