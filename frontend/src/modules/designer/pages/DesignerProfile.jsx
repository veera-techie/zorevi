import { useState } from 'react';
import { User, CheckCircle2, Award, Sparkles, MapPin, Save, Plus } from 'lucide-react';
import { mockDesigners } from '../../../services/mockData';
import { SPECIALIZATIONS } from '../../../constants';
import { useApp } from '../../../context/AppContext';
import './DesignerPages.css';

export default function DesignerProfile() {
  const designer = mockDesigners[0];
  const { addToast } = useApp();

  const [name, setName] = useState(designer.name);
  const [title, setTitle] = useState(designer.title);
  const [location, setLocation] = useState(designer.location);
  const [radius, setRadius] = useState(designer.serviceRadius || '15 km');
  const [experience, setExperience] = useState(designer.experience || '6 years');
  const [bio, setBio] = useState(designer.bio);
  const [selectedSpecializations, setSelectedSpecializations] = useState(designer.specializations || []);
  const [skills, setSkills] = useState(designer.skills || []);
  const [newSkill, setNewSkill] = useState('');

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
    addToast('Designer profile and specializations saved successfully!', 'success');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', paddingBottom: '60px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1E1B4B', margin: '0 0 4px 0' }}>
          Profile & Credentials Management
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>
          Keep your designer bio, service radius, and fashion credentials updated for clients.
        </p>
      </div>

      <form onSubmit={handleSave}>
        {/* Profile Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #F3F4F6', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
            <img src={designer.avatar} alt={name} style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #EDE9FE' }} />
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

        <button type="submit" className="zorevi-btn zorevi-btn--primary zorevi-btn--lg">
          <Save size={16} /> Save Profile Changes
        </button>
      </form>
    </div>
  );
}

