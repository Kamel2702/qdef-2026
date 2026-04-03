import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from '../../components/ImageUpload';

export default function ManageGallery() {
  const { token } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ image_url: '', caption: '', category: 'general', sort_order: 99 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const fetchPhotos = useCallback(() => {
    fetch('/api/gallery', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => setPhotos(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  function openCreate() {
    setEditing(null);
    setForm({ image_url: '', caption: '', category: 'general', sort_order: 99 });
    setError('');
    setShowModal(true);
  }

  function openEdit(photo) {
    setEditing(photo);
    setForm({
      image_url: photo.image_url || '',
      caption: photo.caption || '',
      category: photo.category || 'general',
      sort_order: photo.sort_order || 99,
    });
    setError('');
    setShowModal(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.image_url) { setError('Une image est requise.'); return; }
    setSaving(true);
    try {
      const url = editing ? `/api/gallery/${editing.id}` : '/api/gallery';
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers,
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Erreur');
      setShowModal(false);
      fetchPhotos();
    } catch { setError('Erreur de sauvegarde.'); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Supprimer cette photo ?')) return;
    await fetch(`/api/gallery/${id}`, { method: 'DELETE', headers });
    fetchPhotos();
  }

  async function togglePublished(photo) {
    await fetch(`/api/gallery/${photo.id}`, {
      method: 'PUT', headers,
      body: JSON.stringify({ published: !photo.published }),
    });
    fetchPhotos();
  }

  const categories = ['general', 'conference', 'networking', 'speakers', 'venue', 'exhibition'];

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Galerie Photos</h1>
          <p>Gerez les photos de l'evenement.</p>
        </div>
        <button className="btn btn--primary" onClick={openCreate}>+ Ajouter une photo</button>
      </div>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h2>Photos ({photos.length})</h2>
        </div>

        {photos.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            Aucune photo. Cliquez sur "+ Ajouter une photo".
          </div>
        ) : (
          <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
            {photos.map(photo => (
              <div key={photo.id} style={{
                borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0',
                background: '#ffffff', opacity: photo.published ? 1 : 0.5,
              }}>
                <div style={{ height: 160, overflow: 'hidden' }}>
                  <img src={photo.image_url} alt={photo.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '0.75rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 500, marginBottom: '0.35rem' }}>{photo.caption || '(sans legende)'}</div>
                  <span style={{
                    fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px',
                    background: 'rgba(20,184,166,0.1)', color: '#14b8a6', fontWeight: 600,
                  }}>{photo.category}</span>
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                    <button onClick={() => togglePublished(photo)} className="btn btn--ghost" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
                      {photo.published ? 'Masquer' : 'Publier'}
                    </button>
                    <button onClick={() => openEdit(photo)} className="btn btn--ghost" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(photo.id)} className="btn btn--ghost" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', color: '#ef4444', borderColor: '#fecaca' }}>
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h2>{editing ? 'Modifier la photo' : 'Ajouter une photo'}</h2>
              <button className="modal__close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal__body">
                {error && <div className="alert alert--error">{error}</div>}
                <ImageUpload label="Photo *" value={form.image_url} onChange={url => setForm(p => ({ ...p, image_url: url }))} />
                <div className="form-group">
                  <label className="form-label">Legende</label>
                  <input type="text" className="form-input" value={form.caption} onChange={e => setForm(p => ({ ...p, caption: e.target.value }))} placeholder="Description de la photo" />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Categorie</label>
                    <select className="form-input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ordre</label>
                    <input type="number" className="form-input" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 99 }))} />
                  </div>
                </div>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn--ghost" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? 'Sauvegarde...' : editing ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
