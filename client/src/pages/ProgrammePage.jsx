import { useEffect, useState } from 'react';

const FALLBACK = [
  { id: 'f1', title: 'Registration & Welcome Coffee', type: 'break', start_time: '2026-11-25T08:00:00', end_time: '2026-11-25T09:00:00', description: 'Badge collection, networking, and exhibition stands preview.', speakers: [], tags: ['registration', 'networking'] },
  { id: 'f2', title: 'Opening Ceremony', type: 'keynote', start_time: '2026-11-25T09:00:00', end_time: '2026-11-25T09:20:00', description: 'Luxembourg Minister of Defence opens Q-DEF 2026 and outlines the Grand Duchy\'s vision for quantum defense.', speakers: [{ name: 'Yuriko Backes' }], tags: ['opening', 'policy'] },
  { id: 'f3', title: 'The Quantum Threat Horizon', type: 'keynote', start_time: '2026-11-25T09:20:00', end_time: '2026-11-25T10:00:00', description: 'NATO\'s assessment of when quantum computers will break current encryption and what that means for national security.', speakers: [{ name: 'Gen. Philippe de Villiers' }], tags: ['quantum', 'NATO', 'cryptography'] },
  { id: 'f4', title: 'AI-Powered Defence: Strategy to Battlefield', type: 'keynote', start_time: '2026-11-25T10:00:00', end_time: '2026-11-25T10:40:00', description: 'How AI and quantum computing converge to create a new paradigm of defence capability. Real-world deployments with US DOD and allied forces.', speakers: [{ name: 'Dr. Alexandr Wang' }], tags: ['AI', 'defense'] },
  { id: 'f5', title: 'Coffee Break & Networking', type: 'break', start_time: '2026-11-25T10:40:00', end_time: '2026-11-25T11:10:00', description: 'Coffee, pastries, and exhibition visit.', speakers: [], tags: ['networking'] },
  { id: 'f6', title: 'Post-Quantum Cryptography: Securing NATO\'s Future', type: 'panel', start_time: '2026-11-25T11:10:00', end_time: '2026-11-25T12:00:00', description: 'NIST standards, migration strategies, and real-world deployment challenges for post-quantum cryptography across NATO systems.', speakers: [{ name: 'Dr. Dustin Moody' }, { name: 'Dr. Marko Erman' }, { name: 'Oliver Brauner' }], tags: ['PQC', 'NATO', 'cryptography'] },
  { id: 'f7', title: 'Hands-on Quantum Computing for Defence', type: 'workshop', start_time: '2026-11-25T11:10:00', end_time: '2026-11-25T12:00:00', description: 'Interactive workshop with IBM Quantum and Pasqal. Participants run quantum algorithms on real hardware relevant to defense optimization.', speakers: [{ name: 'Dr. Jay Gambetta' }, { name: 'Dr. Loïc Henriet' }], tags: ['quantum', 'workshop', 'hands-on'] },
  { id: 'f8', title: 'Europe\'s Digital Sovereignty in the Quantum Age', type: 'fireside', start_time: '2026-11-25T12:00:00', end_time: '2026-11-25T12:40:00', description: 'Fireside chat on European strategic autonomy in quantum technologies, digital sovereignty, and reducing dependence on non-EU tech.', speakers: [{ name: 'Thierry Breton' }, { name: 'Dr. Andrea Renda' }], tags: ['policy', 'EU', 'sovereignty'] },
  { id: 'f9', title: 'Lunch & Exhibition', type: 'break', start_time: '2026-11-25T12:40:00', end_time: '2026-11-25T14:00:00', description: 'Buffet lunch with themed networking tables. Exhibition hall open.', speakers: [], tags: ['lunch', 'networking'] },
  { id: 'f10', title: 'Quantum Sensing for Military Operations', type: 'keynote', start_time: '2026-11-25T14:00:00', end_time: '2026-11-25T14:40:00', description: 'Quantum sensors for navigation without GPS, submarine detection, and battlefield awareness.', speakers: [{ name: 'Dr. Anna-Lena Braun' }], tags: ['quantum', 'sensing', 'military'] },
  { id: 'f11', title: 'Startup Showcase: Quantum Security Innovations', type: 'presentation', start_time: '2026-11-25T14:00:00', end_time: '2026-11-25T14:40:00', description: 'Five quantum security startups pitch their solutions to defense industry CISOs and government procurement officers.', speakers: [{ name: 'Dr. Jan Goetz' }], tags: ['innovation', 'startups'] },
  { id: 'f12', title: 'Cyber Warfare 2030: Threats & Defenses', type: 'panel', start_time: '2026-11-25T14:40:00', end_time: '2026-11-25T15:20:00', description: 'State-sponsored cyber attacks, quantum-enhanced threats, and next-generation defense strategies for 2030 and beyond.', speakers: [{ name: 'George Kurtz' }, { name: 'Nikesh Arora' }], tags: ['cybersecurity', 'threats'] },
  { id: 'f13', title: 'Coffee Break', type: 'break', start_time: '2026-11-25T15:20:00', end_time: '2026-11-25T15:50:00', description: 'Afternoon coffee and exhibition.', speakers: [], tags: ['networking'] },
  { id: 'f14', title: 'Ethics of Autonomous Defence Systems', type: 'panel', start_time: '2026-11-25T15:50:00', end_time: '2026-11-25T16:30:00', description: 'Where should humans remain in the loop? Ethical frameworks for AI-driven weapons, autonomous drones, and algorithmic targeting.', speakers: [{ name: 'Dr. Andrea Renda' }, { name: 'Rear Adm. James Parkin CBE' }], tags: ['ethics', 'AI', 'policy'] },
  { id: 'f15', title: 'Quantum Key Distribution: Live Demo', type: 'workshop', start_time: '2026-11-25T15:50:00', end_time: '2026-11-25T16:30:00', description: 'Live demonstration of quantum key distribution over fiber optic, with hands-on for participants.', speakers: [{ name: 'Dr. Marko Erman' }], tags: ['QKD', 'demo', 'quantum'] },
  { id: 'f16', title: 'Luxembourg as Europe\'s Cybersecurity Hub', type: 'keynote', start_time: '2026-11-25T16:30:00', end_time: '2026-11-25T17:10:00', description: 'How Luxembourg is positioning itself as Europe\'s cybersecurity and quantum defense center of excellence.', speakers: [{ name: 'Yuriko Backes' }], tags: ['Luxembourg', 'cybersecurity', 'policy'] },
  { id: 'f17', title: 'Closing Ceremony & Key Takeaways', type: 'keynote', start_time: '2026-11-25T17:10:00', end_time: '2026-11-25T17:40:00', description: 'Summary of the day\'s key insights, call to action for quantum-safe migration, and announcement of Q-DEF 2027.', speakers: [{ name: 'Yuriko Backes' }], tags: ['closing'] },
  { id: 'f18', title: 'Networking Reception & Cocktail', type: 'break', start_time: '2026-11-25T17:40:00', end_time: '2026-11-25T19:00:00', description: 'Cocktail reception on the terrace with live music and open bar.', speakers: [], tags: ['networking', 'reception'] },
];

