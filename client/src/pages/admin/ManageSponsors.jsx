import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from '../../components/ImageUpload';

const TIERS = [
  { value: 'organizer', label: 'Organizer' },
  { value: 'platinum', label: 'Platinum' },
  { value: 'gold', label: 'Gold' },
  { value: 'silver', label: 'Silver' },
  { value: 'institutional', label: 'Institutional' },
];

const emptySponsor = { name: '', tier: 'gold', logo_url: '', website_url: '', description: '', sort_order: 0 };

export default function ManageSponsors() {
  const { token } = useAuth();
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptySponsor);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filterTier, setFilterTier] = useState('all');

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const fetchSponsors = useCallback(() => {
    fetch('/api/sponsors', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => setSponsors(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { fetchSponsors(); }, [fetchSponsors]);

  const filtered = filterTier === 'all' ? sponsors : sponsors.filter(s => s.tier === filterTier);

  function openCreate() { setEditing(null); setForm(emptySponsor); setError(''); setShowModal(true); }
  function openEdit(s) {
    setEditing(s);
    setForm({ name: s.name || '', tier: s.tier || 'gold', logo_url: s.logo_url || '', website_url: s.website_url || '', description: s.description || '', sort_order: s.sort_order || 0 });
    setError(''); setShowModal(true);
  }

  function handleChange(e) { const { name, value } = e.target; setForm(prev => ({ ...prev, [name]: value })); }

  async function handleSave(e) {
    e.preventDefault(); setError('');
    if (!form.name.trim()) { setError('Name is required.'); return; }
    setSaving(true);
    try {
      const url = editing ? `/api/sponsors/${editing.id}` : '/api/sponsors';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify({ ...form, sort_order: parseInt(form.sort_order) || 0 }) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed'); }
      setShowModal(false); fetchSponsors();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this sponsor?')) return;
    try {
      await fetch(`/api/sponsors/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchSponsors();
    } catch { alert('Failed to delete.'); }
  }

  if (loading) return <div className="loading">Loading sponsors...</div>;

  return (
    <>
      <h1>Manage Sponsors & Partners</h1>
      <p>Add, edit, or remove conference sponsors and partners.</p>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h2>Sponsors ({filtered.length})</h2>
            <select className="form-select" style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} value={filterTier} onChange={e => setFilterTier(e.target.value)}>
              <option value="all">All Tiers</option>
              {TIERS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <button className="btn btn--primary btn--sm" onClick={openCreate}>+ Add Sponsor</button>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-gray-400)' }}>No sponsors found.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Tier</th><th>Description</th><th>Order</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td><span className={`badge badge--${s.tier}`}>{s.tier}</span></td>
                  <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.description || '-'}</td>
                  <td>{s.sort_order}</td>
                  <td>
                    <div className="table-actions">
                      <button onClick={() => openEdit(s)}>Edit</button>
                      <button className="delete" onClick={() => handleDelete(s.id)}>Delete</button>
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
              <h2>{editing ? 'Edit Sponsor' : 'Add Sponsor'}</h2>
              <button className="modal__close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal__body">
                {error && <div className="alert alert--error">{error}</div>}
                <div className="form-group">
                  <label className="form-label">Name <span className="required">*</span></label>
                  <input type="text" name="name" className="form-input" value={form.name} onChange={handleChange} placeholder="Company name" />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Tier</label>
                    <select name="tier" className="form-select" value={form.tier} onChange={handleChange}>
                      {TIERS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
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
                <ImageUpload
                  label="Logo"
                  value={form.logo_url}
                  onChange={url => setForm(prev => ({ ...prev, logo_url: url }))}
                />
                <div className="form-group">
                  <label className="form-label">Website URL</label>
                  <input type="text" name="website_url" className="form-input" value={form.website_url} onChange={handleChange} placeholder="https://..." />
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
