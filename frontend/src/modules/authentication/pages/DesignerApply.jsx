import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
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
=======
import {
  Check, ArrowRight, UploadCloud, CheckCircle2, FileText,
  User, Award, Image as ImageIcon, ShieldCheck, Clock
} from 'lucide-react';
import { SPECIALIZATIONS } from '../../../constants';
import { useApp } from '../../../context/AppContext';
import '../Auth.css';
import './DesignerApply.css';

export default function DesignerApply() {
  const [currentStep, setCurrentStep] = useState(1);
  const [brandName, setBrandName] = useState('Aanya Rao');
  const [profileType, setProfileType] = useState('individual'); // 'individual' or 'studio'
  const [bio, setBio] = useState('Fashion designer specializing in bridal and groom wear with 5+ years of experience. Focused on contemporary designs with traditional craftsmanship.');
  const [selectedSkills, setSelectedSkills] = useState(['Bridal Wear', 'Ethnic Wear', 'Styling & Consultation']);
  const [experience, setExperience] = useState('5+ years');
  const [notableWork, setNotableWork] = useState('Styled high-profile weddings in Hyderabad and Mumbai');
  const [uploadedFiles, setUploadedFiles] = useState(['bridal_look_1.jpg', 'traditional_lehenga.png']);

  const { addToast } = useApp();
  const navigate = useNavigate();

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      addToast('Application submitted successfully! Your review is in progress.', 'success');
      navigate('/designer/application-status');
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setUploadedFiles((prev) => [...prev, ...files.map((f) => f.name)]);
      addToast(`Uploaded ${files.length} portfolio item(s)`, 'success');
>>>>>>> origin/sai
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="zorevi-apply-page">
      {/* Top Header */}
      <header className="zorevi-apply-header">
        <Link to="/" className="zorevi-apply-logo">
          <svg viewBox="0 0 32 32" fill="none" width="30" height="30">
            <path d="M16 4C12 4 8 8 8 12c0 4 4 8 8 12 4-4 8-8 8-12 0-4-4-8-8-8z" fill="url(#apply-logo-g)"/>
            <path d="M8 12c-4 0-6 2-6 4s2 4 6 4c2 0 4-2 6-4-2-2-4-4-6-4z" fill="url(#apply-logo-g)" opacity="0.8"/>
            <path d="M24 12c4 0 6 2 6 4s-2 4-6 4c-2 0-4-2-6-4 2-2 4-4 6-4z" fill="url(#apply-logo-g)" opacity="0.8"/>
            <defs>
              <linearGradient id="apply-logo-g" x1="0" y1="0" x2="32" y2="32">
                <stop stopColor="#7C3AED"/>
                <stop offset="1" stopColor="#A855F7"/>
              </linearGradient>
            </defs>
          </svg>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#7C3AED' }}>Zorevi</span>
        </Link>

        <div className="zorevi-apply-header-meta">
          <span>Already applied?</span>
          <Link to="/designer/application-status" className="zorevi-apply-status-link">
            Check Status
          </Link>
        </div>
      </header>

      <div className="zorevi-apply-container container">
        {/* Banner Title */}
        <div className="zorevi-apply-title-banner">
          <h1>Become a Verified Designer on Zorevi</h1>
          <p>Apply now and start receiving styling bookings from fashion lovers near you.</p>
        </div>

        {/* Step Indicator */}
        <div className="zorevi-apply-steps-bar">
          {[
            { num: 1, label: 'Profile Details' },
            { num: 2, label: 'Skills & Services' },
            { num: 3, label: 'Experience' },
            { num: 4, label: 'Portfolio' },
            { num: 5, label: 'Verification' },
          ].map((s) => (
            <div
              key={s.num}
              className={`zorevi-apply-step-item ${currentStep === s.num ? 'active' : ''} ${currentStep > s.num ? 'completed' : ''}`}
              onClick={() => setCurrentStep(s.num)}
            >
              <div className="zorevi-apply-step-circle">
                {currentStep > s.num ? <Check size={14} /> : s.num}
              </div>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Two-Column Workspace */}
        <div className="zorevi-apply-body-grid">
          {/* Left Form Area */}
          <div className="zorevi-apply-main-card">
            {currentStep === 1 && (
              <div className="zorevi-apply-pane">
                <h3 className="zorevi-apply-pane-title">
                  <User size={18} color="#7C3AED" /> Profile Details
                </h3>
                <p className="zorevi-apply-pane-sub">Tell us about yourself and your fashion brand.</p>

                <div className="zorevi-apply-field">
                  <label>Designer / Brand Name *</label>
                  <input
                    type="text"
                    className="zorevi-input"
                    placeholder="Enter your brand or designer name"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                  />
                </div>

                <div className="zorevi-apply-field">
                  <label>Profile Type *</label>
                  <div className="zorevi-apply-radio-row">
                    <label className={`zorevi-apply-radio-pill ${profileType === 'individual' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="profileType"
                        checked={profileType === 'individual'}
                        onChange={() => setProfileType('individual')}
                      />
                      <span>Individual Designer / Stylist</span>
                    </label>

                    <label className={`zorevi-apply-radio-pill ${profileType === 'studio' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="profileType"
                        checked={profileType === 'studio'}
                        onChange={() => setProfileType('studio')}
                      />
                      <span>Fashion Brand / Studio</span>
                    </label>
                  </div>
                </div>

                <div className="zorevi-apply-field">
                  <label>Bio / About You *</label>
                  <textarea
                    className="zorevi-textarea"
                    rows="4"
                    maxLength={300}
                    placeholder="Write a short bio (e.g., your design philosophy, specialties, background...)"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                  <small style={{ color: '#9CA3AF', float: 'right', marginTop: '4px' }}>
                    {bio.length}/300
                  </small>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="zorevi-apply-pane">
                <h3 className="zorevi-apply-pane-title">Skills & Specializations</h3>
                <p className="zorevi-apply-pane-sub">Select the styling categories you cater to.</p>

                <div className="zorevi-apply-skills-grid">
                  {[
                    "Men's Fashion", "Women's Fashion", "Kids' Fashion",
                    "Bridal Wear", "Groom Wear", "Custom Tailoring",
                    "Styling & Consultation", "Ethnic Wear", "Fusion Wear",
                    "Wardrobe Planning", "Personal Shopping", "Corporate Chic"
                  ].map((skill) => (
                    <label
                      key={skill}
                      className={`zorevi-apply-skill-checkbox ${selectedSkills.includes(skill) ? 'checked' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill)}
                        onChange={() => toggleSkill(skill)}
                      />
>>>>>>> origin/sai
                      <span>{skill}</span>
                    </label>
                  ))}
                </div>
<<<<<<< HEAD
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
=======
              </div>
            )}

            {currentStep === 3 && (
              <div className="zorevi-apply-pane">
                <h3 className="zorevi-apply-pane-title">
                  <Award size={18} color="#7C3AED" /> Experience & Credentials
                </h3>
                <p className="zorevi-apply-pane-sub">Your professional styling and design background.</p>

                <div className="zorevi-apply-field">
                  <label>Total Experience in Fashion</label>
                  <select
                    className="zorevi-input"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  >
                    <option value="1–2 years">1–2 years</option>
                    <option value="3–5 years">3–5 years</option>
                    <option value="5+ years">5+ years</option>
                    <option value="8+ years">8+ years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                </div>

                <div className="zorevi-apply-field">
                  <label>Previous / Notable Work (Optional)</label>
                  <textarea
                    className="zorevi-textarea"
                    rows="3"
                    placeholder="e.g. Brands, celebrity styling, boutique ownership, fashion weeks..."
                    value={notableWork}
                    onChange={(e) => setNotableWork(e.target.value)}
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="zorevi-apply-pane">
                <h3 className="zorevi-apply-pane-title">
                  <ImageIcon size={18} color="#7C3AED" /> Portfolio Upload
                </h3>
                <p className="zorevi-apply-pane-sub">Upload 3 to 10 photos of your best creations or client styling.</p>

                <div className="zorevi-apply-upload-dropzone">
                  <UploadCloud size={40} color="#7C3AED" />
                  <h4>Drag and drop images here or browse files</h4>
                  <p>Supports JPG, PNG, WEBP up to 10MB each</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    id="portfolio-file-input"
                  />
                  <label htmlFor="portfolio-file-input" className="zorevi-btn zorevi-btn--outline zorevi-btn--sm">
                    Select Images
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Uploaded Images ({uploadedFiles.length})</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                      {uploadedFiles.map((f, i) => (
                        <span key={i} className="zorevi-uploaded-pill">
                          <CheckCircle2 size={13} color="#10B981" /> {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 5 && (
              <div className="zorevi-apply-pane">
                <h3 className="zorevi-apply-pane-title">
                  <ShieldCheck size={18} color="#10B981" /> Government & Business Verification
                </h3>
                <p className="zorevi-apply-pane-sub">Upload documents for our concierge compliance team.</p>

                <div className="zorevi-apply-doc-row">
                  <div>
                    <strong>Government ID Proof (Aadhaar / PAN / Passport) *</strong>
                    <small>Required to ensure safe customer experiences</small>
                  </div>
                  <span className="zorevi-doc-status-badge">Ready</span>
                </div>

                <div className="zorevi-apply-doc-row">
                  <div>
                    <strong>Business / Studio Registration (Optional)</strong>
                    <small>Shop license, GST or firm registration if applicable</small>
                  </div>
                  <span className="zorevi-doc-status-badge">Uploaded</span>
                </div>

                <div className="zorevi-apply-doc-row">
                  <div>
                    <strong>Address Proof (Utility Bill / Lease Agreement)</strong>
                    <small>For studio or in-person service verification</small>
                  </div>
                  <span className="zorevi-doc-status-badge">Uploaded</span>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="zorevi-apply-footer-bar">
              <Link to="/designer/login" className="zorevi-btn zorevi-btn--ghost">
                Save & Exit
              </Link>
              <button
                type="button"
                className="zorevi-btn zorevi-btn--primary"
                onClick={handleNext}
              >
                {currentStep === 5 ? 'Submit Application' : 'Save & Continue'} <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Checklist & Summary Card */}
          <div className="zorevi-apply-checklist-card">
            <h4 className="zorevi-checklist-title">Verification Checklist</h4>
            <p className="zorevi-checklist-sub">Keep these items ready for faster approval.</p>

            <ul className="zorevi-checklist-items">
              <li className="zorevi-checklist-item completed">
                <CheckCircle2 size={16} />
                <div>
                  <strong>Government ID Proof</strong>
                  <small>Aadhaar, PAN, Passport, etc.</small>
                </div>
              </li>

              <li className="zorevi-checklist-item completed">
                <CheckCircle2 size={16} />
                <div>
                  <strong>Business / Studio Proof</strong>
                  <small>Shop license, GST, or registration (if available)</small>
                </div>
              </li>

              <li className="zorevi-checklist-item completed">
                <CheckCircle2 size={16} />
                <div>
                  <strong>Professional Portfolio</strong>
                  <small>Your best design work (3–10 images)</small>
                </div>
              </li>

              <li className="zorevi-checklist-item completed">
                <CheckCircle2 size={16} />
                <div>
                  <strong>Profile Photo / Brand Logo</strong>
                  <small>Clear, high-resolution portrait or logo</small>
                </div>
              </li>
            </ul>

            <div className="zorevi-approval-timing-box">
              <Clock size={16} color="#7C3AED" />
              <div>
                <strong>Average review time: 24–48 hours</strong>
                <p>Our stylist verification team will notify you via email and WhatsApp upon approval.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
>>>>>>> origin/sai
  );
}
