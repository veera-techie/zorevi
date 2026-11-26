import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Award, CalendarDays, Check, CheckCircle2, Copy, FileText,
  Image as ImageIcon, Info, Link2, MapPin, ShieldCheck, Sparkles, UploadCloud, UserRound, X,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { findDesignerApplication, getStoredDesignerApplications, saveDesignerApplication } from '../../../services/designerApplicationsStorage';
import '../Auth.css';
import './DesignerApply.css';

const STEPS = ['Personal Details', 'Professional Profile', 'Review & Submit'];
const SKILL_OPTIONS = [
  'Bridal Styling', 'Ethnic Styling', 'Western Styling', 'Casual Styling', 'Party Styling', 'Couture Styling',
  'Saree Styling', 'Blouse Design', "Men's Fashion", 'Kids Styling', 'Fashion Illustration',
  'Personal Styling', 'Alterations & Custom Tailoring',
];
const CITY_OPTIONS = [
  'Hyderabad', 'Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata', 'Pune',
  'Ahmedabad', 'Jaipur', 'Lucknow', 'Kochi', 'Other',
];
const EXPERIENCE_OPTIONS = ['Fresher', '1–2 years', '3–5 years', '6–10 years', '10+ years'];
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ACCEPTED_DOCUMENT_TYPES = [...ACCEPTED_IMAGE_TYPES, 'application/pdf'];
const ACCEPTED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const ACCEPTED_DOCUMENT_EXTENSIONS = [...ACCEPTED_IMAGE_EXTENSIONS, 'pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const DRAFT_KEY = 'zorevi_designer_application_draft';
const LEGACY_APPLICATION_STORAGE_PREFIX = 'zorevi_designer_application_';

function createApplicationId() {
  const applications = getStoredDesignerApplications();
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const randomValue = new Uint32Array(1);
    window.crypto.getRandomValues(randomValue);
    const suffix = String(randomValue[0] % 1000000).padStart(6, '0');
    const applicationId = `DSN-${new Date().getFullYear()}-${suffix}`;
    if (!applications.some((application) => application?.applicationId === applicationId) &&
      !sessionStorage.getItem(`${LEGACY_APPLICATION_STORAGE_PREFIX}${applicationId}`)) {
      return applicationId;
    }
  }
  throw new Error('Could not generate a unique application ID. Please try again.');
}

const initialFormData = {
  fullName: '',
  countryCode: '+91',
  phone: '',
  email: '',
  address: '',
  city: '',
  selectedSkills: [],
  customSkill: '',
  experience: '',
  startingPrice: '',
  govIdFile: null,
  certificates: [],
  portfolioFiles: [],
  portfolioLink: '',
  declaration: false,
};

function getDraft() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null');
    return saved ? { ...initialFormData, ...saved, govIdFile: null, certificates: [], portfolioFiles: [] } : initialFormData;
  } catch {
    return initialFormData;
  }
}

function isAllowedFile(file, acceptedTypes, acceptedExtensions) {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return file.size > 0 && file.size <= MAX_FILE_SIZE &&
    (acceptedTypes.includes(file.type) || acceptedExtensions.includes(extension));
}

