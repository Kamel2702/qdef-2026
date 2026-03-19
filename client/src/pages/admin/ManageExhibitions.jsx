import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

const emptyExhibition = { name: '', description: '', image_url: '', tag: '', website_url: '', sort_order: 0 };

export default function ManageExhibitions() {
  const { token } = useAuth();
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyExhibition);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const fetchExhibitions = useCallback(() => {
    fetch('/api/exhibitions', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => setExhibitions(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { fetchExhibitions(); }, [fetchExhibitions]);

  function openCreate() { setEditing(null); setForm(emptyExhibition); setError(''); setShowModal(true); }
  function openEdit(e) {
    setEditing(e);
    setForm({ name: e.name || '', description: e.description || '', image_url: e.image_url || '', tag: e.tag || '', website_url: e.website_url || '', sort_order: e.sort_order || 0 });
    setError(''); setShowModal(true);
  }

  function handleChange(e) { const { name, value } = e.target; setForm(prev => ({ ...prev, [name]: value })); }

  async function handleSave(e) {
    e.preventDefault(); setError('');
    if (!form.name.trim()) { setError('Name is required.'); return; }
    setSaving(true);
    try {
      const url = editing ? `/api/exhibitions/${editing.id}` : '/api/exhibitions';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify({ ...form, sort_order: parseInt(form.sort_order) || 0 }) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed'); }
      setShowModal(false); fetchExhibitions();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this exhibition stand?')) return;
    try {
      await fetch(`/api/exhibitions/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchExhibitions();
    } catch { alert('Failed to delete.'); }
  }

  if (loading) return <div className="loading">Loading exhibitions...</div>;

  return (
    <>
      <h1>Exhibition Stands</h1>
      <p>Manage the exhibition stands displayed on the homepage.</p>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h2>Stands ({exhibitions.length})</h2>
          <button className="btn btn--primary btn--sm" onClick={openCreate}>+ Add Stand</button>
        </div>

        {exhibitions.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-gray-400)' }}>No exhibition stands yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Tag</th><th>Description</th><th>Order</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {exhibitions.map(e => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 600 }}>{e.name}</td>
                  <td><span className="badge badge--presentation">{e.tag || '-'}</span></td>
                  <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.description || '-'}</td>
                  <td>{e.sort_order}</td>
                  <td>
                    <div className="table-actions">
                      <button onClick={() => openEdit(e)}>Edit</button>
                      <button className="delete" onClick={() => handleDelete(e.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h2>{editing ? 'Edit Stand' : 'Add Stand'}</h2>
              <button className="modal__close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal__body">
                {error && <div className="alert alert--error">{error}</div>}
                <div className="form-group">
                  <label className="form-label">Company Name <span className="required">*</span></label>
                  <input type="text" name="name" className="form-input" value={form.name} onChange={handleChange} placeholder="e.g. IBM Quantum" />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Tag / Category</label>
                    <input type="text" name="tag" className="form-input" value={form.tag} onChange={handleChange} placeholder="e.g. Quantum Computing" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sort Order</label>
                    <input type="number" name="sort_order" className="form-input" value={form.sort_order} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea name="description" className="form-textarea" value={form.description} onChange={handleChange} rows={2} placeholder="Short description" />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Image URL</label>
                    <input type="text" name="image_url" className="form-input" value={form.image_url} onChange={handleChange} placeholder="https://..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Website URL</label>
                    <input type="text" name="website_url" className="form-input" value={form.website_url} onChange={handleChange} placeholder="https://..." />
                  </div>
                </div>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn--ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn--primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
