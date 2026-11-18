import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { mockDesigners, mockMalls } from '../../../services/mockData';
import DesignerCard from '../../../components/cards/DesignerCard';
import MallCard from '../../../components/cards/MallCard';
import BookingModal from '../../../components/cards/BookingModal';

export default function CustomerWishlist() {
  const { wishlist, toggleWishlist, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'designers', 'malls'
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingDesigner, setBookingDesigner] = useState(null);

  const handleBook = (designer) => {
    setBookingDesigner(designer);
    setIsBookingModalOpen(true);
  };

  const savedDesigners = mockDesigners.filter((d) =>
    wishlist.some((w) => w.type === 'designer' && w.itemId === d.id)
  );

  const savedMalls = mockMalls.filter((m) =>
    wishlist.some((w) => w.type === 'mall' && w.itemId === m.id)
  );

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#1E1B4B', margin: '0 0 4px 0' }}>
          My Wishlist
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>
          Your saved fashion designers, stylists, and favorite shopping destinations.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button
          className={`zorevi-btn zorevi-btn--sm ${activeTab === 'all' ? 'zorevi-btn--primary' : 'zorevi-btn--outline'}`}
          onClick={() => setActiveTab('all')}
        >
          All Items ({savedDesigners.length + savedMalls.length})
        </button>
        <button
          className={`zorevi-btn zorevi-btn--sm ${activeTab === 'designers' ? 'zorevi-btn--primary' : 'zorevi-btn--outline'}`}
          onClick={() => setActiveTab('designers')}
        >
          Designers ({savedDesigners.length})
        </button>
        <button
          className={`zorevi-btn zorevi-btn--sm ${activeTab === 'malls' ? 'zorevi-btn--primary' : 'zorevi-btn--outline'}`}
          onClick={() => setActiveTab('malls')}
        >
          Malls ({savedMalls.length})
        </button>
      </div>

      {/* Content */}
      {(activeTab === 'all' || activeTab === 'designers') && savedDesigners.length > 0 && (
        <div style={{ marginBottom: '36px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '16px' }}>
            Saved Designers ({savedDesigners.length})
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {savedDesigners.map((des) => (
              <DesignerCard
                key={des.id}
                designer={des}
                onBook={handleBook}
                role="customer"
              />
            ))}
          </div>
        </div>
      )}

      {(activeTab === 'all' || activeTab === 'malls') && savedMalls.length > 0 && (
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '16px' }}>
            Saved Shopping Malls ({savedMalls.length})
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {savedMalls.map((mall) => (
              <MallCard key={mall.id} mall={mall} role="customer" />
            ))}
          </div>
        </div>
      )}

      {savedDesigners.length === 0 && savedMalls.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '20px', border: '1px dashed #DDD6FE' }}>
          <Heart size={40} color="#EC4899" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.25rem', color: '#1E1B4B', marginBottom: '6px' }}>Your Wishlist is Empty</h3>
          <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '20px' }}>
            Save fashion stylists and shopping malls by tapping the heart icon as you explore.
          </p>
          <Link to="/customer/designers" className="zorevi-btn zorevi-btn--primary">
            Explore Designers <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {isBookingModalOpen && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          initialDesigner={bookingDesigner}
        />
      )}
    </div>
  );
}

