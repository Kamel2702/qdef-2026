const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const sb = createClient(
  'https://lahusjjoetgtlrlrchdq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhaHVzampvZXRndGxybHJjaGRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mzk1Njg1MCwiZXhwIjoyMDg5NTMyODUwfQ.fTI6_PnwvqUzmxk67il7DbtIOPt3WAdGwE6wIN8OQi8'
);

async function seed() {
  console.log('Seeding Supabase...\n');

  // 1. Admin
  const hash = bcrypt.hashSync('admin123', 10);
  const { error: e1 } = await sb.from('admins').upsert(
    { email: 'admin@qdef.lu', password_hash: hash, name: 'Q-DEF Admin' },
    { onConflict: 'email' }
  );
  console.log('Admin:', e1 ? e1.message : 'OK');

  // 2. Speakers
  const speakers = [
    { name: 'Gen. Philippe de Villiers', title: 'Supreme Allied Commander Transformation (SACT)', organization: 'NATO Allied Command Transformation', bio: 'General Philippe de Villiers serves as NATO\'s Supreme Allied Commander Transformation.', photo_url: '/images/speakers/de-villiers.jpg' },
    { name: 'Yuriko Backes', title: 'Minister of Defence', organization: 'Government of the Grand Duchy of Luxembourg', bio: 'Yuriko Backes serves as Luxembourg\'s Minister of Defence.', photo_url: '/images/speakers/backes.jpg' },
    { name: 'Thierry Breton', title: 'Executive Vice-President for Tech Sovereignty', organization: 'European Commission', bio: 'Thierry Breton leads the European Commission\'s portfolio on technological sovereignty.', photo_url: '/images/speakers/breton.jpg' },
    { name: 'Prof. Dr. Jian-Wei Pan', title: 'Distinguished Visiting Professor', organization: 'University of Luxembourg / ETH Zurich', bio: 'Professor Pan is one of the world\'s foremost authorities on quantum communication.', photo_url: '/images/speakers/pan.jpg' },
    { name: 'Dr. Jay Gambetta', title: 'Vice President, IBM Quantum', organization: 'IBM Research', bio: 'Dr. Gambetta leads IBM\'s quantum computing division.', photo_url: '/images/speakers/gambetta.jpg' },
    { name: 'Dr. Loic Henriet', title: 'Chief Technology Officer', organization: 'Pasqal', bio: 'Dr. Henriet is CTO of Pasqal, building neutral-atom quantum processors.', photo_url: '/images/speakers/henriet.jpg' },
    { name: 'George Kurtz', title: 'Chief Executive Officer', organization: 'CrowdStrike', bio: 'George Kurtz is the CEO and co-founder of CrowdStrike.', photo_url: '/images/speakers/kurtz.jpg' },
    { name: 'Dr. Marko Erman', title: 'Senior VP & CTO', organization: 'Thales Group', bio: 'Dr. Erman is the CTO of Thales Group.', photo_url: '/images/speakers/erman.jpg' },
    { name: 'Sabine Klauke', title: 'Chief Technology Officer', organization: 'Airbus Defence and Space', bio: 'Sabine Klauke serves as CTO of Airbus Defence and Space.', photo_url: '/images/speakers/klauke.jpg' },
    { name: 'Rear Adm. James Parkin CBE', title: 'Director, National Quantum Technologies Programme', organization: 'UK Ministry of Defence', bio: 'Rear Admiral Parkin directs the UK MOD\'s National Quantum Technologies Programme.', photo_url: '/images/speakers/parkin.jpg' },
    { name: 'Dr. Dustin Moody', title: 'Lead, Post-Quantum Cryptography', organization: 'NIST', bio: 'Dr. Moody leads NIST\'s Post-Quantum Cryptography Standardization project.', photo_url: '/images/speakers/moody.jpg' },
    { name: 'Dr. Alexandr Wang', title: 'Chief Executive Officer', organization: 'Scale AI', bio: 'Dr. Wang is the CEO and founder of Scale AI.', photo_url: '/images/speakers/wang.jpg' },
    { name: 'Dr. Jan Goetz', title: 'Co-Founder & CEO', organization: 'IQM Quantum Computers', bio: 'Dr. Goetz is co-founder and CEO of IQM.', photo_url: '/images/speakers/goetz.jpg' },
    { name: 'Dr. Andrea Renda', title: 'Senior Research Fellow', organization: 'CEPS', bio: 'Dr. Renda advises on technology governance and AI in defence.', photo_url: '/images/speakers/renda.jpg' },
    { name: 'Dr. Anna-Lena Braun', title: 'Head of Quantum Sensing for Defence', organization: 'Fraunhofer Institute IOSB', bio: 'Dr. Braun leads quantum sensing for defence at Fraunhofer.', photo_url: '/images/speakers/braun.jpg' },
    { name: 'Nikesh Arora', title: 'Chairman & CEO', organization: 'Palo Alto Networks', bio: 'Nikesh Arora is Chairman and CEO of Palo Alto Networks.', photo_url: '/images/speakers/arora.jpg' },
    { name: 'Oliver Brauner', title: 'Head of Advanced Technology & Innovation', organization: 'Rheinmetall AG', bio: 'Oliver Brauner leads Advanced Technology at Rheinmetall.', photo_url: '/images/speakers/brauner.jpg' },
  ];
  const { data: spkData, error: e2 } = await sb.from('speakers').insert(speakers).select('id');
  console.log('Speakers:', e2 ? e2.message : (spkData ? spkData.length + ' created' : 'no data'));
  const SP = spkData ? spkData.map(s => s.id) : [];

  // 3. Sessions
  const sessions = [
    { title: 'Registration & Welcome Coffee', description: 'Attendee registration and networking.', type: 'break', start_time: '2026-11-25T08:00:00', end_time: '2026-11-25T09:00:00', speaker_ids: '[]', tags: 'registration,networking', location: 'Hall Principal' },
    { title: 'Opening Ceremony', description: 'Official opening of Q-DEF 2026.', type: 'keynote', start_time: '2026-11-25T09:00:00', end_time: '2026-11-25T09:20:00', speaker_ids: JSON.stringify([SP[1]]), tags: 'opening,policy', location: 'Main Stage' },
    { title: 'Opening Keynote: The Quantum Threat Horizon', description: 'NATO assessment of the quantum threat timeline.', type: 'keynote', start_time: '2026-11-25T09:20:00', end_time: '2026-11-25T10:00:00', speaker_ids: JSON.stringify([SP[0]]), tags: 'quantum,defense,NATO', location: 'Main Stage' },
    { title: 'Keynote: AI-Powered Defence', description: 'How AI and quantum computing converge for defence.', type: 'keynote', start_time: '2026-11-25T10:00:00', end_time: '2026-11-25T10:40:00', speaker_ids: JSON.stringify([SP[11]]), tags: 'AI,defense', location: 'Main Stage' },
    { title: 'Coffee Break & Networking', description: 'Mid-morning break.', type: 'break', start_time: '2026-11-25T10:40:00', end_time: '2026-11-25T11:10:00', speaker_ids: '[]', tags: 'break', location: 'Hall Principal' },
    { title: 'Panel: Post-Quantum Cryptography', description: 'Debate on PQC migration.', type: 'panel', start_time: '2026-11-25T11:10:00', end_time: '2026-11-25T12:00:00', speaker_ids: JSON.stringify([SP[10], SP[0], SP[9], SP[7]]), tags: 'quantum,cryptography', location: 'Main Stage' },
    { title: 'Workshop: Hands-on Quantum Computing', description: 'Using IBM Qiskit and IQM.', type: 'workshop', start_time: '2026-11-25T11:10:00', end_time: '2026-11-25T12:00:00', speaker_ids: JSON.stringify([SP[4], SP[12]]), tags: 'quantum,workshop', location: 'Innovation Lab' },
    { title: 'Fireside Chat: Digital Sovereignty', description: 'European technological independence.', type: 'fireside', start_time: '2026-11-25T12:00:00', end_time: '2026-11-25T12:40:00', speaker_ids: JSON.stringify([SP[2], SP[8]]), tags: 'policy,EU', location: 'Main Stage' },
    { title: 'Lunch & Exhibition', description: 'Buffet lunch with demos.', type: 'break', start_time: '2026-11-25T12:40:00', end_time: '2026-11-25T14:00:00', speaker_ids: '[]', tags: 'lunch', location: 'Espace Restauration' },
    { title: 'Keynote: Quantum Sensing & Navigation', description: 'Quantum sensors for military.', type: 'keynote', start_time: '2026-11-25T14:00:00', end_time: '2026-11-25T14:40:00', speaker_ids: JSON.stringify([SP[14]]), tags: 'quantum,sensing', location: 'Main Stage' },
    { title: 'Panel: Cyber Warfare 2030', description: 'Cyber threat landscape.', type: 'panel', start_time: '2026-11-25T14:40:00', end_time: '2026-11-25T15:20:00', speaker_ids: JSON.stringify([SP[6], SP[15], SP[16], SP[9]]), tags: 'cybersecurity', location: 'Main Stage' },
    { title: 'Startup Showcase', description: 'Quantum security startups.', type: 'presentation', start_time: '2026-11-25T14:00:00', end_time: '2026-11-25T14:40:00', speaker_ids: JSON.stringify([SP[5], SP[12]]), tags: 'startup', location: 'Innovation Stage' },
    { title: 'Panel: Ethics of Autonomous Defence', description: 'AI-driven autonomous weapons debate.', type: 'panel', start_time: '2026-11-25T15:50:00', end_time: '2026-11-25T16:30:00', speaker_ids: JSON.stringify([SP[11], SP[13], SP[8], SP[0]]), tags: 'AI,ethics', location: 'Main Stage' },
    { title: 'Closing Ceremony & Innovation Award', description: 'Official closing and award.', type: 'keynote', start_time: '2026-11-25T17:10:00', end_time: '2026-11-25T17:40:00', speaker_ids: JSON.stringify([SP[1], SP[0]]), tags: 'closing,awards', location: 'Main Stage' },
    { title: 'Networking Reception & Cocktail', description: 'Exclusive cocktail reception.', type: 'break', start_time: '2026-11-25T17:40:00', end_time: '2026-11-25T19:00:00', speaker_ids: '[]', tags: 'reception', location: 'Terrasse' },
  ];
  const { error: e3 } = await sb.from('sessions').insert(sessions);
  console.log('Sessions:', e3 ? e3.message : sessions.length + ' created');

  // 4. Config
  const cfgEntries = [
    { key: 'event_name', value: 'Q-DEF 2026' },
    { key: 'event_full_name', value: 'Quantum Defense & Emerging Technologies Summit' },
    { key: 'event_tagline', value: 'Where quantum science meets defence strategy' },
    { key: 'event_date', value: 'November 25, 2026' },
    { key: 'countdown_target', value: '2026-11-25T09:00:00+01:00' },
    { key: 'event_location', value: 'Maison du Savoir, Esch-sur-Alzette, Luxembourg' },
    { key: 'contact_email', value: 'info@qdef-conference.lu' },
    { key: 'contact_phone', value: '+352 123 456 789' },
    { key: 'hero_headline', value: 'The summit shaping quantum defense.' },
    { key: 'stats_attendees', value: '300+' },
    { key: 'stats_speakers', value: '17' },
    { key: 'stats_sessions', value: '19' },
  ];
  const { error: e4 } = await sb.from('config').upsert(cfgEntries, { onConflict: 'key' });
  console.log('Config:', e4 ? e4.message : cfgEntries.length + ' entries');

  // 5. Sponsors
  const sponsors = [
    { name: 'Luxembourg Ministry of Defence', tier: 'organizer', description: 'Lead organizer', sort_order: 1 },
    { name: 'University of Luxembourg SnT', tier: 'organizer', description: 'Academic partner', sort_order: 2 },
    { name: 'Thales', tier: 'platinum', description: 'Defense electronics & quantum-safe encryption', sort_order: 1 },
    { name: 'Airbus Defence and Space', tier: 'platinum', description: 'Satellite communications & defense', sort_order: 2 },
    { name: 'IBM Quantum', tier: 'platinum', description: 'Quantum computing platforms', sort_order: 3 },
    { name: 'CrowdStrike', tier: 'gold', description: 'AI-native cybersecurity', sort_order: 1 },
    { name: 'Palo Alto Networks', tier: 'gold', description: 'Zero trust security', sort_order: 2 },
    { name: 'IQM', tier: 'gold', description: 'European quantum computers', sort_order: 3 },
    { name: 'Pasqal', tier: 'gold', description: 'Neutral atom quantum processors', sort_order: 4 },
    { name: 'NATO', tier: 'institutional', description: 'North Atlantic Treaty Organization', sort_order: 1 },
    { name: 'European Commission', tier: 'institutional', description: 'EU policy & sovereignty', sort_order: 2 },
    { name: 'NIST', tier: 'institutional', description: 'Standards & cryptography', sort_order: 3 },
  ];
  const { error: e5 } = await sb.from('sponsors').insert(sponsors);
  console.log('Sponsors:', e5 ? e5.message : sponsors.length + ' created');

  // 6. Exhibitions
  const exhibitions = [
    { name: 'IBM Quantum', description: 'Quantum computing platforms', tag: 'Quantum Computing', sort_order: 1 },
    { name: 'Thales', description: 'Cybersecurity & quantum-safe encryption', tag: 'Defense', sort_order: 2 },
    { name: 'Pasqal', description: 'Neutral atom quantum processors', tag: 'Quantum Hardware', sort_order: 3 },
    { name: 'CrowdStrike', description: 'AI-native cybersecurity', tag: 'Cybersecurity', sort_order: 4 },
    { name: 'Airbus Defence', description: 'Satellite communications', tag: 'Aerospace', sort_order: 5 },
    { name: 'IQM', description: 'European quantum computers', tag: 'Quantum Hardware', sort_order: 6 },
    { name: 'Scale AI', description: 'AI data platform for defense', tag: 'AI & Defense', sort_order: 7 },
    { name: 'LuxProvide', description: 'Luxembourg HPC & quantum', tag: 'HPC', sort_order: 8 },
  ];
  const { error: e6 } = await sb.from('exhibitions').insert(exhibitions);
  console.log('Exhibitions:', e6 ? e6.message : exhibitions.length + ' created');

  // 7. Pages
  const pages = [
    { slug: 'home', title: 'Q-DEF 2026', content: JSON.stringify({ hero: { headline: 'Q-DEF 2026', subheadline: 'Quantum Defense & Emerging Technologies' } }) },
    { slug: 'about', title: 'About Q-DEF', content: JSON.stringify({ mission: 'The Q-DEF Conference is dedicated to quantum technologies in defence.' }) },
    { slug: 'venue', title: 'Venue', content: JSON.stringify({ name: 'Maison du Savoir', address: '4365 Esch-sur-Alzette' }) },
  ];
  const { error: e7 } = await sb.from('pages').upsert(pages, { onConflict: 'slug' });
  console.log('Pages:', e7 ? e7.message : pages.length + ' created');

  console.log('\nDONE!');
}

seed().catch(e => console.error('FATAL:', e.message));
