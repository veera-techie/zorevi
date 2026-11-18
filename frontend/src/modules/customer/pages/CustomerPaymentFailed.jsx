import { Link } from 'react-router-dom';
import { AlertCircle, RotateCcw, ArrowRight, HelpCircle } from 'lucide-react';

export default function CustomerPaymentFailed() {
  return (
    <div style={{ maxWidth: '560px', margin: '40px auto 60px', padding: '0 20px' }}>
      <div style={{ background: '#FFFFFF', borderRadius: '28px', border: '1px solid #FEE2E2', padding: '40px', boxShadow: '0 10px 30px rgba(239, 68, 68, 0.08)', textAlign: 'center' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <AlertCircle size={40} />
        </div>

        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          SIMULATED PAYMENT FAILURE
        </span>

        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1E1B4B', margin: '6px 0 10px' }}>
          Transaction Could Not Be Completed
        </h1>

        <p style={{ fontSize: '0.9rem', color: '#6B7280', lineHeight: '1.5', marginBottom: '24px' }}>
          Your bank or simulated gateway declined the transaction. No funds were debited from your account. You can retry with another payment method.
        </p>

        {/* Troubleshooting guidance */}
        <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '16px', textAlign: 'left', marginBottom: '28px', fontSize: '0.82rem', color: '#4B5563', lineHeight: '1.5' }}>
          <strong style={{ color: '#1E1B4B', display: 'block', marginBottom: '6px' }}>Recovery Options:</strong>
          <ul style={{ paddingLeft: '18px', margin: 0 }}>
            <li>Verify that your simulated UPI ID has valid syntax (e.g. name@okaxis)</li>
            <li>Try choosing Credit/Debit Card or Net Banking instead</li>
            <li>Check that the "Simulate failure" test toggle is unchecked</li>
          </ul>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link to="/customer/checkout" className="zorevi-btn zorevi-btn--primary zorevi-btn--full zorevi-btn--lg">
            <RotateCcw size={16} /> Retry Checkout
          </Link>

          <Link to="/customer/support" className="zorevi-btn zorevi-btn--outline zorevi-btn--full">
            <HelpCircle size={16} /> Contact Support
          </Link>

          <Link to="/customer" className="zorevi-btn zorevi-btn--ghost zorevi-btn--full">
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