function formatFileSize(size) {
  return size < 1024 * 1024 ? `${Math.max(1, Math.round(size / 1024))} KB` : `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DesignerApply() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(getDraft);
  const [errors, setErrors] = useState({});
  const [skillSearch, setSkillSearch] = useState('');
  const [dragging, setDragging] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState(null);
  const submissionLock = useRef(false);
  const fileInputRef = useRef(null);
  const portfolioFilesRef = useRef([]);
  const { addToast } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const applicationIdFromUrl = searchParams.get('applicationId');

  portfolioFilesRef.current = formData.portfolioFiles;
  useEffect(() => () => portfolioFilesRef.current.forEach((item) => URL.revokeObjectURL(item.preview)), []);

  useEffect(() => {
    if (!applicationIdFromUrl) {
      setSubmittedApplication(null);
      setSubmitError('');
      setConfirmationLoading(false);
      return undefined;
    }

    setConfirmationLoading(true);
    try {
      const savedApplication = findDesignerApplication(applicationIdFromUrl);
      if (!savedApplication) {
        throw new Error('No application with this ID was found in this browser’s saved applications.');
      }
      setSubmittedApplication(savedApplication);
      setSubmitError('');
    } catch (error) {
      setSubmittedApplication(null);
      setSubmitError(error.message || 'Could not load this saved application.');
    } finally {
      setConfirmationLoading(false);
    }

    return undefined;
  }, [applicationIdFromUrl]);

  const updateField = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: '' }));
    setDraftSaved(false);
  };

  const allSkills = [...formData.selectedSkills, ...(formData.customSkill.trim() ? [formData.customSkill.trim()] : [])];
  const toggleSkill = (skill) => {
    const selected = formData.selectedSkills.includes(skill);
    updateField('selectedSkills', selected
      ? formData.selectedSkills.filter((item) => item !== skill)
      : [...formData.selectedSkills, skill]);
  };

  const addPortfolioFiles = (fileList) => {
    const files = Array.from(fileList || []);
    const accepted = [];
    const rejected = [];
    files.forEach((file) => {
      if (!isAllowedFile(file, ACCEPTED_IMAGE_TYPES, ACCEPTED_IMAGE_EXTENSIONS)) {
        rejected.push(file.name);
      } else {
        accepted.push({ file, name: file.name, size: formatFileSize(file.size), preview: URL.createObjectURL(file) });
      }
    });
    if (rejected.length) {
      addToast(`Some images were skipped. Use JPG, PNG, or WEBP files up to 10 MB.`, 'warning');
    }
    if (accepted.length) {
      setFormData((previous) => ({ ...previous, portfolioFiles: [...previous.portfolioFiles, ...accepted] }));
      setErrors((previous) => ({ ...previous, portfolioFiles: '' }));
      setDraftSaved(false);
    }
  };

  const removePortfolioFile = (index) => {
    const item = formData.portfolioFiles[index];
    if (item) URL.revokeObjectURL(item.preview);
    updateField('portfolioFiles', formData.portfolioFiles.filter((_, itemIndex) => itemIndex !== index));
  };

  const updateDocument = (field, file) => {
    if (!file) return;
    if (!isAllowedFile(file, ACCEPTED_DOCUMENT_TYPES, ACCEPTED_DOCUMENT_EXTENSIONS)) {
      setErrors((previous) => ({ ...previous, [field]: 'Choose a PDF, JPG, PNG, or WEBP file up to 10 MB.' }));
      return;
    }
    if (field === 'certificates') {
      setFormData((previous) => ({ ...previous, certificates: [...previous.certificates, file] }));
      setErrors((previous) => ({ ...previous, certificates: '' }));
    } else {
      setFormData((previous) => ({ ...previous, govIdFile: file }));
      setErrors((previous) => ({ ...previous, govIdFile: '' }));
    }
    setDraftSaved(false);
  };

  const getStepErrors = (step) => {
    const nextErrors = {};
    if (step === 1) {
      if (!formData.fullName.trim()) nextErrors.fullName = 'Enter your full name.';
      if (!formData.phone.trim()) nextErrors.phone = 'Enter your WhatsApp number.';
      else if (!/^[\d\s()-]{7,16}$/.test(formData.phone.trim())) nextErrors.phone = 'Enter a valid phone number.';
      if (!formData.email.trim()) nextErrors.email = 'Enter your email address.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) nextErrors.email = 'Enter a valid email address.';
      if (!formData.address.trim()) nextErrors.address = 'Enter your address.';
      if (!formData.city) nextErrors.city = 'Select your city.';
    }
    if (step === 2) {
      if (!allSkills.length) nextErrors.selectedSkills = 'Select at least one fashion design skill.';
      if (!formData.experience) nextErrors.experience = 'Select your experience level.';
      if (!formData.startingPrice || Number(formData.startingPrice) < 0) nextErrors.startingPrice = 'Enter a valid starting price.';
    }
    return nextErrors;
  };

  const validateStep = (step) => {
    const nextErrors = getStepErrors(step);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goToStep = (step) => {
    if (step > currentStep && !validateStep(currentStep)) {
      addToast('Please complete the required fields before continuing.', 'warning');
      return;
    }
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveDraft = () => {
    const { govIdFile, certificates, portfolioFiles, ...draft } = formData;
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setDraftSaved(true);
      addToast('Your draft has been saved in this browser session. Uploaded documents are not saved.', 'success');
    } catch {
      setDraftSaved(false);
      addToast('Unable to save the draft in this browser. Please try again.', 'error');
    }
  };

  const requiredFieldsComplete = [
    formData.fullName.trim(), formData.phone.trim() && /^[\d\s()-]{7,16}$/.test(formData.phone.trim()),
    formData.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()),
    formData.address.trim(), formData.city, allSkills.length > 0, formData.experience,
    formData.startingPrice && Number(formData.startingPrice) >= 0,
  ].filter(Boolean).length;
  const progressPercent = Math.round(((requiredFieldsComplete + (formData.declaration ? 1 : 0)) / 9) * 100);
  const canSubmit = requiredFieldsComplete === 8 && formData.declaration;

  const handleSubmit = () => {
    if (submissionLock.current) return;
    const nextErrors = { ...getStepErrors(1), ...getStepErrors(2) };
    if (!formData.declaration) nextErrors.declaration = 'Accept the declaration to submit.';
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    submissionLock.current = true;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const applicationId = createApplicationId();
      const submittedAt = new Date();
      const location = [formData.address.trim(), formData.city].filter(Boolean).join(', ');
      const whatsappNumber = `${formData.countryCode} ${formData.phone.trim()}`;
      const portfolioFiles = formData.portfolioFiles.map(({ name, size }) => ({ name, size }));
      const certificates = formData.certificates.map((file) => ({ name: file.name, size: formatFileSize(file.size) }));
      const application = {
        applicationId,
        fullName: formData.fullName.trim(),
        countryCode: formData.countryCode,
        phone: whatsappNumber,
        whatsappNumber,
        email: formData.email.trim(),
        address: formData.address.trim(),
        city: formData.city,
        location,
        skills: allSkills,
        selectedSkills: formData.selectedSkills,
        customSkill: formData.customSkill.trim(),
        experience: formData.experience,
        startingPrice: Number(formData.startingPrice),
        startingPricePerHour: Number(formData.startingPrice),
        portfolioLink: formData.portfolioLink.trim(),
        portfolio: portfolioFiles,
        governmentIdUploaded: Boolean(formData.govIdFile),
        governmentIdFile: formData.govIdFile
          ? { name: formData.govIdFile.name, size: formatFileSize(formData.govIdFile.size) }
          : null,
        certificates,
        portfolioFiles,
        declarationAccepted: formData.declaration,
        submittedAt: submittedAt.toISOString(),
        submissionDate: submittedAt.toLocaleDateString('en-IN'),
        submissionTime: submittedAt.toLocaleTimeString('en-IN'),
        status: 'Pending Review',
      };
      saveDesignerApplication(application);
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        addToast('Application saved, but this browser could not clear the local draft.', 'warning');
      }
      setSubmittedApplication(application);
      navigate(`/designer/apply?applicationId=${encodeURIComponent(application.applicationId)}`, { replace: true });
    } catch (error) {
      const message = error.message || 'Could not save your application in this browser session.';
      setSubmitError(message);
      addToast(message, 'error');
    } finally {
      submissionLock.current = false;
      setIsSubmitting(false);
    }
  };

  const handleCopyApplicationId = async () => {
    try {
      await navigator.clipboard.writeText(submittedApplication.applicationId);
      addToast('Application ID copied.', 'success');
    } catch {
      addToast('Could not copy the ID. Please select and copy it manually.', 'error');
    }
  };

  const editSection = (step) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderReviewCard = (title, icon, step, children) => (
    <section className="designer-review-card" key={title}>
      <div className="designer-review-card__heading">
        <h3>{icon}{title}</h3>
        <button type="button" className="designer-edit-button" onClick={() => editSection(step)}>Edit</button>
      </div>
      {children}
    </section>
  );

  if (applicationIdFromUrl && confirmationLoading) {
    return (
      <div className="zorevi-apply-page">
        <main className="designer-confirmation-loading" role="status">Loading your saved application…</main>
      </div>
    );
  }

  if (applicationIdFromUrl && submitError && !submittedApplication) {
    return (
      <div className="zorevi-apply-page">
        <main className="designer-confirmation designer-confirmation--error">
          <h1>We couldn’t load this application</h1>
          <p>{submitError}</p>
          <Link to="/designer/apply" className="zorevi-btn zorevi-btn--outline">Return to application</Link>
        </main>
      </div>
    );
  }

  if (submittedApplication) {
    const submittedAt = submittedApplication.submittedAt ? new Date(submittedApplication.submittedAt) : null;
    const submittedDate = submittedAt && !Number.isNaN(submittedAt.getTime())
      ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(submittedAt)
      : 'Date unavailable';
    const statusLabel = 'Pending Review';

    return (
      <div className="zorevi-apply-page">
        <header className="zorevi-apply-header">
          <Link to="/" className="zorevi-apply-logo" aria-label="Zorevi Homepage">
            <img src="/images/zorevi-logo.png" alt="Zorevi" className="zorevi-apply-logo-img" />
          </Link>
        </header>
        <main className="designer-confirmation">
          <div className="designer-confirmation__hero">
            <span className="designer-confirmation__icon"><CheckCircle2 size={32} /></span>
            <p className="designer-eyebrow">Designer registration</p>
            <h1>Application Submitted Successfully!</h1>
            <p>Your designer application has been received and is awaiting review.</p>
          </div>

          <div className="designer-confirmation__id">
            <div><span>Application ID</span><strong>{submittedApplication.applicationId}</strong></div>
            <button type="button" className="zorevi-btn zorevi-btn--outline" onClick={handleCopyApplicationId}><Copy size={16} /> Copy ID</button>
          </div>
          <aside className="designer-confirmation__note">
            <Info size={18} />
            <p>Please note and save your Application ID carefully. You will need this ID to check your application details and track your application status later.</p>
          </aside>
          <div className="designer-confirmation__meta">
            <span><CalendarDays size={16} /> Submitted {submittedDate}</span>
            <span className="designer-confirmation__status"><CheckCircle2 size={15} /> {statusLabel}</span>
          </div>

          <div className="designer-confirmation__actions">
            <button type="button" className="zorevi-btn zorevi-btn--primary" onClick={() => navigate(`/designer/application-status?applicationId=${encodeURIComponent(submittedApplication.applicationId)}`)}>
              Check Application Status <ArrowRight size={17} />
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="zorevi-apply-page">
      <header className="zorevi-apply-header">
        <Link to="/" className="zorevi-apply-logo" aria-label="Zorevi Homepage">
          <img src="/images/zorevi-logo.png" alt="Zorevi" className="zorevi-apply-logo-img" />
        </Link>
        <div className="zorevi-apply-header-meta">
          <span>Already applied?</span>
          <Link to="/designer/application-status" className="zorevi-apply-status-link">Check Status</Link>
        </div>
      </header>

      <main className="zorevi-apply-container container">
        <div className="zorevi-apply-title-banner">
          <span className="designer-eyebrow"><Sparkles size={14} /> YOUR NEXT CHAPTER STARTS HERE</span>
          <h1>Designer Registration Wizard</h1>
          <p>Share your story, showcase your craft, and join the Zorevi designer community.</p>
        </div>

        <section className="designer-progress-card" aria-label="Application progress">
          <div className="designer-progress-topline">
            <span>Step {currentStep} of 3</span>
            <strong>{progressPercent}% complete</strong>
          </div>
          <div className="designer-progress-track" aria-hidden="true">
            <span style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="designer-stepper">
            {STEPS.map((label, index) => {
              const step = index + 1;
              const complete = step < currentStep;
              return (
                <div className={`designer-stepper__step ${step === currentStep ? 'is-active' : ''} ${complete ? 'is-complete' : ''}`} key={label}>
                  <button type="button" onClick={() => step < currentStep && editSection(step)} aria-current={step === currentStep ? 'step' : undefined}>
                    <span className="designer-stepper__circle">{complete ? <Check size={16} /> : step}</span>
                    <span className="designer-stepper__label">{label}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="zorevi-apply-main-card">
          {currentStep === 1 && (
            <div className="designer-step-content">
              <div className="designer-section-heading">
                <span className="designer-section-icon"><UserRound size={20} /></span>
                <div><h2>Personal &amp; Contact Details</h2><p>Tell us how to reach you and where you are based.</p></div>
              </div>
              <div className="designer-form-grid">
                <div className="zorevi-apply-field">
                  <label htmlFor="designer-name">Full Name <span>*</span></label>
                  <input id="designer-name" className="zorevi-input" autoComplete="name" value={formData.fullName} onChange={(event) => updateField('fullName', event.target.value)} placeholder="e.g. Aarohi Mehta" aria-invalid={Boolean(errors.fullName)} />
                  {errors.fullName && <span className="zorevi-apply-error">{errors.fullName}</span>}
                </div>
                <div className="zorevi-apply-field">
                  <label htmlFor="designer-phone">WhatsApp Number <span>*</span></label>
                  <div className="designer-phone-input">
                    <select aria-label="Country calling code" value={formData.countryCode} onChange={(event) => updateField('countryCode', event.target.value)}>
                      <option value="+91">🇮🇳 +91</option><option value="+1">🇺🇸 +1</option><option value="+44">🇬🇧 +44</option><option value="+971">🇦🇪 +971</option>
                    </select>
                    <input id="designer-phone" className="zorevi-input" type="tel" inputMode="tel" autoComplete="tel-national" value={formData.phone} onChange={(event) => updateField('phone', event.target.value)} placeholder="98765 43210" aria-invalid={Boolean(errors.phone)} />
                  </div>
                  {errors.phone && <span className="zorevi-apply-error">{errors.phone}</span>}
                </div>
                <div className="zorevi-apply-field">
                  <label htmlFor="designer-email">Email Address <span>*</span></label>
                  <input id="designer-email" className="zorevi-input" type="email" autoComplete="email" value={formData.email} onChange={(event) => updateField('email', event.target.value)} placeholder="you@example.com" aria-invalid={Boolean(errors.email)} />
                  {errors.email && <span className="zorevi-apply-error">{errors.email}</span>}
                </div>
                <div className="zorevi-apply-field">
                  <label htmlFor="designer-city">City <span>*</span></label>
                  <div className="designer-input-with-icon"><MapPin size={17} /><select id="designer-city" className="zorevi-input" value={formData.city} onChange={(event) => updateField('city', event.target.value)} aria-invalid={Boolean(errors.city)}>
                    <option value="">Select your city</option>{CITY_OPTIONS.map((city) => <option value={city} key={city}>{city}</option>)}
                  </select></div>
                  {errors.city && <span className="zorevi-apply-error">{errors.city}</span>}
                </div>
                <div className="zorevi-apply-field designer-form-grid__full">
                  <label htmlFor="designer-address">Address <span>*</span></label>
                  <textarea id="designer-address" className="zorevi-textarea" rows="3" autoComplete="street-address" value={formData.address} onChange={(event) => updateField('address', event.target.value)} placeholder="House / street, locality, and postal code" aria-invalid={Boolean(errors.address)} />
                  {errors.address && <span className="zorevi-apply-error">{errors.address}</span>}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="designer-step-content">
              <div className="designer-section-heading">
                <span className="designer-section-icon"><Award size={20} /></span>
                <div><h2>Professional Profile &amp; Portfolio</h2><p>Highlight your strengths, experience, and creative work.</p></div>
              </div>

              <div className="zorevi-apply-field">
                <div className="designer-label-row"><label htmlFor="skill-search">Fashion Design Skills <span>*</span></label><span>{allSkills.length} selected</span></div>
                <input id="skill-search" className="zorevi-input" type="search" value={skillSearch} onChange={(event) => setSkillSearch(event.target.value)} placeholder="Search skills..." />
                <div className="designer-skill-grid">
                  {SKILL_OPTIONS.filter((skill) => skill.toLowerCase().includes(skillSearch.toLowerCase())).map((skill) => {
                    const selected = formData.selectedSkills.includes(skill);
                    return <button type="button" className={`designer-skill-chip ${selected ? 'is-selected' : ''}`} key={skill} onClick={() => toggleSkill(skill)} aria-pressed={selected}>{selected && <Check size={14} />}{skill}</button>;
                  })}
                </div>
                <div className="designer-custom-skill">
                  <input className="zorevi-input" value={formData.customSkill} onChange={(event) => updateField('customSkill', event.target.value)} placeholder="Add a custom skill (optional)" aria-label="Custom skill" />
                  <button type="button" className="zorevi-btn zorevi-btn--outline" disabled={!formData.customSkill.trim() || formData.selectedSkills.includes(formData.customSkill.trim())} onClick={() => { updateField('selectedSkills', [...formData.selectedSkills, formData.customSkill.trim()]); updateField('customSkill', ''); }}>Add skill</button>
                </div>
                {errors.selectedSkills && <span className="zorevi-apply-error">{errors.selectedSkills}</span>}
              </div>

              <div className="designer-form-grid">
                <div className="zorevi-apply-field">
                  <label htmlFor="designer-experience">Experience <span>*</span></label>
                  <select id="designer-experience" className="zorevi-input" value={formData.experience} onChange={(event) => updateField('experience', event.target.value)}>
                    <option value="">Select your experience</option>{EXPERIENCE_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>{errors.experience && <span className="zorevi-apply-error">{errors.experience}</span>}
                </div>
                <div className="zorevi-apply-field">
                  <label htmlFor="designer-price">Starting Price / Hour (INR) <span>*</span></label>
                  <div className="designer-price-input"><span>₹</span><input id="designer-price" className="zorevi-input" type="number" min="0" step="1" inputMode="numeric" value={formData.startingPrice} onChange={(event) => updateField('startingPrice', event.target.value)} placeholder="₹ e.g. 500 / hour" /></div>
                  {errors.startingPrice && <span className="zorevi-apply-error">{errors.startingPrice}</span>}
                </div>
              </div>

              <div className="designer-subsection">
                <div className="designer-subsection__heading"><ShieldCheck size={18} /><div><h3>Government ID &amp; Certificates</h3><p>Documents are uploaded with your application. Draft saves do not include files.</p></div></div>
                <div className="designer-doc-grid">
                  <div className="designer-doc-upload">
                    <div><strong>Government ID document</strong><small>PDF or image · max 10 MB</small></div>
                    {formData.govIdFile ? <span className="designer-file-pill"><CheckCircle2 size={15} /> ID document added <button type="button" aria-label="Remove government ID" onClick={() => updateField('govIdFile', null)}><X size={15} /></button></span> : <label className="zorevi-btn zorevi-btn--outline zorevi-btn--sm">Upload ID<input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={(event) => { updateDocument('govIdFile', event.target.files?.[0]); event.target.value = ''; }} /></label>}
                  </div>
                  {errors.govIdFile && <span className="zorevi-apply-error">{errors.govIdFile}</span>}
                  <div className="designer-doc-upload">
                    <div><strong>Fashion design certificates / college ID</strong><small>Multiple files accepted · max 10 MB each</small></div>
                    <label className="zorevi-btn zorevi-btn--outline zorevi-btn--sm">Add certificates<input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={(event) => { Array.from(event.target.files || []).forEach((file) => updateDocument('certificates', file)); event.target.value = ''; }} /></label>
                  </div>
                  {formData.certificates.length > 0 && <ul className="designer-document-list">{formData.certificates.map((file, index) => <li key={`${file.name}-${index}`}><FileText size={15} /><span>{file.name} <small>{formatFileSize(file.size)}</small></span><button type="button" aria-label={`Remove ${file.name}`} onClick={() => updateField('certificates', formData.certificates.filter((_, itemIndex) => index !== itemIndex))}><X size={15} /></button></li>)}</ul>}
                  {errors.certificates && <span className="zorevi-apply-error">{errors.certificates}</span>}
                </div>
              </div>

              <div className="designer-subsection">
                <div className="designer-subsection__heading"><ImageIcon size={18} /><div><h3>Portfolio Gallery</h3><p>Upload JPG, JPEG, PNG, or WEBP images up to 10 MB each.</p></div></div>
                <div className={`designer-gallery-uploader ${dragging ? 'is-dragging' : ''}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false); }} onDrop={(event) => { event.preventDefault(); setDragging(false); addPortfolioFiles(event.dataTransfer.files); }}>
                  <span className="designer-gallery-uploader__icon"><UploadCloud size={25} /></span>
                  <strong>Drop your work here</strong><span>or browse from your device</span>
                  <button type="button" className="zorevi-btn zorevi-btn--outline" onClick={() => fileInputRef.current?.click()}>Browse files</button>
                  <input ref={fileInputRef} type="file" multiple accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(event) => { addPortfolioFiles(event.target.files); event.target.value = ''; }} />
                </div>
                {errors.portfolioFiles && <span className="zorevi-apply-error">{errors.portfolioFiles}</span>}
                {formData.portfolioFiles.length > 0 && <div className="designer-gallery-grid">{formData.portfolioFiles.map((item, index) => <div className="designer-gallery-item" key={`${item.name}-${index}`}><img src={item.preview} alt={`Portfolio preview: ${item.name}`} /><span>{item.name}<small>{item.size}</small></span><button type="button" aria-label={`Remove ${item.name}`} onClick={() => removePortfolioFile(index)}><X size={15} /></button></div>)}</div>}
                <button type="button" className="designer-add-images" onClick={() => fileInputRef.current?.click()}><UploadCloud size={16} /> Add more images</button>
              </div>

              <div className="zorevi-apply-field designer-portfolio-link">
                <label htmlFor="designer-portfolio-link">Portfolio link <span className="designer-optional">(optional)</span></label>
                <div className="designer-input-with-icon"><Link2 size={17} /><input id="designer-portfolio-link" className="zorevi-input" type="url" value={formData.portfolioLink} onChange={(event) => updateField('portfolioLink', event.target.value)} placeholder="Instagram, Behance, or your website" /></div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="designer-step-content">
              <div className="designer-section-heading">
                <span className="designer-section-icon"><CheckCircle2 size={20} /></span>
                <div><h2>Review &amp; Submit</h2><p>Make sure everything looks right before sending your application.</p></div>
              </div>
              <div className="designer-review-grid">
                {renderReviewCard('Personal Information', <UserRound size={17} />, 1, <p>{formData.fullName || 'Not provided'}</p>)}
                {renderReviewCard('Contact Information', <FileText size={17} />, 1, <><p>{formData.email || 'Not provided'}</p><p>{formData.countryCode} {formData.phone || 'Not provided'}</p></>)}
                {renderReviewCard('Location', <MapPin size={17} />, 1, <><p>{formData.address || 'Not provided'}</p><p>{formData.city || 'Not selected'}</p></>)}
                {renderReviewCard('Fashion Skills', <Sparkles size={17} />, 2, <div className="designer-review-tags">{allSkills.length ? allSkills.map((skill) => <span key={skill}>{skill}</span>) : <p>No skills selected</p>}</div>)}
                {renderReviewCard('Experience', <Award size={17} />, 2, <p>{formData.experience || 'Not selected'}</p>)}
                {renderReviewCard('Pricing', <span className="designer-review-currency">₹</span>, 2, <p>{formData.startingPrice ? `₹${Number(formData.startingPrice).toLocaleString('en-IN')} onwards` : 'Not provided'}</p>)}
                {renderReviewCard('Government ID Verification', <ShieldCheck size={17} />, 2, <p className="designer-review-private">{formData.govIdFile ? 'ID document added · file details hidden' : 'No ID document added'}</p>)}
                {renderReviewCard('Certificates', <FileText size={17} />, 2, <p>{formData.certificates.length ? `${formData.certificates.length} certificate${formData.certificates.length === 1 ? '' : 's'} added` : 'No certificates added'}</p>)}
                {renderReviewCard('Portfolio Gallery', <ImageIcon size={17} />, 2, formData.portfolioFiles.length ? <div className="designer-review-gallery">{formData.portfolioFiles.map((item, index) => <img src={item.preview} alt={`Portfolio work ${index + 1}`} key={`${item.name}-${index}`} />)}</div> : <p>No portfolio images added</p>)}
                {renderReviewCard('Portfolio Link', <Link2 size={17} />, 2, formData.portfolioLink ? <a href={formData.portfolioLink} target="_blank" rel="noreferrer">{formData.portfolioLink}</a> : <p>No portfolio link added</p>)}
              </div>

              <label className="designer-declaration">
                <input type="checkbox" checked={formData.declaration} onChange={(event) => updateField('declaration', event.target.checked)} />
                <span>I hereby declare that the information and documents provided in this application are accurate and genuine to the best of my knowledge.</span>
              </label>
              {errors.declaration && <span className="zorevi-apply-error">{errors.declaration}</span>}
            </div>
          )}

          <div className="zorevi-apply-footer-bar">
            <div className="designer-footer-left">
              {currentStep > 1 ? <button type="button" className="zorevi-btn zorevi-btn--outline" onClick={() => goToStep(currentStep - 1)}><ArrowLeft size={16} /> Back</button> : <Link to="/designer/login" className="zorevi-btn zorevi-btn--ghost">Cancel</Link>}
              {currentStep === 3 && <button type="button" className="zorevi-btn zorevi-btn--outline" onClick={handleSaveDraft}>Save as Draft</button>}
              {draftSaved && <span className="designer-draft-saved"><Check size={14} /> Draft saved</span>}
            </div>
            {currentStep < 3 ? <button type="button" className="zorevi-btn zorevi-btn--primary" onClick={() => goToStep(currentStep + 1)}>Save &amp; Continue <ArrowRight size={16} /></button> : <button type="button" className="zorevi-btn zorevi-btn--primary" disabled={!canSubmit || isSubmitting} onClick={handleSubmit}>{isSubmitting ? 'Submitting…' : 'Submit Application'} {!isSubmitting && <ArrowRight size={16} />}</button>}
          </div>
          {submitError && <p className="designer-submit-error" role="alert">{submitError}</p>}
          {currentStep === 3 && !canSubmit && <p className="designer-submit-hint">Complete the required fields and accept the declaration to submit.</p>}
        </section>
        <p className="designer-privacy-note"><ShieldCheck size={15} /> Government ID document details are kept out of your public application status view.</p>
      </main>
    </div>
  );
}
