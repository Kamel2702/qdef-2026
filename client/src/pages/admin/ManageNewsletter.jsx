import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ManageNewsletter() {
  const { token } = useAuth();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ email: '', source: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const fetchSubscribers = useCallback(() => {
    fetch('/api/newsletter', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => setSubscribers(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { fetchSubscribers(); }, [fetchSubscribers]);

  const filtered = search.trim()
    ? subscribers.filter(s => s.email.toLowerCase().includes(search.toLowerCase()))
    : subscribers;

  function openEdit(sub) {
    setEditing(sub);
    setForm({
      email: sub.email || '',
      source: sub.source || '',
    });
    setError('');
    setShowModal(true);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setError('');

    if (!form.email.trim()) {
      setError('Email is required.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/newsletter/${editing.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update subscriber.');
      }

      setShowModal(false);
      fetchSubscribers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Remove this subscriber?')) return;
    try {
      await fetch(`/api/newsletter/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchSubscribers();
    } catch { alert('Failed to remove.'); }
  }

  async function handleExport() {
    try {
      const res = await fetch('/api/newsletter/export', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qdef-newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch { alert('Failed to export.'); }
  }

  if (loading) return <div className="loading">Loading subscribers...</div>;

  return (
    <>
      <h1>Newsletter</h1>
      <p>Manage newsletter subscribers and export lists.</p>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h2>Subscribers ({filtered.length})</h2>
          <div className="admin-table-actions">
            <div className="admin-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="text" placeholder="Search emails..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn--primary btn--sm" onClick={handleExport}>Export CSV</button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-gray-400)' }}>
            {subscribers.length === 0 ? 'No subscribers yet.' : 'No match found.'}
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Email</th><th>Source</th><th>Subscribed</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.email}</td>
                  <td>{s.source || 'website'}</td>
                  <td style={{ whiteSpace: 'nowrap', color: 'var(--color-gray-500)' }}>
                    {s.created_at ? new Date(s.created_at).toLocaleDateString('en-GB') : '-'}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button onClick={() => openEdit(s)}>Edit</button>
                      <button className="delete" onClick={() => handleDelete(s.id)}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h2>Edit Subscriber</h2>
              <button className="modal__close" onClick={() => setShowModal(false)}>&times;</button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal__body">
                {error && <div className="alert alert--error">{error}</div>}

                <div className="form-group">
                  <label className="form-label">Email <span className="required">*</span></label>
                  <input type="email" name="email" className="form-input" value={form.email} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">Source</label>
                  <input type="text" name="source" className="form-input" value={form.source} onChange={handleChange} placeholder="e.g. website, import, manual" />
                </div>
              </div>

              <div className="modal__footer">
                <button type="button" className="btn btn--ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Update Subscriber'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
