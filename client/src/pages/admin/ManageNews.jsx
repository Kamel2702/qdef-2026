import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import ImageUpload from '../../components/ImageUpload';

const emptyArticle = { title: '', excerpt: '', content: '', image_url: '', published: false };

export default function ManageNews() {
  const { token } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyArticle);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const fetchArticles = useCallback(() => {
    fetch('/api/news', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => setArticles(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  function openCreate() { setEditing(null); setForm(emptyArticle); setError(''); setShowModal(true); }
  function openEdit(a) {
    setEditing(a);
    setForm({ title: a.title || '', excerpt: a.excerpt || '', content: a.content || '', image_url: a.image_url || '', published: !!a.published });
    setError(''); setShowModal(true);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSave(e) {
    e.preventDefault(); setError('');
    if (!form.title.trim()) { setError('Title is required.'); return; }
    setSaving(true);
    try {
      const url = editing ? `/api/news/${editing.id}` : '/api/news';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed'); }
      setShowModal(false); fetchArticles();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  }

  async function handleTogglePublish(id) {
    try {
      await fetch(`/api/news/${id}/publish`, { method: 'PUT', headers });
      fetchArticles();
    } catch { alert('Failed to toggle publish.'); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this article?')) return;
    try {
      await fetch(`/api/news/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchArticles();
    } catch { alert('Failed to delete.'); }
  }

  if (loading) return <div className="loading">Loading articles...</div>;

  return (
    <>
      <h1>Manage News & Blog</h1>
      <p>Create, edit, publish, or remove news articles.</p>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h2>Articles ({articles.length})</h2>
          <button className="btn btn--primary btn--sm" onClick={openCreate}>+ Add Article</button>
        </div>

        {articles.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-gray-400)' }}>No articles yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Title</th><th>Excerpt</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {articles.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>{a.title}</td>
                  <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.excerpt || '-'}</td>
                  <td>
                    <span className={`badge ${a.published ? 'badge--keynote' : 'badge--break'}`} style={{ cursor: 'pointer' }} onClick={() => handleTogglePublish(a.id)}>
                      {a.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ whiteSpace: 'nowrap', color: 'var(--color-gray-500)' }}>
                    {a.created_at ? new Date(a.created_at).toLocaleDateString('en-GB') : '-'}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button onClick={() => openEdit(a)}>Edit</button>
                      <button className="delete" onClick={() => handleDelete(a.id)}>Delete</button>
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
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 700 }}>
            <div className="modal__header">
              <h2>{editing ? 'Edit Article' : 'New Article'}</h2>
              <button className="modal__close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal__body">
                {error && <div className="alert alert--error">{error}</div>}
                <div className="form-group">
                  <label className="form-label">Title <span className="required">*</span></label>
                  <input type="text" name="title" className="form-input" value={form.title} onChange={handleChange} placeholder="Article title" />
                </div>
                <div className="form-group">
                  <label className="form-label">Excerpt</label>
                  <textarea name="excerpt" className="form-textarea" value={form.excerpt} onChange={handleChange} rows={2} placeholder="Short summary" />
                </div>
                <div className="form-group">
                  <label className="form-label">Content</label>
                  <textarea name="content" className="form-textarea" value={form.content} onChange={handleChange} rows={8} placeholder="Full article content" />
                </div>
                <ImageUpload
                  label="Cover Image"
                  value={form.image_url}
                  onChange={url => setForm(prev => ({ ...prev, image_url: url }))}
                />
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" name="published" checked={form.published} onChange={handleChange} style={{ accentColor: 'var(--color-accent)' }} />
                  <label className="form-label" style={{ margin: 0 }}>Published</label>
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
