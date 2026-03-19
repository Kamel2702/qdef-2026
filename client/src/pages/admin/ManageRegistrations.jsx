import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ManageRegistrations() {
  const { token } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchRegistrations = useCallback(() => {
    fetch('/api/registrations', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const list = Array.isArray(data) ? data : data.registrations || [];
        // Sort newest first
        list.sort(
          (a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0)
        );
        setRegistrations(list);
        setFiltered(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Filter on search change
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(registrations);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(
      registrations.filter(r =>
        `${r.first_name} ${r.last_name} ${r.email} ${r.organization} ${r.country}`
          .toLowerCase()
          .includes(q)
      )
    );
  }, [search, registrations]);

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this registration?')) return;

    try {
      const res = await fetch(`/api/registrations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      fetchRegistrations();
    } catch {
      alert('Failed to delete registration.');
    }
  }

  async function handleExport() {
    try {
      const res = await fetch('/api/registrations/export', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qdef-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch {
      alert('Failed to export registrations. Please try again.');
    }
  }

  if (loading) return <div className="loading">Loading registrations...</div>;

  return (
    <>
      <h1>Manage Registrations</h1>
      <p>View, search, and manage conference registrations.</p>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h2>Registrations ({filtered.length})</h2>
          <div className="admin-table-actions">
            <div className="admin-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search registrations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="btn btn--primary btn--sm" onClick={handleExport}>
              Export CSV
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-gray-400)' }}>
            {registrations.length === 0
              ? 'No registrations yet.'
              : 'No registrations match your search.'}
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Organization</th>
                <th>Position</th>
                <th>Country</th>
                <th>Dietary</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((reg, i) => (
                <tr key={reg.id || i}>
                  <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {reg.first_name} {reg.last_name}
                  </td>
                  <td>{reg.email}</td>
                  <td>{reg.organization}</td>
                  <td>{reg.position}</td>
                  <td>{reg.country}</td>
                  <td style={{ color: 'var(--color-gray-500)', fontSize: '0.85rem' }}>
                    {reg.dietary_requirements || '-'}
                  </td>
                  <td style={{ whiteSpace: 'nowrap', color: 'var(--color-gray-500)' }}>
                    {reg.created_at || reg.createdAt
                      ? new Date(reg.created_at || reg.createdAt).toLocaleDateString('en-GB')
                      : '-'}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="delete" onClick={() => handleDelete(reg.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
