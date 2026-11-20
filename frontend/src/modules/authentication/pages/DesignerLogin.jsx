import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import {
  AuthField,
  AuthPasswordField,
  AuthSubmit,
  AuthDivider,
  GoogleDemoButton,
  AuthShell,
} from '../AuthShell';

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function DesignerLogin() {
  const [email, setEmail] = useState('aarohi@zorevi.in');
  const [password, setPassword] = useState('Password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const { login, loginWithGoogle, isLoading } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = 'Please enter your registered Gmail or email address.';
    } else if (!isEmail(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      nextErrors.password = 'Please enter your password.';
    }

    setErrors(nextErrors);
    setSubmitError('');
    if (Object.keys(nextErrors).length) return;

    try {
      const res = await login('designer', email.trim(), password);
      if (res.success) {
        addToast('Welcome back to your Designer Studio, Aarohi!', 'success');
        navigate('/designer');
      } else {
        setSubmitError(res.error || 'Invalid designer credentials.');
        addToast('Invalid designer credentials', 'error');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign-in could not be completed.';
      setSubmitError(message);
      addToast(message, 'error');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await loginWithGoogle('designer');
      if (res.success) {
        addToast('Welcome back to Designer Studio! Signed in with Google.', 'success');
        navigate('/designer');
      }
    } catch (error) {
      addToast('Google sign-in could not be completed.', 'error');
    }
  };

  return (
    <AuthShell
      image="/images/slide-fashion-design.jpg"
      eyebrow="Designer Partner Studio"
      tagline="Designer Studio Portal"
      title={
        <>
          Grow Your
          <br />
          <span>Design Studio.</span>
        </>
      }
      description="Manage your fashion bookings, collaborate with clients in malls, showcase your portfolio, and track your styling revenue."
      motto={
        <>
          Trusted by 1,200+ Verified Stylists &amp; <span>Fashion Designers across India</span>
        </>
      }
    >
      <header className="zorevi-auth-form-header">
        <div className="zorevi-auth-badge">
          <Sparkles size={13} /> DESIGNER PARTNER PORTAL
        </div>
        <h2 className="zorevi-auth-form-title">Designer Sign In</h2>
        <p className="zorevi-auth-form-sub">Sign in to access your studio dashboard and booking requests.</p>
      </header>

      <form onSubmit={handleSubmit} noValidate>
        {/* Email or Gmail */}
        <AuthField
          id="designer-email"
          label="Registered Email address or Gmail"
          icon={Mail}
          type="email"
          autoComplete="username"
          inputMode="email"
          placeholder="e.g. aarohi@zorevi.in"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
          required
        />

        {/* Password */}
        <AuthPasswordField
          id="designer-password"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your studio password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((visible) => !visible)}
          error={errors.password}
          required
        />

        <div className="zorevi-auth-row-between">
          <label className="zorevi-auth-checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            <span>Keep me logged in</span>
          </label>
          <Link to="/designer/forgot-password" className="zorevi-auth-link">
            Forgot password?
          </Link>
        </div>

        {submitError && <p className="zorevi-auth-error" role="alert">{submitError}</p>}

        <AuthSubmit loading={isLoading}>Sign In to Studio</AuthSubmit>
      </form>

      <AuthDivider />

      {/* Optional Gmail signin */}
      <GoogleDemoButton action="sign in" onClick={handleGoogleLogin} />

      <p className="zorevi-auth-footer-prompt">
        Not yet a verified designer?{' '}
        <Link to="/designer/apply" className="zorevi-auth-link">
          Apply now to become a partner <ArrowRight size={13} style={{ display: 'inline', verticalAlign: 'middle' }} />
        </Link>
      </p>

      <div className="zorevi-auth-status-cta">
        <Link to="/designer/application-status" className="zorevi-auth-status-link">
          Check Application Status
        </Link>
      </div>

      <div className="zorevi-auth-designer-cta">
        Looking for customer account?{' '}
        <Link to="/customer/login" className="zorevi-auth-link">
          Customer sign in →
        </Link>
      </div>

      <nav className="zorevi-auth-legal" aria-label="Legal and support">
        <Link to="/terms">Terms &amp; Conditions</Link>
        <span aria-hidden="true">·</span>
        <Link to="/privacy">Privacy Policy</Link>
        <span aria-hidden="true">·</span>
        <Link to="/help">Help &amp; Support</Link>
      </nav>
    </AuthShell>
  );
}
