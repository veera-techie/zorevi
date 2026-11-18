import { useState } from 'react';
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
