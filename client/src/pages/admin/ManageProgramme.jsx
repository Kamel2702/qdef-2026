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
  const [reorderDirty, setReorderDirty] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  // Drag state
  const dragIdx = useRef(null);
  const [draggingIdx, setDraggingIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);

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
        setReorderDirty(false);
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
    return new Date(dateStr).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  }

  function openCreate() { setEditing(null); setForm(emptySession); setError(''); setShowModal(true); }
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
    setError(''); setShowModal(true);
  }

  function handleChange(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); }
  function handleSpeakerToggle(id) {
    setForm(prev => {
      const ids = [...prev.speaker_ids];
      const idx = ids.indexOf(id);
      if (idx >= 0) ids.splice(idx, 1); else ids.push(id);
      return { ...prev, speaker_ids: ids };
    });
  }

  async function handleSave(e) {
    e.preventDefault(); setError('');
    if (!form.title.trim()) { setError('Title is required.'); return; }
    const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [] };
    setSaving(true);
    try {
      const url = editing ? `/api/sessions/${editing.id}` : '/api/sessions';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message || d.error || 'Failed'); }
      setShowModal(false); fetchSessions();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this session?')) return;
    try {
      await fetch(`/api/sessions/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchSessions();
    } catch { alert('Failed to delete.'); }
  }

  // --- Drag & Drop ---
  function onDragStart(e, idx) {
    dragIdx.current = idx;
    setDraggingIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
    // Make drag image slightly transparent
    if (e.target) e.target.style.opacity = '0.4';
  }

  function onDragEnd(e) {
    if (e.target) e.target.style.opacity = '1';
    setDraggingIdx(null);
    setOverIdx(null);
    dragIdx.current = null;
  }

  function onDragOver(e, idx) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (idx !== overIdx) setOverIdx(idx);
  }

  function onDrop(e, toIdx) {
    e.preventDefault();
    const fromIdx = dragIdx.current;
    if (fromIdx === null || fromIdx === toIdx) return;

    const updated = [...sessions];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setSessions(updated);
    setReorderDirty(true);
    setDraggingIdx(null);
    setOverIdx(null);
    dragIdx.current = null;
  }

  async function saveOrder() {
    setSavingOrder(true);
    try {
      const ordered_ids = sessions.map(s => s.id);
      const res = await fetch('/api/sessions/reorder', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ ordered_ids }),
      });
      if (!res.ok) throw new Error('Failed to save order');
      setReorderDirty(false);
      fetchSessions();
    } catch {
      alert('Failed to save order.');
    } finally {
      setSavingOrder(false);
    }
  }

  if (loading) return <div className="loading">Loading sessions...</div>;

  return (
    <>
      <h1>Manage Programme</h1>
      <p>Drag sessions to reorder, then save.</p>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h2>Sessions ({sessions.length})</h2>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {reorderDirty && (
              <button
                className="btn btn--sm"
                onClick={saveOrder}
                disabled={savingOrder}
                style={{
                  background: 'var(--color-accent)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600,
                  animation: 'pulse 1.5s infinite',
                }}
              >
                {savingOrder ? 'Saving...' : 'Save Order'}
              </button>
            )}
            <button className="btn btn--primary btn--sm" onClick={openCreate}>
              + Add Session
            </button>
          </div>
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
                  onDragStart={e => onDragStart(e, i)}
                  onDragEnd={onDragEnd}
                  onDragOver={e => onDragOver(e, i)}
                  onDrop={e => onDrop(e, i)}
                  className={`${draggingIdx === i ? 'dragging' : ''} ${overIdx === i && draggingIdx !== i ? 'drag-over' : ''}`}
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
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: 2 }}>
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
                  <input type="text" name="title" className="form-input" value={form.title} onChange={handleChange} placeholder="Session title" />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea name="description" className="form-textarea" value={form.description} onChange={handleChange} placeholder="Session description" rows={3} />
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
                    <input type="text" name="tags" className="form-input" value={form.tags} onChange={handleChange} placeholder="e.g. quantum, cybersecurity" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Start Time</label>
                    <input type="datetime-local" name="start_time" className="form-input" value={form.start_time} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Time</label>
                    <input type="datetime-local" name="end_time" className="form-input" value={form.end_time} onChange={handleChange} />
                  </div>
                </div>
                {speakers.length > 0 && (
                  <div className="form-group">
                    <label className="form-label">Speakers</label>
                    <div style={{
                      maxHeight: 160, overflowY: 'auto',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-sm)',
                    }}>
                      {speakers.map(s => (
                        <label key={s.id} style={{
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          padding: '0.35rem 0.5rem', cursor: 'pointer',
                          borderRadius: 'var(--radius-sm)', fontSize: '0.875rem',
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <input type="checkbox" checked={form.speaker_ids.includes(s.id)} onChange={() => handleSpeakerToggle(s.id)} style={{ accentColor: 'var(--color-accent)' }} />
                          {s.name} <span style={{ color: '#94a3b8' }}>- {s.organization}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn--ghost" onClick={() => setShowModal(false)}>Cancel</button>
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
