import { Link } from 'react-router-dom';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import ToastContainer from '../../components/common/ToastContainer';
import { useApp } from '../../context/AppContext';
import './Auth.css';

export function AuthShell({ children, image = '/images/auth-fashion-group.jpg', className = '' }) {
  return (
    <div className={`zorevi-auth-page ${className}`}>
      <section className="zorevi-auth-hero" aria-label="About Zorevi">
        <Link to="/" className="zorevi-auth-hero__logo">
          <img src="/zorevi-icon.svg" alt="" width="42" height="42" />
          <span>
            <strong className="zorevi-auth-hero__brand">Zorevi</strong>
            <small className="zorevi-auth-hero__tagline">Fashion for Everyone</small>
          </span>
        </Link>

        <div className="zorevi-auth-hero__content">
          <p className="zorevi-auth-eyebrow">Fashion for Everyone</p>
          <h1 className="zorevi-auth-hero__title">
            Your Style,
            <br />
            <span>Your Identity.</span>
          </h1>
          <p className="zorevi-auth-hero__desc">
            Discover talented designers and create your perfect look.
          </p>
          <div className="zorevi-auth-hero__img-container">
            <ImageWithFallback
              src={image}
              alt="A group of people celebrating personal style"
              className="zorevi-auth-hero__img"
              fallbackType="hero"
            />
          </div>
        </div>

        <p className="zorevi-auth-hero__motto">
          Fashion for Everyone. <span>Style for Every Occasion.</span>
        </p>
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

export function GoogleDemoButton({ action = 'sign in' }) {
  const { addToast } = useApp();

  return (
    <button
      type="button"
      className="zorevi-google-btn"
      onClick={() => addToast(`Google ${action} is a demo placeholder. No Google account is connected.`, 'info')}
    >
      <span className="zorevi-google-mark" aria-hidden="true">G</span>
      Continue with Google <span className="zorevi-auth-demo-tag">Demo</span>
    </button>
  );
}
