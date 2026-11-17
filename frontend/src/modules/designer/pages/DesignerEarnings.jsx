import { useState } from 'react';
import { DollarSign, CreditCard, TrendingUp, Download, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { mockTransactions } from '../../../services/mockData';
import { useApp } from '../../../context/AppContext';

export default function DesignerEarnings() {
  const { addToast } = useApp();

  const handleRequestPayout = () => {
    addToast('Simulated payout request of ₹12,400 submitted to accounts team.', 'success');
  };

  return (
    <div style={{ width: '100%', paddingBottom: '60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1E1B4B', margin: '0 0 4px 0' }}>
            Earnings & Payouts
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>
            Track styling revenue, platform commissions, transactions, and scheduled bank payouts.
          </p>
        </div>

        <button className="zorevi-btn zorevi-btn--primary" onClick={handleRequestPayout}>
          <ArrowUpRight size={16} /> Request Instant Payout
        </button>
      </div>

      {/* Top 4 Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #F3F4F6', padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase' }}>This Month's Earnings</span>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1E1B4B', margin: '6px 0 2px' }}>₹84,650</div>
          <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: '600' }}>↑ +18.4% vs last month</span>
        </div>

        <div style={{ background: '#FAF5FF', borderRadius: '20px', border: '1px solid #DDD6FE', padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: '#7C3AED', textTransform: 'uppercase' }}>Pending Bank Payout</span>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#7C3AED', margin: '6px 0 2px' }}>₹12,400</div>
          <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Scheduled: Friday, 28 Nov</span>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #F3F4F6', padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase' }}>Platform Commission</span>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1E1B4B', margin: '6px 0 2px' }}>12%</div>
          <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Includes payment gateway & GST</span>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #F3F4F6', padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase' }}>Lifetime Gross Revenue</span>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#1E1B4B', margin: '6px 0 2px' }}>₹2,45,800</div>
          <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: '600' }}>112 Completed Sessions</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #F3F4F6', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1E1B4B', margin: 0 }}>
            Recent Transactions & Payouts
          </h3>
          <button className="zorevi-btn zorevi-btn--ghost zorevi-btn--sm" onClick={() => addToast('Exporting CSV statements', 'info')}>
            <Download size={14} /> Export CSV
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#6B7280' }}>
                <th style={{ padding: '12px 14px' }}>Transaction ID</th>
                <th style={{ padding: '12px 14px' }}>Client / Type</th>
                <th style={{ padding: '12px 14px' }}>Date</th>
                <th style={{ padding: '12px 14px' }}>Amount</th>
                <th style={{ padding: '12px 14px' }}>Net Earnings</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '14px', fontWeight: '600', color: '#1E1B4B' }}>{tx.id}</td>
                  <td style={{ padding: '14px', color: '#4B5563' }}>{tx.customer} • {tx.type}</td>
                  <td style={{ padding: '14px', color: '#6B7280' }}>{tx.date}</td>
                  <td style={{ padding: '14px', color: '#1E1B4B', fontWeight: '700' }}>₹{tx.amount}</td>
                  <td style={{ padding: '14px', color: '#10B981', fontWeight: '700' }}>₹{Math.round(tx.amount * 0.88)}</td>
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

