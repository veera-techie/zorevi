import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import { getSafeReturnTo } from '../../../utils/authNavigation';
import {
  AuthField,
  AuthPasswordField,
  AuthSubmit,
  AuthDivider,
  GoogleDemoButton,
  AuthShell,
} from '../AuthShell';

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function CustomerLogin() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const { login, loginWithGoogle, isLoading } = useAuth();
  const { addToast } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo = getSafeReturnTo(location.search);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!identifier.trim()) {
      nextErrors.identifier = 'Please enter your Gmail or email address.';
    } else if (!isEmail(identifier.trim())) {
      nextErrors.identifier = 'Please enter a valid Gmail or email address.';
    }

    if (!password) {
      nextErrors.password = 'Please enter your password.';
    }

    setErrors(nextErrors);
    setSubmitError('');
    if (Object.keys(nextErrors).length) return;

    try {
      const result = await login('customer', identifier.trim(), password);
      if (!result.success) {
        setSubmitError(result.error || 'Sign-in could not be completed.');
        return;
      }
      addToast('Welcome back to Zorevi! Successfully signed in.', 'success');
      navigate(returnTo || '/customer');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Sign-in could not be completed.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle('customer');
      if (result.success) {
        addToast('Welcome back to Zorevi! Signed in with Google.', 'success');
        navigate(returnTo || '/customer');
      }
    } catch (error) {
      addToast('Google sign-in could not be completed.', 'error');
    }
  };

  return (
    <AuthShell image="/images/family-shopping-fashion.jpg">
      <header className="zorevi-auth-form-header">
        <h2 className="zorevi-auth-form-title">Welcome Back!</h2>
        <p className="zorevi-auth-form-sub">Sign in to continue your Zorevi experience.</p>
      </header>

      <form onSubmit={handleSubmit} noValidate>
        {/* Email or Gmail */}
        <AuthField
          id="customer-identifier"
          label="Email address or Gmail"
          icon={Mail}
          type="email"
          autoComplete="username"
          inputMode="email"
          placeholder="Enter your Gmail or email address"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          error={errors.identifier}
          required
        />

        {/* Password */}
        <AuthPasswordField
          id="customer-password"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
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
            <span>Remember me</span>
          </label>
          <Link to="/customer/forgot-password" className="zorevi-auth-link">
            Forgot password?
          </Link>
        </div>

        {submitError && <p className="zorevi-auth-error" role="alert">{submitError}</p>}

        <AuthSubmit loading={isLoading}>Sign In</AuthSubmit>
      </form>

      <AuthDivider />

      {/* Optional Gmail signin */}
      <GoogleDemoButton action="sign in" onClick={handleGoogleLogin} />

      <p className="zorevi-auth-footer-prompt">
        New to Zorevi?{' '}
        <Link to="/customer/register" className="zorevi-auth-link">
          Create a customer account
        </Link>
      </p>

      <div className="zorevi-auth-designer-cta">
        Designer?{' '}
        <Link to="/designer/apply" className="zorevi-auth-link">
          Apply to join Zorevi →
        </Link>
      </div>

      <nav className="zorevi-auth-legal" aria-label="Legal and support">
        <Link to="/terms">Terms &amp; Conditions</Link>
        <span aria-hidden="true">|</span>
        <Link to="/privacy">Privacy Policy</Link>
        <span aria-hidden="true">|</span>
        <Link to="/help">Help &amp; Support</Link>
      </nav>
    </AuthShell>
  );
}
