import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    }
  };

  return (
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
                      <span>{skill}</span>
                    </label>
                  ))}
                </div>
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
  );
}
