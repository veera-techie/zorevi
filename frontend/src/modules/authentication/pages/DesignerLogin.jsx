import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
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
=======
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import '../Auth.css';

export default function DesignerLogin() {
  const [email, setEmail] = useState('aarohi@zorevi.in');
  const [password, setPassword] = useState('Password123');
  const [showPassword, setShowPassword] = useState(false);
>>>>>>> origin/sai
  const { login, isLoading } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();

<<<<<<< HEAD
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
=======
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login('designer', email, password);
    if (res.success) {
      addToast('Welcome back to your Designer Studio, Aarohi!', 'success');
      navigate('/designer');
    } else {
      addToast('Invalid designer credentials', 'error');
>>>>>>> origin/sai
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="zorevi-auth-page">
      {/* Left Designer Showcase */}
      <div className="zorevi-auth-hero" style={{ background: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%)' }}>
        <Link to="/" className="zorevi-auth-hero__logo">
          <svg viewBox="0 0 32 32" fill="none" width="36" height="36">
            <path d="M16 4C12 4 8 8 8 12c0 4 4 8 8 12 4-4 8-8 8-12 0-4-4-8-8-8z" fill="url(#des-login-logo)"/>
            <path d="M8 12c-4 0-6 2-6 4s2 4 6 4c2 0 4-2 6-4-2-2-4-4-6-4z" fill="url(#des-login-logo)" opacity="0.8"/>
            <path d="M24 12c4 0 6 2 6 4s-2 4-6 4c-2 0-4-2-6-4 2-2 4-4 6-4z" fill="url(#des-login-logo)" opacity="0.8"/>
            <defs>
              <linearGradient id="des-login-logo" x1="0" y1="0" x2="32" y2="32">
                <stop stopColor="#7C3AED"/>
                <stop offset="1" stopColor="#A855F7"/>
              </linearGradient>
            </defs>
          </svg>
          <div>
            <span className="zorevi-auth-hero__brand">Zorevi</span>
            <span className="zorevi-auth-hero__tagline">Designer Studio Portal</span>
          </div>
        </Link>

        <div className="zorevi-auth-hero__content">
          <h1 className="zorevi-auth-hero__title">
            Grow Your <br />
            <span>Design Studio.</span>
          </h1>
          <p className="zorevi-auth-hero__desc">
            Manage your fashion bookings, collaborate with clients in malls, showcase your portfolio, and track your styling revenue.
          </p>

          <div className="zorevi-auth-hero__img-container">
            <ImageWithFallback
              src="/images/designer-studio-hero.jpg"
              alt="Designer Studio"
              className="zorevi-auth-hero__img"
              fallbackType="designer"
            />
          </div>
        </div>

        <div style={{ color: '#6B7280', fontSize: '0.8rem' }}>
          Trusted by 1,200+ Verified Stylists & Fashion Designers across India
        </div>
      </div>

      {/* Right Form */}
      <div className="zorevi-auth-form-wrap">
        <div className="zorevi-auth-form-header">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F5F0FF', color: '#7C3AED', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '8px' }}>
            <Sparkles size={12} /> DESIGNER PARTNER PORTAL
          </div>
          <h2 className="zorevi-auth-form-title">Designer Sign In</h2>
          <p className="zorevi-auth-form-sub">Sign in to access your studio dashboard and booking requests.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="zorevi-auth-field">
            <label>Registered Email or Phone</label>
            <div className="zorevi-auth-input-wrap">
              <Mail size={18} className="icon-left" />
              <input
                type="text"
                placeholder="designer@zorevi.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="zorevi-auth-field">
            <label>Password</label>
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

          <div className="zorevi-auth-row-between">
            <label className="zorevi-auth-checkbox-label">
              <input type="checkbox" defaultChecked />
              <span>Keep me logged in</span>
            </label>
            <Link to="/designer/forgot-password" className="zorevi-auth-link">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="zorevi-btn zorevi-btn--primary zorevi-btn--full zorevi-btn--lg"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In to Studio'}
          </button>
        </form>

        <div className="zorevi-auth-footer-prompt" style={{ marginTop: '28px' }}>
          Not yet a verified designer?{' '}
          <Link to="/designer/apply" className="zorevi-auth-link">
            Apply now to become a partner <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <Link to="/designer/application-status" style={{ fontSize: '0.8rem', color: '#6B7280', textDecoration: 'none' }}>
            Check Application Status
          </Link>
        </div>
      </div>
    </div>
  );
}

>>>>>>> origin/sai
