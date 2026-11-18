import { useState } from 'react';
import { UploadCloud, Plus, Trash2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { mockDesigners } from '../../../services/mockData';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import Modal from '../../../components/common/Modal';
import { useApp } from '../../../context/AppContext';

export default function DesignerPortfolio() {
  const designer = mockDesigners[0];
  const [portfolio, setPortfolio] = useState(designer.portfolio || []);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectCategory, setProjectCategory] = useState('Bridal');
  const { addToast } = useApp();

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;

    const newProject = {
      id: `p-${Date.now()}`,
      title: projectTitle,
      category: projectCategory,
      image: '/images/portfolio-bridal-hd.jpg',
    };

    setPortfolio([newProject, ...portfolio]);
    setProjectTitle('');
    setIsUploadOpen(false);
    addToast('New styling project added to your portfolio!', 'success');
  };

  const handleDelete = (id) => {
    setPortfolio(portfolio.filter((p) => p.id !== id));
    addToast('Project removed from portfolio', 'info');
  };

  return (
    <div style={{ width: '100%', paddingBottom: '60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1E1B4B', margin: '0 0 4px 0' }}>
            Portfolio & Lookbook Management
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>
            Upload and organize photos of your best creations and client styling sessions.
          </p>
        </div>

        <button className="zorevi-btn zorevi-btn--primary" onClick={() => setIsUploadOpen(true)}>
          <Plus size={16} /> Upload New Project
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {portfolio.map((item) => (
          <div
            key={item.id}
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #F3F4F6',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              position: 'relative',
            }}
          >
            <div style={{ height: '260px', width: '100%', background: '#F5F0FF' }}>
              <ImageWithFallback
                src={item.image}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                fallbackType="bridal"
              />
            </div>

            <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ fontSize: '0.95rem', color: '#1E1B4B', display: 'block' }}>{item.title}</strong>
                <span style={{ fontSize: '0.75rem', color: '#7C3AED', fontWeight: '600' }}>{item.category}</span>
              </div>
              <button
                style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '6px' }}
                onClick={() => handleDelete(item.id)}
                title="Delete project"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <Modal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          title="Upload New Look / Project"
          maxWidth="500px"
        >
          <form onSubmit={handleAddProject}>
            <div className="zorevi-auth-field">
              <label>Project Title *</label>
              <input
                type="text"
                className="zorevi-input"
                placeholder="e.g. Royal Rajasthani Bridal"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                required
              />
            </div>

            <div className="zorevi-auth-field">
              <label>Category</label>
              <select
                className="zorevi-input"
                value={projectCategory}
                onChange={(e) => setProjectCategory(e.target.value)}
              >
                <option value="Bridal">Bridal</option>
                <option value="Groom">Groom</option>
                <option value="Western">Western</option>
                <option value="Ethnic">Ethnic</option>
                <option value="Party">Party</option>
                <option value="Casual">Casual</option>
                <option value="Family">Family</option>
              </select>
            </div>

            <div style={{ border: '2px dashed #DDD6FE', background: '#FAF5FF', borderRadius: '16px', padding: '24px', textAlign: 'center', margin: '16px 0' }}>
              <UploadCloud size={32} color="#7C3AED" style={{ margin: '0 auto 8px' }} />
              <strong style={{ fontSize: '0.85rem', color: '#1E1B4B', display: 'block' }}>Upload Project Photos</strong>
              <small style={{ color: '#6B7280', fontSize: '0.72rem' }}>Supports PNG, JPG up to 10MB</small>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" className="zorevi-btn zorevi-btn--outline" onClick={() => setIsUploadOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="zorevi-btn zorevi-btn--primary">
                Add to Portfolio
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

