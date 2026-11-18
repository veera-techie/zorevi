import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Tag,
  DollarSign,
  Percent,
  Layers,
  CheckCircle2,
  Plus,
  Trash2,
  Save,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { mockServices } from '../../../services/mockData';
import { formatCurrency } from '../../../utils';
import { useApp } from '../../../context/AppContext';
import Badge from '../../../components/common/Badge';
import Modal from '../../../components/common/Modal';
import './AdminStyles.css';

const AdminServices = ({ initialTab }) => {
  const location = useLocation();
  const { addToast } = useApp();

  const getInitialTab = () => {
    if (initialTab) return initialTab;
    const path = location.pathname;
    if (path.includes('/categories')) return 'categories';
    if (path.includes('/pricing')) return 'pricing';
    if (path.includes('/commissions')) return 'commissions';
    return 'services';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());

  // Pricing configuration state
  const [pricingConfig, setPricingConfig] = useState({
    defaultStartingPackage: 499,
    defaultDurationHours: 2,
    gstRate: 18,
    platformConvenienceFee: 0,
    cancellationWindowHours: 24,
    cancellationPenaltyPercent: 15
  });

  // Commission state
  const [commissionConfig, setCommissionConfig] = useState({
    standardRate: 12,
    vipRate: 10,
    introductoryRate: 8,
    payoutCycle: 'WEEKLY_WEDNESDAY',
    minimumPayoutThreshold: 1000
  });

  // Services state
  const [services, setServices] = useState(mockServices || []);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    category: 'Personal Styling',
    startingPrice: 499,
    duration: '2 Hours',
    description: ''
  });

  // Categories state
  const [categories, setCategories] = useState([
    { id: 'cat-1', name: "Men's Styling", slug: 'mens', activeDesigners: 28, status: 'Active' },
    { id: 'cat-2', name: "Women's Styling", slug: 'womens', activeDesigners: 45, status: 'Active' },
    { id: 'cat-3', name: "Kids' Styling", slug: 'kids', activeDesigners: 14, status: 'Active' },
    { id: 'cat-4', name: 'Couple Styling', slug: 'couple', activeDesigners: 19, status: 'Active' },
    { id: 'cat-5', name: 'Family Styling', slug: 'family', activeDesigners: 22, status: 'Active' },
    { id: 'cat-6', name: 'Bridal & Groom', slug: 'bridal', activeDesigners: 36, status: 'Active' },
    { id: 'cat-7', name: 'Festive & Occasion', slug: 'festive', activeDesigners: 25, status: 'Active' }
  ]);

  const handleSavePricing = (e) => {
    e.preventDefault();
    addToast('Pricing rules and GST settings updated successfully!', 'success');
  };

  const handleSaveCommission = (e) => {
    e.preventDefault();
    addToast('Commission tiers and payout schedule updated!', 'success');
  };

  const handleAddService = (e) => {
    e.preventDefault();
    if (!newService.title) {
      addToast('Please enter service title', 'error');
      return;
    }
    const created = {
      id: `srv-${Date.now()}`,
      ...newService,
      active: true
    };
    setServices([created, ...services]);
    setIsAddServiceModalOpen(false);
    addToast(`Service "${newService.title}" created successfully!`, 'success');
    setNewService({
      title: '',
      category: 'Personal Styling',
      startingPrice: 499,
      duration: '2 Hours',
      description: ''
    });
  };

  return (
    <div className="zorevi-admin-dash">
      <div className="zorevi-admin-dash__header">
        <div>
          <h1 className="zorevi-admin-dash__title">Services, Categories & Pricing</h1>
          <p className="zorevi-admin-dash__sub">
            Configure catalog services, fashion specializations, default ₹499 packages, and revenue share commissions.
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
          { id: 'services', label: 'Styling Services', icon: Layers },
          { id: 'categories', label: 'Fashion Categories', icon: Tag },
          { id: 'pricing', label: 'Pricing Configuration', icon: DollarSign },
          { id: 'commissions', label: 'Commission Settings', icon: Percent }
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
            </button>
          );
        })}
      </div>

      {/* TAB 1: SERVICES CATALOG */}
      {activeTab === 'services' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e1b4b' }}>Standard Service Packages</h3>
            <button
              className="zorevi-btn zorevi-btn--primary"
              onClick={() => setIsAddServiceModalOpen(true)}
            >
              <Plus size={16} /> Add New Service
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '16px'
            }}
          >
            {services.map((srv) => (
              <div
                key={srv.id}
                className="zorevi-admin-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span
                      style={{
                        background: '#f5f3ff',
                        color: '#7c3aed',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px'
                      }}
                    >
                      {srv.category || 'General'}
                    </span>
                    <Badge variant="success">Active</Badge>
                  </div>

                  <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: '#1e1b4b' }}>
                    {srv.title}
                  </h4>
                  <p style={{ margin: '0 0 14px 0', fontSize: '0.85rem', color: '#6b7280', minHeight: '38px' }}>
                    {srv.description || 'Personalized consultation, styling guidance and wardrobe selection.'}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #f3f4f6',
                    paddingTop: '12px',
                    marginTop: '8px'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Base Price: </span>
                    <strong style={{ color: '#1e1b4b', fontSize: '1.05rem' }}>
                      {formatCurrency(srv.startingPrice || 499)}
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    {srv.duration || '2 Hours'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="zorevi-admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="zorevi-admin-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Slug</th>
                <th>Active Designers</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#1e1b4b' }}>{cat.name}</div>
                  </td>
                  <td style={{ color: '#6b7280', fontFamily: 'monospace' }}>/{cat.slug}</td>
                  <td>{cat.activeDesigners} Stylists</td>
                  <td>
                    <Badge variant={cat.status === 'Active' ? 'success' : 'default'}>
                      {cat.status}
                    </Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="zorevi-btn zorevi-btn--outline"
                      style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                      onClick={() => {
                        setCategories((prev) =>
                          prev.map((c) =>
                            c.id === cat.id
                              ? { ...c, status: c.status === 'Active' ? 'Disabled' : 'Active' }
                              : c
                          )
                        );
                        addToast(`Category ${cat.name} status updated`, 'info');
                      }}
                    >
                      {cat.status === 'Active' ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: PRICING CONFIGURATION */}
      {activeTab === 'pricing' && (
        <div style={{ maxWidth: '680px' }}>
          <div className="zorevi-admin-card">
            <h3 className="zorevi-admin-card__title">Base Marketplace Package Rules</h3>
            <p style={{ fontSize: '0.88rem', color: '#6b7280', margin: '0 0 20px 0' }}>
              These rules set the baseline starting quotation across the platform (₹499 / 2 hours) and tax rates.
            </p>

            <form onSubmit={handleSavePricing} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Default Starting Package (INR)
                  </label>
                  <input
                    type="number"
                    value={pricingConfig.defaultStartingPackage}
                    onChange={(e) =>
                      setPricingConfig({ ...pricingConfig, defaultStartingPackage: Number(e.target.value) })
                    }
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                    Reference screenshot headline rate: ₹499
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Standard Duration (Hours)
                  </label>
                  <input
                    type="number"
                    value={pricingConfig.defaultDurationHours}
                    onChange={(e) =>
                      setPricingConfig({ ...pricingConfig, defaultDurationHours: Number(e.target.value) })
                    }
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>Default slot duration: 2 hours</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    GST Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={pricingConfig.gstRate}
                    onChange={(e) =>
                      setPricingConfig({ ...pricingConfig, gstRate: Number(e.target.value) })
                    }
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>Itemized tax on customer checkout (18%)</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Free Cancellation Window (Hours)
                  </label>
                  <input
                    type="number"
                    value={pricingConfig.cancellationWindowHours}
                    onChange={(e) =>
                      setPricingConfig({ ...pricingConfig, cancellationWindowHours: Number(e.target.value) })
                    }
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>Full refund if cancelled before 24h</span>
                </div>
              </div>

              <button
                type="submit"
                className="zorevi-btn zorevi-btn--primary"
                style={{ alignSelf: 'flex-start', marginTop: '10px' }}
              >
                <Save size={16} /> Save Pricing Parameters
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: COMMISSION SETTINGS */}
      {activeTab === 'commissions' && (
        <div style={{ maxWidth: '680px' }}>
          <div className="zorevi-admin-card">
            <h3 className="zorevi-admin-card__title">Platform Commission & Payout Tiers</h3>
            <p style={{ fontSize: '0.88rem', color: '#6b7280', margin: '0 0 20px 0' }}>
              Configure revenue cut automatically deducted from confirmed booking payouts.
            </p>

            <form onSubmit={handleSaveCommission} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Standard Platform Commission (%)
                  </label>
                  <input
                    type="number"
                    value={commissionConfig.standardRate}
                    onChange={(e) =>
                      setCommissionConfig({ ...commissionConfig, standardRate: Number(e.target.value) })
                    }
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                    Default screenshot commission: 12%
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Top Rated / VIP Designer Rate (%)
                  </label>
                  <input
                    type="number"
                    value={commissionConfig.vipRate}
                    onChange={(e) =>
                      setCommissionConfig({ ...commissionConfig, vipRate: Number(e.target.value) })
                    }
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>Reduced rate for designers with 50+ bookings</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Payout Schedule
                </label>
                <select
                  value={commissionConfig.payoutCycle}
                  onChange={(e) =>
                    setCommissionConfig({ ...commissionConfig, payoutCycle: e.target.value })
                  }
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                >
                  <option value="WEEKLY_WEDNESDAY">Weekly (Every Wednesday via Direct Bank / UPI)</option>
                  <option value="BI_WEEKLY">Bi-weekly (1st and 15th of each month)</option>
                  <option value="DAILY_ON_COMPLETION">Daily after 24h booking closure</option>
                </select>
              </div>

              <button
                type="submit"
                className="zorevi-btn zorevi-btn--primary"
                style={{ alignSelf: 'flex-start', marginTop: '10px' }}
              >
                <Save size={16} /> Save Commission Rules
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      <Modal
        isOpen={isAddServiceModalOpen}
        onClose={() => setIsAddServiceModalOpen(false)}
        title="Add Catalog Styling Service"
      >
        <form onSubmit={handleAddService} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
              Service Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Red Carpet & Gala Styling"
              value={newService.title}
              onChange={(e) => setNewService({ ...newService, title: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                Category
              </label>
              <select
                value={newService.category}
                onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              >
                <option value="Personal Styling">Personal Styling</option>
                <option value="Bridal & Groom">Bridal & Groom</option>
                <option value="Wardrobe Consultation">Wardrobe Consultation</option>
                <option value="Family Styling">Family Styling</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                Base Price (₹)
              </label>
              <input
                type="number"
                value={newService.startingPrice}
                onChange={(e) => setNewService({ ...newService, startingPrice: Number(e.target.value) })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Outline what is included in this session..."
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              type="button"
              className="zorevi-btn zorevi-btn--outline"
              onClick={() => setIsAddServiceModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="zorevi-btn zorevi-btn--primary">
              Create Service
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminServices;

