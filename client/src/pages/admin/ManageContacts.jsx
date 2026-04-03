import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ManageContacts() {
  const { token } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', status: 'new' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const fetchContacts = useCallback(() => {
    fetch('/api/contacts', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => setContacts(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  function openEdit(contact) {
    setEditing(contact);
    setForm({
      name: contact.name || '',
      email: contact.email || '',
      subject: contact.subject || '',
      message: contact.message || '',
      status: contact.status || 'new',
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

    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/contacts/${editing.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update contact.');
      }

      setShowModal(false);
      fetchContacts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function markAsRead(id) {
    try {
      await fetch(`/api/contacts/${id}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: 'read' }),
      });
      fetchContacts();
    } catch {}
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this contact message?')) return;
    try {
      await fetch(`/api/contacts/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchContacts();
    } catch { alert('Failed to delete.'); }
  }

  function toggleExpand(id) {
    if (expanded === id) {
      setExpanded(null);
    } else {
      setExpanded(id);
      const c = contacts.find(x => x.id === id);
      if (c && c.status === 'new') markAsRead(id);
    }
  }

  const newCount = contacts.filter(c => c.status === 'new').length;

  if (loading) return <div className="loading">Loading contacts...</div>;

  return (
    <>
      <h1>Contact Messages</h1>
      <p>View, edit, and manage messages from the contact form.{newCount > 0 && <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}> ({newCount} new)</span>}</p>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h2>Messages ({contacts.length})</h2>
        </div>

        {contacts.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-gray-400)' }}>No messages yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th></th><th>Name</th><th>Email</th><th>Subject</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {contacts.map(c => (
                <>
                  <tr key={c.id} onClick={() => toggleExpand(c.id)} style={{ cursor: 'pointer', fontWeight: c.status === 'new' ? 700 : 400 }}>
                    <td style={{ width: 30 }}>
                      {c.status === 'new' && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block' }} />}
                    </td>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.subject || '-'}</td>
                    <td>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: c.status === 'new' ? 'var(--color-accent)' : 'var(--color-gray-200)',
                        color: c.status === 'new' ? 'white' : 'var(--color-gray-600)',
                      }}>
                        {c.status || 'new'}
                      </span>
                    </td>
                    <td style={{ whiteSpace: 'nowrap', color: 'var(--color-gray-500)' }}>
                      {c.created_at ? new Date(c.created_at).toLocaleDateString('en-GB') : '-'}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button onClick={(e) => { e.stopPropagation(); openEdit(c); }}>Edit</button>
                        <button className="delete" onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                  {expanded === c.id && (
                    <tr key={`msg-${c.id}`}>
                      <td colSpan={7} style={{ background: 'var(--color-gray-50)', padding: '1rem 1.5rem' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)', marginBottom: '0.5rem' }}>
                          From: {c.name} &lt;{c.email}&gt;
                        </div>
                        <div style={{ whiteSpace: 'pre-wrap', color: 'var(--color-gray-700)', lineHeight: 1.6 }}>
                          {c.message || '(no message)'}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
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
              <h2>Edit Contact</h2>
              <button className="modal__close" onClick={() => setShowModal(false)}>&times;</button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal__body">
                {error && <div className="alert alert--error">{error}</div>}

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Name <span className="required">*</span></label>
                    <input type="text" name="name" className="form-input" value={form.name} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email <span className="required">*</span></label>
                    <input type="email" name="email" className="form-input" value={form.email} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input type="text" name="subject" className="form-input" value={form.subject} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea name="message" className="form-textarea" value={form.message} onChange={handleChange} rows={5} />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select name="status" className="form-input" value={form.status} onChange={handleChange}>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="modal__footer">
                <button type="button" className="btn btn--ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Update Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
