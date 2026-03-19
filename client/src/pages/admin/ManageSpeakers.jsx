import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

const emptySpeaker = {
  name: '',
  title: '',
  organization: '',
  bio: '',
  photo_url: '',
};

export default function ManageSpeakers() {
  const { token } = useAuth();
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptySpeaker);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const fetchSpeakers = useCallback(() => {
    fetch('/api/speakers', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => setSpeakers(Array.isArray(data) ? data : data.speakers || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    fetchSpeakers();
  }, [fetchSpeakers]);

  function openCreate() {
    setEditing(null);
    setForm(emptySpeaker);
    setError('');
    setShowModal(true);
  }

  function openEdit(speaker) {
    setEditing(speaker);
    setForm({
      name: speaker.name || '',
      title: speaker.title || '',
      organization: speaker.organization || '',
      bio: speaker.bio || '',
      photo_url: speaker.photo_url || '',
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

    if (!form.name.trim()) {
      setError('Name is required.');
      return;
    }

    setSaving(true);
    try {
      const url = editing ? `/api/speakers/${editing.id}` : '/api/speakers';
      const method = editing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || data.error || 'Failed to save speaker.');
      }

      setShowModal(false);
      fetchSpeakers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this speaker?')) return;

    try {
      const res = await fetch(`/api/speakers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchSpeakers();
    } catch {
      alert('Failed to delete speaker.');
    }
  }

  function getInitials(name) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  if (loading) return <div className="loading">Loading speakers...</div>;

  return (
    <>
      <h1>Manage Speakers</h1>
      <p>Add, edit, or remove conference speakers.</p>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h2>Speakers ({speakers.length})</h2>
          <button className="btn btn--primary btn--sm" onClick={openCreate}>
            + Add Speaker
          </button>
        </div>

        {speakers.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-gray-400)' }}>
            No speakers yet. Add your first speaker above.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Title</th>
                <th>Organization</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {speakers.map((speaker, i) => (
                <tr key={speaker.id || i}>
                  <td style={{ width: 40 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--color-blue), var(--color-cyan))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}>
                      {getInitials(speaker.name)}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{speaker.name}</td>
                  <td>{speaker.title}</td>
                  <td>{speaker.organization}</td>
                  <td>
                    <div className="table-actions">
                      <button onClick={() => openEdit(speaker)}>Edit</button>
                      <button className="delete" onClick={() => handleDelete(speaker.id)}>Delete</button>
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
              <h2>{editing ? 'Edit Speaker' : 'Add Speaker'}</h2>
              <button className="modal__close" onClick={() => setShowModal(false)}>&times;</button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal__body">
                {error && <div className="alert alert--error">{error}</div>}

                <div className="form-group">
                  <label className="form-label">Name <span className="required">*</span></label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full name"
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Title / Position</label>
                    <input
                      type="text"
                      name="title"
                      className="form-input"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g. Director of Research"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Organization</label>
                    <input
                      type="text"
                      name="organization"
                      className="form-input"
                      value={form.organization}
                      onChange={handleChange}
                      placeholder="e.g. NATO CCDCOE"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea
                    name="bio"
                    className="form-textarea"
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="Speaker biography"
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Photo URL</label>
                  <input
                    type="text"
                    name="photo_url"
                    className="form-input"
                    value={form.photo_url}
                    onChange={handleChange}
                    placeholder="https://example.com/photo.jpg (optional)"
                  />
                </div>
              </div>

              <div className="modal__footer">
                <button type="button" className="btn btn--ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update Speaker' : 'Create Speaker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
