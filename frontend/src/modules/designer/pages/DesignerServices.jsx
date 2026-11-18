import { useState } from 'react';
import {
  Scissors, Sparkles, Clock, MapPin, DollarSign, Plus,
  CheckCircle2, Edit2
} from 'lucide-react';
import { mockServices } from '../../../services/mockData';
import Modal from '../../../components/common/Modal';
import { useApp } from '../../../context/AppContext';

export default function DesignerServices() {
  const [services, setServices] = useState(mockServices.slice(0, 4));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState(1499);
  const [newServiceDuration, setNewServiceDuration] = useState('2 hours');
  const [newServiceCategory, setNewServiceCategory] = useState('Personal Styling');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const { addToast } = useApp();

  const toggleServiceActive = (id) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
    addToast('Service visibility updated', 'info');
  };

  const openNewService = () => {
    setEditingService(null);
    setNewServiceName('');
    setNewServicePrice(1499);
    setNewServiceDuration('2 hours');
    setNewServiceCategory('Personal Styling');
    setNewServiceDesc('');
    setIsAddModalOpen(true);
  };

  const openServiceEditor = (service) => {
    setEditingService(service);
    setNewServiceName(service.name);
    setNewServicePrice(service.basePrice);
    setNewServiceDuration(service.duration);
    setNewServiceCategory(service.category || 'Personal Styling');
    setNewServiceDesc(service.description || '');
    setIsAddModalOpen(true);
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    const serviceDetails = {
      name: newServiceName,
      basePrice: Number(newServicePrice),
      duration: newServiceDuration,
      category: newServiceCategory,
      description: newServiceDesc || 'Custom fashion consultation and styling service.',
    };

    if (editingService) {
      setServices((current) => current.map((service) => service.id === editingService.id ? { ...service, ...serviceDetails } : service));
      addToast(`${newServiceName} updated successfully`, 'success');
    } else {
      setServices((current) => [...current, { id: `svc-${Date.now()}`, ...serviceDetails, isActive: true }]);
      addToast('New service published to your profile!', 'success');
    }
    setIsAddModalOpen(false);
    setEditingService(null);
  };

  return (
    <div style={{ width: '100%', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1E1B4B', margin: '0 0 4px 0' }}>
            Services & Pricing Editor
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>
            Create, customize, and price your styling packages and custom quotes.
          </p>
        </div>

        <button className="zorevi-btn zorevi-btn--primary" onClick={openNewService}>
          <Plus size={16} /> Add New Service
        </button>
      </div>

      {/* Standard Package Banner & Price Factors Grid matching screenshot */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', marginBottom: '28px' }}>
        {/* Banner */}
        <div style={{ background: 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%)', borderRadius: '24px', border: '1px solid #E9D5FF', padding: '28px', position: 'relative', overflow: 'hidden' }}>
          <span style={{ fontSize: '0.72rem', color: '#7C3AED', fontWeight: '700', textTransform: 'uppercase' }}>
            STANDARD PACKAGE
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#1E1B4B', margin: '6px 0 10px' }}>
            Starting at Just ₹499 <small style={{ fontSize: '1rem', fontWeight: '600', color: '#6B7280' }}>for 2 Hours</small>
          </h2>

          <ul style={{ fontSize: '0.85rem', color: '#4B5563', lineHeight: '1.8', listStyle: 'none', padding: 0 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#7C3AED" /> Designer Consultation
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#7C3AED" /> In-Mall Shopping Assistance
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#7C3AED" /> Personalized Outfit Suggestions
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#7C3AED" /> Standard All-Inclusive Package
            </li>
          </ul>
        </div>

        {/* Price Factors Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #F3F4F6', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="#7C3AED" /> Transparent Price Factors
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem', color: '#4B5563' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Clock size={16} color="#7C3AED" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#1E1B4B', display: 'block' }}>Service Duration</strong>
                <span>e.g., 2 Hours (Standard), Half Day, Full Day</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Scissors size={16} color="#7C3AED" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#1E1B4B', display: 'block' }}>Outfit Complexity</strong>
                <span>Basic casual styling vs. Heavy bridal trousseau</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <MapPin size={16} color="#7C3AED" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#1E1B4B', display: 'block' }}>Location & Travel</strong>
                <span>In-studio, mall meeting, or client destination</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services List matching screenshot */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '16px' }}>
        My Active Services ({services.length})
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {services.map((svc) => (
          <div
            key={svc.id}
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #F3F4F6',
              padding: '20px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1E1B4B', margin: 0 }}>{svc.name}</h4>
                <strong style={{ fontSize: '1.15rem', color: '#7C3AED' }}>₹{svc.basePrice}</strong>
              </div>

              <p style={{ fontSize: '0.82rem', color: '#6B7280', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                {svc.description}
              </p>

              <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Duration: {svc.duration}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #F3F4F6' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: svc.isActive ? '#059669' : '#9CA3AF', fontWeight: '600', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={svc.isActive}
                  onChange={() => toggleServiceActive(svc.id)}
                />
                <span>{svc.isActive ? 'Active' : 'Inactive'}</span>
              </label>

              <button
                className="zorevi-btn zorevi-btn--ghost zorevi-btn--sm"
                onClick={() => openServiceEditor(svc)}
              >
                <Edit2 size={13} /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Service Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => { setIsAddModalOpen(false); setEditingService(null); }}
          title={editingService ? `Edit ${editingService.name}` : 'Create New Styling Service'}
          maxWidth="520px"
        >
          <form onSubmit={handleSaveService}>
            <div className="zorevi-auth-field">
              <label>Service Name *</label>
              <input
                type="text"
                className="zorevi-input"
                placeholder="e.g. Cocktail & Evening Gown Styling"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="zorevi-auth-field">
                <label>Base Price (₹) *</label>
                <input
                  type="number"
                  className="zorevi-input"
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(e.target.value)}
                  required
                />
              </div>

              <div className="zorevi-auth-field">
                <label>Duration</label>
                <input
                  type="text"
                  className="zorevi-input"
                  value={newServiceDuration}
                  onChange={(e) => setNewServiceDuration(e.target.value)}
                />
              </div>
            </div>

            <div className="zorevi-auth-field">
              <label>Service Category</label>
              <select className="zorevi-input" value={newServiceCategory} onChange={(e) => setNewServiceCategory(e.target.value)}>
                <option>Personal Styling</option>
                <option>Bridal &amp; Groom</option>
                <option>Family Styling</option>
                <option>Wardrobe Consultation</option>
                <option>Custom Tailoring</option>
              </select>
            </div>

            <div className="zorevi-auth-field">
              <label>Service Description</label>
              <textarea
                className="zorevi-textarea"
                rows="3"
                placeholder="What is included in this styling package?"
                value={newServiceDesc}
                onChange={(e) => setNewServiceDesc(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button type="button" className="zorevi-btn zorevi-btn--outline" onClick={() => { setIsAddModalOpen(false); setEditingService(null); }}>
                Cancel
              </button>
              <button type="submit" className="zorevi-btn zorevi-btn--primary">
                {editingService ? 'Save Changes' : 'Publish Service'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

