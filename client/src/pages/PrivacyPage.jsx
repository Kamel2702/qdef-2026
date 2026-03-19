import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <>
      <div className="page-header">
        <h1>Privacy Policy</h1>
        <p>How we collect, use, and protect your personal data</p>
      </div>

      <div className="content-page">
        <p style={{ color: 'var(--color-gray-500)', fontStyle: 'italic' }}>
          Last updated: March 2026
        </p>

        <h2>1. Introduction</h2>
        <p>
          Q-DEF Conference Luxembourg (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to
          protecting your personal data in compliance with the General Data Protection Regulation
          (GDPR) - Regulation (EU) 2016/679. This privacy policy explains how we collect, use,
          store, and protect your personal information when you interact with our conference
          website and services.
        </p>

        <h2>2. Data Controller</h2>
        <p>
          The data controller for the processing of your personal data is:
        </p>
        <p>
          Q-DEF Conference Secretariat<br />
          4 Place de l&apos;Europe<br />
          1499 Luxembourg<br />
          Grand Duchy of Luxembourg<br />
          Email: <a href="mailto:privacy@qdef-conference.lu">privacy@qdef-conference.lu</a>
        </p>

        <h2>3. Data We Collect</h2>
        <p>We collect the following categories of personal data:</p>
        <h3>3.1 Registration Data</h3>
        <ul>
          <li>First name and last name</li>
          <li>Email address</li>
          <li>Organization and position/title</li>
          <li>Country of residence</li>
          <li>Dietary requirements (optional)</li>
          <li>Accessibility needs (optional)</li>
        </ul>

        <h3>3.2 Technical Data</h3>
        <ul>
          <li>IP address and browser type</li>
          <li>Device information</li>
          <li>Pages visited and interaction data</li>
          <li>Date and time of access</li>
        </ul>

        <h2>4. How We Use Your Data</h2>
        <p>We process your personal data for the following purposes:</p>
        <ul>
          <li>Processing and managing your conference registration</li>
          <li>Communicating conference logistics, programme updates, and relevant information</li>
          <li>Providing on-site services including catering and accessibility accommodations</li>
          <li>Ensuring the security and proper functioning of our website</li>
          <li>Compiling anonymized attendance statistics</li>
          <li>Complying with legal and regulatory obligations</li>
        </ul>
        <p>
          The legal basis for processing your data is your explicit consent (Article 6(1)(a) GDPR)
          provided during registration, as well as the performance of the contract for conference
          services (Article 6(1)(b) GDPR).
        </p>

        <h2>5. Data Storage &amp; Retention</h2>
        <p>
          Your personal data is stored on secure servers located within the European Economic Area (EEA).
          We implement appropriate technical and organizational measures to protect your data against
          unauthorized access, alteration, disclosure, or destruction.
        </p>
        <p>
          Registration data is retained for a period of 12 months following the conference date,
          after which it is securely deleted unless longer retention is required by law or with
          your explicit consent for future event communications.
        </p>

        <h2>6. Data Sharing</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personal data to third parties for
          marketing purposes. Your data may be shared with:
        </p>
        <ul>
          <li>Conference service providers (venue, catering) solely to fulfill event services</li>
          <li>IT service providers who help us operate the conference platform</li>
          <li>Public authorities if required by applicable law</li>
        </ul>
        <p>
          All third-party processors are bound by data processing agreements that ensure
          GDPR-compliant handling of your data.
        </p>

        <h2>7. Your Rights</h2>
        <p>Under the GDPR, you have the following rights regarding your personal data:</p>
        <ul>
          <li><strong>Right of access</strong> - obtain a copy of your personal data</li>
          <li><strong>Right to rectification</strong> - request correction of inaccurate data</li>
          <li><strong>Right to erasure</strong> - request deletion of your data (&quot;right to be forgotten&quot;)</li>
          <li><strong>Right to restriction</strong> - limit processing of your data</li>
          <li><strong>Right to data portability</strong> - receive your data in a structured, machine-readable format</li>
          <li><strong>Right to object</strong> - object to processing based on legitimate interests</li>
          <li><strong>Right to withdraw consent</strong> - withdraw your consent at any time</li>
        </ul>
        <p>
          To exercise any of these rights, please contact us at{' '}
          <a href="mailto:privacy@qdef-conference.lu">privacy@qdef-conference.lu</a>.
          We will respond to your request within 30 days.
        </p>

        <h2>8. Cookies</h2>
        <p>
          Our website uses only essential cookies necessary for the proper functioning of the site.
          These include session cookies for authentication and security purposes. We do not use
          tracking, analytics, or advertising cookies. No third-party cookies are set without
          your explicit consent.
        </p>

        <h2>9. Security Measures</h2>
        <p>
          We implement industry-standard security measures including:
        </p>
        <ul>
          <li>TLS/SSL encryption for all data in transit</li>
          <li>Encryption of sensitive data at rest</li>
          <li>Regular security audits and vulnerability assessments</li>
          <li>Access controls and authentication for administrative systems</li>
          <li>Staff training on data protection procedures</li>
        </ul>

        <h2>10. Contact &amp; Complaints</h2>
        <p>
          If you have any questions about this privacy policy or wish to exercise your data protection
          rights, please contact:
        </p>
        <p>
          Data Protection Officer<br />
          Q-DEF Conference Secretariat<br />
          Email: <a href="mailto:privacy@qdef-conference.lu">privacy@qdef-conference.lu</a>
        </p>
        <p>
          You also have the right to lodge a complaint with the Luxembourg National Commission
          for Data Protection (CNPD) or your local supervisory authority.
        </p>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Link to="/contact" className="btn btn--outline">Contact Us</Link>
        </div>
      </div>
    </>
  );
}
