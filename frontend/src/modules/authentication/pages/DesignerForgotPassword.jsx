import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import '../Auth.css';

export default function DesignerForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useApp();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      addToast('Please enter your designer email', 'error');
      return;
    }
    setSubmitted(true);
    addToast('Password reset link sent to your designer email', 'success');
  };

  return (
    <div className="zorevi-auth-page" style={{ justifyContent: 'center', alignItems: 'center', background: '#F5F0FF' }}>
      <div className="zorevi-auth-form-wrap" style={{ background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 20px 40px rgba(124, 58, 237, 0.1)', padding: '40px', maxWidth: '480px' }}>
        <Link to="/designer/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6B7280', fontSize: '0.85rem', textDecoration: 'none', marginBottom: '20px' }}>
          <ArrowLeft size={16} /> Back to Designer Sign In
        </Link>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={32} />
            </div>
            <h2 className="zorevi-auth-form-title">Reset Link Sent</h2>
            <p className="zorevi-auth-form-sub" style={{ marginTop: '8px' }}>
              We've dispatched password recovery instructions to <strong>{email}</strong>.
            </p>
            <Link to="/designer/login" className="zorevi-btn zorevi-btn--primary zorevi-btn--full" style={{ marginTop: '24px' }}>
              Return to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div className="zorevi-auth-form-header">
              <h2 className="zorevi-auth-form-title">Designer Password Recovery</h2>
              <p className="zorevi-auth-form-sub">
                Enter your registered studio email to receive recovery instructions.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="zorevi-auth-field">
                <label>Registered Studio Email</label>
                <div className="zorevi-auth-input-wrap">
                  <Mail size={18} className="icon-left" />
                  <input
                    type="email"
                    placeholder="designer@zorevi.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="zorevi-btn zorevi-btn--primary zorevi-btn--full zorevi-btn--lg"
              >
                Send Recovery Instructions
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
