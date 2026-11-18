import { useState } from 'react';
<<<<<<< HEAD
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Phone, User } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { getSafeReturnTo, withReturnTo } from '../../../utils/authNavigation';
import {
  AuthDemoNotice,
  AuthField,
  AuthPasswordField,
  AuthSubmit,
  AuthDivider,
  GoogleDemoButton,
  AuthShell,
} from '../AuthShell';

const interests = ["Men's styling", "Women's styling", "Kids' styling", "Couple styling", "Family styling", "Personal styling", "Bridal styling"];
const emailIsValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const phoneIsValid = (value) => {
  const digits = value.replace(/\D/g, '');
  return /^\+?[\d\s()-]+$/.test(value) && digits.length >= 8 && digits.length <= 15;
};
const makeDemoCode = () => String(Math.floor(100000 + Math.random() * 900000));
=======
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import '../Auth.css';
>>>>>>> origin/sai

export default function CustomerRegister() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
<<<<<<< HEAD
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { addToast } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo = getSafeReturnTo(location.search);

  const toggleInterest = (interest) => {
    setSelectedInterests((current) => current.includes(interest)
      ? current.filter((item) => item !== interest)
      : [...current, interest]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (fullName.trim().length < 2) nextErrors.name = 'Enter your full name.';
    if (!emailIsValid(email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (!phoneIsValid(phone)) nextErrors.phone = 'Enter a valid mobile number with country code if needed.';
    if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      nextErrors.password = 'Use at least 8 characters with an uppercase letter, a lowercase letter, and a number.';
    }
    if (confirmPassword !== password) nextErrors.confirmPassword = 'Passwords do not match.';
    if (!agreed) nextErrors.terms = 'Please accept the Terms & Conditions and Privacy Policy.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setLoading(true);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 300));
      const code = makeDemoCode();
      window.sessionStorage.setItem('zorevi.demo.verification', JSON.stringify({
        code,
        expiresAt: Date.now() + 10 * 60 * 1000,
        returnTo,
        profile: { name: fullName.trim(), email: email.trim(), phone: phone.trim(), interests: selectedInterests },
      }));
      addToast(`Demo verification code: ${code}. No email or SMS was sent.`, 'info', 8000);
      navigate(withReturnTo('/customer/verify', returnTo));
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : 'Could not start the demo verification flow.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell image="/images/auth-traditional-bride.jpg">
      <div className="zorevi-auth-progress">Create your account · 1 of 2</div>
      <header className="zorevi-auth-form-header">
        <h2 className="zorevi-auth-form-title">Create your account</h2>
        <p className="zorevi-auth-form-sub">A little about you, then we’ll tailor Zorevi to your style.</p>
      </header>
      <AuthDemoNotice />
      <form onSubmit={handleSubmit} noValidate>
        <AuthField
          id="register-name"
          label="Full name"
          icon={User}
          type="text"
          autoComplete="name"
          placeholder="Your full name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          error={errors.name}
        />
        <AuthField
          id="register-email"
          label="Email address"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
        />
        <AuthField
          id="register-phone"
          label="Mobile number"
          icon={Phone}
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="Include country code if needed"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          error={errors.phone}
        />
        <AuthPasswordField
          id="register-password"
          label="Create password"
          autoComplete="new-password"
          placeholder="Create a strong password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((visible) => !visible)}
          error={errors.password}
          aria-describedby={errors.password ? 'register-password-error' : 'register-password-hint'}
        />
        <p className="zorevi-auth-note" id="register-password-hint">Password must be 8+ characters and include uppercase, lowercase, and a number.</p>
        <AuthPasswordField
          id="register-confirm-password"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Enter your password again"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((visible) => !visible)}
          error={errors.confirmPassword}
        />

        <div className="zorevi-auth-field">
          <label>What would you like styling for? <span className="zorevi-auth-note">(optional)</span></label>
          <div className="zorevi-auth-chip-list">
            {interests.map((interest) => (
              <button
                type="button"
                key={interest}
                className="zorevi-auth-chip"
                aria-pressed={selectedInterests.includes(interest)}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div className="zorevi-auth-field">
          <label className="zorevi-auth-checkbox-label">
            <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} aria-invalid={Boolean(errors.terms)} />
            <span>I agree to the <Link to="/terms" className="zorevi-auth-link">Terms &amp; Conditions</Link> and <Link to="/privacy" className="zorevi-auth-link">Privacy Policy</Link>.</span>
          </label>
          {errors.terms && <span className="zorevi-auth-error" role="alert">{errors.terms}</span>}
        </div>
        {errors.form && <p className="zorevi-auth-error" role="alert">{errors.form}</p>}
        <AuthSubmit loading={loading}>Create account</AuthSubmit>
      </form>

      <AuthDivider />
      <GoogleDemoButton action="sign-up" />
      <p className="zorevi-auth-footer-prompt">
        Already have an account? <Link to="/customer/login" className="zorevi-auth-link">Sign in</Link>
      </p>
    </AuthShell>
  );
}
=======
  const [selectedCategories, setSelectedCategories] = useState(["Women's Fashion"]);
  const [selectedStyles, setSelectedStyles] = useState(['Traditional', 'Ethnic']);
  const [agreed, setAgreed] = useState(true);

  const { setUser } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleStyle = (st) => {
    setSelectedStyles((prev) =>
      prev.includes(st) ? prev.filter((s) => s !== st) : [...prev, st]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) {
      addToast('Please accept the Terms & Conditions', 'error');
      return;
    }
    if (password !== confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    // Create mock user
    const newUser = {
      id: `cust-${Date.now()}`,
      name: fullName || 'New Customer',
      email: email || 'customer@zorevi.in',
      phone: phone || '+91 98765 00000',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      role: 'customer',
      preferredStyles: selectedStyles,
      preferredCategories: selectedCategories,
    };

    setUser(newUser);
    addToast('Account created successfully! Welcome to Zorevi.', 'success');
    navigate('/customer/verify');
  };

  return (
    <div className="zorevi-auth-page">
      {/* Left Banner */}
      <div className="zorevi-auth-hero">
        <Link to="/" className="zorevi-auth-hero__logo">
          <svg viewBox="0 0 32 32" fill="none" width="36" height="36">
            <path d="M16 4C12 4 8 8 8 12c0 4 4 8 8 12 4-4 8-8 8-12 0-4-4-8-8-8z" fill="url(#reg-logo)"/>
            <path d="M8 12c-4 0-6 2-6 4s2 4 6 4c2 0 4-2 6-4-2-2-4-4-6-4z" fill="url(#reg-logo)" opacity="0.8"/>
            <path d="M24 12c4 0 6 2 6 4s-2 4-6 4c-2 0-4-2-6-4 2-2 4-4 6-4z" fill="url(#reg-logo)" opacity="0.8"/>
            <defs>
              <linearGradient id="reg-logo" x1="0" y1="0" x2="32" y2="32">
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
            Join Zorevi <br />
            <span>Create Your Style Profile.</span>
          </h1>
          <p className="zorevi-auth-hero__desc">
            Discover designers, book styling sessions, and get personalized fashion recommendations for weddings, parties, and everyday chic.
          </p>

          <div className="zorevi-auth-hero__img-container">
            <ImageWithFallback
              src="/images/auth-traditional-bride.jpg"
              alt="Bridal and Ethnic Fashion"
              className="zorevi-auth-hero__img"
              fallbackType="bridal"
            />
          </div>
        </div>

        <div style={{ color: '#6B7280', fontSize: '0.8rem' }}>
          Personalized Style Curation • Top Designers • Safe & Secure
        </div>
      </div>

      {/* Right Form */}
      <div className="zorevi-auth-form-wrap" style={{ width: '640px' }}>
        <div className="zorevi-auth-form-header">
          <h2 className="zorevi-auth-form-title">Create Your Zorevi Account</h2>
          <p className="zorevi-auth-form-sub">It takes less than a minute to get started.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Personal Details */}
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={16} color="#7C3AED" /> Personal Details
          </h4>

          <div className="zorevi-auth-field">
            <label>Full Name *</label>
            <div className="zorevi-auth-input-wrap">
              <User size={18} className="icon-left" />
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="zorevi-auth-field">
              <label>Email Address *</label>
              <div className="zorevi-auth-input-wrap">
                <Mail size={18} className="icon-left" />
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="zorevi-auth-field">
              <label>Mobile Number *</label>
              <div className="zorevi-auth-input-wrap">
                <Phone size={18} className="icon-left" />
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1E1B4B', margin: '16px 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={16} color="#7C3AED" /> Create Password
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="zorevi-auth-field">
              <label>Password *</label>
              <div className="zorevi-auth-input-wrap">
                <Lock size={18} className="icon-left" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="zorevi-auth-toggle-pwd"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="zorevi-auth-field">
              <label>Confirm Password *</label>
              <div className="zorevi-auth-input-wrap">
                <Lock size={18} className="icon-left" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Styling Preferences */}
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1E1B4B', margin: '16px 0 4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="#7C3AED" /> Your Styling Preferences
          </h4>
          <p style={{ fontSize: '0.78rem', color: '#6B7280', marginBottom: '10px' }}>
            Help us personalize your fashion feed and recommendations.
          </p>

          <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
            Preferred Categories
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
            {["Men's Fashion", "Women's Fashion", "Kids' Fashion", "Bridal & Groom"].map((cat) => (
              <button
                type="button"
                key={cat}
                className={`zorevi-chip ${selectedCategories.includes(cat) ? 'active' : ''}`}
                onClick={() => toggleCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
            Style Preferences (Select one or more)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {['Traditional', 'Contemporary', 'Fusion', 'Ethnic', 'Western', 'Casual'].map((st) => (
              <button
                type="button"
                key={st}
                className={`zorevi-chip ${selectedStyles.includes(st) ? 'active' : ''}`}
                onClick={() => toggleStyle(st)}
              >
                {st}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="zorevi-auth-checkbox-label">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <span>
                I agree to the <Link to="/help" className="zorevi-auth-link">Terms & Conditions</Link> and <Link to="/help" className="zorevi-auth-link">Privacy Policy</Link> of Zorevi.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="zorevi-btn zorevi-btn--primary zorevi-btn--full zorevi-btn--lg"
          >
            Create Account
          </button>
        </form>

        <div className="zorevi-auth-footer-prompt" style={{ marginTop: '20px' }}>
          Already have an account?{' '}
          <Link to="/customer/login" className="zorevi-auth-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

>>>>>>> origin/sai
