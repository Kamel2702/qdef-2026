import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState({});
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch('/api/stats', { headers }).then(r => r.ok ? r.json() : {}).catch(() => ({})),
      fetch('/api/registrations', { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/contacts', { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
    ]).then(([statsData, regsData, contactsData]) => {
      setStats(statsData);

      const regs = Array.isArray(regsData) ? regsData : [];
      const sorted = [...regs].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      setRecentRegistrations(sorted.slice(0, 8));

      const contacts = Array.isArray(contactsData) ? contactsData : [];
      setRecentContacts(contacts.slice(0, 5));
    }).finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  const statCards = [
    { label: 'Registrations', value: stats.registrations || 0, link: '/admin/registrations', color: 'var(--color-blue)' },
    { label: 'Speakers', value: stats.speakers || 0, link: '/admin/speakers', color: 'var(--color-accent)' },
    { label: 'Sessions', value: stats.sessions || 0, link: '/admin/programme', color: 'var(--color-cyan)' },
    { label: 'Sponsors', value: stats.sponsors || 0, link: '/admin/sponsors', color: '#8b5cf6' },
    { label: 'News Articles', value: stats.news || 0, link: '/admin/news', color: '#f59e0b' },
    { label: 'Contact Messages', value: stats.contacts || 0, sub: stats.newContacts > 0 ? `${stats.newContacts} new` : null, link: '/admin/contacts', color: '#ef4444' },
    { label: 'Newsletter', value: stats.newsletter || 0, link: '/admin/newsletter', color: '#10b981' },
    { label: 'Exhibitions', value: stats.exhibitions || 0, link: '/admin/exhibitions', color: '#6366f1' },
  ];

  return (
    <>
      <h1>Dashboard</h1>
      <p>Overview of Q-DEF Conference 2026 management data.</p>

      {/* Stat Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
        {statCards.map(card => (
          <Link to={card.link} key={card.label} className="stat-card" style={{ textDecoration: 'none', borderTop: `3px solid ${card.color}` }}>
            <div className="stat-card__label">{card.label}</div>
            <div className="stat-card__value">{card.value}</div>
            {card.sub && <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600, marginTop: '0.25rem' }}>{card.sub}</div>}
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
        {/* Recent Registrations */}
        <div className="admin-table-wrapper">
          <div className="admin-table-header">
            <h2>Recent Registrations</h2>
            <Link to="/admin/registrations" className="btn btn--ghost btn--sm">View all</Link>
          </div>
          {recentRegistrations.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-gray-400)' }}>No registrations yet.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Date</th></tr>
              </thead>
              <tbody>
                {recentRegistrations.map((reg, i) => (
                  <tr key={reg.id || i}>
                    <td style={{ fontWeight: 600 }}>{reg.first_name} {reg.last_name}</td>
                    <td>{reg.email}</td>
                    <td style={{ whiteSpace: 'nowrap', color: 'var(--color-gray-500)' }}>
                      {reg.created_at ? new Date(reg.created_at).toLocaleDateString('en-GB') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Contact Messages */}
        <div className="admin-table-wrapper">
          <div className="admin-table-header">
            <h2>Recent Messages</h2>
            <Link to="/admin/contacts" className="btn btn--ghost btn--sm">View all</Link>
          </div>
          {recentContacts.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-gray-400)' }}>No messages yet.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr><th></th><th>Name</th><th>Subject</th><th>Date</th></tr>
              </thead>
              <tbody>
                {recentContacts.map((c, i) => (
                  <tr key={c.id || i}>
                    <td style={{ width: 20 }}>
                      {c.status === 'new' && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block' }} />}
                    </td>
                    <td style={{ fontWeight: c.status === 'new' ? 700 : 400 }}>{c.name}</td>
                    <td>{c.subject || '-'}</td>
                    <td style={{ whiteSpace: 'nowrap', color: 'var(--color-gray-500)' }}>
                      {c.created_at ? new Date(c.created_at).toLocaleDateString('en-GB') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
