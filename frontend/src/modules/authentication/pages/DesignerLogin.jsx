import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import { AuthDemoNotice, AuthField, AuthPasswordField, AuthSubmit, AuthShell } from '../AuthShell';

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isPhone = (value) => {
  const digits = value.replace(/\D/g, '');
  return /^\+?[\d\s()-]+$/.test(value) && digits.length >= 8 && digits.length <= 15;
};

export default function DesignerLogin() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const { login, isLoading } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!isEmail(identifier.trim()) && !isPhone(identifier.trim())) {
      nextErrors.identifier = 'Enter a valid email address or mobile number.';
    }
    if (!password) nextErrors.password = 'Enter your password.';
    setErrors(nextErrors);
    setSubmitError('');
    if (Object.keys(nextErrors).length) return;

    try {
      const result = await login('designer', identifier.trim(), password);
      if (!result.success) {
        setSubmitError(result.error || 'Sign-in could not be completed.');
        return;
      }
      addToast('Demo sign-in only. No account was authenticated.', 'info');
      navigate('/designer');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Sign-in could not be completed.');
    }
  };

  return (
    <AuthShell image="/images/designer-studio-hero.jpg">
      <header className="zorevi-auth-form-header">
        <p className="zorevi-auth-progress">Designer Studio</p>
        <h2 className="zorevi-auth-form-title">Welcome back</h2>
        <p className="zorevi-auth-form-sub">Sign in to manage your studio and booking requests.</p>
      </header>
      <AuthDemoNotice />
      <form onSubmit={handleSubmit} noValidate>
        <AuthField
          id="designer-identifier"
          label="Email address or mobile number"
          icon={Mail}
          type="text"
          autoComplete="username"
          placeholder="Enter your registered email or mobile"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          error={errors.identifier}
        />
        <AuthPasswordField
          id="designer-password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((visible) => !visible)}
          error={errors.password}
        />
        <p className="zorevi-auth-row-between">
          <span>Secure access to your studio</span>
          <Link to="/designer/forgot-password" className="zorevi-auth-link">Forgot password?</Link>
        </p>
        {submitError && <p className="zorevi-auth-error" role="alert">{submitError}</p>}
        <AuthSubmit loading={isLoading}>Sign in to studio</AuthSubmit>
      </form>
      <p className="zorevi-auth-footer-prompt">
        New to Zorevi? <Link to="/designer/apply" className="zorevi-auth-link">Apply to join Zorevi</Link>
      </p>
      <p className="zorevi-auth-footer-prompt">
        Already applied? <Link to="/designer/application-status" className="zorevi-auth-link">Check application status</Link>
      </p>
    </AuthShell>
  );
}
