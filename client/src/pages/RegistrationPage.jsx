import { useState } from 'react';
import { Link } from 'react-router-dom';

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Argentina','Armenia','Australia',
  'Austria','Azerbaijan','Bahrain','Bangladesh','Belarus','Belgium','Bosnia and Herzegovina',
  'Brazil','Bulgaria','Canada','Chile','China','Colombia','Croatia','Cyprus','Czech Republic',
  'Denmark','Ecuador','Egypt','Estonia','Ethiopia','Finland','France','Georgia','Germany',
  'Ghana','Greece','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel',
  'Italy','Japan','Jordan','Kazakhstan','Kenya','Kosovo','Kuwait','Latvia','Lebanon',
  'Libya','Lithuania','Luxembourg','Malaysia','Malta','Mexico','Moldova','Monaco','Montenegro',
  'Morocco','Netherlands','New Zealand','Nigeria','North Macedonia','Norway','Oman','Pakistan',
  'Palestine','Peru','Philippines','Poland','Portugal','Qatar','Romania','Russia',
  'Saudi Arabia','Senegal','Serbia','Singapore','Slovakia','Slovenia','South Africa',
  'South Korea','Spain','Sweden','Switzerland','Taiwan','Thailand','Tunisia','Turkey',
  'Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Vietnam',
];

const initialForm = {
  first_name: '',
  last_name: '',
  organization: '',
  position: '',
  email: '',
  country: '',
  dietary_requirements: '',
  accessibility_needs: '',
  gdpr_consent: false,
};

export default function RegistrationPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }

  function validate() {
    const errs = {};
    if (!form.first_name.trim()) errs.first_name = 'First name is required';
    if (!form.last_name.trim()) errs.last_name = 'Last name is required';
    if (!form.organization.trim()) errs.organization = 'Organization is required';
    if (!form.position.trim()) errs.position = 'Position is required';
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!form.country) errs.country = 'Please select a country';
    if (!form.gdpr_consent) errs.gdpr_consent = 'You must accept the privacy policy to register';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Registration failed. Please try again.');
      }

      setSuccess(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <>
        <div className="page-header">
          <h1>Registration</h1>
          <p>Q-DEF Conference Luxembourg &mdash; June 12, 2026</p>
        </div>
        <section className="section">
          <div className="container">
            <div className="success-state">
              <div className="success-state__icon">&#10003;</div>
              <h2>Registration Confirmed!</h2>
              <p style={{ marginBottom: '1rem' }}>
                Thank you for registering for Q-DEF Conference Luxembourg 2026.
                A confirmation email has been sent to <strong>{form.email}</strong>.
              </p>
              <p style={{ color: 'var(--color-gray-500)', marginBottom: '2rem' }}>
                We look forward to welcoming you on June 12, 2026 at the ECCL, Luxembourg.
                You will receive further details about the programme and logistics closer to the event.
              </p>
              <Link to="/" className="btn btn--primary">Return to Homepage</Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1>Register</h1>
        <p>Secure your place at Q-DEF Conference Luxembourg 2026</p>
      </div>

      <section className="section">
        <div className="container">
          <form className="form" onSubmit={handleSubmit} noValidate>
            {submitError && (
              <div className="alert alert--error">{submitError}</div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  First Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  className={`form-input ${errors.first_name ? 'error' : ''}`}
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="e.g. Jean"
                />
                {errors.first_name && <div className="form-error">{errors.first_name}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Last Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  className={`form-input ${errors.last_name ? 'error' : ''}`}
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="e.g. Dupont"
                />
                {errors.last_name && <div className="form-error">{errors.last_name}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Organization <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="organization"
                  className={`form-input ${errors.organization ? 'error' : ''}`}
                  value={form.organization}
                  onChange={handleChange}
                  placeholder="e.g. Ministry of Defense"
                />
                {errors.organization && <div className="form-error">{errors.organization}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Position <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="position"
                  className={`form-input ${errors.position ? 'error' : ''}`}
                  value={form.position}
                  onChange={handleChange}
                  placeholder="e.g. Senior Analyst"
                />
                {errors.position && <div className="form-error">{errors.position}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  value={form.email}
                  onChange={handleChange}
                  placeholder="e.g. jean.dupont@example.com"
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Country <span className="required">*</span>
                </label>
                <select
                  name="country"
                  className={`form-select ${errors.country ? 'error' : ''}`}
                  value={form.country}
                  onChange={handleChange}
                >
                  <option value="">Select your country</option>
                  {COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.country && <div className="form-error">{errors.country}</div>}
              </div>

              <div className="form-group form-group--full">
                <label className="form-label">Dietary Requirements</label>
                <input
                  type="text"
                  name="dietary_requirements"
                  className="form-input"
                  value={form.dietary_requirements}
                  onChange={handleChange}
                  placeholder="e.g. Vegetarian, Gluten-free, Halal (optional)"
                />
              </div>

              <div className="form-group form-group--full">
                <label className="form-label">Accessibility Needs</label>
                <textarea
                  name="accessibility_needs"
                  className="form-textarea"
                  value={form.accessibility_needs}
                  onChange={handleChange}
                  placeholder="Please let us know if you have any accessibility requirements (optional)"
                  rows={3}
                />
              </div>

              <div className="form-group form-group--full">
                <label className="form-checkbox">
                  <input
                    type="checkbox"
                    name="gdpr_consent"
                    checked={form.gdpr_consent}
                    onChange={handleChange}
                  />
                  <span className="form-checkbox__label">
                    I consent to the collection and processing of my personal data in accordance
                    with the <Link to="/privacy">Privacy Policy</Link>. I understand that my data
                    will be used solely for the purposes of conference registration and communication. <span className="required">*</span>
                  </span>
                </label>
                {errors.gdpr_consent && <div className="form-error">{errors.gdpr_consent}</div>}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--lg btn--block"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Complete Registration'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
