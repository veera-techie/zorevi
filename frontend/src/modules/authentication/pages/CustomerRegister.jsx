import { useState } from 'react';
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

export default function CustomerRegister() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
