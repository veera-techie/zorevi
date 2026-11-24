import { useState } from 'react';
import {
  DollarSign, CreditCard, TrendingUp, Download, ArrowUpRight,
  CheckCircle2, Clock, Info, ShieldCheck, Banknote
} from 'lucide-react';
import { mockTransactions } from '../../../services/mockData';
import { useApp } from '../../../context/AppContext';

export default function DesignerEarnings() {
  const { bookings, addToast } = useApp();

  const handleRequestPayout = () => {
    addToast('Simulated payout request of ₹14,850 submitted to accounts team.', 'success');
  };

  const allBookings = bookings || [];
  const advancePaidBookings = allBookings.filter(
    (b) => b.paymentStatus === 'Advance Paid (30%)' || b.status === 'Confirmed' || b.status === 'Completed'
  );
  const completedBookings = allBookings.filter((b) => b.status === 'Completed');

  // Advances collected: 30% of each confirmed/advance paid booking
  const totalAdvancesCollected = advancePaidBookings.reduce(
    (acc, b) => acc + Math.round((Number(b.designerFee || b.amount || 999)) * 0.3),
    0
  );

  // Remaining 70% due at session
  const totalRemainingDue = advancePaidBookings
    .filter((b) => b.status !== 'Completed')
    .reduce((acc, b) => acc + Math.round((Number(b.designerFee || b.amount || 999)) * 0.7), 0);

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '850', color: '#1E1B4B', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
            Earnings & Advance Payments
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#6B7280', margin: 0 }}>
            Track client 30% advance receipts, remaining session balances, net earnings, and bank payouts.
          </p>
        </div>

        <button className="zorevi-btn zorevi-btn--primary" onClick={handleRequestPayout}>
          <ArrowUpRight size={16} /> Request Instant Payout
        </button>
      </div>

      {/* Distinction callout: Service fee vs shopping budget */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          background: '#F5F0FF',
          border: '1.5px solid #DDD6FE',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '26px',
        }}
      >
        <Info size={20} color="#7C3AED" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: '0.85rem', color: '#4B5563', lineHeight: 1.5 }}>
          <strong style={{ color: '#7C3AED', display: 'block', marginBottom: 2 }}>
            Accounting Architecture: Designer Fees vs. Client Shopping Budgets
          </strong>
          All figures below represent your professional styling and consultation fees.
          Client wardrobe shopping budgets (e.g. ₹20,000 to ₹1,00,000) are paid directly by clients to retail stores at malls and are not treated as designer income.
        </div>
      </div>

      {/* Top 4 Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EDE9FE', padding: '20px', boxShadow: '0 4px 16px rgba(124, 58, 237, 0.03)' }}>
          <span style={{ fontSize: '0.72rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: '700' }}>30% Advances Received</span>
          <div style={{ fontSize: '1.65rem', fontWeight: '850', color: '#059669', margin: '6px 0 2px' }}>
            ₹{(84650 + totalAdvancesCollected).toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '600' }}>
            Verified via Gateway (Paid upon booking confirmation)
          </span>
        </div>

        <div style={{ background: '#FAF5FF', borderRadius: '20px', border: '1.5px solid #DDD6FE', padding: '20px' }}>
          <span style={{ fontSize: '0.72rem', color: '#7C3AED', textTransform: 'uppercase', fontWeight: '700' }}>Remaining 70% Balances Due</span>
          <div style={{ fontSize: '1.65rem', fontWeight: '850', color: '#7C3AED', margin: '6px 0 2px' }}>
            ₹{(12400 + totalRemainingDue).toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Collected at styling session completion</span>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EDE9FE', padding: '20px', boxShadow: '0 4px 16px rgba(124, 58, 237, 0.03)' }}>
          <span style={{ fontSize: '0.72rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: '700' }}>Platform Commission</span>
          <div style={{ fontSize: '1.65rem', fontWeight: '850', color: '#1E1B4B', margin: '6px 0 2px' }}>12%</div>
          <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Includes payment gateway & GST handling</span>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EDE9FE', padding: '20px', boxShadow: '0 4px 16px rgba(124, 58, 237, 0.03)' }}>
          <span style={{ fontSize: '0.72rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: '700' }}>Total Net Gross Revenue</span>
          <div style={{ fontSize: '1.65rem', fontWeight: '850', color: '#1E1B4B', margin: '6px 0 2px' }}>₹2,45,800</div>
          <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: '600' }}>112 Completed Sessions</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #EDE9FE', padding: '24px', boxShadow: '0 4px 16px rgba(124, 58, 237, 0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>
            Recent Advance Payments & Settlements
          </h3>
          <button className="zorevi-btn zorevi-btn--ghost zorevi-btn--sm" onClick={() => addToast('Exporting transaction statements to CSV...', 'info')}>
            <Download size={14} /> Export CSV
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#6B7280' }}>
                <th style={{ padding: '12px 14px' }}>Transaction ID</th>
                <th style={{ padding: '12px 14px' }}>Client & Occasion</th>
                <th style={{ padding: '12px 14px' }}>Date</th>
                <th style={{ padding: '12px 14px' }}>Consultation Fee</th>
                <th style={{ padding: '12px 14px' }}>Advance Paid (30%)</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '14px', fontWeight: '700', color: '#1E1B4B' }}>{tx.id}</td>
                  <td style={{ padding: '14px', color: '#4B5563' }}>{tx.customer} • {tx.type}</td>
                  <td style={{ padding: '14px', color: '#6B7280' }}>{tx.date}</td>
                  <td style={{ padding: '14px', color: '#1E1B4B', fontWeight: '700' }}>₹{tx.amount}</td>
                  <td style={{ padding: '14px', color: '#059669', fontWeight: '700' }}>₹{Math.round(tx.amount * 0.3)}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '3px 10px', borderRadius: '9999px', background: tx.status === 'Successful' ? '#ECFDF5' : '#FFFBEB', color: tx.status === 'Successful' ? '#059669' : '#B45309' }}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
