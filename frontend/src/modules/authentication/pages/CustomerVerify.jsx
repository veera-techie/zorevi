import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, RotateCw } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import '../Auth.css';

export default function CustomerVerify() {
  const [otp, setOtp] = useState(['5', '2', '8', '4']);
  const { user, setUser } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();

  const handleOtpChange = (index, val) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (otp.join('').length < 4) {
      addToast('Please enter the 4-digit verification code', 'error');
      return;
    }
    addToast('Account verified successfully!', 'success');
    navigate('/customer');
  };

  return (
    <div className="zorevi-auth-page" style={{ justifyContent: 'center', alignItems: 'center', background: '#F5F0FF' }}>
      <div className="zorevi-auth-form-wrap" style={{ background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 20px 40px rgba(124, 58, 237, 0.1)', padding: '40px', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#F5F0FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <ShieldCheck size={28} />
          </div>
          <h2 className="zorevi-auth-form-title">Verify Your Account</h2>
          <p className="zorevi-auth-form-sub">
            We have sent a 4-digit code to your registered mobile and email.
          </p>
        </div>

        <form onSubmit={handleVerify}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                style={{
                  width: '56px',
                  height: '60px',
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  borderRadius: '12px',
                  border: '2px solid #DDD6FE',
                  color: '#1E1B4B',
                  background: '#F9FAFB',
                  outline: 'none',
                }}
              />
            ))}
          </div>

          <button
            type="submit"
            className="zorevi-btn zorevi-btn--primary zorevi-btn--full zorevi-btn--lg"
          >
            Verify & Continue <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#6B7280' }}>
          Didn't receive code?{' '}
          <button
            type="button"
            style={{ background: 'none', border: 'none', color: '#7C3AED', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            onClick={() => addToast('Resent verification OTP', 'info')}
          >
            <RotateCw size={13} /> Resend OTP
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/customer/login" className="zorevi-auth-link" style={{ fontSize: '0.85rem' }}>
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

