import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import { AuthDemoNotice, AuthField, AuthPasswordField, AuthSubmit, AuthShell } from '../AuthShell';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = 'Enter a valid admin email address.';
    if (!password) nextErrors.password = 'Enter your password.';
    setErrors(nextErrors);
    setSubmitError('');
    if (Object.keys(nextErrors).length) return;

    try {
      const result = await login('admin', email.trim(), password);
      if (!result.success) {
        setSubmitError(result.error || 'Sign-in could not be completed.');
        return;
      }
      addToast('Demo sign-in only. No account was authenticated.', 'info');
      navigate('/admin');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Sign-in could not be completed.');
    }
  };

  return (
    <AuthShell>
      <header className="zorevi-auth-form-header">
        <p className="zorevi-auth-progress">Restricted access</p>
        <h2 className="zorevi-auth-form-title">Admin Console</h2>
        <p className="zorevi-auth-form-sub">Sign in to manage Zorevi platform operations.</p>
      </header>
      <AuthDemoNotice />
      <form onSubmit={handleSubmit} noValidate>
        <AuthField
          id="admin-email"
          label="Admin email"
          icon={Mail}
          type="email"
          autoComplete="username"
          placeholder="name@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
        />
        <AuthPasswordField
          id="admin-password"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((visible) => !visible)}
          error={errors.password}
        />
        <p className="zorevi-auth-row-between">
          <span>Admin access is provisioned by invitation.</span>
          <Link to="/admin/forgot-password" className="zorevi-auth-link">Forgot password?</Link>
        </p>
        {submitError && <p className="zorevi-auth-error" role="alert">{submitError}</p>}
        <AuthSubmit loading={isLoading}>Access console</AuthSubmit>
      </form>
      <p className="zorevi-auth-note">There is no public admin registration. Contact your platform administrator for access.</p>
    </AuthShell>
  );
}
