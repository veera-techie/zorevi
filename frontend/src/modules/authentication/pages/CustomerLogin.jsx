import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import '../Auth.css';

export default function CustomerLogin() {
  const [email, setEmail] = useState('praveen.kumar@email.com');
  const [password, setPassword] = useState('Password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const { login, isLoading } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password', 'error');
      return;
    }

    const res = await login('customer', email, password);
    if (res.success) {
      addToast('Welcome back, Praveen!', 'success');
      navigate('/customer');
    } else {
      addToast('Login failed. Please check your credentials.', 'error');
    }
  };

  return (
    <div className="zorevi-auth-page">
      {/* Left Fashion Showcase */}
      <div className="zorevi-auth-hero">
        <Link to="/" className="zorevi-auth-hero__logo">
          <svg viewBox="0 0 32 32" fill="none" width="36" height="36">
            <path d="M16 4C12 4 8 8 8 12c0 4 4 8 8 12 4-4 8-8 8-12 0-4-4-8-8-8z" fill="url(#auth-logo-1)"/>
            <path d="M8 12c-4 0-6 2-6 4s2 4 6 4c2 0 4-2 6-4-2-2-4-4-6-4z" fill="url(#auth-logo-1)" opacity="0.8"/>
            <path d="M24 12c4 0 6 2 6 4s-2 4-6 4c-2 0-4-2-6-4 2-2 4-4 6-4z" fill="url(#auth-logo-1)" opacity="0.8"/>
            <defs>
              <linearGradient id="auth-logo-1" x1="0" y1="0" x2="32" y2="32">
                <stop stopColor="#7C3AED"/>
                <stop offset="1" stopColor="#A855F7"/>
              </linearGradient>
            </defs>
          </svg>
          <div>
            <span className="zorevi-auth-hero__brand">Zorevi</span>
            <span className="zorevi-auth-hero__tagline">Fashion for Everyone</span>
          </div>
        </Link>

        <div className="zorevi-auth-hero__content">
          <h1 className="zorevi-auth-hero__title">
            Your Style, <br />
            <span>Your Identity.</span>
          </h1>
          <p className="zorevi-auth-hero__desc">
            Discover talented fashion designers, explore nearby shopping malls, and create your perfect look.
          </p>

          <div className="zorevi-auth-hero__img-container">
            <ImageWithFallback
              src="/images/auth-fashion-group.jpg"
              alt="Fashion for Everyone"
              className="zorevi-auth-hero__img"
              fallbackType="hero"
            />
          </div>
        </div>

        <div style={{ color: '#6B7280', fontSize: '0.8rem' }}>
          Packages starting at ₹499 / 2 hours • Verified Designers
        </div>
      </div>

      {/* Right Form */}
      <div className="zorevi-auth-form-wrap">
        <div className="zorevi-auth-form-header">
          <h2 className="zorevi-auth-form-title">Welcome Back!</h2>
          <p className="zorevi-auth-form-sub">Sign in to continue your Zorevi experience.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="zorevi-auth-field">
            <label>Email address or mobile number</label>
            <div className="zorevi-auth-input-wrap">
              <Mail size={18} className="icon-left" />
              <input
                type="text"
                placeholder="Enter your email address or mobile number"
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="zorevi-auth-toggle-pwd"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="zorevi-auth-row-between">
            <label className="zorevi-auth-checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <Link to="/customer/forgot-password" className="zorevi-auth-link">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="zorevi-btn zorevi-btn--primary zorevi-btn--full zorevi-btn--lg"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="zorevi-auth-divider">
          <span>OR</span>
        </div>

        <button
          type="button"
          className="zorevi-google-btn"
          onClick={() => {
            login('customer');
            addToast('Signed in via Google', 'success');
            navigate('/customer');
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Continue with Google
        </button>

        <div className="zorevi-auth-footer-prompt">
          New to Zorevi?{' '}
          <Link to="/customer/register" className="zorevi-auth-link">
            Create a customer account
          </Link>
        </div>

        <div className="zorevi-auth-designer-cta">
          Designer?{' '}
          <Link to="/designer/apply" className="zorevi-auth-link">
            Apply to join Zorevi <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </Link>
        </div>

        <div className="zorevi-auth-legal">
          <Link to="/help">Terms & Conditions</Link>
          <span>|</span>
          <Link to="/help">Privacy Policy</Link>
          <span>|</span>
          <Link to="/help">Help & Support</Link>
        </div>
      </div>
    </div>
  );
}

