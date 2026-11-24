import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, CheckCircle2, Award, Sparkles, MapPin, Save, Plus, Camera, Pencil, Upload, ExternalLink } from 'lucide-react';
import { mockDesigners, mockMalls } from '../../../services/mockData';
import { SPECIALIZATIONS } from '../../../constants';
import { useApp } from '../../../context/AppContext';
import Modal from '../../../components/common/Modal';
import { AAROHI_PROFILE_IMAGE, loadAarohiProfileImage } from '../../../utils/aarohiProfileImage';
import './DesignerPages.css';

const loadSavedProfile = () => {
  try { return JSON.parse(localStorage.getItem('zorevi-designer-profile') || '{}') || {}; }
  catch { return {}; }
};

const loadStoredJson = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback; }
  catch { return fallback; }
};

export default function DesignerProfile() {
  const designer = mockDesigners[0];
  const { addToast } = useApp();
  const photoInputRef = useRef(null);
  const mallPhotoInputRef = useRef(null);
  const [savedProfile] = useState(loadSavedProfile);
  const [profileImage, setProfileImage] = useState(loadAarohiProfileImage);

  const [name, setName] = useState(savedProfile.name || designer.name);
  const [title, setTitle] = useState(savedProfile.title || designer.title);
  const [location, setLocation] = useState(savedProfile.location || designer.location);
  const [radius, setRadius] = useState(savedProfile.radius || designer.serviceRadius || '15 km');
  const [experience, setExperience] = useState(savedProfile.experience || designer.experience || '6 years');
  const [bio, setBio] = useState(savedProfile.bio || designer.bio);
  const [selectedSpecializations, setSelectedSpecializations] = useState(savedProfile.specializations || designer.specializations || []);
  const [skills, setSkills] = useState(savedProfile.skills || designer.skills || []);
  const [availableMallIds, setAvailableMallIds] = useState(savedProfile.availableMallIds || []);
  const [socialAccounts, setSocialAccounts] = useState(savedProfile.socialAccounts || { instagram: '', facebook: '', pinterest: '' });
  const [mallOverrides, setMallOverrides] = useState(() => loadStoredJson('zorevi-designer-mall-overrides', {}));
  const [customMalls, setCustomMalls] = useState(() => loadStoredJson('zorevi-designer-custom-malls', []));
  const [editingMall, setEditingMall] = useState(null);
  const [mallDraft, setMallDraft] = useState({ name: '', address: '', image: '', fashionStores: 1 });
  const [newSkill, setNewSkill] = useState('');

  const malls = [...mockMalls, ...customMalls].map((mall) => ({ ...mall, ...(mallOverrides[mall.id] || {}) }));
  const availableMalls = malls.filter((mall) => mall.fashionStores > 0);

  const saveProfilePart = (fields, successMessage) => {
    try {
      const stored = loadSavedProfile();
      localStorage.setItem('zorevi-designer-profile', JSON.stringify({ ...stored, ...fields }));
      addToast(successMessage, 'success');
      return true;
    } catch {
      addToast('The browser could not save this profile section.', 'error');
      return false;
    }
  };

  const saveSocialAccounts = () => saveProfilePart({ socialAccounts }, 'Social media accounts saved.');
  const saveMallLocations = () => saveProfilePart({ availableMallIds }, 'Mall locations saved to your profile.');

  const openMallEditor = (mall) => {
    setEditingMall(mall ? { id: mall.id, isCustom: customMalls.some((item) => item.id === mall.id) } : { id: `custom-${Date.now()}`, isCustom: true });
    setMallDraft(mall ? { name: mall.name, address: mall.address, image: mall.image, fashionStores: mall.fashionStores || 1 } : { name: '', address: location, image: '/images/mall-lakeside.jpg', fashionStores: 1 });
  };

  const saveMall = () => {
    if (!mallDraft.name.trim() || !mallDraft.address.trim()) {
      addToast('Enter the mall name and address before saving.', 'error');
      return;
    }
    const nextMall = { id: editingMall.id, name: mallDraft.name.trim(), address: mallDraft.address.trim(), location: location || 'Hyderabad', image: mallDraft.image || '/images/mall-lakeside.jpg', fashionStores: Math.max(1, Number(mallDraft.fashionStores) || 1) };
    const nextOverrides = editingMall.isCustom ? mallOverrides : { ...mallOverrides, [editingMall.id]: nextMall };
    const nextCustomMalls = editingMall.isCustom ? [...customMalls.filter((mall) => mall.id !== editingMall.id), nextMall] : customMalls;
    const nextAvailableMallIds = availableMallIds.includes(nextMall.id) ? availableMallIds : [...availableMallIds, nextMall.id];
    try {
      localStorage.setItem('zorevi-designer-mall-overrides', JSON.stringify(nextOverrides));
      localStorage.setItem('zorevi-designer-custom-malls', JSON.stringify(nextCustomMalls));
      localStorage.setItem('zorevi-designer-profile', JSON.stringify({ ...loadSavedProfile(), availableMallIds: nextAvailableMallIds }));
      setMallOverrides(nextOverrides);
      setCustomMalls(nextCustomMalls);
      setAvailableMallIds(nextAvailableMallIds);
      setEditingMall(null);
      addToast('Mall details and image saved.', 'success');
    } catch {
      addToast('The browser could not store this mall. Try a smaller image.', 'error');
    }
  };

  const handleMallPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('Choose an image file for this mall.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, 900 / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        setMallDraft((current) => ({ ...current, image: canvas.toDataURL('image/jpeg', 0.8) }));
      };
      image.onerror = () => addToast('Could not load that image. Please try another file.', 'error');
      image.src = reader.result;
    };
    reader.onerror = () => addToast('Could not load that image. Please try another file.', 'error');
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const toggleSpec = (spec) => {
    setSelectedSpecializations((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
      addToast('Added skill', 'info');
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const profile = { name, title, location, radius, experience, bio, specializations: selectedSpecializations, skills, availableMallIds, socialAccounts };
    try {
      localStorage.setItem('zorevi-designer-profile', JSON.stringify(profile));
    } catch {
      addToast('The browser could not save your profile. Try freeing local storage and save again.', 'error');
      return;
    }
    addToast('Designer profile and specializations saved successfully!', 'success');
  };

  const toggleMall = (mallId) => {
    setAvailableMallIds((current) => current.includes(mallId)
      ? current.filter((id) => id !== mallId)
      : [...current, mallId]);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('Choose an image file for your profile photo.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, 640 / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        const optimizedImage = canvas.toDataURL('image/jpeg', 0.82);
        setProfileImage(optimizedImage);
        try {
          localStorage.setItem('zorevi-designer-profile-photo', optimizedImage);
          addToast('Profile photo updated and saved in this browser.', 'success');
        } catch {
          addToast('Photo preview updated, but this browser could not store it.', 'info');
        }
      };
      image.onerror = () => addToast('Could not load that image. Please try another file.', 'error');
      image.src = reader.result;
    };
    reader.onerror = () => addToast('Could not load that image. Please try another file.', 'error');
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', paddingBottom: '60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1E1B4B', margin: '0 0 4px 0' }}>
            Profile & Credentials Management
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>
            Keep your designer bio, service radius, and fashion credentials updated for clients.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/designers/des-001" target="_blank" className="zorevi-btn zorevi-btn--outline">
            <ExternalLink size={15} /> Preview Profile
          </Link>
          <button type="submit" form="designer-profile-form" className="zorevi-btn zorevi-btn--primary">
            <Save size={15} /> Save Changes
          </button>
        </div>
      </div>

      <form id="designer-profile-form" onSubmit={handleSave}>
        {/* Profile Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #F3F4F6', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img src={profileImage} alt={name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = AAROHI_PROFILE_IMAGE; }} style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #EDE9FE' }} />
              <button type="button" onClick={() => photoInputRef.current?.click()} aria-label="Edit profile photo" title="Edit profile photo" style={{ position: 'absolute', right: 0, bottom: 0, width: '30px', height: '30px', borderRadius: '50%', border: '2px solid #fff', background: '#7043C5', color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer' }}><Camera size={14} /></button>
              <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1E1B4B', margin: 0 }}>{name}</h3>
                <CheckCircle2 size={18} color="#10B981" />
              </div>
              <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>Verified Fashion Designer & Stylist</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="zorevi-auth-field">
              <label>Full Name *</label>
              <input type="text" className="zorevi-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="zorevi-auth-field">
              <label>Professional Title *</label>
              <input type="text" className="zorevi-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="zorevi-auth-field">
              <label>Base City</label>
              <input type="text" className="zorevi-input" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>

            <div className="zorevi-auth-field">
              <label>Service Area Radius</label>
              <select className="zorevi-input" value={radius} onChange={(e) => setRadius(e.target.value)}>
                <option value="5 km">5 km radius</option>
                <option value="10 km">10 km radius</option>
                <option value="15 km">15 km radius</option>
                <option value="25 km">25 km (All Hyderabad)</option>
              </select>
            </div>

            <div className="zorevi-auth-field">
              <label>Total Experience</label>
              <input type="text" className="zorevi-input" value={experience} onChange={(e) => setExperience(e.target.value)} />
            </div>
          </div>

          <div className="zorevi-auth-field" style={{ marginTop: '8px' }}>
            <label>Professional Bio (Short)</label>
            <textarea className="zorevi-textarea" rows="4" value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #F3F4F6', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
            <div><h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1E1B4B', margin: '0 0 6px' }}>Mall locations</h3><p style={{ fontSize: '0.85rem', color: '#6B7280', margin: '0 0 16px' }}>Choose where clients can meet you. Edit each mall's details and photo, or add another location.</p></div>
            <button type="button" className="zorevi-btn zorevi-btn--outline" onClick={() => openMallEditor(null)}><Plus size={15} /> Add a mall</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(245px, 1fr))', gap: '12px' }}>
            {availableMalls.map((mall) => (
              <article key={mall.id} style={{ overflow: 'hidden', border: availableMallIds.includes(mall.id) ? '1px solid #BFA9E8' : '1px solid #EEE9F5', borderRadius: '13px', background: availableMallIds.includes(mall.id) ? '#FAF8FE' : '#fff' }}>
                <img src={mall.image} alt={mall.name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/mall-lakeside.jpg'; }} style={{ display: 'block', width: '100%', height: '118px', objectFit: 'cover', background: '#F3EEFB' }} />
                <div style={{ padding: '11px' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={availableMallIds.includes(mall.id)} onChange={() => toggleMall(mall.id)} style={{ accentColor: '#7043C5', marginTop: '3px' }} />
                    <span><strong style={{ display: 'block', color: '#30283C', fontSize: '0.84rem' }}>{mall.name}</strong><small style={{ display: 'block', color: '#817A89', fontSize: '0.72rem', marginTop: '3px' }}>{mall.address}</small><small style={{ display: 'block', color: '#7043C5', fontSize: '0.72rem', marginTop: '4px' }}>{mall.fashionStores} fashion stores</small></span>
                  </label>
                  <button type="button" onClick={() => openMallEditor(mall)} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', margin: '10px 0 0 23px', padding: 0, border: 0, background: 'transparent', color: '#7043C5', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}><Pencil size={12} /> Edit mall &amp; photo</button>
                </div>
              </article>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}><button type="button" className="zorevi-btn zorevi-btn--primary" onClick={saveMallLocations}><Save size={15} /> Save mall locations</button></div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #F3F4F6', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1E1B4B', margin: '0 0 6px' }}>Social media accounts</h3>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: '0 0 16px' }}>Add public profile links so clients can discover more of your work.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
            {[['instagram', 'Instagram'], ['facebook', 'Facebook'], ['pinterest', 'Pinterest']].map(([key, label]) => (
              <div className="zorevi-auth-field" key={key}>
                <label htmlFor={`social-${key}`}>{label}</label>
                <input id={`social-${key}`} type="url" className="zorevi-input" placeholder={`https://${key}.com/your-profile`} value={socialAccounts[key]} onChange={(e) => setSocialAccounts((current) => ({ ...current, [key]: e.target.value }))} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}><button type="button" className="zorevi-btn zorevi-btn--primary" onClick={saveSocialAccounts}><Save size={15} /> Save social accounts</button></div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #F3F4F6', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1E1B4B', margin: '0 0 6px' }}>Previous design works</h3>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: '0 0 16px' }}>A quick look at four featured projects from your portfolio.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            {[
              { title: 'Bridal Elegance', category: 'Bridal styling', image: '/images/portfolio-bridal-hd.jpg' },
              { title: 'Modern Classics', category: 'Contemporary', image: '/images/portfolio-classics-hd.jpg' },
              { title: 'Family Festive', category: 'Family styling', image: '/images/portfolio-family-hd.jpg' },
              { title: 'Fusion Celebration', category: 'Fusion wear', image: '/images/portfolio-fusion-hd.jpg' },
            ].map((work) => (
              <article key={work.title} style={{ overflow: 'hidden', border: '1px solid #EEE9F5', borderRadius: '13px', background: '#FCFBFE' }}>
                <img src={work.image} alt={work.title} style={{ display: 'block', width: '100%', height: '160px', objectFit: 'cover', objectPosition: 'top' }} />
                <div style={{ padding: '10px 12px' }}><strong style={{ display: 'block', color: '#30283C', fontSize: '0.84rem' }}>{work.title}</strong><small style={{ color: '#817A89', fontSize: '0.72rem' }}>{work.category}</small></div>
              </article>
            ))}
          </div>
        </div>

        {/* Specializations & Skills */}
        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #F3F4F6', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '8px' }}>
            Specializations
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '16px' }}>
            Select the categories your studio specializes in.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
            {SPECIALIZATIONS.map((spec) => (
              <button
                type="button"
                key={spec}
                className={`zorevi-chip ${selectedSpecializations.includes(spec) ? 'active' : ''}`}
                onClick={() => toggleSpec(spec)}
              >
                {selectedSpecializations.includes(spec) && <CheckCircle2 size={13} />} {spec}
              </button>
            ))}
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '8px' }}>
            Core Styling Skills
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {skills.map((sk) => (
              <span key={sk} style={{ padding: '6px 14px', background: '#F5F0FF', color: '#7C3AED', borderRadius: '9999px', fontSize: '0.82rem', fontWeight: '600', border: '1px solid #DDD6FE' }}>
                {sk}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', maxWidth: '380px' }}>
            <input
              type="text"
              className="zorevi-input"
              placeholder="Add skill (e.g. Body Typing)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <button type="button" className="zorevi-btn zorevi-btn--outline" onClick={handleAddSkill}>
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        {editingMall && (
          <Modal isOpen={Boolean(editingMall)} onClose={() => setEditingMall(null)} title={editingMall.isCustom && !customMalls.some((mall) => mall.id === editingMall.id) ? 'Add mall location' : 'Edit mall location'} maxWidth="560px">
            <div onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}>
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px', background: '#F3EEFB', marginBottom: '14px' }}>
                <img src={mallDraft.image} alt={mallDraft.name || 'Mall preview'} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/mall-lakeside.jpg'; }} style={{ display: 'block', width: '100%', height: '190px', objectFit: 'cover' }} />
                <button type="button" onClick={() => mallPhotoInputRef.current?.click()} className="zorevi-btn zorevi-btn--outline" style={{ position: 'absolute', right: '10px', bottom: '10px', background: '#fff' }}><Upload size={14} /> Change image</button>
                <input ref={mallPhotoInputRef} type="file" accept="image/*" onChange={handleMallPhotoChange} style={{ display: 'none' }} />
              </div>
              <div className="zorevi-auth-field"><label>Mall name *</label><input className="zorevi-input" value={mallDraft.name} onChange={(e) => setMallDraft((current) => ({ ...current, name: e.target.value }))} placeholder="e.g. City Centre Mall" /></div>
              <div className="zorevi-auth-field"><label>Address *</label><input className="zorevi-input" value={mallDraft.address} onChange={(e) => setMallDraft((current) => ({ ...current, address: e.target.value }))} placeholder="Area, city, postal code" /></div>
              <div className="zorevi-auth-field"><label>Fashion stores</label><input className="zorevi-input" type="number" min="1" value={mallDraft.fashionStores} onChange={(e) => setMallDraft((current) => ({ ...current, fashionStores: e.target.value }))} /></div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '9px', marginTop: '18px' }}><button type="button" className="zorevi-btn zorevi-btn--outline" onClick={() => setEditingMall(null)}>Cancel</button><button type="button" className="zorevi-btn zorevi-btn--primary" onClick={saveMall}><Save size={14} /> Save mall</button></div>
            </div>
          </Modal>
        )}

        <button type="submit" className="zorevi-btn zorevi-btn--primary zorevi-btn--lg">
          <Save size={16} /> Save Profile Changes
        </button>
      </form>
    </div>
  );
}

