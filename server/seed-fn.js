// Lightweight seed function for serverless cold starts
// Does NOT require dotenv - uses environment variables directly

const bcrypt = require('bcryptjs');

module.exports = function seedDatabase(db) {
  if (!db) db = require('./db');

  // 1. Admin
  const passwordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);
  db.prepare('INSERT OR REPLACE INTO admins (email, password_hash, name) VALUES (?, ?, ?)').run(
    process.env.ADMIN_EMAIL || 'admin@qdef.lu', passwordHash, 'Q-DEF Admin'
  );

  // 2. Speakers
  const insertSpeaker = db.prepare('INSERT INTO speakers (name, title, organization, bio, photo_url) VALUES (?, ?, ?, ?, ?)');
  const speakers = [
    ['Gen. Philippe de Villiers', 'Supreme Allied Commander Transformation (SACT)', 'NATO Allied Command Transformation', 'General Philippe de Villiers serves as NATO\'s Supreme Allied Commander Transformation.', '/images/speakers/de-villiers.jpg'],
    ['Yuriko Backes', 'Minister of Defence', 'Government of the Grand Duchy of Luxembourg', 'Yuriko Backes serves as Luxembourg\'s Minister of Defence.', '/images/speakers/backes.jpg'],
    ['Thierry Breton', 'Executive Vice-President for Tech Sovereignty', 'European Commission', 'Thierry Breton leads the European Commission\'s portfolio on technological sovereignty.', '/images/speakers/breton.jpg'],
    ['Prof. Dr. Jian-Wei Pan', 'Distinguished Visiting Professor of Quantum Information', 'University of Luxembourg / ETH Zurich', 'Professor Jian-Wei Pan is one of the world\'s foremost authorities on quantum communication.', '/images/speakers/pan.jpg'],
    ['Dr. Jay Gambetta', 'Vice President, IBM Quantum', 'IBM Research', 'Dr. Jay Gambetta leads IBM\'s quantum computing division.', '/images/speakers/gambetta.jpg'],
    ['Dr. Loic Henriet', 'Chief Technology Officer', 'Pasqal', 'Dr. Loic Henriet is CTO of Pasqal, building neutral-atom quantum processors.', '/images/speakers/henriet.jpg'],
    ['George Kurtz', 'Chief Executive Officer', 'CrowdStrike', 'George Kurtz is the CEO and co-founder of CrowdStrike.', '/images/speakers/kurtz.jpg'],
    ['Dr. Marko Erman', 'Senior VP & Chief Technology Officer', 'Thales Group', 'Dr. Marko Erman is the CTO of Thales Group.', '/images/speakers/erman.jpg'],
    ['Sabine Klauke', 'Chief Technology Officer', 'Airbus Defence and Space', 'Sabine Klauke serves as CTO of Airbus Defence and Space.', '/images/speakers/klauke.jpg'],
    ['Rear Adm. James Parkin CBE', 'Director, National Quantum Technologies Programme', 'UK Ministry of Defence', 'Rear Admiral James Parkin directs the UK MOD\'s National Quantum Technologies Programme.', '/images/speakers/parkin.jpg'],
    ['Dr. Dustin Moody', 'Lead, Post-Quantum Cryptography Standardization', 'NIST', 'Dr. Dustin Moody leads NIST\'s Post-Quantum Cryptography Standardization project.', '/images/speakers/moody.jpg'],
    ['Dr. Alexandr Wang', 'Chief Executive Officer', 'Scale AI', 'Dr. Alexandr Wang is the CEO and founder of Scale AI.', '/images/speakers/wang.jpg'],
    ['Dr. Jan Goetz', 'Co-Founder & Chief Executive Officer', 'IQM Quantum Computers', 'Dr. Jan Goetz is co-founder and CEO of IQM.', '/images/speakers/goetz.jpg'],
    ['Dr. Andrea Renda', 'Senior Research Fellow & Head of Global Governance', 'CEPS', 'Dr. Andrea Renda advises on technology governance and AI in defence.', '/images/speakers/renda.jpg'],
    ['Dr. Anna-Lena Braun', 'Head of Quantum Sensing for Defence Applications', 'Fraunhofer Institute IOSB', 'Dr. Anna-Lena Braun leads Quantum Sensing for Defence Applications.', '/images/speakers/braun.jpg'],
    ['Nikesh Arora', 'Chairman & Chief Executive Officer', 'Palo Alto Networks', 'Nikesh Arora is Chairman and CEO of Palo Alto Networks.', '/images/speakers/arora.jpg'],
    ['Oliver Brauner', 'Head of Advanced Technology & Innovation', 'Rheinmetall AG', 'Oliver Brauner leads Advanced Technology and Innovation at Rheinmetall.', '/images/speakers/brauner.jpg'],
  ];

  const speakerIds = [];
  for (const s of speakers) {
    const r = insertSpeaker.run(...s);
    speakerIds.push(r.lastInsertRowid);
  }

  // 3. Sessions
  const insertSession = db.prepare('INSERT INTO sessions (title, description, type, start_time, end_time, speaker_ids, tags, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const SP = speakerIds;
  const sessions = [
    ['Registration & Welcome Coffee', 'Attendee registration and networking.', 'break', '2026-11-25T08:00:00', '2026-11-25T09:00:00', '[]', 'registration,networking', 'Maison du Savoir - Hall Principal'],
    ['Opening Ceremony', 'Official opening of Q-DEF 2026.', 'keynote', '2026-11-25T09:00:00', '2026-11-25T09:20:00', JSON.stringify([SP[1]]), 'opening,policy', 'Main Stage'],
    ['Opening Keynote: The Quantum Threat Horizon', 'NATO assessment of the quantum threat timeline.', 'keynote', '2026-11-25T09:20:00', '2026-11-25T10:00:00', JSON.stringify([SP[0]]), 'quantum,defense,NATO', 'Main Stage'],
    ['Keynote: AI-Powered Defence', 'How AI and quantum computing converge for defence.', 'keynote', '2026-11-25T10:00:00', '2026-11-25T10:40:00', JSON.stringify([SP[11]]), 'AI,defense', 'Main Stage'],
    ['Coffee Break & Networking', 'Mid-morning refreshment break.', 'break', '2026-11-25T10:40:00', '2026-11-25T11:10:00', '[]', 'break', 'Hall Principal'],
    ['Panel: Post-Quantum Cryptography', 'Debate on PQC migration at scale.', 'panel', '2026-11-25T11:10:00', '2026-11-25T12:00:00', JSON.stringify([SP[10], SP[0], SP[9], SP[7]]), 'quantum,cryptography', 'Main Stage'],
    ['Workshop: Hands-on Quantum Computing', 'Practitioner workshop using IBM Qiskit and IQM.', 'workshop', '2026-11-25T11:10:00', '2026-11-25T12:00:00', JSON.stringify([SP[4], SP[12]]), 'quantum,workshop', 'Innovation Lab'],
    ['Fireside Chat: Europe\'s Digital Sovereignty', 'Conversation on European technological independence.', 'fireside', '2026-11-25T12:00:00', '2026-11-25T12:40:00', JSON.stringify([SP[2], SP[8]]), 'policy,EU', 'Main Stage'],
    ['Lunch & Exhibition', 'Gourmet buffet lunch with demos.', 'break', '2026-11-25T12:40:00', '2026-11-25T14:00:00', '[]', 'lunch,networking', 'Espace Restauration'],
    ['Keynote: Quantum Sensing & Navigation', 'Latest advances in quantum sensors for military.', 'keynote', '2026-11-25T14:00:00', '2026-11-25T14:40:00', JSON.stringify([SP[14]]), 'quantum,sensing', 'Main Stage'],
    ['Panel: Cyber Warfare 2030', 'Cyber threat landscape of the near future.', 'panel', '2026-11-25T14:40:00', '2026-11-25T15:20:00', JSON.stringify([SP[6], SP[15], SP[16], SP[9]]), 'cybersecurity', 'Main Stage'],
    ['Startup Showcase', 'Europe\'s most promising quantum security startups.', 'presentation', '2026-11-25T14:00:00', '2026-11-25T14:40:00', JSON.stringify([SP[5], SP[12]]), 'startup,innovation', 'Innovation Stage'],
    ['Building Quantum-Safe Infrastructure', 'Real-world deployment of quantum-safe cryptography.', 'presentation', '2026-11-25T14:40:00', '2026-11-25T15:20:00', JSON.stringify([SP[10], SP[7]]), 'quantum,infrastructure', 'Innovation Stage'],
    ['Coffee Break', 'Afternoon break.', 'break', '2026-11-25T15:20:00', '2026-11-25T15:50:00', '[]', 'break', 'Hall Principal'],
    ['Panel: Ethics of Autonomous Defence', 'Ethical debate on AI-driven autonomous weapons.', 'panel', '2026-11-25T15:50:00', '2026-11-25T16:30:00', JSON.stringify([SP[11], SP[13], SP[8], SP[0]]), 'AI,ethics', 'Main Stage'],
    ['Workshop: QKD Live Demo', 'Live quantum key distribution demonstration.', 'workshop', '2026-11-25T15:50:00', '2026-11-25T16:30:00', JSON.stringify([SP[7], SP[3]]), 'quantum,QKD', 'Innovation Lab'],
    ['Keynote: Luxembourg as Cybersecurity Hub', 'Luxembourg\'s role in European quantum defence.', 'keynote', '2026-11-25T16:30:00', '2026-11-25T17:10:00', JSON.stringify([SP[2]]), 'policy,Luxembourg', 'Main Stage'],
    ['Closing Ceremony & Q-DEF Innovation Award', 'Official closing and award announcement.', 'keynote', '2026-11-25T17:10:00', '2026-11-25T17:40:00', JSON.stringify([SP[1], SP[0]]), 'closing,awards', 'Main Stage'],
    ['Networking Reception & Cocktail', 'Exclusive cocktail reception.', 'break', '2026-11-25T17:40:00', '2026-11-25T19:00:00', '[]', 'reception,networking', 'Terrasse'],
  ];
  for (const s of sessions) insertSession.run(...s);

  // 4. Config
  const upsertConfig = db.prepare('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)');
  const cfg = {
    event_name: 'Q-DEF 2026', event_full_name: 'Quantum Defense & Emerging Technologies Summit',
    event_tagline: 'Where quantum science meets defence strategy',
    event_date: 'November 25, 2026', event_date_iso: '2026-11-25',
    countdown_target: '2026-11-25T09:00:00+01:00',
    event_location: 'Maison du Savoir, Esch-sur-Alzette, Luxembourg',
    contact_email: 'info@qdef-conference.lu', contact_phone: '+352 123 456 789',
    hero_headline: 'The summit shaping quantum defense.',
    hero_subtitle: '300+ leaders in cybersecurity, quantum computing, and defense gather at Maison du Savoir.',
    stats_attendees: '300+', stats_speakers: '17', stats_sessions: '19', stats_tracks: '6', stats_nations: '15+',
  };
  for (const [k, v] of Object.entries(cfg)) upsertConfig.run(k, v);

  // 5. Sponsors
  const insertSponsor = db.prepare('INSERT INTO sponsors (name, tier, description, sort_order) VALUES (?, ?, ?, ?)');
  [
    ['Luxembourg Ministry of Defence', 'organizer', 'Lead organizer', 1],
    ['University of Luxembourg SnT', 'organizer', 'Academic partner', 2],
    ['Thales', 'platinum', 'Defense electronics & quantum-safe encryption', 1],
    ['Airbus Defence and Space', 'platinum', 'Satellite communications & defense', 2],
    ['IBM Quantum', 'platinum', 'Quantum computing platforms', 3],
    ['CrowdStrike', 'gold', 'AI-native cybersecurity', 1],
    ['Palo Alto Networks', 'gold', 'Zero trust security', 2],
    ['Rheinmetall', 'gold', 'Defense technology', 3],
    ['IQM', 'gold', 'European quantum computers', 4],
    ['Pasqal', 'gold', 'Neutral atom quantum processors', 5],
    ['NATO', 'institutional', 'North Atlantic Treaty Organization', 1],
    ['European Commission', 'institutional', 'EU policy & sovereignty', 2],
    ['NIST', 'institutional', 'Standards & cryptography', 3],
  ].forEach(s => insertSponsor.run(...s));

  // 6. Exhibitions
  const insertExh = db.prepare('INSERT INTO exhibitions (name, description, tag, sort_order) VALUES (?, ?, ?, ?)');
  [
    ['IBM Quantum', 'Quantum computing platforms & enterprise solutions', 'Quantum Computing', 1],
    ['Thales', 'Cybersecurity, defense electronics & quantum-safe encryption', 'Defense', 2],
    ['Pasqal', 'Neutral atom quantum processors', 'Quantum Hardware', 3],
    ['CrowdStrike', 'AI-native cybersecurity & threat intelligence', 'Cybersecurity', 4],
    ['Airbus Defence', 'Satellite communications & defense systems', 'Aerospace', 5],
    ['IQM', 'European quantum computers', 'Quantum Hardware', 6],
    ['Palo Alto Networks', 'Next-gen firewalls & zero trust', 'Cybersecurity', 7],
    ['Rheinmetall', 'Defense technology & autonomous systems', 'Defense Tech', 8],
    ['Scale AI', 'AI data platform for defense', 'AI & Defense', 9],
    ['LuxProvide', 'Luxembourg HPC & quantum center', 'HPC', 10],
    ['Leonardo', 'Defense & aerospace electronics', 'Defense', 11],
  ].forEach(e => insertExh.run(...e));

  // 7. Pages
  const insertPage = db.prepare('INSERT OR REPLACE INTO pages (slug, title, content) VALUES (?, ?, ?)');
  insertPage.run('home', 'Q-DEF Conference Luxembourg 2026', JSON.stringify({ hero: { headline: 'Q-DEF 2026', subheadline: 'Quantum Defense & Emerging Technologies' } }));
  insertPage.run('about', 'About Q-DEF', JSON.stringify({ mission: 'The Q-DEF Conference is dedicated to quantum technologies in defence.' }));
  insertPage.run('venue', 'Venue', JSON.stringify({ name: 'Maison du Savoir', address: '2 avenue de l\'Université, 4365 Esch-sur-Alzette' }));
};
