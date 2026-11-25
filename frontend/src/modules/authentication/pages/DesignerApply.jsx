import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Check, ArrowRight, ArrowLeft, UploadCloud, CheckCircle2, FileText,
  User, Award, Image as ImageIcon, ShieldCheck, Clock, X, Trash2
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import '../Auth.css';
import './DesignerApply.css';

const SPECIALIZATION_OPTIONS = [
  "Women's Styling",
  "Men's Styling",
  "Bridal & Groom",
  "Kids' Styling",
  "Couple Styling",
  "Family Styling",
  "Personal Styling",
  "Traditional & Ethnic",
  "Contemporary & Western",
  "Custom Tailoring",
  "Wardrobe Curation",
  "Occasion & Party Wear",
];

const CITY_OPTIONS = [
  'Hyderabad',
  'Mumbai',
  'Delhi NCR',
  'Bengaluru',
  'Chennai',
  'Kolkata',
  'Pune',
];

export default function DesignerApply() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    brandName: '',
    email: '',
    phone: '',
    city: 'Hyderabad',
    area: '',
    profileType: 'individual', // 'individual' or 'studio'
    bio: '',
    selectedSkills: [],
    experience: '',
    startingPrice: '799',
    portfolioLink: '',
    notableWork: '',
    portfolioFiles: [],
    govIdFile: null,
    businessDocFile: null,
    addressDocFile: null,
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const { addToast } = useApp();
  const navigate = useNavigate();

  // Field change handler
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Toggle skills in Step 2
  const toggleSkill = (skill) => {
    setFormData((prev) => {
      const skills = prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter((s) => s !== skill)
        : [...prev.selectedSkills, skill];
      return { ...prev, selectedSkills: skills };
    });
    if (errors.selectedSkills) {
      setErrors((prev) => ({ ...prev, selectedSkills: '' }));
    }
  };

  // Portfolio image upload handler
  const handlePortfolioUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        portfolioFiles: [
          ...prev.portfolioFiles,
          ...files.map((f) => ({
            name: f.name,
            size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
          })),
        ],
      }));
      addToast(`Added ${files.length} portfolio item(s)`, 'success');
      if (errors.portfolioFiles) {
        setErrors((prev) => ({ ...prev, portfolioFiles: '' }));
      }
    }
  };

  const removePortfolioFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      portfolioFiles: prev.portfolioFiles.filter((_, i) => i !== index),
    }));
  };

  // Document upload handler for Step 5
  const handleDocUpload = (field, e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [field]: { name: file.name, size: `${(file.size / 1024).toFixed(0)} KB` },
      }));
      addToast(`Uploaded ${file.name}`, 'success');
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }
    }
  };

  const removeDoc = (field) => {
    setFormData((prev) => ({ ...prev, [field]: null }));
  };

  // Step validation
  const validateStep = (step) => {
    const nextErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) nextErrors.fullName = 'Full Name is required';
      if (!formData.email.trim()) {
        nextErrors.email = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        nextErrors.email = 'Please enter a valid email address';
      }
      if (!formData.phone.trim()) {
        nextErrors.phone = 'Phone number is required';
      } else if (formData.phone.trim().length < 8) {
        nextErrors.phone = 'Please enter a valid phone number';
      }
      if (!formData.city) nextErrors.city = 'Please select your primary city';
      if (!formData.bio.trim()) {
        nextErrors.bio = 'Please write a short bio or design philosophy';
      } else if (formData.bio.trim().length < 20) {
        nextErrors.bio = 'Bio should be at least 20 characters';
      }
    }

    if (step === 2) {
      if (formData.selectedSkills.length === 0) {
        nextErrors.selectedSkills = 'Please select at least 1 specialization';
      }
    }

    if (step === 3) {
      if (!formData.experience) {
        nextErrors.experience = 'Please select your years of experience';
      }
    }

    if (step === 4) {
      if (formData.portfolioFiles.length === 0) {
        nextErrors.portfolioFiles = 'Please upload at least 1 portfolio image';
      }
    }

    if (step === 5) {
      if (!formData.govIdFile) {
        nextErrors.govIdFile = 'Government ID proof is required for verification';
      }
      if (!formData.agreeTerms) {
        nextErrors.agreeTerms = 'Please confirm and agree to continue';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      addToast('Please fill all required fields before proceeding.', 'warning');
      return;
    }

    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Step 5 Submit
      const appId = `DZ-${Math.floor(1000 + Math.random() * 9000)}`;
      const applicationRecord = {
        applicationId: appId,
        fullName: formData.fullName,
        brandName: formData.brandName || formData.fullName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        area: formData.area || 'City Center',
        profileType: formData.profileType,
        experience: formData.experience,
        skills: formData.selectedSkills,
        submissionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'pending',
      };

      sessionStorage.setItem('zorevi_designer_application', JSON.stringify(applicationRecord));
      addToast(`Application ${appId} submitted successfully! Your review is in progress.`, 'success');
      navigate('/designer/application-status');
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Dynamic Checklist Calculation
  const isProfileComplete = Boolean(
    formData.fullName.trim() &&
    formData.email.trim() &&
    formData.phone.trim() &&
    formData.bio.trim()
  );
  const isSkillsComplete = formData.selectedSkills.length > 0;
  const isExperienceComplete = Boolean(formData.experience);
  const isPortfolioComplete = formData.portfolioFiles.length > 0;
  const isVerificationComplete = Boolean(formData.govIdFile);

  const completedCount = [
    isProfileComplete,
    isSkillsComplete,
    isExperienceComplete,
    isPortfolioComplete,
    isVerificationComplete,
  ].filter(Boolean).length;

  const progressPercent = Math.round((completedCount / 5) * 100);

  return (
    <div className="zorevi-apply-page">
      {/* Top Header */}
      <header className="zorevi-apply-header">
        <Link to="/" className="zorevi-apply-logo" aria-label="Zorevi Homepage">
          <img
            src="/images/zorevi-logo.png"
            alt="Zorevi – Shopping | Happy | Stylish"
            className="zorevi-apply-logo-img"
          />
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
            { num: 1, label: 'Profile Details', done: isProfileComplete },
            { num: 2, label: 'Skills & Services', done: isSkillsComplete },
            { num: 3, label: 'Experience & Pricing', done: isExperienceComplete },
            { num: 4, label: 'Portfolio', done: isPortfolioComplete },
            { num: 5, label: 'Verification', done: isVerificationComplete },
          ].map((s) => (
            <div
              key={s.num}
              className={`zorevi-apply-step-item ${currentStep === s.num ? 'active' : ''} ${s.done ? 'completed' : ''}`}
              onClick={() => setCurrentStep(s.num)}
            >
              <div className="zorevi-apply-step-circle">
                {s.done ? <Check size={14} /> : s.num}
              </div>
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Two-Column Workspace */}
        <div className="zorevi-apply-body-grid">
          {/* Left Form Area */}
          <div className="zorevi-apply-main-card">
            {/* STEP 1: Profile Details */}
            {currentStep === 1 && (
              <div className="zorevi-apply-pane">
                <h3 className="zorevi-apply-pane-title">
                  <User size={18} color="#7C3AED" /> Profile &amp; Contact Details
                </h3>
                <p className="zorevi-apply-pane-sub">Tell us about yourself and your styling background.</p>

                <div className="zorevi-apply-row-2col">
                  <div className="zorevi-apply-field">
                    <label>Full Name / Designer Name *</label>
                    <input
                      type="text"
                      className="zorevi-input"
                      placeholder="e.g. Aarohi Mehta"
                      value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                    />
                    {errors.fullName && <span className="zorevi-apply-error">{errors.fullName}</span>}
                  </div>

                  <div className="zorevi-apply-field">
                    <label>Brand / Studio Name (Optional)</label>
                    <input
                      type="text"
                      className="zorevi-input"
                      placeholder="e.g. Aarohi Styles Studio"
                      value={formData.brandName}
                      onChange={(e) => updateField('brandName', e.target.value)}
                    />
                  </div>
                </div>

                <div className="zorevi-apply-row-2col">
                  <div className="zorevi-apply-field">
                    <label>Email Address or Gmail *</label>
                    <input
                      type="email"
                      className="zorevi-input"
                      placeholder="e.g. aarohi@zorevi.in"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                    />
                    {errors.email && <span className="zorevi-apply-error">{errors.email}</span>}
                  </div>

                  <div className="zorevi-apply-field">
                    <label>Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      className="zorevi-input"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                    />
                    {errors.phone && <span className="zorevi-apply-error">{errors.phone}</span>}
                  </div>
                </div>

                <div className="zorevi-apply-row-2col">
                  <div className="zorevi-apply-field">
                    <label>Primary Operating City *</label>
                    <select
                      className="zorevi-input"
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                    >
                      {CITY_OPTIONS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {errors.city && <span className="zorevi-apply-error">{errors.city}</span>}
                  </div>

                  <div className="zorevi-apply-field">
                    <label>Locality / Neighborhood (Optional)</label>
                    <input
                      type="text"
                      className="zorevi-input"
                      placeholder="e.g. Banjara Hills, Jubilee Hills"
                      value={formData.area}
                      onChange={(e) => updateField('area', e.target.value)}
                    />
                  </div>
                </div>

                <div className="zorevi-apply-field">
                  <label>Profile Type *</label>
                  <div className="zorevi-apply-radio-row">
                    <label className={`zorevi-apply-radio-pill ${formData.profileType === 'individual' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="profileType"
                        checked={formData.profileType === 'individual'}
                        onChange={() => updateField('profileType', 'individual')}
                      />
                      <span>Individual Designer / Stylist</span>
                    </label>

                    <label className={`zorevi-apply-radio-pill ${formData.profileType === 'studio' ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="profileType"
                        checked={formData.profileType === 'studio'}
                        onChange={() => updateField('profileType', 'studio')}
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
                    placeholder="Write a short summary of your design philosophy, background, and what makes your styling unique..."
                    value={formData.bio}
                    onChange={(e) => updateField('bio', e.target.value)}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    {errors.bio ? (
                      <span className="zorevi-apply-error">{errors.bio}</span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Minimum 20 characters</span>
                    )}
                    <small style={{ color: '#9CA3AF' }}>
                      {formData.bio.length}/300
                    </small>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Skills & Services */}
            {currentStep === 2 && (
              <div className="zorevi-apply-pane">
                <h3 className="zorevi-apply-pane-title">
                  <FileText size={18} color="#7C3AED" /> Styling Specializations
                </h3>
                <p className="zorevi-apply-pane-sub">
                  Select all styling categories you specialize in ({formData.selectedSkills.length} selected).
                </p>

                {errors.selectedSkills && (
                  <p className="zorevi-apply-error" style={{ marginBottom: '14px' }}>
                    {errors.selectedSkills}
                  </p>
                )}

                <div className="zorevi-apply-skills-grid">
                  {SPECIALIZATION_OPTIONS.map((skill) => {
                    const isChecked = formData.selectedSkills.includes(skill);
                    return (
                      <label
                        key={skill}
                        className={`zorevi-apply-skill-checkbox ${isChecked ? 'checked' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSkill(skill)}
                        />
                        <span>{skill}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: Experience & Pricing */}
            {currentStep === 3 && (
              <div className="zorevi-apply-pane">
                <h3 className="zorevi-apply-pane-title">
                  <Award size={18} color="#7C3AED" /> Experience &amp; Consultation Pricing
                </h3>
                <p className="zorevi-apply-pane-sub">Share your industry experience and starting session packages.</p>

                <div className="zorevi-apply-row-2col">
                  <div className="zorevi-apply-field">
                    <label>Total Experience in Fashion *</label>
                    <select
                      className="zorevi-input"
                      value={formData.experience}
                      onChange={(e) => updateField('experience', e.target.value)}
                    >
                      <option value="">Select experience</option>
                      <option value="Less than 1 year">Less than 1 year</option>
                      <option value="1–2 years">1–2 years</option>
                      <option value="3–5 years">3–5 years</option>
                      <option value="5+ years">5+ years</option>
                      <option value="8+ years">8+ years</option>
                      <option value="10+ years">10+ years</option>
                    </select>
                    {errors.experience && <span className="zorevi-apply-error">{errors.experience}</span>}
                  </div>

                  <div className="zorevi-apply-field">
                    <label>Starting Package Rate (2 Hours) *</label>
                    <select
                      className="zorevi-input"
                      value={formData.startingPrice}
                      onChange={(e) => updateField('startingPrice', e.target.value)}
                    >
                      <option value="499">₹499 (Standard Entry Package)</option>
                      <option value="699">₹699 / 2 Hours</option>
                      <option value="799">₹799 / 2 Hours</option>
                      <option value="999">₹999 / 2 Hours</option>
                      <option value="1299">₹1,299 / 2 Hours</option>
                      <option value="1499">₹1,499 / 2 Hours</option>
                      <option value="1999">₹1,999 / 2 Hours</option>
                    </select>
                  </div>
                </div>

                <div className="zorevi-apply-field">
                  <label>Portfolio Link / Instagram / Website (Optional)</label>
                  <input
                    type="url"
                    className="zorevi-input"
                    placeholder="https://instagram.com/yourhandle or portfolio URL"
                    value={formData.portfolioLink}
                    onChange={(e) => updateField('portfolioLink', e.target.value)}
                  />
                </div>

                <div className="zorevi-apply-field">
                  <label>Previous / Notable Work (Optional)</label>
                  <textarea
                    className="zorevi-textarea"
                    rows="3"
                    placeholder="e.g. High-profile clients, fashion weeks, boutique styling, awards..."
                    value={formData.notableWork}
                    onChange={(e) => updateField('notableWork', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* STEP 4: Portfolio Upload */}
            {currentStep === 4 && (
              <div className="zorevi-apply-pane">
                <h3 className="zorevi-apply-pane-title">
                  <ImageIcon size={18} color="#7C3AED" /> Portfolio Upload
                </h3>
                <p className="zorevi-apply-pane-sub">
                  Upload photos showcasing your styling work, outfits, or design lookbooks.
                </p>

                <div className="zorevi-apply-upload-dropzone">
                  <UploadCloud size={40} color="#7C3AED" />
                  <h4>Drag and drop images here, or browse files</h4>
                  <p>Supports JPG, PNG, WEBP up to 10MB each</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePortfolioUpload}
                    style={{ display: 'none' }}
                    id="portfolio-file-input"
                  />
                  <label htmlFor="portfolio-file-input" className="zorevi-btn zorevi-btn--outline zorevi-btn--sm">
                    Select Images
                  </label>
                </div>

                {errors.portfolioFiles && (
                  <p className="zorevi-apply-error" style={{ marginTop: '10px' }}>
                    {errors.portfolioFiles}
                  </p>
                )}

                {formData.portfolioFiles.length > 0 ? (
                  <div style={{ marginTop: '20px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#374151' }}>
                      Uploaded Portfolio Images ({formData.portfolioFiles.length})
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                      {formData.portfolioFiles.map((file, i) => (
                        <span key={i} className="zorevi-uploaded-pill">
                          <CheckCircle2 size={13} color="#10B981" />
                          <span>{file.name}</span>
                          <button
                            type="button"
                            className="zorevi-uploaded-remove-btn"
                            onClick={() => removePortfolioFile(i)}
                            title="Remove file"
                          >
                            <X size={13} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p style={{ marginTop: '16px', fontSize: '0.8rem', color: '#9CA3AF' }}>
                    No photos uploaded yet. Select images to showcase your work to prospective clients.
                  </p>
                )}
              </div>
            )}

            {/* STEP 5: Verification Documents */}
            {currentStep === 5 && (
              <div className="zorevi-apply-pane">
                <h3 className="zorevi-apply-pane-title">
                  <ShieldCheck size={18} color="#10B981" /> Government &amp; Business Verification
                </h3>
                <p className="zorevi-apply-pane-sub">
                  Upload verification documents for our concierge compliance team.
                </p>

                {/* 1. Government ID */}
                <div className="zorevi-apply-doc-row">
                  <div>
                    <strong>Government ID Proof (Aadhaar / PAN / Passport) *</strong>
                    <small>Required to ensure verified, trustworthy customer experiences</small>
                  </div>
                  <div className="zorevi-apply-doc-actions">
                    {formData.govIdFile ? (
                      <span className="zorevi-doc-status-badge uploaded">
                        <CheckCircle2 size={13} /> {formData.govIdFile.name}
                        <button
                          type="button"
                          className="zorevi-uploaded-remove-btn"
                          onClick={() => removeDoc('govIdFile')}
                          title="Remove file"
                        >
                          <X size={13} />
                        </button>
                      </span>
                    ) : (
                      <label className="zorevi-btn zorevi-btn--outline zorevi-btn--sm">
                        Upload ID
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleDocUpload('govIdFile', e)}
                        />
                      </label>
                    )}
                  </div>
                </div>
                {errors.govIdFile && (
                  <span className="zorevi-apply-error" style={{ marginBottom: '12px' }}>
                    {errors.govIdFile}
                  </span>
                )}

                {/* 2. Business Proof */}
                <div className="zorevi-apply-doc-row">
                  <div>
                    <strong>Business / Studio Registration (Optional)</strong>
                    <small>Shop license, GST or business registration if applicable</small>
                  </div>
                  <div className="zorevi-apply-doc-actions">
                    {formData.businessDocFile ? (
                      <span className="zorevi-doc-status-badge uploaded">
                        <CheckCircle2 size={13} /> {formData.businessDocFile.name}
                        <button
                          type="button"
                          className="zorevi-uploaded-remove-btn"
                          onClick={() => removeDoc('businessDocFile')}
                          title="Remove file"
                        >
                          <X size={13} />
                        </button>
                      </span>
                    ) : (
                      <label className="zorevi-btn zorevi-btn--outline zorevi-btn--sm">
                        Upload Doc
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleDocUpload('businessDocFile', e)}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* 3. Address Proof */}
                <div className="zorevi-apply-doc-row">
                  <div>
                    <strong>Studio Address Proof (Optional)</strong>
                    <small>Utility bill, lease agreement or studio letterhead</small>
                  </div>
                  <div className="zorevi-apply-doc-actions">
                    {formData.addressDocFile ? (
                      <span className="zorevi-doc-status-badge uploaded">
                        <CheckCircle2 size={13} /> {formData.addressDocFile.name}
                        <button
                          type="button"
                          className="zorevi-uploaded-remove-btn"
                          onClick={() => removeDoc('addressDocFile')}
                          title="Remove file"
                        >
                          <X size={13} />
                        </button>
                      </span>
                    ) : (
                      <label className="zorevi-btn zorevi-btn--outline zorevi-btn--sm">
                        Upload Doc
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleDocUpload('addressDocFile', e)}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <div style={{ marginTop: '24px' }}>
                  <label className="zorevi-apply-checkbox-label" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.85rem', color: '#4B5563' }}>
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={(e) => updateField('agreeTerms', e.target.checked)}
                      style={{ marginTop: '2px', accentColor: '#7C3AED', width: '16px', height: '16px' }}
                    />
                    <span>
                      I declare that all details, qualifications, and verification documents provided are true and accurate.
                    </span>
                  </label>
                  {errors.agreeTerms && (
                    <span className="zorevi-apply-error" style={{ marginTop: '6px' }}>
                      {errors.agreeTerms}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="zorevi-apply-footer-bar">
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link to="/designer/login" className="zorevi-btn zorevi-btn--ghost">
                  Save &amp; Exit
                </Link>
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="zorevi-btn zorevi-btn--outline"
                    onClick={handlePrev}
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                )}
              </div>

              <button
                type="button"
                className="zorevi-btn zorevi-btn--primary"
                onClick={handleNext}
              >
                {currentStep === 5 ? 'Submit Application' : 'Save & Continue'} <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Dynamic Checklist Card */}
          <div className="zorevi-apply-checklist-card">
            <h4 className="zorevi-checklist-title">Application Readiness</h4>
            <p className="zorevi-checklist-sub">Complete each section to submit your application.</p>

            <div className="zorevi-checklist-progress-wrap">
              <div className="zorevi-checklist-progress-label">
                <span>{completedCount} of 5 Completed</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="zorevi-checklist-progress-bar">
                <div
                  className="zorevi-checklist-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <ul className="zorevi-checklist-items">
              <li className={`zorevi-checklist-item ${isProfileComplete ? 'completed' : ''}`}>
                {isProfileComplete ? (
                  <CheckCircle2 size={16} color="#10B981" />
                ) : (
                  <Clock size={16} color="#9CA3AF" />
                )}
                <div>
                  <strong>Profile &amp; Contact Details</strong>
                  <small>
                    {isProfileComplete
                      ? `${formData.fullName} (${formData.city})`
                      : 'Name, email, phone, city & bio'}
                  </small>
                </div>
              </li>

              <li className={`zorevi-checklist-item ${isSkillsComplete ? 'completed' : ''}`}>
                {isSkillsComplete ? (
                  <CheckCircle2 size={16} color="#10B981" />
                ) : (
                  <Clock size={16} color="#9CA3AF" />
                )}
                <div>
                  <strong>Styling Specializations</strong>
                  <small>
                    {isSkillsComplete
                      ? `${formData.selectedSkills.length} category(ies) selected`
                      : 'Choose your styling services'}
                  </small>
                </div>
              </li>

              <li className={`zorevi-checklist-item ${isExperienceComplete ? 'completed' : ''}`}>
                {isExperienceComplete ? (
                  <CheckCircle2 size={16} color="#10B981" />
                ) : (
                  <Clock size={16} color="#9CA3AF" />
                )}
                <div>
                  <strong>Experience &amp; Pricing</strong>
                  <small>
                    {isExperienceComplete
                      ? `${formData.experience} • From ₹${formData.startingPrice}`
                      : 'Years of exp & consultation rate'}
                  </small>
                </div>
              </li>

              <li className={`zorevi-checklist-item ${isPortfolioComplete ? 'completed' : ''}`}>
                {isPortfolioComplete ? (
                  <CheckCircle2 size={16} color="#10B981" />
                ) : (
                  <Clock size={16} color="#9CA3AF" />
                )}
                <div>
                  <strong>Portfolio Showcase</strong>
                  <small>
                    {isPortfolioComplete
                      ? `${formData.portfolioFiles.length} photo(s) uploaded`
                      : 'Upload your design photos'}
                  </small>
                </div>
              </li>

              <li className={`zorevi-checklist-item ${isVerificationComplete ? 'completed' : ''}`}>
                {isVerificationComplete ? (
                  <CheckCircle2 size={16} color="#10B981" />
                ) : (
                  <Clock size={16} color="#9CA3AF" />
                )}
                <div>
                  <strong>Government Verification ID</strong>
                  <small>
                    {isVerificationComplete
                      ? formData.govIdFile.name
                      : 'Aadhaar, PAN, or Passport'}
                  </small>
                </div>
              </li>
            </ul>

            <div className="zorevi-approval-timing-box">
              <Clock size={16} color="#7C3AED" />
              <div>
                <strong>Average review time: 24–48 hours</strong>
                <p>Our stylist onboarding team verifies submissions and reaches out directly upon approval.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