export default function ProgrammePage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetch('/api/sessions')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const list = Array.isArray(data) ? data : data.sessions || [];
        list.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
        setSessions(list.length > 0 ? list : FALLBACK);
      })
      .catch(() => setSessions(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'keynote', label: 'Keynotes' },
    { value: 'panel', label: 'Panels' },
    { value: 'presentation', label: 'Presentations' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'fireside', label: 'Fireside' },
  ];

  const filtered = filter === 'all'
    ? sessions
    : sessions.filter(s => (s.type || '').toLowerCase() === filter);

  function formatTime(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }

  function toggleExpand(id) {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function getTypeBadgeClass(type) {
    const t = (type || 'presentation').toLowerCase();
    return `badge badge--${t}`;
  }

  return (
    <>
      {/* Page Hero with quantum background */}
      <section className="page-hero page-hero--img" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1920&q=80)'
      }}>
        <div className="page-hero__overlay" />
        <div className="page-hero__content">
          <h1 className="page-hero__title">
            Conference <span className="gradient-text">Programme</span>
          </h1>
          <p className="page-hero__subtitle">
            November 25, 2026 &mdash; Maison du Savoir, Esch-sur-Alzette
          </p>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          {/* Filter Pills */}
          <div className="filters">
            {filterOptions.map(opt => (
              <button
                key={opt.value}
                className={`filter-pill ${filter === opt.value ? 'filter-pill--active' : ''}`}
                onClick={() => setFilter(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading">
              <div className="loading-spinner" />
              <p>Loading programme...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state glass-card">
              {sessions.length === 0
                ? 'The programme will be announced soon. Check back later.'
                : 'No sessions match the selected filter.'}
            </div>
          ) : (
            <div className="timeline">
              {filtered.map((session, i) => {
                const key = session.id || i;
                const isExpanded = expanded[key];
                const type = (session.type || 'presentation').toLowerCase();
                const isBreak = type === 'break';

                return (
                  <div
                    className={`timeline__item ${isBreak ? 'timeline__item--break' : ''}`}
                    key={key}
                  >
                    <div className="timeline__marker">
                      <div className={`timeline__dot timeline__dot--${type}`} />
                    </div>

                    <div className="timeline__time">
                      <span className="timeline__time-start">
                        {formatTime(session.start_time)}
                      </span>
                      {session.end_time && (
                        <span className="timeline__time-end">
                          {formatTime(session.end_time)}
                        </span>
                      )}
                    </div>

                    <div
                      className="glass-card timeline__card"
                      onClick={() => toggleExpand(key)}
                    >
                      <div className="timeline__card-header">
                        <h3 className="timeline__card-title">{session.title}</h3>
                        <span className={getTypeBadgeClass(session.type)}>
                          {session.type || 'Session'}
                        </span>
                      </div>

                      {/* Speakers */}
                      {session.speakers && session.speakers.length > 0 && (
                        <div className="timeline__speakers">
                          {session.speakers.map((speaker, si) => (
                            <span className="timeline__speaker-tag" key={si}>
                              {typeof speaker === 'string' ? speaker : speaker.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Tags */}
                      {session.tags && (Array.isArray(session.tags) ? session.tags : session.tags.split(',')).length > 0 && (
                        <div className="timeline__tags">
                          {(Array.isArray(session.tags) ? session.tags : session.tags.split(',')).map((tag, ti) => (
                            <span key={ti} className="timeline__tag-pill">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Expandable description */}
                      {isExpanded && session.description && (
                        <div className="timeline__card-description">
                          {session.description}
                        </div>
                      )}

                      {session.description && (
                        <div className="timeline__expand-hint">
                          {isExpanded ? 'Click to collapse' : 'Click to expand details'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
