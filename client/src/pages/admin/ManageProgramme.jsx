import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

const emptySession = {
  title: '',
  description: '',
  type: 'presentation',
  start_time: '',
  end_time: '',
  tags: '',
  speaker_ids: [],
};

export default function ManageProgramme() {
  const { token } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptySession);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Drag & drop state
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const [draggingIdx, setDraggingIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const fetchSessions = useCallback(() => {
    fetch('/api/sessions', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const list = Array.isArray(data) ? data : data.sessions || [];
        list.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
        setSessions(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    fetchSessions();
    fetch('/api/speakers', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => setSpeakers(Array.isArray(data) ? data : data.speakers || []))
      .catch(() => {});
  }, [fetchSessions, token]);

  function formatTime(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  }

  function openCreate() {
    setEditing(null);
    setForm(emptySession);
    setError('');
    setShowModal(true);
  }

  function openEdit(session) {
    setEditing(session);
    setForm({
      title: session.title || '',
      description: session.description || '',
      type: session.type || 'presentation',
      start_time: session.start_time ? new Date(session.start_time).toISOString().slice(0, 16) : '',
      end_time: session.end_time ? new Date(session.end_time).toISOString().slice(0, 16) : '',
      tags: Array.isArray(session.tags) ? session.tags.join(', ') : session.tags || '',
      speaker_ids: session.speaker_ids || (session.speakers ? session.speakers.map(s => s.id || s) : []),
    });
    setError('');
    setShowModal(true);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSpeakerToggle(id) {
    setForm(prev => {
      const ids = [...prev.speaker_ids];
      const idx = ids.indexOf(id);
      if (idx >= 0) ids.splice(idx, 1);
      else ids.push(id);
      return { ...prev, speaker_ids: ids };
    });
  }

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }
    const payload = {
      ...form,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
    setSaving(true);
    try {
      const url = editing ? `/api/sessions/${editing.id}` : '/api/sessions';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || data.error || 'Failed to save session.');
      }
      setShowModal(false);
      fetchSessions();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    try {
      const res = await fetch(`/api/sessions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchSessions();
    } catch {
      alert('Failed to delete session.');
    }
  }

  // --- Drag & drop handlers ---
  function handleDragStart(idx) {
    dragItem.current = idx;
    setDraggingIdx(idx);
  }

  function handleDragEnter(idx) {
    dragOverItem.current = idx;
    setDragOverIdx(idx);
  }

  function handleDragEnd() {
    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
      setDraggingIdx(null);
      setDragOverIdx(null);
      return;
    }
    const reordered = [...sessions];
    const [moved] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOverItem.current, 0, moved);

    // Reassign start_time based on new order to reflect the drag reorder
    // We swap the times of the dragged and the target position
    const fromSession = sessions[dragItem.current];
    const toSession = sessions[dragOverItem.current];
    if (fromSession.start_time && toSession.start_time) {
      const movedIdx = dragOverItem.current;
      const movedItem = reordered[movedIdx];
      // Update the moved session's time to match where it was dropped
      updateSessionTime(movedItem.id, toSession.start_time, toSession.end_time);
    }

    setSessions(reordered);
    dragItem.current = null;
    dragOverItem.current = null;
    setDraggingIdx(null);
    setDragOverIdx(null);
  }

  async function updateSessionTime(id, start_time, end_time) {
    try {
      await fetch(`/api/sessions/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ start_time, end_time }),
      });
    } catch {
      // Silently fail, will refresh on next load
    }
  }

  if (loading) return <div className="loading">Loading sessions...</div>;

  return (
    <>
      <h1>Manage Programme</h1>
      <p>Add, edit, or remove conference sessions. Drag rows to reorder.</p>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h2>Sessions ({sessions.length})</h2>
          <button className="btn btn--primary btn--sm" onClick={openCreate}>
            + Add Session
          </button>
        </div>

        {sessions.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            No sessions yet. Add your first session above.
          </div>
        ) : (
          <table className="admin-table drag-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Time</th>
                <th>Title</th>
                <th>Type</th>
                <th>Speakers</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, i) => (
                <tr
                  key={session.id || i}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragEnter={() => handleDragEnter(i)}
                  onDragEnd={handleDragEnd}
                  onDragOver={e => e.preventDefault()}
                  className={`${draggingIdx === i ? 'dragging' : ''} ${dragOverIdx === i && draggingIdx !== i ? 'drag-over' : ''}`}
                >
                  <td>
                    <div className="drag-handle" title="Drag to reorder">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <circle cx="5" cy="3" r="1.5" />
                        <circle cx="11" cy="3" r="1.5" />
                        <circle cx="5" cy="8" r="1.5" />
                        <circle cx="11" cy="8" r="1.5" />
                        <circle cx="5" cy="13" r="1.5" />
                        <circle cx="11" cy="13" r="1.5" />
                      </svg>
                    </div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: 2 }}>
                      {formatDate(session.start_time)}
                    </div>
                    {formatTime(session.start_time)} - {formatTime(session.end_time)}
                  </td>
                  <td style={{ fontWeight: 600 }}>{session.title}</td>
                  <td>
                    <span className={`badge badge--${(session.type || 'presentation').toLowerCase()}`}>
                      {session.type || 'Session'}
                    </span>
                  </td>
                  <td>
                    {session.speakers
                      ? session.speakers.map(s => typeof s === 'string' ? s : s.name).join(', ')
                      : '-'}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button onClick={() => openEdit(session)}>Edit</button>
                      <button className="delete" onClick={() => handleDelete(session.id)}>Delete</button>
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
              <h2>{editing ? 'Edit Session' : 'Add Session'}</h2>
              <button className="modal__close" onClick={() => setShowModal(false)}>&times;</button>
            </div>

            <form onSubmit={handleSave}>
              <div className="modal__body">
                {error && <div className="alert alert--error">{error}</div>}

                <div className="form-group">
                  <label className="form-label">Title <span className="required">*</span></label>
                  <input
                    type="text"
                    name="title"
                    className="form-input"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Session title"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-textarea"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Session description"
                    rows={3}
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select name="type" className="form-select" value={form.type} onChange={handleChange}>
                      <option value="keynote">Keynote</option>
                      <option value="panel">Panel</option>
                      <option value="presentation">Presentation</option>
                      <option value="workshop">Workshop</option>
                      <option value="break">Break</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tags (comma separated)</label>
                    <input
                      type="text"
                      name="tags"
                      className="form-input"
                      value={form.tags}
                      onChange={handleChange}
                      placeholder="e.g. quantum, cybersecurity"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Start Time</label>
                    <input
                      type="datetime-local"
                      name="start_time"
                      className="form-input"
                      value={form.start_time}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">End Time</label>
                    <input
                      type="datetime-local"
                      name="end_time"
                      className="form-input"
                      value={form.end_time}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {speakers.length > 0 && (
                  <div className="form-group">
                    <label className="form-label">Speakers</label>
                    <div style={{
                      maxHeight: 160,
                      overflowY: 'auto',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-sm)',
                    }}>
                      {speakers.map(s => (
                        <label
                          key={s.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.35rem 0.5rem',
                            cursor: 'pointer',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.875rem',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <input
                            type="checkbox"
                            checked={form.speaker_ids.includes(s.id)}
                            onChange={() => handleSpeakerToggle(s.id)}
                            style={{ accentColor: 'var(--color-accent)' }}
                          />
                          {s.name} <span style={{ color: '#94a3b8' }}>- {s.organization}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal__footer">
                <button type="button" className="btn btn--ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update Session' : 'Create Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
