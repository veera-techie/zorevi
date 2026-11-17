import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Users,
  Scissors,
  Calendar,
  CreditCard,
  RotateCcw,
  Search,
  Filter,
  Download,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Check,
  X,
  FileSpreadsheet
} from 'lucide-react';
import {
  mockCustomers,
  mockDesigners,
  mockBookings,
  mockTransactions,
  mockRefunds
} from '../../../services/mockData';
import { formatCurrency, formatDate } from '../../../utils';
import { useApp } from '../../../context/AppContext';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import Badge from '../../../components/common/Badge';
import Modal from '../../../components/common/Modal';
import './AdminStyles.css';

const AdminOperations = ({ initialTab }) => {
  const location = useLocation();
  const { addToast } = useApp();

  // Determine initial tab from prop or URL pathname
  const getInitialTab = () => {
    if (initialTab) return initialTab;
    const path = location.pathname;
    if (path.includes('/designers')) return 'designers';
    if (path.includes('/bookings')) return 'bookings';
    if (path.includes('/payments')) return 'payments';
    if (path.includes('/refunds')) return 'refunds';
    return 'customers';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null); // 'customer', 'designer', 'booking', 'refund'

  // Dynamic state for actions
  const [customers, setCustomers] = useState(mockCustomers || []);
  const [designers, setDesigners] = useState(mockDesigners || []);
  const [bookings, setBookings] = useState(mockBookings || []);
  const [refunds, setRefunds] = useState(mockRefunds || []);

  const handleExport = (type) => {
    addToast(`Exported ${type} report as CSV successfully!`, 'success');
  };

  const handleToggleCustomerStatus = (id) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'Active' ? 'Suspended' : 'Active' }
          : c
      )
    );
    addToast('Customer account status updated', 'info');
    setSelectedItem(null);
  };

  const handleRefundAction = (id, newStatus) => {
    setRefunds((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    addToast(`Refund ${id} marked as ${newStatus}`, 'success');
    setSelectedItem(null);
  };

  return (
    <div className="zorevi-admin-dash">
      {/* Top Banner / Header */}
      <div className="zorevi-admin-dash__header">
        <div>
          <h1 className="zorevi-admin-dash__title">Marketplace Operations</h1>
          <p className="zorevi-admin-dash__sub">
            Manage customers, verified designers, styling bookings, transactions and refund claims.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="zorevi-btn zorevi-btn--outline"
            onClick={() => handleExport(activeTab)}
          >
            <Download size={16} /> Export {activeTab.toUpperCase()}
          </button>
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
          { id: 'customers', label: 'Customers', icon: Users, count: customers.length },
          { id: 'designers', label: 'Designers', icon: Scissors, count: designers.length },
          { id: 'bookings', label: 'Bookings', icon: Calendar, count: bookings.length },
          { id: 'payments', label: 'Payments', icon: CreditCard, count: mockTransactions.length },
          { id: 'refunds', label: 'Refunds', icon: RotateCcw, count: refunds.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchTerm('');
                setStatusFilter('ALL');
              }}
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
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
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
            </button>
          );
        })}
      </div>

      {/* Search and Filters Bar */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#ffffff',
          padding: '14px 18px',
          borderRadius: '14px',
          marginBottom: '20px',
          border: '1px solid #f3f4f6',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
          <Search size={18} color="#9ca3af" />
          <input
            type="text"
            placeholder={`Search ${activeTab} by name, ID, phone or email...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '0.9rem',
              color: '#1e1b4b'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#6b7280' }}>
            <Filter size={16} /> Status:
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '0.85rem',
              color: '#374151',
              outline: 'none'
            }}
          >
            <option value="ALL">All Statuses</option>
            {activeTab === 'customers' && (
              <>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </>
            )}
            {activeTab === 'designers' && (
              <>
                <option value="Approved">Verified / Approved</option>
                <option value="Pending">Pending Review</option>
              </>
            )}
            {activeTab === 'bookings' && (
              <>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </>
            )}
            {activeTab === 'payments' && (
              <>
                <option value="Success">Success</option>
                <option value="Pending">Pending</option>
              </>
            )}
            {activeTab === 'refunds' && (
              <>
                <option value="Approved">Approved</option>
                <option value="Processed">Processed</option>
                <option value="Pending">Pending</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="zorevi-admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="zorevi-admin-table-wrap">
          {/* TAB 1: CUSTOMERS */}
          {activeTab === 'customers' && (
            <table className="zorevi-admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact Info</th>
                  <th>Location</th>
                  <th>Joined Date</th>
                  <th>Total Bookings</th>
                  <th>Total Spent</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers
                  .filter((c) =>
                    statusFilter === 'ALL' ? true : (c.status || 'Active') === statusFilter
                  )
                  .filter((c) =>
                    searchTerm
                      ? c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.email.toLowerCase().includes(searchTerm.toLowerCase())
                      : true
                  )
                  .map((cust) => (
                    <tr key={cust.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <ImageWithFallback
                            src={cust.avatar}
                            alt={cust.name}
                            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: '#1e1b4b' }}>{cust.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>ID: {cust.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>{cust.email}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{cust.phone}</div>
                      </td>
                      <td>{cust.city || 'Hyderabad'}</td>
                      <td>{cust.joinedOn || '12 Oct 2025'}</td>
                      <td style={{ fontWeight: 600 }}>{cust.totalBookings || 4}</td>
                      <td style={{ fontWeight: 700, color: '#1e1b4b' }}>
                        {formatCurrency(cust.totalSpent || 6499)}
                      </td>
                      <td>
                        <Badge
                          variant={(cust.status || 'Active') === 'Active' ? 'success' : 'danger'}
                        >
                          {cust.status || 'Active'}
                        </Badge>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="zorevi-btn zorevi-btn--outline"
                          style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                          onClick={() => {
                            setSelectedItem(cust);
                            setModalType('customer');
                          }}
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {/* TAB 2: DESIGNERS */}
          {activeTab === 'designers' && (
            <table className="zorevi-admin-table">
              <thead>
                <tr>
                  <th>Designer</th>
                  <th>Specialization</th>
                  <th>Experience & City</th>
                  <th>Rating</th>
                  <th>Total Bookings</th>
                  <th>Verification</th>
                  <th>Commission</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {designers
                  .filter((d) =>
                    statusFilter === 'ALL'
                      ? true
                      : statusFilter === 'Approved'
                      ? d.isVerified
                      : !d.isVerified
                  )
                  .filter((d) =>
                    searchTerm
                      ? d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        d.brandName?.toLowerCase().includes(searchTerm.toLowerCase())
                      : true
                  )
                  .map((des) => (
                    <tr key={des.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <ImageWithFallback
                            src={des.avatar}
                            alt={des.name}
                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: '#1e1b4b' }}>{des.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              {des.brandName || 'Independent Stylist'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {des.specializations?.slice(0, 2).map((s) => (
                            <span
                              key={s}
                              style={{
                                background: '#f5f3ff',
                                color: '#7c3aed',
                                fontSize: '0.7rem',
                                padding: '2px 6px',
                                borderRadius: '4px'
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div>{des.experience || '5+ Years'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{des.city}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#f59e0b' }}>
                          ★ {des.rating} <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>({des.reviewCount})</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{des.totalBookings || 48}</td>
                      <td>
                        <Badge variant={des.isVerified ? 'success' : 'warning'}>
                          {des.isVerified ? 'Verified' : 'Pending'}
                        </Badge>
                      </td>
                      <td style={{ fontWeight: 700, color: '#7c3aed' }}>12%</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="zorevi-btn zorevi-btn--outline"
                          style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                          onClick={() => {
                            setSelectedItem(des);
                            setModalType('designer');
                          }}
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {/* TAB 3: BOOKINGS */}
          {activeTab === 'bookings' && (
            <table className="zorevi-admin-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Designer</th>
                  <th>Service & Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings
                  .filter((b) => (statusFilter === 'ALL' ? true : b.status === statusFilter))
                  .filter((b) =>
                    searchTerm
                      ? b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        b.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        b.designerName?.toLowerCase().includes(searchTerm.toLowerCase())
                      : true
                  )
                  .map((b) => (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 700, color: '#7c3aed' }}>{b.id}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.customerName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{b.customerPhone || '+91 98765 43210'}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.designerName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{b.city}</div>
                      </td>
                      <td>
                        <div>{b.serviceTitle}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {formatDate(b.date)} • {b.time}
                        </div>
                      </td>
                      <td style={{ fontWeight: 700 }}>{formatCurrency(b.totalAmount)}</td>
                      <td>
                        <Badge
                          variant={
                            b.status === 'CONFIRMED'
                              ? 'success'
                              : b.status === 'PENDING'
                              ? 'warning'
                              : b.status === 'COMPLETED'
                              ? 'info'
                              : 'danger'
                          }
                        >
                          {b.status}
                        </Badge>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="zorevi-btn zorevi-btn--outline"
                          style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                          onClick={() => {
                            setSelectedItem(b);
                            setModalType('booking');
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {/* TAB 4: PAYMENTS */}
          {activeTab === 'payments' && (
            <table className="zorevi-admin-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Booking ID</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Platform Cut</th>
                  <th>Gateway</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions
                  .filter((t) => (statusFilter === 'ALL' ? true : t.status === statusFilter))
                  .filter((t) =>
                    searchTerm
                      ? t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        t.bookingId?.toLowerCase().includes(searchTerm.toLowerCase())
                      : true
                  )
                  .map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>{t.id}</td>
                      <td>{t.bookingId}</td>
                      <td>
                        <span
                          style={{
                            background:
                              t.type === 'BOOKING_PAYMENT'
                                ? '#ecfdf5'
                                : t.type === 'COMMISSION'
                                ? '#f5f3ff'
                                : '#eff6ff',
                            color:
                              t.type === 'BOOKING_PAYMENT'
                                ? '#059669'
                                : t.type === 'COMMISSION'
                                ? '#7c3aed'
                                : '#2563eb',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}
                        >
                          {t.type}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>{formatCurrency(t.amount)}</td>
                      <td style={{ color: '#7c3aed', fontWeight: 600 }}>
                        {formatCurrency(Math.round(t.amount * 0.12))}
                      </td>
                      <td>{t.paymentMethod || 'Razorpay UPI'}</td>
                      <td style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        {formatDate(t.date)} {t.time || '14:20'}
                      </td>
                      <td>
                        <Badge variant={t.status === 'Success' ? 'success' : 'warning'}>
                          {t.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {/* TAB 5: REFUNDS */}
          {activeTab === 'refunds' && (
            <table className="zorevi-admin-table">
              <thead>
                <tr>
                  <th>Refund ID</th>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {refunds
                  .filter((r) => (statusFilter === 'ALL' ? true : r.status === statusFilter))
                  .filter((r) =>
                    searchTerm
                      ? r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.bookingId?.toLowerCase().includes(searchTerm.toLowerCase())
                      : true
                  )
                  .map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>{r.id}</td>
                      <td style={{ color: '#7c3aed' }}>{r.bookingId}</td>
                      <td>{r.customerName}</td>
                      <td style={{ fontWeight: 700 }}>{formatCurrency(r.amount)}</td>
                      <td style={{ maxWidth: '240px', fontSize: '0.82rem', color: '#4b5563' }}>
                        {r.reason}
                      </td>
                      <td>
                        <Badge
                          variant={
                            r.status === 'Approved'
                              ? 'success'
                              : r.status === 'Processed'
                              ? 'info'
                              : r.status === 'Pending'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {r.status}
                        </Badge>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          {r.status === 'Pending' ? (
                            <>
                              <button
                                className="zorevi-btn zorevi-btn--primary"
                                style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                                onClick={() => handleRefundAction(r.id, 'Approved')}
                              >
                                Approve
                              </button>
                              <button
                                className="zorevi-btn zorevi-btn--outline"
                                style={{ padding: '4px 8px', fontSize: '0.72rem', color: '#ef4444' }}
                                onClick={() => handleRefundAction(r.id, 'Rejected')}
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Completed</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Item Management Modal */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={`Manage ${modalType?.toUpperCase()}: ${selectedItem.name || selectedItem.id}`}
        >
          <div style={{ padding: '10px 0' }}>
            {modalType === 'customer' && (
              <div>
                <p style={{ margin: '0 0 12px 0', color: '#4b5563' }}>
                  Manage account status and safety flags for <strong>{selectedItem.name}</strong>.
                </p>
                <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                  <div><strong>Email:</strong> {selectedItem.email}</div>
                  <div style={{ marginTop: '6px' }}><strong>Phone:</strong> {selectedItem.phone}</div>
                  <div style={{ marginTop: '6px' }}><strong>Total Bookings:</strong> {selectedItem.totalBookings || 4}</div>
                  <div style={{ marginTop: '6px' }}><strong>Status:</strong> {selectedItem.status || 'Active'}</div>
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    className="zorevi-btn zorevi-btn--outline"
                    onClick={() => handleToggleCustomerStatus(selectedItem.id)}
                    style={{ color: selectedItem.status === 'Suspended' ? '#10b981' : '#ef4444' }}
                  >
                    {selectedItem.status === 'Suspended' ? 'Activate Account' : 'Suspend Account'}
                  </button>
                  <button
                    className="zorevi-btn zorevi-btn--primary"
                    onClick={() => setSelectedItem(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {modalType === 'designer' && (
              <div>
                <p style={{ margin: '0 0 12px 0', color: '#4b5563' }}>
                  Overview and commission settings for <strong>{selectedItem.name}</strong>.
                </p>
                <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                  <div><strong>Brand:</strong> {selectedItem.brandName}</div>
                  <div style={{ marginTop: '6px' }}><strong>City:</strong> {selectedItem.city}</div>
                  <div style={{ marginTop: '6px' }}><strong>Rating:</strong> ★ {selectedItem.rating}</div>
                  <div style={{ marginTop: '6px' }}><strong>Platform Commission:</strong> 12% standard</div>
                  <div style={{ marginTop: '6px' }}><strong>Starting Rate:</strong> {formatCurrency(selectedItem.startingPrice || 499)} / 2 hrs</div>
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    className="zorevi-btn zorevi-btn--outline"
                    onClick={() => {
                      addToast('Commission updated to 10% custom rate', 'success');
                      setSelectedItem(null);
                    }}
                  >
                    Apply VIP 10% Commission
                  </button>
                  <button
                    className="zorevi-btn zorevi-btn--primary"
                    onClick={() => setSelectedItem(null)}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {modalType === 'booking' && (
              <div>
                <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                  <div><strong>Booking ID:</strong> {selectedItem.id}</div>
                  <div style={{ marginTop: '6px' }}><strong>Service:</strong> {selectedItem.serviceTitle}</div>
                  <div style={{ marginTop: '6px' }}><strong>Customer:</strong> {selectedItem.customerName}</div>
                  <div style={{ marginTop: '6px' }}><strong>Designer:</strong> {selectedItem.designerName}</div>
                  <div style={{ marginTop: '6px' }}><strong>Total:</strong> {formatCurrency(selectedItem.totalAmount)}</div>
                  <div style={{ marginTop: '6px' }}><strong>Status:</strong> {selectedItem.status}</div>
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    className="zorevi-btn zorevi-btn--outline"
                    onClick={() => {
                      setBookings((prev) =>
                        prev.map((b) => (b.id === selectedItem.id ? { ...b, status: 'COMPLETED' } : b))
                      );
                      addToast('Booking status overridden to COMPLETED', 'info');
                      setSelectedItem(null);
                    }}
                  >
                    Force Complete
                  </button>
                  <button
                    className="zorevi-btn zorevi-btn--primary"
                    onClick={() => setSelectedItem(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminOperations;

