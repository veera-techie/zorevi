import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  FileText,
  Check,
  ShieldCheck,
  Mail,
  Phone,
  Sparkles,
  MapPin,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import { AAROHI_PROFILE_IMAGE } from '../../../utils/aarohiProfileImage';
import './DesignerApplicationStatus.css';

export default function DesignerApplicationStatus() {
  const [status, setStatus] = useState('pending'); // 'pending', 'approved', 'changes_requested'
  const { login } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();

  const savedApp = (() => {
    try {
      return JSON.parse(sessionStorage.getItem('zorevi_designer_application') || '{}');
    } catch {
      return {};
    }
  })();

  const applicantName = savedApp.brandName || savedApp.fullName || 'Aarohi Mehta';
  const applicantLocation = savedApp.city
    ? `${savedApp.area ? `${savedApp.area}, ` : ''}${savedApp.city}`
    : 'Banjara Hills, Hyderabad';
  const applicantId = savedApp.applicationId || 'DZ-7812';
  const submissionDate = savedApp.submissionDate || '16 Nov 2025';

  const handleSimulateApproved = () => {
    setStatus('approved');
    addToast('Simulated approval: Application status is now Approved!', 'success');
  };

  const handleSimulateChanges = () => {
    setStatus('changes_requested');
    addToast('Simulated request: Information requested by verification officer.', 'warning');
  };

  const handleEnterDashboard = async () => {
    await login('designer');
    navigate('/designer');
  };

  return (
    <div className="zorevi-status-page">
      {/* Top Application Header */}
      <header className="zorevi-status-header">
        <Link to="/" className="zorevi-status-logo" aria-label="Zorevi Homepage">
          <img
            src="/images/zorevi-logo.png"
            alt="Zorevi – Shopping | Happy | Stylish"
            className="zorevi-status-logo-img"
          />
        </Link>

        <div className="zorevi-status-header__actions">
          <Link to="/help" className="zorevi-status-header__help">
            <HelpCircle size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
            Help &amp; Support
          </Link>
          <Link to="/designer/login" className="zorevi-btn zorevi-btn--outline zorevi-btn--sm">
            Designer Login
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="zorevi-status-container">
        <div className="zorevi-status-card">
          {/* Card Header Banner */}
          <div className="zorevi-status-card__header">
            <div className="zorevi-status-card__header-left">
              <img
                src={savedApp.avatar || AAROHI_PROFILE_IMAGE}
                alt={applicantName}
                className="zorevi-status-avatar"
              />
              <div className="zorevi-status-meta">
                <h1>{applicantName}</h1>
                <div className="zorevi-status-meta-pills">
                  <span className="zorevi-meta-pill id-pill">
                    <FileText size={12} /> ID: {applicantId}
                  </span>
                  <span className="zorevi-meta-pill">
                    <MapPin size={12} /> {applicantLocation}
                  </span>
                  <span className="zorevi-meta-pill">
                    Submitted: {submissionDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Current Status Badge */}
            <div>
              {status === 'pending' && (
                <span className="zorevi-status-badge pending">
                  <Clock size={16} /> Under Review
                </span>
              )}
              {status === 'approved' && (
                <span className="zorevi-status-badge approved">
                  <CheckCircle2 size={16} /> Approved &amp; Active
                </span>
              )}
              {status === 'changes_requested' && (
                <span className="zorevi-status-badge changes_requested">
                  <AlertTriangle size={16} /> Action Required
                </span>
              )}
            </div>
          </div>

          {/* Card Body */}
          <div className="zorevi-status-card__body">
            {/* Visual Multi-step Timeline */}
            <div className="zorevi-stepper" aria-label="Application Progress">
              <div className="zorevi-step completed">
                <div className="zorevi-step__circle">
                  <Check size={20} strokeWidth={2.5} />
                </div>
                <span className="zorevi-step__label">Submitted</span>
                <span className="zorevi-step__date">16 Nov 2025</span>
              </div>

              <div className={`zorevi-step ${status === 'approved' ? 'completed' : 'active'}`}>
                <div className="zorevi-step__circle">
                  {status === 'approved' ? <Check size={20} strokeWidth={2.5} /> : '2'}
                </div>
                <span className="zorevi-step__label">Portfolio &amp; ID</span>
                <span className="zorevi-step__date">{status === 'approved' ? 'Verified' : 'In Review'}</span>
              </div>

              <div className={`zorevi-step ${status === 'approved' ? 'completed' : status === 'changes_requested' ? 'active' : ''}`}>
                <div className="zorevi-step__circle">
                  {status === 'approved' ? <Check size={20} strokeWidth={2.5} /> : '3'}
                </div>
                <span className="zorevi-step__label">Verification</span>
                <span className="zorevi-step__date">{status === 'approved' ? 'Completed' : 'Pending'}</span>
              </div>

              <div className={`zorevi-step ${status === 'approved' ? 'completed' : ''}`}>
                <div className="zorevi-step__circle">
                  {status === 'approved' ? <Sparkles size={20} /> : '4'}
                </div>
                <span className="zorevi-step__label">Studio Live</span>
                <span className="zorevi-step__date">{status === 'approved' ? 'Ready!' : 'Final Step'}</span>
              </div>
            </div>

            {/* Dynamic Status Section */}
            {status === 'pending' && (
              <div className="zorevi-status-section pending">
                <div className="zorevi-status-section__header">
                  <div className="zorevi-status-section__icon-wrap">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="zorevi-status-section__title">Application is Under Verification</h3>
                    <p className="zorevi-status-section__sub">
                      Our fashion onboarding team is reviewing your credentials, portfolio, and identity documents.
                      Estimated turnaround is 24–48 hours.
                    </p>
                  </div>
                </div>

                {/* Checklist */}
                <div className="zorevi-checklist-grid">
                  <div className="zorevi-checklist-item">
                    <div className="zorevi-checklist-item__icon verified">
                      <ShieldCheck size={16} />
                    </div>
                    <div className="zorevi-checklist-item__info">
                      <span className="zorevi-checklist-item__title">Government ID Proof</span>
                      <span className="zorevi-checklist-item__desc">Aadhaar card uploaded &amp; verified</span>
                    </div>
                  </div>

                  <div className="zorevi-checklist-item">
                    <div className="zorevi-checklist-item__icon verified">
                      <ShieldCheck size={16} />
                    </div>
                    <div className="zorevi-checklist-item__info">
                      <span className="zorevi-checklist-item__title">Studio / Business Proof</span>
                      <span className="zorevi-checklist-item__desc">Boutique address in Banjara Hills</span>
                    </div>
                  </div>

                  <div className="zorevi-checklist-item">
                    <div className="zorevi-checklist-item__icon reviewing">
                      <Clock size={16} />
                    </div>
                    <div className="zorevi-checklist-item__info">
                      <span className="zorevi-checklist-item__title">Portfolio Review (8 Looks)</span>
                      <span className="zorevi-checklist-item__desc">Fashion curator evaluation in progress</span>
                    </div>
                  </div>

                  <div className="zorevi-checklist-item">
                    <div className="zorevi-checklist-item__icon reviewing">
                      <Clock size={16} />
                    </div>
                    <div className="zorevi-checklist-item__info">
                      <span className="zorevi-checklist-item__title">Standard Package Onboarding</span>
                      <span className="zorevi-checklist-item__desc">₹499 / 2 hours base consultation</span>
                    </div>
                  </div>
                </div>

                <div className="zorevi-status-action-box">
                  <Link to="/designer/apply" className="zorevi-btn zorevi-btn--outline zorevi-btn--sm">
                    View Submitted Application
                  </Link>
                  <Link to="/help" className="zorevi-btn zorevi-btn--ghost zorevi-btn--sm">
                    Have questions? Contact Concierge
                  </Link>
                </div>
              </div>
            )}

            {status === 'approved' && (
              <div className="zorevi-status-section approved">
                <div className="zorevi-status-section__header">
                  <div className="zorevi-status-section__icon-wrap">
                    <CheckCircle2 size={26} />
                  </div>
                  <div>
                    <h3 className="zorevi-status-section__title">Congratulations! Your Designer Studio is Active!</h3>
                    <p className="zorevi-status-section__sub">
                      Your credentials and portfolio have passed verification. You are now featured across Zorevi Hyderabad designer discovery and mall styling listings.
                    </p>
                  </div>
                </div>

                <div className="zorevi-checklist-grid">
                  <div className="zorevi-checklist-item">
                    <div className="zorevi-checklist-item__icon verified">
                      <Check size={16} />
                    </div>
                    <div className="zorevi-checklist-item__info">
                      <span className="zorevi-checklist-item__title">Verified Badge Granted</span>
                      <span className="zorevi-checklist-item__desc">Displaying on all customer search cards</span>
                    </div>
                  </div>

                  <div className="zorevi-checklist-item">
                    <div className="zorevi-checklist-item__icon verified">
                      <Check size={16} />
                    </div>
                    <div className="zorevi-checklist-item__info">
                      <span className="zorevi-checklist-item__title">Direct Booking Enabled</span>
                      <span className="zorevi-checklist-item__desc">Customers can book 2-hour styling sessions</span>
                    </div>
                  </div>
                </div>

                <div className="zorevi-status-action-box">
                  <button
                    type="button"
                    className="zorevi-btn zorevi-btn--primary zorevi-btn--lg"
                    onClick={handleEnterDashboard}
                  >
                    <span>Enter Designer Studio</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {status === 'changes_requested' && (
              <div className="zorevi-status-section changes_requested">
                <div className="zorevi-status-section__header">
                  <div className="zorevi-status-section__icon-wrap">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h3 className="zorevi-status-section__title">Note from Verification Concierge</h3>
                    <p className="zorevi-status-section__sub">
                      "Please upload a higher-resolution image for your Government ID (Aadhaar or PAN) and clarify your studio service radius in Hyderabad to complete verification."
                    </p>
                  </div>
                </div>

                <div className="zorevi-status-action-box">
                  <Link to="/designer/apply" className="zorevi-btn zorevi-btn--primary">
                    <span>Update Application Details</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Support & Concierge Card */}
        <div className="zorevi-support-card">
          <div className="zorevi-support-card__left">
            <div className="zorevi-support-card__icon">
              <Mail size={22} />
            </div>
            <div>
              <h4>Need assistance with your verification?</h4>
              <p>Our designer onboarding team is available Mon–Sat, 9:00 AM – 7:00 PM IST.</p>
            </div>
          </div>
          <div className="zorevi-support-card__contacts">
            <a href="mailto:concierge@zorevi.in" className="zorevi-support-pill">
              <Mail size={14} /> concierge@zorevi.in
            </a>
            <a href="tel:+919876543210" className="zorevi-support-pill">
              <Phone size={14} /> +91 98765 43210
            </a>
          </div>
        </div>

        {/* Demo Simulator Toolbar */}
        <div className="zorevi-status-simulator">
          <div className="zorevi-status-simulator__label">
            <RefreshCw size={13} /> Interactive Simulator: Test Different Approval States
          </div>
          <div className="zorevi-status-simulator__btns">
            <button
              type="button"
              className={`zorevi-sim-btn ${status === 'pending' ? 'active' : ''}`}
              onClick={() => setStatus('pending')}
            >
              Pending (Under Review)
            </button>
            <button
              type="button"
              className={`zorevi-sim-btn ${status === 'approved' ? 'active' : ''}`}
              onClick={handleSimulateApproved}
            >
              Approved (Studio Live)
            </button>
            <button
              type="button"
              className={`zorevi-sim-btn ${status === 'changes_requested' ? 'active' : ''}`}
              onClick={handleSimulateChanges}
            >
              Changes Requested
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
