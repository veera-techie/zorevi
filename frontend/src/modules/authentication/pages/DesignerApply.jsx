import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Award, Check, ChevronLeft, ChevronRight, UploadCloud } from 'lucide-react';
import { SPECIALIZATIONS } from '../../../constants';
import {
  AuthDemoNotice,
  AuthField,
  AuthShell,
} from '../AuthShell';
import './DesignerApply.css';

const audiences = ['Men', 'Women', 'Children', 'Couples', 'Families'];
const steps = ['Profile', 'Skills & experience', 'Qualifications', 'Review'];

const emailIsValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const phoneIsValid = (value) => {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
};

export default function DesignerApply() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    studio: '',
    bio: '',
  });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedAudiences, setSelectedAudiences] = useState([]);
  const [years, setYears] = useState('');
  const [qualification, setQualification] = useState('');
  const [certifications, setCertifications] = useState('');
  const [files, setFiles] = useState([]);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const updateProfile = (key, value) => setProfile((current) => ({ ...current, [key]: value }));
  const toggle = (items, setItems, item) => setItems((current) => current.includes(item)
    ? current.filter((value) => value !== item)
    : [...current, item]);

  const validateStep = () => {
    const nextErrors = {};
    if (step === 1) {
      if (profile.name.trim().length < 2) nextErrors.name = 'Enter your name or studio contact name.';
      if (!emailIsValid(profile.email.trim())) nextErrors.email = 'Enter a valid email address.';
      if (!phoneIsValid(profile.phone)) nextErrors.phone = 'Enter a valid mobile number.';
    }
    if (step === 2) {
      if (!selectedSkills.length) nextErrors.skills = 'Select at least one specialization.';
      if (!selectedAudiences.length) nextErrors.audiences = 'Choose at least one audience you serve.';
      if (!years) nextErrors.years = 'Select your years of experience.';
    }
    if (step === 3) {
      if (!qualification.trim()) nextErrors.qualification = 'Add your qualification or describe your professional training.';
      if (!files.length) nextErrors.files = 'Add at least one portfolio image.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateStep()) setStep((current) => Math.min(4, current + 1));
  };

  const handleFileChange = (event) => {
    const selected = Array.from(event.target.files || []);
    const oversized = selected.find((file) => file.size > 10 * 1024 * 1024);
    if (oversized) {
      setErrors((current) => ({ ...current, files: `${oversized.name} is larger than 10 MB.` }));
      event.target.value = '';
      return;
    }
    setFiles((current) => [...current, ...selected.map((file) => file.name)].slice(0, 10));
    setErrors((current) => ({ ...current, files: '' }));
    event.target.value = '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateStep()) return;
    if (!agreed) {
      setErrors({ terms: 'Confirm that the information is accurate before submitting.' });
      return;
    }

    setLoading(true);
    try {
      window.sessionStorage.setItem('zorevi.demo.application', JSON.stringify({
        status: 'submitted',
        applicationId: `ZV-${Math.floor(100000 + Math.random() * 900000)}`,
        submittedAt: new Date().toISOString(),
      }));
      await new Promise((resolve) => window.setTimeout(resolve, 450));
      navigate('/designer/application-status');
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : 'Could not save this demo application.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell image="/images/designer-studio-hero.jpg" className="zorevi-auth-page--application">
      <div className="zorevi-apply-card">
        <div className="zorevi-auth-progress">Designer application · {step} of 4</div>
        <header className="zorevi-auth-form-header">
          <h2 className="zorevi-auth-form-title">Join Zorevi as a designer</h2>
          <p className="zorevi-auth-form-sub">Share your work and help people find a style that feels like them.</p>
        </header>
        <AuthDemoNotice>Demo application: details and files stay in this browser and are not submitted to Zorevi.</AuthDemoNotice>

        <ol className="zorevi-apply-steps" aria-label="Application progress">
          {steps.map((label, index) => {
            const number = index + 1;
            return (
              <li key={label}>
                <button
                  type="button"
                  className={number === step ? 'active' : number < step ? 'completed' : ''}
                  disabled={number > step}
                  aria-current={number === step ? 'step' : undefined}
                  onClick={() => number < step && setStep(number)}
                >
                  <span>{number < step ? <Check size={14} /> : number}</span>
                  {label}
                </button>
              </li>
            );
          })}
        </ol>

        <form onSubmit={step === 4 ? handleSubmit : (event) => { event.preventDefault(); handleContinue(); }} noValidate>
          {step === 1 && (
            <section aria-labelledby="apply-profile-heading">
              <h3 id="apply-profile-heading" className="zorevi-apply-section-title">Basic profile and contact</h3>
              <AuthField
                id="designer-name"
                label="Designer or studio contact name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={profile.name}
                onChange={(event) => updateProfile('name', event.target.value)}
                error={errors.name}
              />
              <AuthField
                id="designer-application-email"
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={profile.email}
                onChange={(event) => updateProfile('email', event.target.value)}
                error={errors.email}
              />
              <AuthField
                id="designer-application-phone"
                label="Mobile number"
                type="tel"
                autoComplete="tel"
                placeholder="Include country code if needed"
                value={profile.phone}
                onChange={(event) => updateProfile('phone', event.target.value)}
                error={errors.phone}
              />
              <AuthField
                id="designer-studio"
                label="Studio or brand name (optional)"
                type="text"
                placeholder="Your studio name"
                value={profile.studio}
                onChange={(event) => updateProfile('studio', event.target.value)}
              />
              <div className="zorevi-auth-field">
                <label htmlFor="designer-bio">A little about your work (optional)</label>
                <textarea
                  id="designer-bio"
                  className="zorevi-auth-textarea"
                  rows={3}
                  maxLength={500}
                  placeholder="Your design approach, background, or what inspires you"
                  value={profile.bio}
                  onChange={(event) => updateProfile('bio', event.target.value)}
                />
              </div>
            </section>
          )}

          {step === 2 && (
            <section aria-labelledby="apply-skills-heading">
              <h3 id="apply-skills-heading" className="zorevi-apply-section-title">Skills and experience</h3>
              <p className="zorevi-apply-copy">Select your specialties. Designers of all genders are welcome.</p>
              <fieldset className="zorevi-apply-fieldset">
                <legend>Specializations</legend>
                <div className="zorevi-apply-options">
                  {SPECIALIZATIONS.map((skill) => (
                    <label className="zorevi-apply-option" key={skill}>
                      <input type="checkbox" checked={selectedSkills.includes(skill)} onChange={() => toggle(selectedSkills, setSelectedSkills, skill)} />
                      <span>{skill}</span>
                    </label>
                  ))}
                </div>
                {errors.skills && <span className="zorevi-auth-error" role="alert">{errors.skills}</span>}
              </fieldset>
              <fieldset className="zorevi-apply-fieldset">
                <legend>Who do you serve?</legend>
                <div className="zorevi-apply-options">
                  {audiences.map((audience) => (
                    <label className="zorevi-apply-option" key={audience}>
                      <input type="checkbox" checked={selectedAudiences.includes(audience)} onChange={() => toggle(selectedAudiences, setSelectedAudiences, audience)} />
                      <span>{audience}</span>
                    </label>
                  ))}
                </div>
                {errors.audiences && <span className="zorevi-auth-error" role="alert">{errors.audiences}</span>}
              </fieldset>
              <div className="zorevi-auth-field">
                <label htmlFor="designer-years">Years of experience</label>
                <div className="zorevi-auth-input-wrap">
                  <Award className="icon-left" size={18} aria-hidden="true" />
                  <select id="designer-years" value={years} onChange={(event) => setYears(event.target.value)} aria-invalid={Boolean(errors.years)}>
                    <option value="">Select experience</option>
                    <option value="Under 1 year">Under 1 year</option>
                    <option value="1–2 years">1–2 years</option>
                    <option value="3–5 years">3–5 years</option>
                    <option value="6–10 years">6–10 years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                </div>
                {errors.years && <span className="zorevi-auth-error" role="alert">{errors.years}</span>}
              </div>
            </section>
          )}

          {step === 3 && (
            <section aria-labelledby="apply-qualifications-heading">
              <h3 id="apply-qualifications-heading" className="zorevi-apply-section-title">Qualifications and portfolio</h3>
              <AuthField
                id="designer-qualification"
                label="Qualifications or professional training"
                type="text"
                placeholder="Degree, apprenticeship, or relevant experience"
                value={qualification}
                onChange={(event) => setQualification(event.target.value)}
                error={errors.qualification}
              />
              <div className="zorevi-auth-field">
                <label htmlFor="designer-certifications">Certifications (optional)</label>
                <textarea
                  id="designer-certifications"
                  className="zorevi-auth-textarea"
                  rows={2}
                  placeholder="List relevant certifications"
                  value={certifications}
                  onChange={(event) => setCertifications(event.target.value)}
                />
              </div>
              <div className="zorevi-apply-upload">
                <UploadCloud size={28} aria-hidden="true" />
                <label htmlFor="designer-portfolio">Portfolio images</label>
                <p>Choose up to 10 JPG, PNG, or WEBP images (10 MB max each).</p>
                <input id="designer-portfolio" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFileChange} />
                {files.length > 0 && <ul aria-label="Selected portfolio files">{files.map((file, index) => <li key={`${file}-${index}`}>{file}</li>)}</ul>}
                {errors.files && <span className="zorevi-auth-error" role="alert">{errors.files}</span>}
                <p className="zorevi-auth-note">Demo only: selected file names are listed locally and are not uploaded.</p>
              </div>
            </section>
          )}

          {step === 4 && (
            <section aria-labelledby="apply-review-heading">
              <h3 id="apply-review-heading" className="zorevi-apply-section-title">Review your application</h3>
              <dl className="zorevi-apply-review">
                <div><dt>Contact</dt><dd>{profile.name} · {profile.email} · {profile.phone}</dd></div>
                <div><dt>Studio</dt><dd>{profile.studio || 'Not provided'}</dd></div>
                <div><dt>About</dt><dd>{profile.bio || 'Not provided'}</dd></div>
                <div><dt>Specializations</dt><dd>{selectedSkills.join(', ')}</dd></div>
                <div><dt>Clients served</dt><dd>{selectedAudiences.join(', ')}</dd></div>
                <div><dt>Experience</dt><dd>{years}</dd></div>
                <div><dt>Qualifications</dt><dd>{qualification}</dd></div>
                <div><dt>Certifications</dt><dd>{certifications || 'Not provided'}</dd></div>
                <div><dt>Portfolio</dt><dd>{files.length} image{files.length === 1 ? '' : 's'} selected</dd></div>
              </dl>
              <label className="zorevi-auth-checkbox-label zorevi-apply-consent">
                <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} aria-invalid={Boolean(errors.terms)} />
                <span>I confirm these details are accurate and understand this demo application is not sent to Zorevi.</span>
              </label>
              {errors.terms && <span className="zorevi-auth-error" role="alert">{errors.terms}</span>}
              {errors.form && <span className="zorevi-auth-error" role="alert">{errors.form}</span>}
              <p className="zorevi-apply-review-note">In production, applications are reviewed before booking access is enabled.</p>
            </section>
          )}

          <div className="zorevi-apply-actions">
            {step > 1
              ? <button type="button" className="zorevi-apply-secondary" onClick={() => setStep((current) => current - 1)}><ChevronLeft size={17} /> Back</button>
              : <Link to="/designer/login" className="zorevi-apply-secondary">Already a designer? Sign in</Link>}
            {step < 4
              ? <button type="submit" className="zorevi-auth-submit">Continue <ChevronRight size={17} /></button>
              : <button type="submit" className="zorevi-auth-submit" disabled={loading}>{loading ? 'Submitting demo…' : 'Submit application'} {!loading && <ChevronRight size={17} />}</button>}
          </div>
        </form>

        <p className="zorevi-auth-footer-prompt">Already applied? <Link to="/designer/application-status" className="zorevi-auth-link">Check application status</Link></p>
      </div>
    </AuthShell>
  );
}
