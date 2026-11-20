import { Link } from 'react-router-dom';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import ToastContainer from '../../components/common/ToastContainer';
import { useApp } from '../../context/AppContext';
import './Auth.css';

export function AuthShell({
  children,
  image = '/images/family-shopping-fashion.jpg',
  className = '',
  eyebrow = 'Fashion for Everyone',
  title = (
    <>
      Your Style,
      <br />
      <span>Your Identity.</span>
    </>
  ),
  description = 'Discover talented designers and create your perfect look.',
  motto = (
    <>
      Fashion for Everyone. <span>Style for Every Occasion.</span>
    </>
  ),
  tagline = 'Fashion for Everyone',
}) {
  return (
    <div className={`zorevi-auth-page ${className}`}>
      <section className="zorevi-auth-hero" aria-label="About Zorevi">
        <Link to="/" className="zorevi-auth-hero__logo">
          <img src="/zorevi-icon.svg" alt="" width="42" height="42" />
          <span>
            <strong className="zorevi-auth-hero__brand">Zorevi</strong>
            <small className="zorevi-auth-hero__tagline">{tagline}</small>
          </span>
        </Link>

        <div className="zorevi-auth-hero__content">
          <p className="zorevi-auth-eyebrow">{eyebrow}</p>
          <h1 className="zorevi-auth-hero__title">{title}</h1>
          <p className="zorevi-auth-hero__desc">{description}</p>
          <div className="zorevi-auth-hero__img-container">
            <ImageWithFallback
              src={image}
              alt="Visual showcase"
              className="zorevi-auth-hero__img"
              fallbackType="hero"
            />
          </div>
        </div>

        <p className="zorevi-auth-hero__motto">{motto}</p>
      </section>

      <main className="zorevi-auth-form-wrap">
        <div className="zorevi-auth-card">{children}</div>
      </main>
      <ToastContainer />
    </div>
  );
}

export function AuthDemoNotice({ children = 'Demo mode: this form does not provide real authentication or send messages.' }) {
  return (
    <p className="zorevi-auth-demo" role="note">
      <span aria-hidden="true">i</span>
      {children}
    </p>
  );
}

export function AuthField({ id, label, icon: Icon, error, className = '', ...inputProps }) {
  return (
    <div className={`zorevi-auth-field ${className}`}>
      <label htmlFor={id}>{label}</label>
      <div className={`zorevi-auth-input-wrap ${Icon ? '' : 'zorevi-auth-input-wrap--plain'}`}>
        {Icon && <Icon size={18} className="icon-left" aria-hidden="true" />}
        <input id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...inputProps} />
      </div>
      {error && <span className="zorevi-auth-error" id={`${id}-error`}>{error}</span>}
    </div>
  );
}

export function AuthPasswordField({
  id,
  label = 'Password',
  error,
  className = '',
  showPassword,
  onTogglePassword,
  ...inputProps
}) {
  return (
    <div className={`zorevi-auth-field ${className}`}>
      <label htmlFor={id}>{label}</label>
      <div className="zorevi-auth-input-wrap">
        <svg className="icon-left" aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="4" y="10" width="16" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 1 1 8 0v3" />
        </svg>
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...inputProps}
        />
        <button
          type="button"
          className="zorevi-auth-toggle-pwd"
          onClick={onTogglePassword}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          aria-pressed={showPassword}
        >
          <span aria-hidden="true">{showPassword ? 'Hide' : 'Show'}</span>
        </button>
      </div>
      {error && <span className="zorevi-auth-error" id={`${id}-error`}>{error}</span>}
    </div>
  );
}

export function AuthSubmit({ children, loading = false }) {
  return (
    <button className="zorevi-auth-submit" type="submit" disabled={loading}>
      {loading ? <><span className="zorevi-auth-spinner" aria-hidden="true" /> Please wait…</> : children}
    </button>
  );
}

export function AuthDivider() {
  return <div className="zorevi-auth-divider" aria-hidden="true"><span>OR</span></div>;
}

export function GoogleDemoButton({ action = 'sign in', onClick }) {
  const { addToast } = useApp();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      addToast(`Google ${action} placeholder (Google OAuth integration pending).`, 'info');
    }
  };

  return (
    <button
      type="button"
      className="zorevi-google-btn"
      onClick={handleClick}
      aria-label={action === 'sign up' ? 'Sign up with Google' : 'Continue with Google'}
    >
      <svg className="zorevi-google-icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
      </svg>
      <span>{action === 'sign up' ? 'Sign up with Google' : 'Continue with Google'}</span>
    </button>
  );
}
