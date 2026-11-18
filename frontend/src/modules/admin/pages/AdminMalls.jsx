import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Clock,
  ShoppingBag,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Eye
} from 'lucide-react';
import { mockMalls } from '../../../services/mockData';
import { useApp } from '../../../context/AppContext';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import Badge from '../../../components/common/Badge';
import Modal from '../../../components/common/Modal';
import './AdminStyles.css';

const AdminMalls = () => {
  const { addToast } = useApp();
  const [malls, setMalls] = useState(mockMalls || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMallStores, setSelectedMallStores] = useState(null);

  // Form state for adding/editing a mall
  const [formData, setFormData] = useState({
    name: '',
    city: 'Hyderabad',
    address: '',
    totalStores: 40,
    openingHours: '10:00 AM - 10:00 PM',
    rating: 4.8,
    image: '/images/mall-lakeside.jpg'
  });

  const handleToggleMallStatus = (id) => {
    setMalls((prev) =>
      prev.map((m) => (m.id === id ? { ...m, active: m.active === false ? true : false } : m))
    );
    addToast('Mall visibility status toggled', 'info');
  };

  const handleAddMall = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      addToast('Please fill in mall name and address', 'error');
      return;
    }

    const newMall = {
      id: `mall-${Date.now()}`,
      ...formData,
      active: true,
      fashionStores: [
        { name: 'Zara', floor: '1st Floor', category: 'Western Apparel' },
        { name: 'FabIndia', floor: 'Ground Floor', category: 'Ethnic Wear' },
        { name: 'H&M', floor: '2nd Floor', category: 'Fast Fashion' }
      ]
    };

    setMalls([newMall, ...malls]);
    setIsAddModalOpen(false);
    addToast(`Mall "${formData.name}" added successfully!`, 'success');
    setFormData({
      name: '',
      city: 'Hyderabad',
      address: '',
      totalStores: 40,
      openingHours: '10:00 AM - 10:00 PM',
      rating: 4.8,
      image: '/images/mall-lakeside.jpg'
    });
  };

  return (
    <div className="zorevi-admin-dash">
      <div className="zorevi-admin-dash__header">
        <div>
          <h1 className="zorevi-admin-dash__title">Manage Malls & Styling Hubs</h1>
          <p className="zorevi-admin-dash__sub">
            Configure partner shopping malls, designate styling meeting points, and audit tenant stores.
          </p>
        </div>
        <button
          className="zorevi-btn zorevi-btn--primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} /> Add Partner Mall
        </button>
      </div>

      {/* Filter and Search Bar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="#9ca3af" />
          <input
            type="text"
            placeholder="Search malls by name, locality or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>City:</span>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '0.85rem'
            }}
          >
            <option value="ALL">All Cities</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
          </select>
        </div>
      </div>

      {/* Malls Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}
      >
        {malls
          .filter((m) => (selectedCity === 'ALL' ? true : m.city === selectedCity))
          .filter((m) =>
            searchTerm
              ? m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.address.toLowerCase().includes(searchTerm.toLowerCase())
              : true
          )
          .map((mall) => (
            <div
              key={mall.id}
              className="zorevi-admin-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '0',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'relative', height: '160px' }}>
                <ImageWithFallback
                  src={mall.image}
                  alt={mall.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    display: 'flex',
                    gap: '6px'
                  }}
                >
                  <Badge variant={mall.active !== false ? 'success' : 'default'}>
                    {mall.active !== false ? 'Active Hub' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              <div style={{ padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: '#1e1b4b' }}>
                    {mall.name}
                  </h3>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b' }}>
                    ★ {mall.rating || 4.8}
                  </span>
                </div>

                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} color="#7c3aed" /> {mall.address}
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    color: '#4b5563',
                    background: '#f9fafb',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShoppingBag size={14} /> {mall.totalStores || 42} Fashion Stores
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> {mall.openingHours || '10 AM - 10 PM'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="zorevi-btn zorevi-btn--outline"
                    style={{ flex: 1, padding: '8px', fontSize: '0.8rem' }}
                    onClick={() => setSelectedMallStores(mall)}
                  >
                    <Eye size={14} /> Stores ({mall.fashionStores?.length || 8})
                  </button>
                  <button
                    className="zorevi-btn"
                    style={{
                      background: mall.active !== false ? '#fee2e2' : '#ecfdf5',
                      color: mall.active !== false ? '#ef4444' : '#10b981',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    onClick={() => handleToggleMallStatus(mall.id)}
                  >
                    {mall.active !== false ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Add Mall Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Partner Mall"
      >
        <form onSubmit={handleAddMall} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
              Mall Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Inorbit Fashion Mall"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                City *
              </label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              >
                <option value="Hyderabad">Hyderabad</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                Fashion Stores Count
              </label>
              <input
                type="number"
                value={formData.totalStores}
                onChange={(e) => setFormData({ ...formData, totalStores: Number(e.target.value) })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
              Full Address & Landmark *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Madhapur, HITEC City, Hyderabad - 500081"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
              Cover Image URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              type="button"
              className="zorevi-btn zorevi-btn--outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="zorevi-btn zorevi-btn--primary">
              Save Mall
            </button>
          </div>
        </form>
      </Modal>

      {/* Mall Stores Inspector Modal */}
      {selectedMallStores && (
        <Modal
          isOpen={!!selectedMallStores}
          onClose={() => setSelectedMallStores(null)}
          title={`Stores at ${selectedMallStores.name}`}
        >
          <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 14px 0' }}>
              Designers can use these stores for styling sessions and merchandise sourcing.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(selectedMallStores.fashionStores || [
                { name: 'Zara', floor: '1st Floor', category: 'Western Apparel' },
                { name: 'FabIndia', floor: 'Ground Floor', category: 'Ethnic Wear' },
                { name: 'H&M', floor: '2nd Floor', category: 'Fast Fashion' },
                { name: 'Westside', floor: '1st Floor', category: 'Lifestyle' }
              ]).map((store, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: '#f9fafb',
                    border: '1px solid #f3f4f6'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: '#1e1b4b' }}>{store.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {store.floor} • {store.category}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      background: '#ecfdf5',
                      color: '#059669',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontWeight: 600
                    }}
                  >
                    Verified Partner
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="zorevi-btn zorevi-btn--primary"
              onClick={() => setSelectedMallStores(null)}
            >
              Done
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminMalls;

