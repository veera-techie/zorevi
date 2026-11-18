import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RotateCw, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import { getSafeReturnTo } from '../../../utils/authNavigation';
import { AuthDemoNotice, AuthSubmit, AuthShell } from '../AuthShell';

const createDemoCode = () => String(Math.floor(100000 + Math.random() * 900000));

function readVerification() {
  try {
    const saved = window.sessionStorage.getItem('zorevi.demo.verification');
    if (!saved) return { value: null, error: '' };
    const value = JSON.parse(saved);
    if (!value?.profile || !/^\d{6}$/.test(value.code) || !Number.isFinite(value.expiresAt)) {
      return { value: null, error: 'Saved demo verification details are invalid. Please register again.' };
    }
    return { value, error: '' };
  } catch (error) {
    return {
      value: null,
      error: error instanceof Error ? `Could not read the saved demo verification: ${error.message}` : 'Could not read the saved demo verification.',
    };
  }
}

export default function CustomerVerify() {
  const [verificationState, setVerificationState] = useState(readVerification);
  const verification = verificationState.value;
  const [code, setCode] = useState('');
  const [error, setError] = useState(verificationState.error);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const returnToFromQuery = getSafeReturnTo(location.search);
  const savedReturnTo = verification?.returnTo
    ? getSafeReturnTo(new URLSearchParams({ returnTo: verification.returnTo }).toString())
    : null;
  const returnTo = returnToFromQuery || savedReturnTo;
  const { setUser } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();

  const handleVerify = async (event) => {
    event.preventDefault();
    setError('');
    if (!verification?.profile) {
      setError('No pending demo registration was found. Start by creating an account.');
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the six-digit verification code.');
      return;
    }
    if (Date.now() > verification.expiresAt) {
      setError('This demo code has expired. Request a new code to continue.');
      return;
    }
    if (code !== verification.code) {
      setError('That code is not correct. Check the demo code and try again.');
      return;
    }

    try {
      window.sessionStorage.removeItem('zorevi.demo.verification');
    } catch (storageError) {
      setError(storageError instanceof Error ? storageError.message : 'Could not clear the local verification state.');
      return;
    }

    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    setUser({
      id: `demo-customer-${Date.now()}`,
      name: verification.profile.name,
      email: verification.profile.email,
      phone: verification.profile.phone,
      avatar: '/zorevi-icon.svg',
      role: 'customer',
      preferredCategories: verification.profile.interests,
      preferredStyles: [],
    });
    setVerified(true);
    setLoading(false);
    addToast('Demo verification completed locally. No account was created on a server.', 'info');
  };

  const handleResend = () => {
    if (!verification?.profile) {
      setError('Start a registration before requesting a verification code.');
      return;
    }
    const nextVerification = { ...verification, code: createDemoCode(), expiresAt: Date.now() + 10 * 60 * 1000 };
    try {
      window.sessionStorage.setItem('zorevi.demo.verification', JSON.stringify(nextVerification));
    } catch (storageError) {
      setError(storageError instanceof Error ? storageError.message : 'Could not save a new demo verification code.');
      return;
    }
    setVerificationState({ value: nextVerification, error: '' });
    setCode('');
    setError('');
    addToast(`New demo verification code: ${nextVerification.code}. No email or SMS was sent.`, 'info', 8000);
  };

  return (
    <AuthShell>
      <div className="zorevi-auth-progress">Create your account · 2 of 2</div>
      <header className="zorevi-auth-form-header">
        <div className="zorevi-auth-progress" aria-hidden="true"><ShieldCheck size={16} /></div>
        <h2 className="zorevi-auth-form-title">{verified ? 'You’re all set' : 'Verify your contact'}</h2>
        <p className="zorevi-auth-form-sub">
          {verified
            ? 'Your demo profile is ready. Verification was simulated in this browser only.'
            : `Verify your email or mobile before your first booking. Enter the code for ${verification?.profile?.email || 'your contact details'}.`}
        </p>
      </header>
      <AuthDemoNotice />

      {verified ? (
        <>
          <div className="zorevi-auth-demo-code">Demo profile verified locally. No server account or authentication was created.</div>
          <button type="button" className="zorevi-auth-submit" onClick={() => navigate(returnTo || '/customer')}>Continue to Zorevi</button>
        </>
      ) : (
        <form onSubmit={handleVerify} noValidate>
          {verification?.profile && (
            <div className="zorevi-auth-demo-code">
              Your local demo code (valid for 10 minutes)
              <strong>{verification.code}</strong>
            </div>
          )}
          <div className="zorevi-auth-field">
            <label htmlFor="verification-code">6-digit verification code</label>
            <input
              id="verification-code"
              className="zorevi-auth-input-wrap zorevi-auth-otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              pattern="[0-9]{6}"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'verification-error' : undefined}
              placeholder="000000"
            />
            {error && <span className="zorevi-auth-error" id="verification-error" role="alert">{error}</span>}
          </div>
          <AuthSubmit loading={loading}>Verify and continue</AuthSubmit>
          <p className="zorevi-auth-footer-prompt">
            Didn’t receive a code?{' '}
            <button type="button" className="zorevi-auth-link" onClick={handleResend}>
              <RotateCw size={14} aria-hidden="true" /> Resend demo code
            </button>
          </p>
        </form>
      )}
      <p className="zorevi-auth-footer-prompt"><Link to="/customer/register" className="zorevi-auth-link">Back to registration</Link></p>
    </AuthShell>
  );
}
