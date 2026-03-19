import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ManageContacts() {
  const { token } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const fetchContacts = useCallback(() => {
    fetch('/api/contacts', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => setContacts(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  async function markAsRead(id) {
    try {
      await fetch(`/api/contacts/${id}/status`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
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
      <p>View and manage messages from the contact form.{newCount > 0 && <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}> ({newCount} new)</span>}</p>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h2>Messages ({contacts.length})</h2>
        </div>

        {contacts.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-gray-400)' }}>No messages yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th></th><th>Name</th><th>Email</th><th>Subject</th><th>Date</th><th>Actions</th></tr>
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
                    <td style={{ whiteSpace: 'nowrap', color: 'var(--color-gray-500)' }}>
                      {c.created_at ? new Date(c.created_at).toLocaleDateString('en-GB') : '-'}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="delete" onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                  {expanded === c.id && (
                    <tr key={`msg-${c.id}`}>
                      <td colSpan={6} style={{ background: 'var(--color-gray-50)', padding: '1rem 1.5rem' }}>
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
    </>
  );
}
