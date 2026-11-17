import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  LifeBuoy,
  Star,
  BarChart3,
  Settings,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Search,
  Filter,
  Eye,
  FileSpreadsheet
} from 'lucide-react';
import { mockSupportTickets, mockReviews } from '../../../services/mockData';
import { formatDate } from '../../../utils';
import { useApp } from '../../../context/AppContext';
import Badge from '../../../components/common/Badge';
import Modal from '../../../components/common/Modal';
import './AdminStyles.css';

const AdminSupportReviews = ({ initialTab }) => {
  const location = useLocation();
  const { addToast } = useApp();

  const getInitialTab = () => {
    if (initialTab) return initialTab;
    const path = location.pathname;
    if (path.includes('/reviews')) return 'reviews';
    if (path.includes('/reports')) return 'reports';
    if (path.includes('/settings')) return 'settings';
    return 'support';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [tickets, setTickets] = useState(mockSupportTickets || []);
  const [reviews, setReviews] = useState(mockReviews || []);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Audit Log items matching screenshot
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, time: '18 Nov, 11:24 AM', admin: 'Priya Sharma', action: 'Approved designer', details: 'Aanya Rao (DZ-7812)' },
    { id: 2, time: '18 Nov, 10:47 AM', admin: 'Ankit Jain', action: 'Updated refund', details: 'RF-2008 - ₹2,400' },
    { id: 3, time: '17 Nov, 06:21 PM', admin: 'Meera Dutta', action: 'Resolved ticket', details: 'TKT-9820 - Marked Resolved' },
    { id: 4, time: '17 Nov, 03:15 PM', admin: 'Priya Sharma', action: 'Updated commission', details: 'VIP Tier rate set to 10%' },
    { id: 5, time: '16 Nov, 02:40 PM', admin: 'Admin System', action: 'Automated backup', details: 'Daily DB snapshot created' }
  ]);

  const handleResolveTicket = (ticketId) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'Resolved' } : t))
    );
    addToast(`Ticket ${ticketId} marked as Resolved`, 'success');
    setSelectedTicket(null);
  };

  const handleModerateReview = (reviewId, action) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, moderated: action } : r))
    );
    addToast(`Review ${reviewId} ${action === 'approved' ? 'approved' : 'flagged/hidden'}`, 'info');
  };

  const handleExportReport = (reportName) => {
    addToast(`Exported ${reportName} (CSV) successfully!`, 'success');
  };

  return (
    <div className="zorevi-admin-dash">
      <div className="zorevi-admin-dash__header">
        <div>
          <h1 className="zorevi-admin-dash__title">Support, Reviews & Reports</h1>
          <p className="zorevi-admin-dash__sub">
            Handle customer tickets, moderate reviews, export tax reports, and inspect platform audit logs.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #e5e7eb',
          marginBottom: '20px',
          overflowX: 'auto'
        }}
      >
        {[
          { id: 'support', label: 'Support Tickets', icon: LifeBuoy, count: tickets.length },
          { id: 'reviews', label: 'Reviews & Moderation', icon: Star, count: reviews.length },
          { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
          { id: 'settings', label: 'Audit & Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 18px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '3px solid #7c3aed' : '3px solid transparent',
                color: isActive ? '#7c3aed' : '#6b7280',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  style={{
                    background: isActive ? '#f5f3ff' : '#f3f4f6',
                    color: isActive ? '#7c3aed' : '#6b7280',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: SUPPORT TICKETS */}
      {activeTab === 'support' && (
        <div>
          {/* Priority breakdown cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginBottom: '20px'
            }}
          >
            <div className="zorevi-admin-stat-card">
              <span className="zorevi-admin-stat-label">Total Open Tickets</span>
              <span className="zorevi-admin-stat-val">24</span>
              <span className="zorevi-admin-stat-sub" style={{ color: '#ef4444' }}>8 High Priority</span>
            </div>
            <div className="zorevi-admin-stat-card">
              <span className="zorevi-admin-stat-label">Avg. Resolution Time</span>
              <span className="zorevi-admin-stat-val">3.2 Hrs</span>
              <span className="zorevi-admin-stat-sub">SLA 98.4%</span>
            </div>
            <div className="zorevi-admin-stat-card">
              <span className="zorevi-admin-stat-label">Booking Reschedule Req.</span>
              <span className="zorevi-admin-stat-val">11</span>
              <span className="zorevi-admin-stat-sub" style={{ color: '#f59e0b' }}>Action Needed</span>
            </div>
            <div className="zorevi-admin-stat-card">
              <span className="zorevi-admin-stat-label">Payment Inquiries</span>
              <span className="zorevi-admin-stat-val">5</span>
              <span className="zorevi-admin-stat-sub">Razorpay Sync OK</span>
            </div>
          </div>

          <div className="zorevi-admin-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="zorevi-admin-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Subject</th>
                  <th>User / Role</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Updated</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 700, color: '#7c3aed' }}>{t.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{t.subject}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Category: {t.category || 'Booking Issue'}</div>
                    </td>
                    <td>
                      <div>{t.userName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{t.userRole || 'Customer'}</div>
                    </td>
                    <td>
                      <span
                        style={{
                          background:
                            t.priority === 'High'
                              ? '#fef2f2'
                              : t.priority === 'Medium'
                              ? '#fffbeb'
                              : '#f0fdf4',
                          color:
                            t.priority === 'High'
                              ? '#ef4444'
                              : t.priority === 'Medium'
                              ? '#f59e0b'
                              : '#16a34a',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td>
                      <Badge
                        variant={
                          t.status === 'Resolved'
                            ? 'success'
                            : t.status === 'In Progress'
                            ? 'info'
                            : 'warning'
                        }
                      >
                        {t.status}
                      </Badge>
                    </td>
                    <td>{t.assignedTo || 'Priya Sharma'}</td>
                    <td style={{ fontSize: '0.8rem', color: '#6b7280' }}>{t.updatedAt || '18 Nov 2025'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="zorevi-btn zorevi-btn--outline"
                        style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                        onClick={() => setSelectedTicket(t)}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: REVIEWS & MODERATION */}
      {activeTab === 'reviews' && (
        <div>
          <div className="zorevi-admin-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="zorevi-admin-table">
              <thead>
                <tr>
                  <th>Review ID</th>
                  <th>Customer</th>
                  <th>Designer</th>
                  <th>Rating</th>
                  <th>Review Feedback</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Moderation Action</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((rev) => (
                  <tr key={rev.id}>
                    <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>{rev.id}</td>
                    <td>{rev.customerName || 'Anonymous Customer'}</td>
                    <td style={{ fontWeight: 600 }}>{rev.designerName || 'Designer'}</td>
                    <td>
                      <span style={{ color: '#f59e0b', fontWeight: 700 }}>
                        {'★'.repeat(rev.rating)} ({rev.rating})
                      </span>
                    </td>
                    <td style={{ maxWidth: '340px' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#374151' }}>
                        "{rev.comment || rev.text}"
                      </p>
                      <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                        Booking #{rev.bookingId || 'ZV-8402'}
                      </span>
                    </td>
                    <td>
                      <Badge
                        variant={
                          rev.moderated === 'flagged'
                            ? 'danger'
                            : rev.moderated === 'approved'
                            ? 'success'
                            : 'info'
                        }
                      >
                        {rev.moderated || 'Published'}
                      </Badge>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          className="zorevi-btn zorevi-btn--primary"
                          style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                          onClick={() => handleModerateReview(rev.id, 'approved')}
                        >
                          Approve
                        </button>
                        <button
                          className="zorevi-btn zorevi-btn--outline"
                          style={{ padding: '4px 8px', fontSize: '0.72rem', color: '#ef4444' }}
                          onClick={() => handleModerateReview(rev.id, 'flagged')}
                        >
                          Hide / Flag
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REPORTS & ANALYTICS */}
      {activeTab === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="zorevi-admin-card">
            <h3 className="zorevi-admin-card__title">Exportable Platform Reports</h3>
            <p style={{ fontSize: '0.88rem', color: '#6b7280', margin: '0 0 20px 0' }}>
              Download detailed CSV data for accounting, GST filings, designer payout settlements, and auditing.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '16px'
              }}
            >
              {[
                { title: 'Bookings & Styling Log', desc: 'All completed, upcoming and cancelled bookings with location tags.', file: 'bookings-report-nov2025.csv' },
                { title: 'Revenue & Commission Report', desc: '12% platform take rate, gross GMV, and net designer earnings.', file: 'revenue-commission-nov2025.csv' },
                { title: 'Designer Payout Settlements', desc: 'Bank account numbers, IFSC, transfer status and timestamps.', file: 'payouts-report-nov2025.csv' },
                { title: 'Customer Refunds & Disputes', desc: 'Refund reason codes, approval timestamps, and Razorpay refund IDs.', file: 'refunds-log-nov2025.csv' }
              ].map((rep, idx) => (
                <div
                  key={idx}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', color: '#1e1b4b' }}>
                      {rep.title}
                    </h4>
                    <p style={{ margin: '0 0 14px 0', fontSize: '0.8rem', color: '#6b7280' }}>
                      {rep.desc}
                    </p>
                  </div>
                  <button
                    className="zorevi-btn zorevi-btn--outline"
                    onClick={() => handleExportReport(rep.title)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem' }}
                  >
                    <Download size={16} /> Download CSV
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOG & SETTINGS */}
      {activeTab === 'settings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick System Settings summary card matching screenshot */}
          <div className="zorevi-admin-card">
            <h3 className="zorevi-admin-card__title">System & Platform Health</h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginTop: '10px'
              }}
            >
              <div style={{ background: '#f9fafb', padding: '14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>PLATFORM COMMISSION</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e1b4b', marginTop: '4px' }}>12% Active</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>DEFAULT PACKAGE</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e1b4b', marginTop: '4px' }}>₹499 / 2 hours</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>PAYMENT GATEWAY</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>Razorpay Connected</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>AUDIT LOGGING</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#7c3aed', marginTop: '4px' }}>Enabled (SOC-2)</div>
              </div>
            </div>
          </div>

          {/* Audit Log Table */}
          <div className="zorevi-admin-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e1b4b' }}>
                Audit Log (Recent Staff & Admin Activity)
              </h3>
            </div>
            <table className="zorevi-admin-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Admin / System</th>
                  <th>Action Taken</th>
                  <th>Target Details</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.8rem', color: '#6b7280' }}>{log.time}</td>
                    <td style={{ fontWeight: 600, color: '#1e1b4b' }}>{log.admin}</td>
                    <td style={{ color: '#7c3aed', fontWeight: 600 }}>{log.action}</td>
                    <td>{log.details}</td>
                    <td>
                      <Badge variant="success">Logged</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <Modal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={`Ticket Details: ${selectedTicket.id}`}
        >
          <div>
            <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
              <div><strong>Subject:</strong> {selectedTicket.subject}</div>
              <div style={{ marginTop: '6px' }}><strong>User:</strong> {selectedTicket.userName} ({selectedTicket.userRole})</div>
              <div style={{ marginTop: '6px' }}><strong>Priority:</strong> {selectedTicket.priority}</div>
              <div style={{ marginTop: '6px' }}><strong>Status:</strong> {selectedTicket.status}</div>
              <div style={{ marginTop: '12px', borderTop: '1px solid #e5e7eb', paddingTop: '10px' }}>
                <strong>Description / Customer Notes:</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: '#4b5563' }}>
                  Customer requested to shift their personal styling appointment from 4:00 PM to 6:00 PM at Lakeside Fashion Mall due to travel delay.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              {selectedTicket.status !== 'Resolved' && (
                <button
                  className="zorevi-btn zorevi-btn--primary"
                  onClick={() => handleResolveTicket(selectedTicket.id)}
                >
                  <CheckCircle2 size={16} /> Mark as Resolved
                </button>
              )}
              <button
                className="zorevi-btn zorevi-btn--outline"
                onClick={() => setSelectedTicket(null)}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminSupportReviews;

