import { useState } from 'react';
<<<<<<< HEAD
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
=======
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import '../Auth.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('priya@zorevi.in');
  const [password, setPassword] = useState('AdminPass123');
  const [showPassword, setShowPassword] = useState(false);
>>>>>>> origin/sai
  const { login, isLoading } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();

<<<<<<< HEAD
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
=======
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login('admin', email, password);
    if (res.success) {
      addToast('Welcome to Zorevi Super Admin Console', 'success');
      navigate('/admin');
    } else {
      addToast('Invalid admin credentials', 'error');
>>>>>>> origin/sai
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="zorevi-auth-page" style={{ justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)', minHeight: '100vh', padding: '24px' }}>
      <div className="zorevi-auth-form-wrap" style={{ background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)', padding: '44px', maxWidth: '460px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#F5F0FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Shield size={28} />
          </div>
          <h2 className="zorevi-auth-form-title" style={{ fontSize: '1.6rem' }}>Admin Console</h2>
          <p className="zorevi-auth-form-sub">
            Internal operations portal for platform administrators and verification concierges.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="zorevi-auth-field">
            <label>Admin Email</label>
            <div className="zorevi-auth-input-wrap">
              <Mail size={18} className="icon-left" />
              <input
                type="email"
                placeholder="admin@zorevi.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="zorevi-auth-field">
            <label>Security Key / Password</label>
            <div className="zorevi-auth-input-wrap">
              <Lock size={18} className="icon-left" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="zorevi-auth-toggle-pwd"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="zorevi-btn zorevi-btn--primary zorevi-btn--full zorevi-btn--lg"
            style={{ marginTop: '12px' }}
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Access Console'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '24px', padding: '12px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '0.75rem', color: '#6B7280', textAlign: 'center' }}>
          🔒 Restricted access. All administrative actions are recorded in platform audit logs.
        </div>
      </div>
    </div>
  );
}

>>>>>>> origin/sai
