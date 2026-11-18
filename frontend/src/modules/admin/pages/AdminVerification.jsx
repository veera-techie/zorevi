import { useState } from 'react';
import {
  ShieldCheck, Check, X, FileText, CheckCircle2, AlertTriangle,
  Mail, Phone, MapPin, Calendar, Clock, Image as ImageIcon, Send
} from 'lucide-react';
import { mockDesignerApplications } from '../../../services/mockData';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import { useApp } from '../../../context/AppContext';
import './AdminStyles.css';

export default function AdminVerification() {
  const [activeFilter, setActiveFilter] = useState('all'); // all, pending, resubmitted, in_review
  const [applications, setApplications] = useState(mockDesignerApplications);
  const [selectedApp, setSelectedApp] = useState(mockDesignerApplications[0]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, documents, portfolio, activity
  const { addToast } = useApp();

  const filteredApps = applications.filter((app) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return app.status === 'Pending';
    if (activeFilter === 'resubmitted') return app.status === 'Resubmitted';
    if (activeFilter === 'in_review') return app.status === 'In Review';
    return true;
  });

  const handleApprove = () => {
    setApplications((prev) =>
      prev.map((a) => (a.id === selectedApp.id ? { ...a, status: 'Approved' } : a))
    );
    addToast(`Approved designer ${selectedApp.name}! Verified badge granted.`, 'success');
  };

  const handleReject = () => {
    setApplications((prev) =>
      prev.map((a) => (a.id === selectedApp.id ? { ...a, status: 'Rejected' } : a))
    );
    addToast(`Application rejected for ${selectedApp.name}. Email dispatched.`, 'error');
  };

  const handleRequestInfo = () => {
    addToast(`Information request sent to ${selectedApp.email}`, 'info');
  };

  return (
    <div className="zorevi-admin-dash">
      <div className="zorevi-admin-dash__header">
        <div>
          <h1 className="zorevi-admin-dash__title">Designer Verification Queue</h1>
          <p className="zorevi-admin-dash__sub">
            Review stylist applications, verify government documents & portfolios, and grant marketplace access.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { id: 'all', label: `All (${applications.length})` },
          { id: 'pending', label: 'Pending (7)' },
          { id: 'resubmitted', label: 'Resubmitted (3)' },
          { id: 'in_review', label: 'In Review (2)' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`zorevi-btn zorevi-btn--sm ${activeFilter === tab.id ? 'zorevi-btn--primary' : 'zorevi-btn--outline'}`}
            onClick={() => setActiveFilter(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Two Column Layout matching screenshot */}
      <div className="zorevi-admin-verif-grid">
        {/* Left Column: Applicants Table */}
        <div className="zorevi-admin-card" style={{ padding: '16px' }}>
          <div className="zorevi-admin-table-wrap">
            <table className="zorevi-admin-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Specialization</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => {
                  const isSelected = selectedApp.id === app.id;
                  return (
                    <tr
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      style={{
                        cursor: 'pointer',
                        background: isSelected ? '#FAF5FF' : 'transparent',
                        borderLeft: isSelected ? '3px solid #7C3AED' : 'none',
                      }}
                    >
                      <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={app.avatar} alt={app.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div>
                          <strong>{app.name}</strong>
                          <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>{app.location}</div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#4B5563' }}>{app.specializations[0]}</td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            background: app.status === 'Approved' ? '#ECFDF5' : app.status === 'Rejected' ? '#FEF2F2' : '#FFFBEB',
                            color: app.status === 'Approved' ? '#059669' : app.status === 'Rejected' ? '#EF4444' : '#B45309',
                          }}
                        >
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Applicant Details Card matching screenshot */}
        <div className="zorevi-admin-card">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '20px', borderBottom: '1px solid #F3F4F6', marginBottom: '20px' }}>
            <img
              src={selectedApp.avatar}
              alt={selectedApp.name}
              style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #EDE9FE' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>{selectedApp.name}</h2>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '2px 8px', borderRadius: '9999px', background: '#FFFBEB', color: '#B45309' }}>
                  {selectedApp.status}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#7C3AED', fontWeight: '600', margin: '2px 0 6px' }}>
                {selectedApp.title} • {selectedApp.location}
              </p>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: '#6B7280' }}>
                <span>Applied: {selectedApp.submittedDate}</span>
                <span>Phone: {selectedApp.phone}</span>
              </div>
            </div>
          </div>

          {/* Sub Navigation */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E5E7EB', marginBottom: '20px' }}>
            {['overview', 'documents', 'portfolio', 'activity'].map((tab) => (
              <button
                key={tab}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  background: 'none',
                  borderBottom: activeTab === tab ? '2px solid #7C3AED' : 'none',
                  color: activeTab === tab ? '#7C3AED' : '#6B7280',
                  fontWeight: activeTab === tab ? '700' : '500',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview Content */}
          {activeTab === 'overview' && (
            <div>
              {/* Documents Checklist matching screenshot */}
              <div style={{ background: '#FAF5FF', border: '1px solid #DDD6FE', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '12px' }}>
                  Documents Checklist (4 of 4 verified)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669' }}>
                    <CheckCircle2 size={15} /> Government ID (Aadhaar / PAN)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669' }}>
                    <CheckCircle2 size={15} /> Business / Studio Proof
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669' }}>
                    <CheckCircle2 size={15} /> Address Proof
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669' }}>
                    <CheckCircle2 size={15} /> Professional Certificate
                  </div>
                </div>
              </div>

              {/* Portfolio Preview */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '10px' }}>
                  Portfolio Preview (12 items)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{ height: '70px', borderRadius: '10px', overflow: 'hidden', background: '#F3F4F6' }}>
                      <ImageWithFallback
                        src={`/images/portfolio-${i}.jpg`}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        fallbackType="bridal"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bio & Details */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '6px' }}>
                  About & Background
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#4B5563', lineHeight: '1.5', margin: 0 }}>
                  {selectedApp.bio}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '16px', textAlign: 'center' }}>
                  <div style={{ background: '#F9FAFB', padding: '10px', borderRadius: '10px' }}>
                    <strong style={{ fontSize: '1rem', color: '#1E1B4B', display: 'block' }}>{selectedApp.experience}</strong>
                    <small style={{ color: '#6B7280', fontSize: '0.72rem' }}>Experience</small>
                  </div>
                  <div style={{ background: '#F9FAFB', padding: '10px', borderRadius: '10px' }}>
                    <strong style={{ fontSize: '1rem', color: '#1E1B4B', display: 'block' }}>{selectedApp.teamSize || 4} members</strong>
                    <small style={{ color: '#6B7280', fontSize: '0.72rem' }}>Studio Team</small>
                  </div>
                  <div style={{ background: '#F9FAFB', padding: '10px', borderRadius: '10px' }}>
                    <strong style={{ fontSize: '1rem', color: '#1E1B4B', display: 'block' }}>Own Studio</strong>
                    <small style={{ color: '#6B7280', fontSize: '0.72rem' }}>Profile Type</small>
                  </div>
                </div>
              </div>

              {/* Action Buttons matching screenshot */}
              <div style={{ display: 'flex', gap: '10px', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
                <button
                  className="zorevi-btn zorevi-btn--primary"
                  style={{ background: '#10B981', flex: 1.2 }}
                  onClick={handleApprove}
                >
                  <Check size={16} /> Approve & Verify
                </button>
                <button
                  className="zorevi-btn zorevi-btn--outline"
                  style={{ color: '#EF4444', borderColor: '#FECACA' }}
                  onClick={handleReject}
                >
                  <X size={16} /> Reject
                </button>
                <button
                  className="zorevi-btn zorevi-btn--outline"
                  onClick={handleRequestInfo}
                >
                  Request Info
                </button>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div style={{ padding: '10px 0' }}>
              <p style={{ fontSize: '0.85rem', color: '#4B5563', marginBottom: '16px' }}>
                Click below to preview or re-verify uploaded identity documents:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Government Aadhaar Proof', 'Shop & Establishment Certificate', 'Utility Bill Address Verification'].map((doc, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FileText size={18} color="#7C3AED" />
                      <strong>{doc}</strong>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700' }}>VALID (200 DPI)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

