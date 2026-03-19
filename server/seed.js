require('dotenv').config();

const bcrypt = require('bcryptjs');
const db = require('./db');

function seed() {
  console.log('Seeding Q-DEF Conference database...\n');

  // ------------------------------------------------------------------
  // 1. Admin user
  // ------------------------------------------------------------------
  console.log('Creating admin user...');
  const passwordHash = bcrypt.hashSync('admin123', 10);

  const insertAdmin = db.prepare(`
    INSERT OR REPLACE INTO admins (email, password_hash, name)
    VALUES (?, ?, ?)
  `);
  insertAdmin.run('admin@qdef.lu', passwordHash, 'Q-DEF Admin');
  console.log('  Admin created: admin@qdef.lu / admin123\n');

  // ------------------------------------------------------------------
  // 2. Speakers (15+ diverse speakers)
  // ------------------------------------------------------------------
  console.log('Creating speakers...');

  const insertSpeaker = db.prepare(`
    INSERT INTO speakers (name, title, organization, bio, photo_url)
    VALUES (?, ?, ?, ?, ?)
  `);

  // Clear existing speakers & sessions (sessions depend on speaker IDs)
  db.prepare('DELETE FROM sessions').run();
  db.prepare('DELETE FROM speakers').run();

  const speakers = [
    // --- 1. Military & NATO ---
    {
      name: 'Gen. Philippe de Villiers',
      title: 'Supreme Allied Commander Transformation (SACT)',
      organization: 'NATO Allied Command Transformation',
      bio: 'General Philippe de Villiers serves as NATO\'s Supreme Allied Commander Transformation, overseeing the Alliance\'s military transformation agenda including quantum technology integration and next-generation cyber defence capabilities. A four-star general in the French Armed Forces, he previously commanded the French Cyber Defence Command (COMCYBER) and served as Military Advisor to the French President. He holds degrees from Saint-Cyr Military Academy and the Ecole de Guerre, and has led multinational operations in the Sahel, Levant, and Indo-Pacific regions.',
      photo_url: '/images/speakers/de-villiers.jpg'
    },
    // --- 2. Government / Luxembourg ---
    {
      name: 'Yuriko Backes',
      title: 'Minister of Defence',
      organization: 'Government of the Grand Duchy of Luxembourg',
      bio: 'Yuriko Backes serves as Luxembourg\'s Minister of Defence, championing the country\'s strategy for emerging defence technologies and its contributions to NATO and EU security. Under her leadership, Luxembourg has significantly increased investment in quantum-safe communications, satellite-based defence, and cybersecurity. Prior to politics, she served as Chief of Protocol at the Court of the Grand Duke and held senior positions at the European Investment Bank. She is a graduate of the Sorbonne and Sciences Po Paris.',
      photo_url: '/images/speakers/backes.jpg'
    },
    // --- 3. EU Policy ---
    {
      name: 'Thierry Breton',
      title: 'Executive Vice-President for Tech Sovereignty',
      organization: 'European Commission',
      bio: 'Thierry Breton leads the European Commission\'s portfolio on technological sovereignty, digital infrastructure, and defence industry policy. He has been a driving force behind the European Quantum Communication Infrastructure (EuroQCI), the Chips Act, and the EU Cyber Solidarity Act. Before joining the Commission, he served as CEO of Atos and France Telecom, and as France\'s Minister of Economy, Finance and Industry. He is a graduate of Supelec and holds an MBA from HEC Paris.',
      photo_url: '/images/speakers/breton.jpg'
    },
    // --- 4. Quantum Computing - Academia ---
    {
      name: 'Prof. Dr. Jian-Wei Pan',
      title: 'Distinguished Visiting Professor of Quantum Information',
      organization: 'University of Luxembourg / ETH Zurich',
      bio: 'Professor Jian-Wei Pan is one of the world\'s foremost authorities on quantum communication and quantum computing. His pioneering work on quantum teleportation, entanglement distribution, and satellite-based quantum key distribution has earned him the Wolf Prize in Physics and the Nishina Memorial Prize. Currently a Distinguished Visiting Professor at the University of Luxembourg and ETH Zurich, he advises the EU Quantum Flagship programme on long-distance quantum networking and has published over 200 papers in Nature, Science, and Physical Review Letters.',
      photo_url: '/images/speakers/pan.jpg'
    },
    // --- 5. Quantum Computing - Industry (IBM) ---
    {
      name: 'Dr. Jay Gambetta',
      title: 'Vice President, IBM Quantum',
      organization: 'IBM Research',
      bio: 'Dr. Jay Gambetta leads IBM\'s quantum computing division, overseeing the development of IBM\'s quantum hardware roadmap including the 1,000+ qubit processors and the Qiskit software ecosystem. Under his leadership, IBM has partnered with defence agencies across NATO to explore quantum advantage in logistics optimization, cryptanalysis simulation, and materials science for next-generation defence systems. He holds a PhD in Physics from Griffith University and has authored over 150 publications on quantum information science.',
      photo_url: '/images/speakers/gambetta.jpg'
    },
    // --- 6. Quantum Computing - European Startup ---
    {
      name: 'Dr. Loic Henriet',
      title: 'Chief Technology Officer',
      organization: 'Pasqal',
      bio: 'Dr. Loic Henriet is CTO of Pasqal, the French quantum computing startup building neutral-atom quantum processors. Pasqal\'s technology has been selected by the French Ministry of Armed Forces for quantum simulation of complex battlefield scenarios and logistics optimization. Henriet leads the company\'s defence and government partnerships across Europe, working closely with DGA (Direction Generale de l\'Armement) and EDA. He holds a PhD from Universite Paris-Saclay and previously conducted research at College de France under Nobel laureate Serge Haroche.',
      photo_url: '/images/speakers/henriet.jpg'
    },
    // --- 7. Cybersecurity - Industry ---
    {
      name: 'George Kurtz',
      title: 'Chief Executive Officer',
      organization: 'CrowdStrike',
      bio: 'George Kurtz is the CEO and co-founder of CrowdStrike, the global leader in cloud-native endpoint protection and threat intelligence. CrowdStrike\'s Falcon platform protects critical infrastructure and defence networks across 30+ NATO nations. Kurtz has been a vocal advocate for quantum-resistant cybersecurity frameworks, leading CrowdStrike\'s initiative to integrate post-quantum cryptographic standards into its platform. Prior to CrowdStrike, he served as CTO of McAfee and is the author of "Hacking Exposed," one of the best-selling cybersecurity books of all time.',
      photo_url: '/images/speakers/kurtz.jpg'
    },
    // --- 8. Defence Industry - Thales ---
    {
      name: 'Dr. Marko Erman',
      title: 'Senior VP & Chief Technology Officer',
      organization: 'Thales Group',
      bio: 'Dr. Marko Erman is the Chief Technology Officer of Thales Group, overseeing the company\'s R&D strategy across defence, aerospace, and digital security. He leads Thales\'s quantum technology programme, which includes quantum key distribution systems deployed in French and EU government networks, quantum random number generators for military-grade encryption, and quantum sensing prototypes for submarine detection. Before joining Thales, he was Director of Research at Alcatel-Lucent Bell Labs France. He holds a PhD in Physics from Universite Paris-Sud.',
      photo_url: '/images/speakers/erman.jpg'
    },
    // --- 9. Defence Industry - Airbus ---
    {
      name: 'Sabine Klauke',
      title: 'Chief Technology Officer',
      organization: 'Airbus Defence and Space',
      bio: 'Sabine Klauke serves as CTO of Airbus Defence and Space, driving innovation in satellite communications, unmanned aerial systems, and space-based quantum technologies. She oversees Airbus\'s involvement in the EuroQCI satellite constellation for quantum key distribution and leads the company\'s AI-augmented defence systems programme. An aerospace engineer by training, she previously led Airbus Helicopters\' engineering division and holds an honorary doctorate from the Technical University of Munich for her contributions to European aerospace innovation.',
      photo_url: '/images/speakers/klauke.jpg'
    },
    // --- 10. UK Military/Intelligence ---
    {
      name: 'Rear Adm. James Parkin CBE',
      title: 'Director, National Quantum Technologies Programme',
      organization: 'UK Ministry of Defence',
      bio: 'Rear Admiral James Parkin CBE directs the UK Ministry of Defence\'s National Quantum Technologies Programme, the largest government-funded quantum initiative in Europe at over 1 billion GBP. He coordinates quantum technology development across DSTL, GCHQ, and the UK\'s network of quantum technology hubs. A career Royal Navy officer, he previously commanded HMS Queen Elizabeth and served as Assistant Chief of Naval Staff for Capability. He holds an MSc in Defence Technology from Cranfield University.',
      photo_url: '/images/speakers/parkin.jpg'
    },
    // --- 11. Quantum Security - Post-Quantum Crypto ---
    {
      name: 'Dr. Dustin Moody',
      title: 'Lead, Post-Quantum Cryptography Standardization',
      organization: 'NIST (National Institute of Standards and Technology)',
      bio: 'Dr. Dustin Moody leads NIST\'s Post-Quantum Cryptography Standardization project, which has produced the world\'s first standardized quantum-resistant cryptographic algorithms including ML-KEM (Kyber) and ML-DSA (Dilithium). His work directly shapes how governments and defence organizations worldwide will protect classified information in the quantum era. He holds a PhD in Mathematics from the University of Washington and has been a mathematician at NIST since 2009, specializing in elliptic curve cryptography and number theory.',
      photo_url: '/images/speakers/moody.jpg'
    },
    // --- 12. AI & Defence ---
    {
      name: 'Dr. Alexandr Wang',
      title: 'Chief Executive Officer',
      organization: 'Scale AI',
      bio: 'Dr. Alexandr Wang is the CEO and founder of Scale AI, the leading data infrastructure company powering AI applications for the US Department of Defense, intelligence community, and allied nations. Scale AI\'s platform supports autonomous vehicle targeting systems, satellite imagery analysis, and natural language intelligence processing for defence customers. At 19, he became the youngest self-made billionaire in the world. He previously worked at Quora and Hudson River Trading, and studied computer science at MIT.',
      photo_url: '/images/speakers/wang.jpg'
    },
    // --- 13. Finnish Quantum / IQM ---
    {
      name: 'Dr. Jan Goetz',
      title: 'Co-Founder & Chief Executive Officer',
      organization: 'IQM Quantum Computers',
      bio: 'Dr. Jan Goetz is co-founder and CEO of IQM, Europe\'s leading superconducting quantum computer manufacturer headquartered in Espoo, Finland. IQM has delivered quantum processors to defence research laboratories in Finland, Germany, and Spain, and is building Europe\'s first 150-qubit quantum computer in partnership with VTT Technical Research Centre. He leads IQM\'s defence-focused quantum computing initiatives, including quantum optimization for military logistics and quantum machine learning for threat detection. He holds a PhD from the Technical University of Munich and Walther-Meissner-Institut.',
      photo_url: '/images/speakers/goetz.jpg'
    },
    // --- 14. Think Tank / Policy ---
    {
      name: 'Dr. Andrea Renda',
      title: 'Senior Research Fellow & Head of Global Governance',
      organization: 'Centre for European Policy Studies (CEPS)',
      bio: 'Dr. Andrea Renda is Senior Research Fellow and Head of Global Governance, Regulation, Innovation and the Digital Economy at CEPS, one of Europe\'s most influential think tanks based in Brussels. He advises the European Commission, NATO, and national governments on technology governance, autonomous weapons policy, and the ethical framework for AI in defence. He has authored landmark reports on AI regulation and digital sovereignty for the European Parliament. He holds a PhD from Erasmus University Rotterdam and teaches at several European universities.',
      photo_url: '/images/speakers/renda.jpg'
    },
    // --- 15. Quantum Sensing ---
    {
      name: 'Dr. Anna-Lena Braun',
      title: 'Head of Quantum Sensing for Defence Applications',
      organization: 'Fraunhofer Institute IOSB',
      bio: 'Dr. Anna-Lena Braun leads the Quantum Sensing for Defence Applications group at Fraunhofer IOSB in Ettlingen, Germany. Her team develops quantum magnetometers and gravimeters for submarine detection, underground mapping, and navigation in GPS-denied environments. Her recent work on deployable quantum inertial navigation units has been adopted by the German Bundeswehr for field trials. She holds a PhD from the Max Planck Institute for Quantum Optics and has received the German Innovation Prize for Defence Technology.',
      photo_url: '/images/speakers/braun.jpg'
    },
    // --- 16. Cybersecurity - Palo Alto ---
    {
      name: 'Nikesh Arora',
      title: 'Chairman & Chief Executive Officer',
      organization: 'Palo Alto Networks',
      bio: 'Nikesh Arora is Chairman and CEO of Palo Alto Networks, the world\'s largest pure-play cybersecurity company. Under his leadership, Palo Alto has expanded into quantum-safe network security, securing critical infrastructure for defence ministries across NATO nations. He drives the company\'s vision of AI-powered, quantum-resilient security operations centers. Before Palo Alto, he served as President and COO of SoftBank Group and as Chief Business Officer of Google. He holds a degree from IIT Varanasi and an MBA from Northeastern University.',
      photo_url: '/images/speakers/arora.jpg'
    },
    // --- 17. Rheinmetall ---
    {
      name: 'Oliver Brauner',
      title: 'Head of Advanced Technology & Innovation',
      organization: 'Rheinmetall AG',
      bio: 'Oliver Brauner leads Advanced Technology and Innovation at Rheinmetall AG, Europe\'s largest listed defence company. He oversees the integration of quantum-enhanced sensors into armored vehicle platforms, AI-driven autonomous systems for land forces, and quantum-secure tactical communications for the German and allied armed forces. He has spearheaded Rheinmetall\'s partnerships with quantum startups and research institutions across Europe. An engineer by training, he previously served in leadership roles at MBDA and Diehl Defence.',
      photo_url: '/images/speakers/brauner.jpg'
    }
  ];

  const speakerIds = [];
  for (const s of speakers) {
    const result = insertSpeaker.run(s.name, s.title, s.organization, s.bio, s.photo_url);
    speakerIds.push(result.lastInsertRowid);
    console.log(`  Speaker created: ${s.name}`);
  }
  console.log('');

  // Map speaker indices for readability
  const SP = {
    DE_VILLIERS:  speakerIds[0],   // Gen. Philippe de Villiers - NATO SACT
    BACKES:       speakerIds[1],   // Yuriko Backes - Luxembourg MOD
    BRETON:       speakerIds[2],   // Thierry Breton - European Commission
    PAN:          speakerIds[3],   // Prof. Jian-Wei Pan - Quantum academia
    GAMBETTA:     speakerIds[4],   // Dr. Jay Gambetta - IBM Quantum
    HENRIET:      speakerIds[5],   // Dr. Loic Henriet - Pasqal
    KURTZ:        speakerIds[6],   // George Kurtz - CrowdStrike
    ERMAN:        speakerIds[7],   // Dr. Marko Erman - Thales
    KLAUKE:       speakerIds[8],   // Sabine Klauke - Airbus Defence
    PARKIN:       speakerIds[9],   // Rear Adm. James Parkin - UK MOD
    MOODY:        speakerIds[10],  // Dr. Dustin Moody - NIST
    WANG:         speakerIds[11],  // Dr. Alexandr Wang - Scale AI
    GOETZ:        speakerIds[12],  // Dr. Jan Goetz - IQM
    RENDA:        speakerIds[13],  // Dr. Andrea Renda - CEPS
    BRAUN:        speakerIds[14],  // Dr. Anna-Lena Braun - Fraunhofer
    ARORA:        speakerIds[15],  // Nikesh Arora - Palo Alto Networks
    BRAUNER:      speakerIds[16],  // Oliver Brauner - Rheinmetall
  };

  // ------------------------------------------------------------------
  // 3. Sessions (Full-day programme, November 25, 2026 at Maison du Savoir)
  // ------------------------------------------------------------------
  console.log('Creating conference programme...');

  const insertSession = db.prepare(`
    INSERT INTO sessions (title, description, type, start_time, end_time, speaker_ids, tags, location)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const sessions = [
    // ==================== MORNING ====================
    {
      title: 'Registration & Welcome Coffee',
      description: 'Attendee registration, badge collection, and networking over coffee, Luxembourg pastries, and fresh juices in the Maison du Savoir grand foyer. Exhibition stands open for early viewing, featuring live demos from quantum technology startups and defence industry leaders. Complimentary copies of the Q-DEF Programme and the "State of Quantum Defence 2026" white paper available at the registration desk.',
      type: 'break',
      start_time: '2026-11-25T08:00:00',
      end_time: '2026-11-25T09:00:00',
      speaker_ids: [],
      tags: 'registration,networking',
      location: 'Maison du Savoir - Hall Principal'
    },
    {
      title: 'Opening Ceremony',
      description: 'Official opening of the inaugural Q-DEF Conference Luxembourg 2026. The Luxembourg Minister of Defence welcomes delegates from 30+ nations and outlines the Grand Duchy\'s vision for quantum defence leadership in Europe. The ceremony includes the unveiling of the Q-DEF Charter for Quantum-Safe Defence Cooperation and a moment of recognition for pioneers in European quantum technology.',
      type: 'keynote',
      start_time: '2026-11-25T09:00:00',
      end_time: '2026-11-25T09:20:00',
      speaker_ids: [SP.BACKES],
      tags: 'opening,policy,defense,Luxembourg',
      location: 'Main Stage - Salle Robert Schuman'
    },
    {
      title: 'Opening Keynote: The Quantum Threat Horizon',
      description: 'When will quantum computers break current encryption? What does that mean for national security? In this opening keynote, NATO\'s Supreme Allied Commander Transformation presents the Alliance\'s assessment of the quantum threat timeline, drawing on classified intelligence briefings and cutting-edge research. He outlines the "harvest now, decrypt later" threat to allied communications, the projected timelines for cryptographically relevant quantum computers, and NATO\'s multi-layered quantum defence strategy. This is the definitive briefing on where we stand and what must happen next.',
      type: 'keynote',
      start_time: '2026-11-25T09:20:00',
      end_time: '2026-11-25T10:00:00',
      speaker_ids: [SP.DE_VILLIERS],
      tags: 'quantum,defense,NATO,cryptography,threat',
      location: 'Main Stage - Salle Robert Schuman'
    },
    {
      title: 'Keynote: AI-Powered Defence — From Strategy to Battlefield',
      description: 'Artificial intelligence is transforming every domain of warfare, from intelligence analysis and autonomous systems to logistics and cyber operations. This keynote explores how AI and quantum computing converge to create a new paradigm of defence capability. Drawing on real-world deployments with the US DOD and allied forces, the speaker presents case studies of AI-powered ISR (Intelligence, Surveillance, Reconnaissance), predictive maintenance for military platforms, and the role of foundation models in defence decision-making. The talk concludes with a vision of how quantum machine learning could provide decisive advantages in the 2030s.',
      type: 'keynote',
      start_time: '2026-11-25T10:00:00',
      end_time: '2026-11-25T10:40:00',
      speaker_ids: [SP.WANG],
      tags: 'AI,defense,autonomous,quantum,innovation',
      location: 'Main Stage - Salle Robert Schuman'
    },
    {
      title: 'Coffee Break & Networking',
      description: 'Mid-morning refreshment break. Coffee, tea, and pastries served in the foyer. Visit the 20+ exhibition stands featuring quantum hardware, cybersecurity solutions, and defence technology demonstrators. Dedicated "Meet the Speaker" corners for informal Q&A with morning keynote presenters.',
      type: 'break',
      start_time: '2026-11-25T10:40:00',
      end_time: '2026-11-25T11:10:00',
      speaker_ids: [],
      tags: 'break,networking',
      location: 'Maison du Savoir - Hall Principal & Exhibition Hall'
    },

    // ==================== MID-MORNING (PARALLEL SESSIONS) ====================
    {
      title: 'Panel: Post-Quantum Cryptography — Securing NATO\'s Future',
      description: 'With NIST\'s post-quantum cryptographic standards now finalized, the race to migrate is on. But how do you overhaul the encryption underpinning an alliance of 32 nations? This high-level panel brings together the architect of NIST\'s PQC standards, NATO\'s quantum readiness lead, the UK\'s quantum programme director, and Thales\'s CTO to debate the practical challenges of PQC migration at scale. Topics include: hybrid classical-PQC transition strategies, interoperability across alliance members, the cost of quantum-safe migration for legacy systems, and the timeline pressure of "Q-Day." Moderated audience Q&A included.',
      type: 'panel',
      start_time: '2026-11-25T11:10:00',
      end_time: '2026-11-25T12:00:00',
      speaker_ids: [SP.MOODY, SP.DE_VILLIERS, SP.PARKIN, SP.ERMAN],
      tags: 'quantum,cryptography,NATO,policy,defense',
      location: 'Main Stage - Salle Robert Schuman'
    },
    {
      title: 'Workshop: Hands-on Quantum Computing for Defence Applications',
      description: 'A practitioner-focused workshop for defence engineers, analysts, and technical officers. Participants will use IBM Qiskit and IQM\'s quantum cloud to run quantum algorithms relevant to defence: quantum optimization for supply chain logistics, quantum simulation for materials science (armor and propellant chemistry), and variational quantum eigensolvers for electronic warfare signal processing. Laptops required. No prior quantum programming experience necessary — the workshop begins with a 15-minute accelerated primer on quantum gates and circuits. Limited to 60 participants; first-come, first-served.',
      type: 'workshop',
      start_time: '2026-11-25T11:10:00',
      end_time: '2026-11-25T12:00:00',
      speaker_ids: [SP.GAMBETTA, SP.GOETZ],
      tags: 'quantum,workshop,innovation,defense',
      location: 'Innovation Lab - Room 2.01'
    },
    {
      title: 'Fireside Chat: Europe\'s Digital Sovereignty in the Quantum Age',
      description: 'An intimate and candid conversation between the European Commission\'s tech sovereignty chief and Airbus Defence\'s CTO on the future of European technological independence. They discuss the EuroQCI satellite constellation, Europe\'s quantum computing supply chain, the risk of dependence on non-European quantum hardware, and how the EU can maintain strategic autonomy while collaborating with allies. The format encourages personal reflections, policy disagreements, and bold predictions for Europe\'s quantum future. Audience questions via live polling.',
      type: 'fireside',
      start_time: '2026-11-25T12:00:00',
      end_time: '2026-11-25T12:40:00',
      speaker_ids: [SP.BRETON, SP.KLAUKE],
      tags: 'policy,defense,innovation,quantum,EU',
      location: 'Main Stage - Salle Robert Schuman'
    },

    // ==================== LUNCH ====================
    {
      title: 'Lunch & Exhibition',
      description: 'Gourmet buffet lunch featuring Luxembourg and European cuisine, with vegetarian, vegan, halal, and gluten-free options. Exhibition hall remains open with scheduled demos on the hour: Thales QKD hardware demo (13:00), IQM live quantum processor link (13:20), CrowdStrike AI-SOC demonstration (13:40). Dedicated networking tables organized by theme: Quantum Hardware, Cybersecurity, Defence Policy, and Startup & Innovation.',
      type: 'break',
      start_time: '2026-11-25T12:40:00',
      end_time: '2026-11-25T14:00:00',
      speaker_ids: [],
      tags: 'lunch,networking,exhibition',
      location: 'Maison du Savoir - Espace Restauration & Exhibition Hall'
    },

    // ==================== AFTERNOON TRACK 1 (MAIN STAGE) ====================
    {
      title: 'Keynote: Quantum Sensing & Navigation for Military Operations',
      description: 'Quantum sensors are transitioning from the laboratory to the battlefield. This keynote presents the latest advances in quantum magnetometry for submarine and underground facility detection, quantum gravimetry for terrain mapping and tunnel identification, and quantum inertial navigation systems that maintain precision in GPS-denied and jammed environments. Dr. Braun shares field trial results from recent NATO exercises, including a live quantum magnetometer that detected a submerged test platform at 200m depth. She outlines the roadmap to field-deployable quantum sensor suites for land, sea, and air platforms by 2030.',
      type: 'keynote',
      start_time: '2026-11-25T14:00:00',
      end_time: '2026-11-25T14:40:00',
      speaker_ids: [SP.BRAUN],
      tags: 'quantum,defense,sensing,navigation,innovation',
      location: 'Main Stage - Salle Robert Schuman'
    },
    {
      title: 'Panel: Cyber Warfare 2030 — Threats, Actors, and Quantum Defences',
      description: 'A sobering look at the cyber threat landscape of the near future. Panellists from CrowdStrike, Palo Alto Networks, Rheinmetall, and the UK MOD dissect the evolving tactics of state-sponsored cyber actors, the convergence of AI and cyber weapons, the coming quantum decryption threat to critical infrastructure, and how quantum-safe architectures can harden defence networks. The panel includes real-world case studies of APT campaigns against European defence contractors and intelligence on adversary quantum computing programmes. Expect frank assessments and uncomfortable truths.',
      type: 'panel',
      start_time: '2026-11-25T14:40:00',
      end_time: '2026-11-25T15:20:00',
      speaker_ids: [SP.KURTZ, SP.ARORA, SP.BRAUNER, SP.PARKIN],
      tags: 'cybersecurity,defense,quantum,threat,NATO',
      location: 'Main Stage - Salle Robert Schuman'
    },

    // ==================== AFTERNOON TRACK 2 (INNOVATION STAGE) ====================
    {
      title: 'Startup Showcase: Quantum Security Innovations',
      description: 'Three of Europe\'s most promising quantum security startups take the stage for rapid-fire pitches followed by expert Q&A. Featuring: (1) Pasqal — neutral-atom quantum computing for defence simulation and optimization; (2) IQM — superconducting quantum processors purpose-built for European sovereignty; (3) A surprise third presenter from the Q-DEF Startup Competition. Each startup gets 10 minutes to present, followed by 5 minutes of questions from a panel including Thales CTO and Airbus Defence CTO. The audience votes for the "Q-DEF Innovation Award" winner, announced at the closing ceremony.',
      type: 'presentation',
      start_time: '2026-11-25T14:00:00',
      end_time: '2026-11-25T14:40:00',
      speaker_ids: [SP.HENRIET, SP.GOETZ, SP.ERMAN, SP.KLAUKE],
      tags: 'innovation,quantum,startup,defense',
      location: 'Innovation Stage - Salle Jean Monnet'
    },
    {
      title: 'Building Quantum-Safe Infrastructure: Lessons from the Field',
      description: 'A deeply technical presentation on the real-world challenges of deploying quantum-safe cryptography and quantum key distribution in operational networks. Dr. Moody shares lessons from NIST\'s algorithm selection process and the unexpected implementation pitfalls discovered during early migrations. Dr. Erman complements with Thales\'s experience deploying QKD in French government networks and EuroQCI nodes, including key management at scale, fiber vs. satellite trade-offs, latency impact on operational systems, and the hybrid classical-quantum transition architecture. Includes a live comparison of classical TLS, hybrid PQC-TLS, and QKD-secured channels.',
      type: 'presentation',
      start_time: '2026-11-25T14:40:00',
      end_time: '2026-11-25T15:20:00',
      speaker_ids: [SP.MOODY, SP.ERMAN],
      tags: 'quantum,cryptography,infrastructure,innovation',
      location: 'Innovation Stage - Salle Jean Monnet'
    },

    // ==================== AFTERNOON COFFEE ====================
    {
      title: 'Coffee Break & Networking',
      description: 'Afternoon refreshment break with specialty Luxembourg coffee and regional treats. Last opportunity to visit exhibition stands and collect materials. Speed-networking session organized in the main foyer — 3-minute structured introductions for delegates who want to expand their professional network.',
      type: 'break',
      start_time: '2026-11-25T15:20:00',
      end_time: '2026-11-25T15:50:00',
      speaker_ids: [],
      tags: 'break,networking',
      location: 'Maison du Savoir - Hall Principal & Exhibition Hall'
    },

    // ==================== LATE AFTERNOON (PARALLEL SESSIONS) ====================
    {
      title: 'Panel: The Ethics of Autonomous Defence Systems',
      description: 'As AI-driven autonomous weapons move from concept to deployment, fundamental ethical questions demand answers. Should a machine decide to use lethal force? How do we maintain meaningful human control? What are the legal implications under international humanitarian law? This panel brings together Scale AI\'s CEO, a leading European policy ethicist, Airbus Defence\'s CTO, and NATO\'s transformation commander for a rigorous debate on the moral, legal, and strategic dimensions of autonomy in warfare. Expect diverse perspectives — from Silicon Valley pragmatism to European precautionary principles to military operational realities.',
      type: 'panel',
      start_time: '2026-11-25T15:50:00',
      end_time: '2026-11-25T16:30:00',
      speaker_ids: [SP.WANG, SP.RENDA, SP.KLAUKE, SP.DE_VILLIERS],
      tags: 'AI,defense,policy,ethics,autonomous',
      location: 'Main Stage - Salle Robert Schuman'
    },
    {
      title: 'Workshop: Quantum Key Distribution — Live Demonstration',
      description: 'A hands-on demonstration of quantum key distribution technology in action. Thales engineers set up a live QKD link between two nodes in the Maison du Savoir, demonstrating real-time quantum key exchange over fiber optic cable. Participants observe the quantum channel, monitor the key rate, and witness how eavesdropping attempts are detected and mitigated by the laws of quantum physics. The workshop includes a walkthrough of the Thales Cyris QKD platform, integration with classical network encryption, and a discussion of satellite-based QKD for intercontinental defence communications. Suitable for both technical and non-technical attendees.',
      type: 'workshop',
      start_time: '2026-11-25T15:50:00',
      end_time: '2026-11-25T16:30:00',
      speaker_ids: [SP.ERMAN, SP.PAN],
      tags: 'quantum,cryptography,workshop,defense,QKD',
      location: 'Innovation Lab - Room 2.01'
    },
    {
      title: 'Keynote: Luxembourg as Europe\'s Cybersecurity Hub',
      description: 'Luxembourg has quietly become one of Europe\'s most important cybersecurity and digital trust centres. This closing keynote by the European Commission\'s tech sovereignty lead explores how the Grand Duchy\'s unique position — home to EU institutions, a thriving fintech sector, world-class data centres, and now the LuxQCI quantum communication infrastructure — makes it the natural hub for European quantum defence cooperation. The talk charts Luxembourg\'s journey from steel to satellites to quantum, and presents the vision for a European Quantum Defence Coordination Centre headquartered in the Grand Duchy.',
      type: 'keynote',
      start_time: '2026-11-25T16:30:00',
      end_time: '2026-11-25T17:10:00',
      speaker_ids: [SP.BRETON],
      tags: 'policy,cybersecurity,Luxembourg,EU,innovation',
      location: 'Main Stage - Salle Robert Schuman'
    },
    {
      title: 'Closing Ceremony & Q-DEF Innovation Award',
      description: 'The official closing of Q-DEF 2026. The Luxembourg Minister of Defence and NATO SACT deliver joint closing remarks summarizing the day\'s key insights and calls to action. Highlights include: announcement of the Q-DEF Innovation Award winner (voted by audience during the Startup Showcase), signing of the Q-DEF Quantum Defence Cooperation MOU by participating nations, and the reveal of Q-DEF 2027 dates and location. A moment of collective commitment to securing the Alliance\'s quantum future.',
      type: 'keynote',
      start_time: '2026-11-25T17:10:00',
      end_time: '2026-11-25T17:40:00',
      speaker_ids: [SP.BACKES, SP.DE_VILLIERS],
      tags: 'closing,defense,NATO,awards',
      location: 'Main Stage - Salle Robert Schuman'
    },
    {
      title: 'Networking Reception & Cocktail',
      description: 'The day concludes with an exclusive cocktail reception on the Maison du Savoir\'s panoramic terrace overlooking Luxembourg City and the Kirchberg plateau. Champagne, Crémant de Luxembourg, craft cocktails, and a curated selection of Luxembourg and European canapés. Live jazz quartet. This is the premier networking opportunity of the event — an informal setting for speakers, delegates, defence attachés, startup founders, and exhibitors to forge partnerships and continue the day\'s conversations. Dress code: business or smart casual.',
      type: 'break',
      start_time: '2026-11-25T17:40:00',
      end_time: '2026-11-25T19:00:00',
      speaker_ids: [],
      tags: 'reception,networking,cocktail',
      location: 'Maison du Savoir - Terrasse'
    }
  ];

  for (const s of sessions) {
    insertSession.run(
      s.title, s.description, s.type, s.start_time, s.end_time,
      JSON.stringify(s.speaker_ids), s.tags, s.location
    );
    console.log(`  Session created: ${s.start_time.slice(11, 16)} - ${s.end_time.slice(11, 16)} | [${s.type.toUpperCase()}] ${s.title}`);
  }
  console.log('');

  // ------------------------------------------------------------------
  // 4. Pages
  // ------------------------------------------------------------------
  console.log('Creating pages...');

  const insertPage = db.prepare(`
    INSERT OR REPLACE INTO pages (slug, title, content, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
  `);

  const pages = [
    {
      slug: 'home',
      title: 'Q-DEF Conference Luxembourg 2026',
      content: JSON.stringify({
        hero: {
          headline: 'Q-DEF 2026',
          subheadline: 'Quantum Defense & Emerging Technologies',
          tagline: 'Where quantum science meets defence strategy',
          date: 'November 25, 2026',
          location: 'Maison du Savoir, Esch-sur-Alzette',
          cta_primary: 'Register Now',
          cta_secondary: 'View Programme'
        },
        introduction: 'The inaugural Q-DEF Conference brings together the world\'s foremost leaders in quantum computing, post-quantum cryptography, artificial intelligence, and defence policy for one intensive day of keynotes, panels, workshops, and high-level networking. Held at the iconic Maison du Savoir on Luxembourg\'s Kirchberg plateau — surrounded by the institutions of the European Union — Q-DEF 2026 is where the quantum defence community comes together to shape the security architecture of tomorrow.',
        highlights: [
          'Keynotes from NATO SACT, European Commission, and world-leading quantum researchers',
          'Panels on post-quantum cryptography, cyber warfare 2030, and autonomous systems ethics',
          'Hands-on workshops: quantum computing for defence and live QKD demonstration',
          'Startup Showcase with audience-voted Q-DEF Innovation Award',
          'Fireside Chat on Europe\'s digital sovereignty with EU and Airbus leaders',
          'Exhibition hall with 20+ quantum technology and cybersecurity companies',
          'Networking reception with 300+ defence, government, and industry professionals',
          'Launch of the Q-DEF Quantum Defence Cooperation Charter'
        ],
        themes: [
          { icon: 'shield-lock', title: 'Post-Quantum Cryptography', description: 'Migrating defence systems to quantum-safe encryption' },
          { icon: 'cpu', title: 'Quantum Computing', description: 'Harnessing quantum advantage for defence applications' },
          { icon: 'radar', title: 'Quantum Sensing', description: 'Revolutionary sensors for land, sea, and air operations' },
          { icon: 'brain-circuit', title: 'AI & Autonomy', description: 'AI-powered defence systems and ethical frameworks' },
          { icon: 'globe-lock', title: 'Cyber Defence', description: 'Quantum-resilient cybersecurity architectures' },
          { icon: 'landmark', title: 'Policy & Sovereignty', description: 'European digital sovereignty and defence cooperation' }
        ],
        stats: {
          speakers: '17+',
          sessions: '20+',
          countries: '30+',
          attendees: '300+'
        },
        partners: {
          organizers: ['Luxembourg Ministry of Defence', 'University of Luxembourg SnT', 'European Defence Agency'],
          platinum_sponsors: ['Thales', 'Airbus Defence and Space', 'IBM Quantum'],
          gold_sponsors: ['CrowdStrike', 'Palo Alto Networks', 'Rheinmetall', 'IQM', 'Pasqal'],
          institutional: ['NATO', 'European Commission', 'NIST']
        }
      })
    },
    {
      slug: 'about',
      title: 'About Q-DEF',
      content: JSON.stringify({
        mission: 'The Q-DEF Conference (Quantum Defense & Emerging Technologies) is an annual summit dedicated to accelerating the understanding, development, and deployment of quantum technologies in the defence and security sector. Our mission is to bridge the gap between cutting-edge quantum research and operational defence capabilities, while fostering the cross-border cooperation essential to collective security in the quantum age.',
        background: 'The quantum revolution is not a distant prospect — it is happening now. Quantum computers are rapidly approaching the scale needed to break the encryption protecting classified military communications, intelligence databases, and critical infrastructure. Simultaneously, quantum technologies offer transformative capabilities in sensing, navigation, and computation that can provide decisive strategic advantages to those who master them first. The "harvest now, decrypt later" threat means that adversaries are already collecting encrypted data today to decrypt with future quantum computers. The window to act is closing. Q-DEF exists to ensure that the democratic world is prepared.',
        why_luxembourg: 'Luxembourg is uniquely positioned at the crossroads of European defence, technology, and policy. Despite its compact size, the Grand Duchy hosts key EU institutions (European Court of Justice, European Investment Bank, Eurostat), a thriving cybersecurity ecosystem anchored by institutions like the Luxembourg House of Cybersecurity (LHC) and CIRCL, and is actively building its national Quantum Communication Infrastructure (LuxQCI) as part of the EU\'s EuroQCI initiative. Luxembourg\'s multilingual, multinational character and its tradition of quiet diplomacy make it the ideal convening point for sensitive discussions at the intersection of technology and security.',
        venue_note: 'The Maison du Savoir, Esch-sur-Alzette on the Kirchberg plateau provides a world-class, secure venue surrounded by EU institutions — the perfect setting for a conference that bridges quantum science and defence policy.',
        organisers: {
          lead: 'Luxembourg Ministry of Defence — Digital Transformation & Cybersecurity Division',
          academic: 'University of Luxembourg — Interdisciplinary Centre for Security, Reliability and Trust (SnT)',
          eu: 'European Defence Agency (EDA) — Technology and Innovation Directorate',
          supporting: 'NATO Emerging and Disruptive Technologies (EDT) Division'
        },
        advisory_board: [
          'Gen. Philippe de Villiers — NATO SACT',
          'Thierry Breton — European Commission',
          'Prof. Jian-Wei Pan — University of Luxembourg / ETH Zurich',
          'Dr. Jay Gambetta — IBM Quantum',
          'George Kurtz — CrowdStrike'
        ],
        previous_editions: 'Q-DEF 2026 is the inaugural edition of this conference series. We aim to establish Q-DEF as the premier European event at the intersection of quantum technology, artificial intelligence, and defence — a VivaTech for the security community.',
        code_of_conduct: 'Q-DEF is committed to providing a safe, respectful, and inclusive environment for all participants regardless of nationality, rank, gender, ethnicity, or affiliation. All attendees, speakers, sponsors, and staff are required to adhere to our Code of Conduct. Q-DEF operates under Chatham House Rule unless otherwise specified for specific sessions.'
      })
    },
    {
      slug: 'venue',
      title: 'Venue — Maison du Savoir Luxembourg',
      content: JSON.stringify({
        name: 'Maison du Savoir, Esch-sur-Alzette',
        address: '4 Place de l\'Europe, L-1499 Luxembourg-Kirchberg',
        description: 'The Maison du Savoir is Luxembourg\'s premier conference venue, situated in the heart of the Kirchberg European quarter. This architectural landmark features state-of-the-art conference facilities, panoramic views of Luxembourg City, and is surrounded by the institutions of the European Union. The venue regularly hosts European Council presidencies, NATO ministerial meetings, and high-level international summits, making it ideally suited for the sensitive and high-profile nature of the Q-DEF Conference.',
        spaces: [
          { name: 'Main Stage — Salle Robert Schuman', capacity: '800 seats', description: 'The flagship auditorium hosting keynotes, panels, and ceremonies' },
          { name: 'Innovation Stage — Salle Jean Monnet', capacity: '250 seats', description: 'Parallel track for startup showcases and technical presentations' },
          { name: 'Innovation Lab — Room 2.01', capacity: '60 seats', description: 'Hands-on workshop space with full AV and network infrastructure' },
          { name: 'Exhibition Hall', capacity: '20+ stands', description: 'Ground-floor exhibition area for quantum technology and cybersecurity companies' },
          { name: 'Maison du Savoir - Hall Principal', capacity: '300+ standing', description: 'Registration, coffee breaks, and speed-networking area' },
          { name: 'Panoramic Terrace', capacity: '300 standing', description: 'Rooftop terrace for the evening networking reception with city views' },
          { name: 'Maison du Savoir - Espace Restauration', capacity: '400 seated', description: 'Buffet lunch with themed networking tables' }
        ],
        facilities: [
          'State-of-the-art AV systems with LED walls and broadcast-quality cameras',
          'Simultaneous interpretation booths (EN/FR/DE/LU)',
          'High-speed dedicated WiFi (1 Gbps symmetric)',
          'Full catering with vegetarian, vegan, halal, kosher, and gluten-free options',
          'Dedicated press room and media centre',
          'VIP lounge for speakers and ministerial delegations',
          'On-site security coordination with Luxembourg Police Grand-Ducale',
          'Accessibility: fully wheelchair accessible, hearing loops, sign language on request'
        ],
        getting_there: {
          by_air: 'Luxembourg Findel Airport (LUX) is 8 km from the venue — approximately 15 minutes by taxi (€30) or 25 minutes by bus (Line 16). Direct flights from London, Paris, Frankfurt, Munich, Amsterdam, Zurich, and many other European cities.',
          by_train: 'Luxembourg Gare Centrale is connected to Paris (TGV, 2h10), Brussels (IC, 2h50), Frankfurt (IC, 3h30), and Metz/Strasbourg (TER, <1h). From the station, take Tram T1 directly to Kirchberg (12 minutes).',
          by_tram: 'Tram Line T1 to Philharmonie/MUDAM stop, then 4-minute walk to the Maison du Savoir. Trams run every 4 minutes during peak hours. All public transport in Luxembourg is free.',
          by_car: 'The Maison du Savoir has underground parking (600 spaces). GPS: 49.6188°N, 6.1432°E. From the A1/A6 motorways, follow signs to Kirchberg/European Institutions.',
          shuttle: 'Complimentary Q-DEF shuttle buses will run between Luxembourg Findel Airport, Gare Centrale, and the Maison du Savoir on the morning and evening of the conference.'
        },
        accommodation: {
          description: 'Several hotels are within walking distance of the Maison du Savoir. Q-DEF has negotiated preferential rates at the following partner hotels:',
          hotels: [
            { name: 'Meliá Luxembourg', distance: '5 min walk', stars: 4 },
            { name: 'Novotel Luxembourg Kirchberg', distance: '8 min walk', stars: 4 },
            { name: 'Hotel Parc Belle-Vue', distance: '12 min walk', stars: 4 },
            { name: 'Sofitel Luxembourg Le Grand Ducal', distance: '15 min by tram', stars: 5 },
            { name: 'Hotel Le Royal', distance: '15 min by tram', stars: 5 }
          ]
        },
        map_embed_url: 'https://www.openstreetmap.org/export/embed.html?bbox=6.135%2C49.615%2C6.150%2C49.622&layer=mapnik&marker=49.6188%2C6.1432'
      })
    }
  ];

  for (const p of pages) {
    insertPage.run(p.slug, p.title, p.content);
    console.log(`  Page created: ${p.slug}`);
  }

  // ------------------------------------------------------------------
  // 5. Site Config
  // ------------------------------------------------------------------
  console.log('\nCreating site config...');

  const upsertConfig = db.prepare(`
    INSERT OR REPLACE INTO config (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
  `);

  const configEntries = {
    event_name: 'Q-DEF 2026',
    event_full_name: 'Quantum Defense & Emerging Technologies Summit',
    event_tagline: 'Where quantum science meets defence strategy',
    event_date: 'November 25, 2026',
    event_date_iso: '2026-11-25',
    countdown_target: '2026-11-25T09:00:00+01:00',
    event_location: 'Maison du Savoir, Esch-sur-Alzette, Luxembourg',
    event_address: '2 avenue de l\'Université, 4365 Esch-sur-Alzette',
    contact_email: 'info@qdef-conference.lu',
    contact_phone: '+352 123 456 789',
    ticket_url: '',
    social_linkedin: '',
    social_twitter: '',
    hero_headline: 'The summit shaping quantum defense.',
    hero_subtitle: '300+ leaders in cybersecurity, quantum computing, and defense gather at Maison du Savoir, Esch-sur-Alzette.',
    hero_cta_primary: 'Attend the Event',
    hero_cta_secondary: 'Programme',
    stats_attendees: '300+',
    stats_speakers: '17',
    stats_sessions: '19',
    stats_tracks: '6',
    stats_nations: '15+',
    footer_text: 'Q-DEF Conference Luxembourg. All rights reserved.',
  };

  for (const [key, value] of Object.entries(configEntries)) {
    upsertConfig.run(key, value);
  }
  console.log(`  ${Object.keys(configEntries).length} config entries created`);

  // ------------------------------------------------------------------
  // 6. Sponsors / Partners
  // ------------------------------------------------------------------
  console.log('\nCreating sponsors...');

  db.prepare('DELETE FROM sponsors').run();

  const insertSponsor = db.prepare(`
    INSERT INTO sponsors (name, tier, logo_url, website_url, description, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const sponsorsList = [
    { name: 'Luxembourg Ministry of Defence', tier: 'organizer', description: 'Lead organizer', sort_order: 1 },
    { name: 'University of Luxembourg SnT', tier: 'organizer', description: 'Academic partner', sort_order: 2 },
    { name: 'European Defence Agency', tier: 'organizer', description: 'EU defence partner', sort_order: 3 },
    { name: 'Thales', tier: 'platinum', description: 'Cybersecurity, defense electronics & quantum-safe encryption', sort_order: 1 },
    { name: 'Airbus Defence and Space', tier: 'platinum', description: 'Satellite communications & secure defense systems', sort_order: 2 },
    { name: 'IBM Quantum', tier: 'platinum', description: 'Quantum computing platforms & enterprise solutions', sort_order: 3 },
    { name: 'CrowdStrike', tier: 'gold', description: 'AI-native cybersecurity & threat intelligence platform', sort_order: 1 },
    { name: 'Palo Alto Networks', tier: 'gold', description: 'Next-gen firewalls & zero trust security architecture', sort_order: 2 },
    { name: 'Rheinmetall', tier: 'gold', description: 'Defense technology, electronics & autonomous systems', sort_order: 3 },
    { name: 'IQM', tier: 'gold', description: 'European quantum computers for research & industry', sort_order: 4 },
    { name: 'Pasqal', tier: 'gold', description: 'Neutral atom quantum processors for defense applications', sort_order: 5 },
    { name: 'NATO', tier: 'institutional', description: 'North Atlantic Treaty Organization', sort_order: 1 },
    { name: 'European Commission', tier: 'institutional', description: 'EU policy & technology sovereignty', sort_order: 2 },
    { name: 'NIST', tier: 'institutional', description: 'National Institute of Standards and Technology', sort_order: 3 },
  ];

  for (const s of sponsorsList) {
    insertSponsor.run(s.name, s.tier, s.logo_url || null, s.website_url || null, s.description || null, s.sort_order || 0);
    console.log(`  Sponsor created: [${s.tier.toUpperCase()}] ${s.name}`);
  }

  // ------------------------------------------------------------------
  // 7. Exhibition Stands
  // ------------------------------------------------------------------
  console.log('\nCreating exhibition stands...');

  db.prepare('DELETE FROM exhibitions').run();

  const insertExhibition = db.prepare(`
    INSERT INTO exhibitions (name, description, image_url, tag, website_url, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const exhibitionsList = [
    { name: 'IBM Quantum', description: 'Quantum computing platforms & enterprise solutions', tag: 'Quantum Computing', sort_order: 1 },
    { name: 'Thales', description: 'Cybersecurity, defense electronics & quantum-safe encryption', tag: 'Defense', sort_order: 2 },
    { name: 'Pasqal', description: 'Neutral atom quantum processors for defense applications', tag: 'Quantum Hardware', sort_order: 3 },
    { name: 'CrowdStrike', description: 'AI-native cybersecurity & threat intelligence platform', tag: 'Cybersecurity', sort_order: 4 },
    { name: 'Airbus Defence', description: 'Satellite communications & secure defense systems', tag: 'Aerospace', sort_order: 5 },
    { name: 'IQM', description: 'European quantum computers for research & industry', tag: 'Quantum Hardware', sort_order: 6 },
    { name: 'Palo Alto Networks', description: 'Next-gen firewalls & zero trust security architecture', tag: 'Cybersecurity', sort_order: 7 },
    { name: 'Rheinmetall', description: 'Defense technology, electronics & autonomous systems', tag: 'Defense Tech', sort_order: 8 },
    { name: 'QuSecure', description: 'Post-quantum cryptography solutions for enterprises', tag: 'PQC', sort_order: 9 },
    { name: 'Scale AI', description: 'AI data platform for defense & intelligence applications', tag: 'AI & Defense', sort_order: 10 },
    { name: 'LuxProvide', description: "Luxembourg's HPC & quantum computing national center", tag: 'HPC', sort_order: 11 },
    { name: 'Leonardo', description: 'Defense, security, aerospace electronics & cyber systems', tag: 'Defense', sort_order: 12 },
  ];

  for (const e of exhibitionsList) {
    insertExhibition.run(e.name, e.description, e.image_url || null, e.tag, e.website_url || null, e.sort_order);
    console.log(`  Exhibition created: ${e.name}`);
  }

  console.log('\n========================================');
  console.log(' Q-DEF 2026 seed complete!');
  console.log('========================================');
  console.log(`  ${speakers.length} speakers created`);
  console.log(`  ${sessions.length} sessions created`);
  console.log(`  ${pages.length} pages created`);
  console.log(`  ${Object.keys(configEntries).length} config entries created`);
  console.log(`  ${sponsorsList.length} sponsors created`);
  console.log(`  ${exhibitionsList.length} exhibition stands created`);
  console.log('  1 admin user created');
  console.log('\nStart the server with: npm start');
}

// Run the seed
try {
  seed();
} catch (err) {
  console.error('Seed error:', err);
  process.exit(1);
}
