import { useState, useRef } from 'react';
import { User, Mail, Phone, MapPin, Sparkles, Plus, Check, Save, Camera, Edit2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import { STYLE_PREFERENCES } from '../../../constants';

export default function CustomerProfile() {
  const { user, setUser } = useAuth();
  const { addToast } = useApp();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || 'Praveen Kumar');
  const [email, setEmail] = useState(user?.email || 'praveen.kumar@email.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [city, setCity] = useState(user?.location || 'Hyderabad');
  const [avatar, setAvatar] = useState(user?.avatar || '/zorevi-icon.svg');
  const [selectedStyles, setSelectedStyles] = useState(['Contemporary', 'Ethnic', 'Western']);
  const [addresses, setAddresses] = useState([
    { id: 1, label: 'Home', address: 'Flat 402, Gachibowli, Hyderabad – 500032' },
    { id: 2, label: 'Work', address: 'Tech Park, HITEC City, Hyderabad – 500081' },
  ]);

  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);

  const toggleStyle = (style) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        setAvatar(result);
        if (setUser) {
          setUser((prev) => ({ ...(prev || {}), avatar: result }));
        }
        addToast('Profile photo updated successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogo = () => {
    setAvatar('/zorevi-icon.svg');
    if (setUser) {
      setUser((prev) => ({ ...(prev || {}), avatar: '/zorevi-icon.svg' }));
    }
    addToast('Reset avatar to Zorevi company logo.', 'info');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (setUser) {
      setUser((prev) => ({
        ...(prev || {}),
        name,
        email,
        phone,
        location: city,
        avatar,
      }));
    }
    addToast('Profile and style preferences updated successfully!', 'success');
  };

  const handleAddAddress = () => {
    if (!newLabel || !newAddress) return;
    setAddresses([...addresses, { id: Date.now(), label: newLabel, address: newAddress }]);
    setNewLabel('');
    setNewAddress('');
    setShowAddAddress(false);
    addToast('Address added to your profile', 'success');
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', width: '100%', paddingBottom: '60px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1E1B4B', margin: '0 0 4px 0' }}>
          My Style Profile
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>
          Manage your personal details, preferred styling aesthetics, and saved locations.
        </p>
      </div>

      <form onSubmit={handleSaveProfile}>
        {/* Personal Details Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #EDE9FE', padding: '28px', boxShadow: '0 4px 16px rgba(124, 58, 237, 0.04)', marginBottom: '24px' }}>
          {/* Avatar & Edit Photo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '28px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={avatar || '/zorevi-icon.svg'}
                alt={name}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/zorevi-icon.svg'; }}
                style={{
                  width: '88px',
                  height: '88px',
                  borderRadius: '50%',
                  objectFit: avatar === '/zorevi-icon.svg' ? 'contain' : 'cover',
                  background: '#ffffff',
                  padding: avatar === '/zorevi-icon.svg' ? '6px' : '0',
                  border: '3px solid #EDE9FE',
                  boxShadow: '0 4px 16px rgba(124, 58, 237, 0.1)',
                  display: 'block',
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: '#7C3AED',
                  color: '#FFFFFF',
                  border: '2px solid #FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  transition: 'transform 0.15s ease',
                }}
                title="Change profile picture"
              >
                <Camera size={14} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoUpload}
              />
            </div>

            <div style={{ flex: 1, minWidth: '220px' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1E1B4B', margin: '0 0 4px 0' }}>{name}</h3>
              <span style={{ fontSize: '0.84rem', color: '#6B7280', display: 'block', marginBottom: '10px' }}>
                Zorevi Customer Member • {city}
              </span>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="zorevi-btn zorevi-btn--outline zorevi-btn--sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera size={13} /> Change Photo
                </button>
                {avatar !== '/zorevi-icon.svg' && (
                  <button
                    type="button"
                    className="zorevi-btn zorevi-btn--ghost zorevi-btn--sm"
                    onClick={handleResetLogo}
                  >
                    Use Company Logo
                  </button>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="zorevi-auth-field">
              <label>Full Name</label>
              <input
                type="text"
                className="zorevi-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="zorevi-auth-field">
              <label>Email Address</label>
              <input
                type="email"
                className="zorevi-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="zorevi-auth-field">
              <label>Mobile Number</label>
              <input
                type="tel"
                className="zorevi-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="zorevi-auth-field">
              <label>City</label>
              <input
                type="text"
                className="zorevi-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Style Preferences */}
        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #EDE9FE', padding: '28px', boxShadow: '0 4px 16px rgba(124, 58, 237, 0.04)', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '8px' }}>
            Preferred Styles &amp; Aesthetics
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '16px' }}>
            Designers will tailor outfit recommendations and store picks to these aesthetics.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {STYLE_PREFERENCES.map((st) => (
              <button
                type="button"
                key={st}
                className={`zorevi-chip ${selectedStyles.includes(st) ? 'active' : ''}`}
                onClick={() => toggleStyle(st)}
              >
                {selectedStyles.includes(st) && <Check size={14} />} {st}
              </button>
            ))}
          </div>
        </div>

        {/* Saved Addresses */}
        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #EDE9FE', padding: '28px', boxShadow: '0 4px 16px rgba(124, 58, 237, 0.04)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1E1B4B', margin: 0 }}>
              Saved Addresses &amp; Locations
            </h3>
            <button
              type="button"
              className="zorevi-btn zorevi-btn--outline zorevi-btn--sm"
              onClick={() => setShowAddAddress(!showAddAddress)}
            >
              <Plus size={14} /> Add Address
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {addresses.map((addr) => (
              <div
                key={addr.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px',
                  borderRadius: '14px',
                  background: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F5F0FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '0.9rem', color: '#1E1B4B' }}>{addr.label}</strong>
                  <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '2px 0 0' }}>{addr.address}</p>
                </div>
              </div>
            ))}
          </div>

          {showAddAddress && (
            <div style={{ marginTop: '16px', padding: '16px', borderRadius: '14px', background: '#FAF5FF', border: '1px solid #DDD6FE' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="text"
                  className="zorevi-input"
                  placeholder="Label (e.g. Studio, Home)"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                />
                <input
                  type="text"
                  className="zorevi-input"
                  placeholder="Full Address"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="zorevi-btn zorevi-btn--ghost zorevi-btn--sm" onClick={() => setShowAddAddress(false)}>
                  Cancel
                </button>
                <button type="button" className="zorevi-btn zorevi-btn--primary zorevi-btn--sm" onClick={handleAddAddress}>
                  Save Address
                </button>
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="zorevi-btn zorevi-btn--primary zorevi-btn--lg">
          <Save size={16} /> Save Profile Changes
        </button>
      </form>
    </div>
  );
}
