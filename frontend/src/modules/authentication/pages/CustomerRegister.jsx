import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, User } from 'lucide-react';
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

const emailIsValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function CustomerRegister() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const { addToast } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo = getSafeReturnTo(location.search);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (fullName.trim().length < 2) {
      nextErrors.name = 'Please enter your full name.';
    }
    if (!emailIsValid(email.trim())) {
      nextErrors.email = 'Please enter a valid Gmail or email address.';
    }
    if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }
    if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!agreed) {
      nextErrors.terms = 'Please accept the Terms & Conditions and Privacy Policy.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      const result = await register('customer', {
        name: fullName.trim(),
        email: email.trim(),
      });

      if (result.success) {
        addToast(`Welcome to Zorevi, ${fullName.trim()}! Your account has been created.`, 'success');
        navigate(returnTo || '/customer');
      } else {
        setErrors({ form: result.error || 'Could not create account.' });
      }
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : 'Registration failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await loginWithGoogle('customer');
      if (result.success) {
        addToast('Welcome to Zorevi! Successfully signed up with Google.', 'success');
        navigate(returnTo || '/customer');
      }
    } catch (error) {
      addToast('Google signup could not be completed.', 'error');
    }
  };

  return (
    <AuthShell image="/images/family-shopping-fashion.jpg">
      <header className="zorevi-auth-form-header">
        <h2 className="zorevi-auth-form-title">Create Your Zorevi Account</h2>
        <p className="zorevi-auth-form-sub">It takes less than a minute to get started.</p>
      </header>

      <form onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <AuthField
          id="register-name"
          label="Full Name"
          icon={User}
          type="text"
          autoComplete="name"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          error={errors.name}
          required
        />

        {/* Gmail / Email */}
        <AuthField
          id="register-email"
          label="Email address or Gmail"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="Enter your Gmail or email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
          required
        />

        {/* Password */}
        <AuthPasswordField
          id="register-password"
          label="Password"
          autoComplete="new-password"
          placeholder="Create a strong password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((visible) => !visible)}
          error={errors.password}
          required
        />

        {/* Confirm Password */}
        <AuthPasswordField
          id="register-confirm-password"
          label="Confirm Password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((visible) => !visible)}
          error={errors.confirmPassword}
          required
        />

        {/* Terms agreement */}
        <div className="zorevi-auth-field" style={{ marginTop: '16px' }}>
          <label className="zorevi-auth-checkbox-label">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              aria-invalid={Boolean(errors.terms)}
            />
            <span>
              I agree to the <Link to="/terms" className="zorevi-auth-link">Terms &amp; Conditions</Link> and <Link to="/privacy" className="zorevi-auth-link">Privacy Policy</Link> of Zorevi.
            </span>
          </label>
          {errors.terms && <span className="zorevi-auth-error" role="alert">{errors.terms}</span>}
        </div>

        {errors.form && <p className="zorevi-auth-error" role="alert">{errors.form}</p>}

        <AuthSubmit loading={loading}>Create Account</AuthSubmit>
      </form>

      <AuthDivider />

      {/* Optional Gmail signup */}
      <GoogleDemoButton action="sign up" onClick={handleGoogleSignup} />

      <p className="zorevi-auth-footer-prompt">
        Already have an account? <Link to="/customer/login" className="zorevi-auth-link">Sign in</Link>
      </p>
    </AuthShell>
  );
}
