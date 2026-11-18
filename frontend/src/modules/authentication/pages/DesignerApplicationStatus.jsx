import { useState } from 'react';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Clock3, FileCheck2, RefreshCw } from 'lucide-react';
import { AuthDemoNotice, AuthShell } from '../AuthShell';

const states = [
  { id: 'submitted', label: 'Submitted', icon: FileCheck2, title: 'Application submitted' },
  { id: 'under_review', label: 'Under review', icon: Clock3, title: 'Application under review' },
  { id: 'approved', label: 'Approved', icon: CheckCircle2, title: 'You’re approved' },
  { id: 'revision_needed', label: 'Revision needed', icon: AlertCircle, title: 'A few updates are needed' },
];

function readApplication() {
  try {
    const saved = window.sessionStorage.getItem('zorevi.demo.application');
    if (!saved) return { value: null, error: '' };
    const value = JSON.parse(saved);
    if (!value?.applicationId || !states.some((item) => item.id === value.status)) {
      return { value: null, error: 'Saved demo application details are invalid.' };
    }
    return { value, error: '' };
  } catch (error) {
    return {
      value: null,
      error: error instanceof Error ? `Could not read the saved demo application: ${error.message}` : 'Could not read the saved demo application.',
    };
  }
}

export default function DesignerApplicationStatus() {
  const [applicationState, setApplicationState] = useState(readApplication);
  const application = applicationState.value;
  const status = states.find((item) => item.id === application?.status) || states[0];
  const StatusIcon = status.icon;
  const activeStage = application ? states.findIndex((item) => item.id === status.id) : -1;

  const setDemoStatus = (nextStatus) => {
    const updated = {
      ...(application || {}),
      applicationId: application?.applicationId || `ZV-${Math.floor(100000 + Math.random() * 900000)}`,
      submittedAt: application?.submittedAt || new Date().toISOString(),
      status: nextStatus,
    };
    try {
      window.sessionStorage.setItem('zorevi.demo.application', JSON.stringify(updated));
      setApplicationState({ value: updated, error: '' });
    } catch (error) {
      setApplicationState({
        value: application,
        error: error instanceof Error ? `Could not save this demo status: ${error.message}` : 'Could not save this demo status.',
      });
    }
  };

  return (
    <AuthShell image="/images/designer-studio-hero.jpg">
      <div className={`zorevi-apply-status zorevi-apply-status--${status.id}`}>
        <p className="zorevi-auth-progress">Designer application status</p>
        <div className="zorevi-apply-status-icon"><StatusIcon size={28} aria-hidden="true" /></div>
        <h2 className="zorevi-auth-form-title">{application ? status.title : 'No application found'}</h2>
        <p className="zorevi-auth-form-sub">
          {application
            ? `Application ${application.applicationId} · Submitted ${new Date(application.submittedAt).toLocaleDateString()}`
            : 'No submitted demo application was found in this browser.'}
        </p>
        <AuthDemoNotice>Demo status only. Changes are saved in this browser and are not reviewed by Zorevi staff.</AuthDemoNotice>
        {applicationState.error && <p className="zorevi-auth-error" role="alert">{applicationState.error}</p>}

        <ol className="zorevi-apply-status-steps" aria-label="Application review stages">
          {states.slice(0, 3).map((item, index) => (
            <li key={item.id} className={activeStage >= index ? 'complete' : ''}>
              <span>{index + 1}</span>{item.label}
            </li>
          ))}
        </ol>

        <div className="zorevi-apply-status-message" role="status">
          {!application && <p>Submit a designer application to see its local demo status. Applications are reviewed before booking access is enabled.</p>}
          {application && status.id === 'submitted' && <p>Your application has been saved in this browser. In a connected service, you would receive a confirmation after submitting.</p>}
          {application && status.id === 'under_review' && <p>Applications are reviewed before booking access is enabled. This demo state does not represent a real review.</p>}
          {application && status.id === 'approved' && <p>Approval is simulated for this demo. A real application must be reviewed before studio booking access is enabled.</p>}
          {application && status.id === 'revision_needed' && <p>The demo requests a revision. In production, the review team would explain which information needs an update.</p>}
        </div>

        {status.id === 'approved' && <Link to="/designer/login" className="zorevi-auth-submit">Continue to designer sign in</Link>}
        {status.id === 'revision_needed' && <Link to="/designer/apply" className="zorevi-auth-submit">Update application</Link>}
        {!application && <Link to="/designer/apply" className="zorevi-auth-submit">Start an application</Link>}

        <div className="zorevi-apply-demo-controls">
          <strong><RefreshCw size={14} aria-hidden="true" /> Interactive demo states</strong>
          <div>
            {states.map((item) => (
              <button
                type="button"
                key={item.id}
                aria-pressed={status.id === item.id}
                onClick={() => setDemoStatus(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <p className="zorevi-auth-footer-prompt"><Link to="/designer/login" className="zorevi-auth-link">Back to designer sign in</Link></p>
      </div>
    </AuthShell>
  );
}
=======
import { Link, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, AlertTriangle, ArrowRight, FileText, RefreshCw } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import '../Auth.css';

export default function DesignerApplicationStatus() {
  const [status, setStatus] = useState('pending'); // 'pending', 'approved', 'changes_requested'
  const { login } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();

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
    <div className="zorevi-auth-page" style={{ justifyContent: 'center', alignItems: 'center', background: '#F5F0FF', padding: '24px' }}>
      <div className="zorevi-auth-form-wrap" style={{ background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 20px 40px rgba(124, 58, 237, 0.1)', padding: '40px', maxWidth: '580px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          {status === 'pending' && (
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#FFFBEB', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Clock size={32} />
            </div>
          )}
          {status === 'approved' && (
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={32} />
            </div>
          )}
          {status === 'changes_requested' && (
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#EFF6FF', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <AlertTriangle size={32} />
            </div>
          )}

          <h2 className="zorevi-auth-form-title">
            {status === 'pending' && 'Application Under Review'}
            {status === 'approved' && 'Congratulations! You are Approved!'}
            {status === 'changes_requested' && 'Additional Information Requested'}
          </h2>

          <p className="zorevi-auth-form-sub" style={{ marginTop: '8px' }}>
            Application ID: <strong>DZ-7812</strong> • Submitted: 16 Nov 2025
          </p>
        </div>

        {/* Status Content */}
        {status === 'pending' && (
          <div style={{ background: '#FAF5FF', border: '1px solid #DDD6FE', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
            <h4 style={{ color: '#1E1B4B', fontSize: '0.95rem', marginBottom: '8px' }}>What happens next?</h4>
            <ul style={{ fontSize: '0.82rem', color: '#4B5563', lineHeight: '1.6', paddingLeft: '18px', listStyleType: 'disc' }}>
              <li>Our designer onboarding team is verifying your portfolio & ID documents.</li>
              <li>Estimated turnaround time is 24–48 hours.</li>
              <li>Once verified, your profile will be live on Zorevi discovery and mall listings.</li>
            </ul>
          </div>
        )}

        {status === 'approved' && (
          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
            <h4 style={{ color: '#065F46', fontSize: '0.95rem', marginBottom: '8px' }}>Your Profile is Active!</h4>
            <p style={{ fontSize: '0.85rem', color: '#047857', margin: 0, lineHeight: '1.5' }}>
              You can now configure your styling services, set standard package rates (starting ₹499/2 hrs), and begin accepting customer bookings.
            </p>
            <button
              className="zorevi-btn zorevi-btn--primary zorevi-btn--full"
              style={{ marginTop: '16px' }}
              onClick={handleEnterDashboard}
            >
              Enter Designer Studio <ArrowRight size={16} />
            </button>
          </div>
        )}

        {status === 'changes_requested' && (
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
            <h4 style={{ color: '#1E40AF', fontSize: '0.95rem', marginBottom: '8px' }}>Note from Concierge Team</h4>
            <p style={{ fontSize: '0.85rem', color: '#1D4ED8', marginBottom: '14px', lineHeight: '1.5' }}>
              "Please upload a higher-resolution image for your Government ID and clarify your studio service radius in Hyderabad."
            </p>
            <Link to="/designer/apply" className="zorevi-btn zorevi-btn--primary zorevi-btn--full">
              Update Application Details
            </Link>
          </div>
        )}

        {/* Demo Simulator Bar */}
        <div style={{ padding: '14px', background: '#F9FAFB', borderRadius: '12px', border: '1px dashed #E5E7EB', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={12} /> Interactive Demo: Test Different Approval States
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`zorevi-btn zorevi-btn--sm ${status === 'pending' ? 'zorevi-btn--primary' : 'zorevi-btn--outline'}`}
              onClick={() => setStatus('pending')}
            >
              Pending
            </button>
            <button
              className={`zorevi-btn zorevi-btn--sm ${status === 'approved' ? 'zorevi-btn--primary' : 'zorevi-btn--outline'}`}
              onClick={handleSimulateApproved}
            >
              Approved
            </button>
            <button
              className={`zorevi-btn zorevi-btn--sm ${status === 'changes_requested' ? 'zorevi-btn--primary' : 'zorevi-btn--outline'}`}
              onClick={handleSimulateChanges}
            >
              Changes Requested
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/designer/login" className="zorevi-auth-link" style={{ fontSize: '0.85rem' }}>
            Back to Designer Login
          </Link>
        </div>
      </div>
    </div>
  );
}

>>>>>>> origin/sai
