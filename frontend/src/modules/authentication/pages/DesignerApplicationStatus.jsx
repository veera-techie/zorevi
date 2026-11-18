import { useState } from 'react';
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
