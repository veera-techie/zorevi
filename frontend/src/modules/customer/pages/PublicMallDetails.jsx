import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Star, Clock, Navigation, ShoppingBag, ShieldCheck,
  ChevronLeft, Sparkles, Building, Phone, ArrowRight
} from 'lucide-react';
import { mockMalls, mockDesigners } from '../../../services/mockData';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import DesignerCard from '../../../components/cards/DesignerCard';
import BookingModal from '../../../components/cards/BookingModal';
import { useApp } from '../../../context/AppContext';

export default function PublicMallDetails({ role = 'public' }) {
  const { mallId } = useParams();
  const mall = mockMalls.find((m) => m.id === mallId) || mockMalls[0];
  const { addToast } = useApp();

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDesigner, setSelectedDesigner] = useState(null);

  const handleBook = (designer) => {
    setSelectedDesigner(designer);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="container" style={{ paddingTop: '20px', paddingBottom: '60px' }}>
      {/* Back button */}
      <div style={{ marginBottom: '16px' }}>
        <Link
          to={role === 'customer' ? '/customer/malls' : '/explore/malls'}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6B7280', fontSize: '0.85rem', textDecoration: 'none' }}
        >
          <ChevronLeft size={16} /> Back to Malls
        </Link>
      </div>

      {/* Hero Mall Card */}
      <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1px solid #F3F4F6', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '32px' }}>
        <div style={{ height: '320px', width: '100%', position: 'relative' }}>
          <ImageWithFallback
            src={mall.image}
            alt={mall.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            fallbackType="mall"
          />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(15,23,42,0.8))', padding: '32px', color: '#FFFFFF' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#FFFFFF', margin: 0 }}>{mall.name}</h1>
            <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', margin: '6px 0 0', opacity: 0.9 }}>
              <MapPin size={16} /> {mall.address}
            </p>
          </div>
        </div>

        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', background: '#FAFAFC', borderTop: '1px solid #F3F4F6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={16} fill="#F59E0B" color="#F59E0B" />
              <strong style={{ fontSize: '1rem', color: '#1E1B4B' }}>{mall.rating}</strong>
              <span style={{ color: '#6B7280', fontSize: '0.85rem' }}>({mall.reviewCount} verified reviews)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontWeight: '600', fontSize: '0.875rem' }}>
              <ShoppingBag size={16} />
              <span>{mall.fashionStores} Fashion Stores</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: '600', fontSize: '0.875rem' }}>
              <Clock size={16} />
              <span>Open: {mall.openingHours}</span>
            </div>
          </div>

          <button
            className="zorevi-btn zorevi-btn--primary"
            onClick={() => addToast('Opening Google Maps Directions for ' + mall.name, 'info')}
          >
            <Navigation size={16} /> Get Directions
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px' }}>
        {/* Left Column: Stores & Meeting Points */}
        <div>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #F3F4F6', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '14px' }}>
              Official Zorevi Meeting Points
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: '1.5', marginBottom: '16px' }}>
              When you book a stylist for an in-person shopping or trial session at {mall.name}, meet at these designated easy-to-spot spots:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Ground Floor – Main Atrium (Central Fountain)', 'First Floor – Fashion Lounge', 'Second Floor – Coffee Bar near Zara'].map((point, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: '#F5F0FF', borderRadius: '12px', border: '1px solid #DDD6FE' }}>
                  <MapPin size={16} color="#7C3AED" />
                  <strong style={{ fontSize: '0.875rem', color: '#1E1B4B' }}>{point}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Stores */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #F3F4F6', padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '14px' }}>
              Fashion Stores & Brands at {mall.name}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {['Zara', 'H&M', 'FabIndia', 'W for Woman', 'Biba', 'Manyavar & Mohey', 'Marks & Spencer', 'Mango', 'Lifestyle', 'Shoppers Stop', 'Westside', 'Tommy Hilfiger'].map((brand) => (
                <span key={brand} style={{ padding: '8px 16px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '500', color: '#374151' }}>
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Designers servicing this Mall */}
        <div>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #F3F4F6', padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1E1B4B', marginBottom: '6px' }}>
              Stylists Available at This Mall
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '20px' }}>
              Top rated personal stylists ready to meet you at {mall.name}.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mockDesigners.slice(0, 3).map((des) => (
                <div key={des.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '14px', border: '1px solid #E5E7EB', background: '#FAFAFC' }}>
                  <img src={des.avatar} alt={des.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: '0.9rem', color: '#1E1B4B' }}>{des.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{des.title} • ★ {des.rating}</div>
                    <span style={{ fontSize: '0.78rem', color: '#7C3AED', fontWeight: '700' }}>₹{des.startingPrice || 499} / 2 hrs</span>
                  </div>
                  <button className="zorevi-btn zorevi-btn--primary zorevi-btn--sm" onClick={() => handleBook(des)}>
                    Book
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isBookingModalOpen && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          initialDesigner={selectedDesigner}
        />
      )}
    </div>
  );
}

