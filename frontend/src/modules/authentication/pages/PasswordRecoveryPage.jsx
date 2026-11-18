import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { AuthDemoNotice, AuthField, AuthSubmit, AuthShell } from '../AuthShell';

const configs = {
  customer: {
    title: 'Reset your password',
    subtitle: 'Enter the email address or mobile number associated with your account.',
    label: 'Email address or mobile number',
    back: '/customer/login',
    backLabel: 'Back to sign in',
  },
  designer: {
    title: 'Designer password recovery',
    subtitle: 'Enter your registered email address or mobile number.',
    label: 'Email address or mobile number',
    back: '/designer/login',
    backLabel: 'Back to studio sign in',
  },
  admin: {
    title: 'Admin password recovery',
    subtitle: 'Enter the admin email address associated with your invited account.',
    label: 'Admin email',
    back: '/admin/login',
    backLabel: 'Back to Admin Console',
  },
};

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isPhone = (value) => {
  const digits = value.replace(/\D/g, '');
  return /^\+?[\d\s()-]+$/.test(value) && digits.length >= 8 && digits.length <= 15;
};

export default function PasswordRecoveryPage({ role }) {
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const config = configs[role];

  const handleSubmit = async (event) => {
    event.preventDefault();
    const valid = role === 'admin'
      ? isEmail(identifier.trim())
      : isEmail(identifier.trim()) || isPhone(identifier.trim());
    if (!valid) {
      setError(role === 'admin' ? 'Enter a valid email address.' : 'Enter a valid email address or mobile number.');
      return;
    }

    setError('');
    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <AuthShell>
      <Link to={config.back} className="zorevi-auth-link">← {config.backLabel}</Link>
      <header className="zorevi-auth-form-header" style={{ marginTop: 22 }}>
        <h2 className="zorevi-auth-form-title">{submitted ? 'Request noted' : config.title}</h2>
        <p className="zorevi-auth-form-sub">
          {submitted
            ? `Demo only: a reset request for ${identifier.trim()} was shown locally. No email or SMS was sent.`
            : config.subtitle}
        </p>
      </header>
      <AuthDemoNotice />
      {submitted ? (
        <Link to={config.back} className="zorevi-auth-submit">Return to sign in</Link>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <AuthField
            id={`${role}-recovery-identifier`}
            label={config.label}
            icon={Mail}
            type="text"
            autoComplete="email"
            placeholder={role === 'admin' ? 'name@company.com' : 'Enter your email or mobile number'}
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            error={error}
          />
          <AuthSubmit loading={loading}>Continue</AuthSubmit>
        </form>
      )}
    </AuthShell>
  );
}
