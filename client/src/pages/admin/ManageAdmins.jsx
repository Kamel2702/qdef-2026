import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

const emptyForm = { email: '', password: '', name: '' };

export default function ManageAdmins() {
  const { token, user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const fetchAdmins = useCallback(() => {
    fetch('/api/admins', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => setAdmins(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  }

  function openEdit(admin) {
    setEditing(admin);
    setForm({
      email: admin.email || '',
      password: '',
      name: admin.name || '',
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

    if (!editing && !form.password) {
      setError('Password is required for new admins.');
      return;
    }

    setSaving(true);
    try {
      const url = editing ? `/api/admins/${editing.id}` : '/api/admins';
      const method = editing ? 'PUT' : 'POST';

      const body = { email: form.email, name: form.name };
      if (form.password) body.password = form.password;

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save admin.');
      }

      setShowModal(false);
      fetchAdmins();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;

    try {
      const res = await fetch(`/api/admins/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Delete failed');
      }
      fetchAdmins();
    } catch (err) {
      alert(err.message || 'Failed to delete admin.');
    }
  }

  if (loading) return <div className="loading">Loading admins...</div>;

  return (
    <>
      <h1>Manage Admins</h1>
      <p>Add, edit, or remove administrator accounts.</p>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h2>Administrators ({admins.length})</h2>
          <button className="btn btn--primary btn--sm" onClick={openCreate}>
            + Add Admin
          </button>
        </div>

        {admins.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-gray-400)' }}>
            No admins found.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>
                    {a.name || '-'}
                    {user?.email === a.email && (
                      <span style={{ marginLeft: 8, fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 700 }}>(you)</span>
                    )}
                  </td>
                  <td>{a.email}</td>
                  <td style={{ whiteSpace: 'nowrap', color: 'var(--color-gray-500)' }}>
                    {a.created_at ? new Date(a.created_at).toLocaleDateString('en-GB') : '-'}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button onClick={() => openEdit(a)}>Edit</button>
                      {user?.email !== a.email && (
                        <button className="delete" onClick={() => handleDelete(a.id)}>Delete</button>
                      )}
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
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h2>{editing ? 'Edit Admin' : 'Add Admin'}</h2>
              <button className="modal__close" onClick={() => setShowModal(false)}>&times;</button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal__body">
                {error && <div className="alert alert--error">{error}</div>}

                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input type="text" name="name" className="form-input" value={form.name} onChange={handleChange} placeholder="Admin name" />
                </div>

                <div className="form-group">
                  <label className="form-label">Email <span className="required">*</span></label>
                  <input type="email" name="email" className="form-input" value={form.email} onChange={handleChange} placeholder="admin@example.com" />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Password {!editing && <span className="required">*</span>}
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="form-input"
                    value={form.password}
                    onChange={handleChange}
                    placeholder={editing ? 'Leave blank to keep current password' : 'Enter password'}
                  />
                  {editing && (
                    <small style={{ color: 'var(--color-gray-500)', marginTop: 4, display: 'block' }}>
                      Leave blank to keep the current password.
                    </small>
                  )}
                </div>
              </div>

              <div className="modal__footer">
                <button type="button" className="btn btn--ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update Admin' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
