import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, ArrowRight, ShieldCheck, CreditCard, MapPin,
  Calendar, Star, ChevronRight, CheckCircle2, Clock
} from 'lucide-react';
import DesignerCard from '../../../components/cards/DesignerCard';
import MallCard from '../../../components/cards/MallCard';
import BookingModal from '../../../components/cards/BookingModal';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import { mockDesigners, mockMalls, mockBookings } from '../../../services/mockData';
import { CATEGORIES } from '../../../constants';
import './LandingPage.css';

export default function CustomerHome() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingDesigner, setBookingDesigner] = useState(null);

  const handleBook = (designer) => {
    setBookingDesigner(designer);
    setIsBookingModalOpen(true);
  };

  const filteredDesigners = mockDesigners.filter((d) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'mens') return d.specializations.includes("Men's Fashion");
    if (selectedCategory === 'womens') return d.specializations.includes("Women's Fashion");
    if (selectedCategory === 'bridal') return d.specializations.includes("Bridal & Groom");
    if (selectedCategory === 'family') return d.specializations.includes("Family Styling");
    return true;
  });

  const upcomingBookings = mockBookings.filter((b) => b.status === 'Confirmed' || b.status === 'Upcoming');

  return (
    <div className="zorevi-landing" style={{ width: '100%' }}>
      {/* Hero Banner */}
      <section className="zorevi-hero-banner" style={{ marginTop: 0 }}>
        <div className="zorevi-hero-banner__grid">
          <div className="zorevi-hero-banner__text-col">
            <h1 className="zorevi-hero-banner__title">
              Fashion for Everyone. <br />
              <span>Style for Every Occasion.</span>
            </h1>
            <p className="zorevi-hero-banner__subtitle">
              Discover expert fashion designers, explore nearby shopping malls, and book your personalized styling experience.
            </p>

            <div className="zorevi-hero-banner__actions">
              <Link to="/customer/designers" className="zorevi-btn zorevi-btn--primary zorevi-btn--lg">
                Explore Designers <ArrowRight size={18} />
              </Link>
              <Link to="/customer/malls" className="zorevi-btn zorevi-btn--outline zorevi-btn--lg">
                Find Nearby Malls <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="zorevi-hero-banner__img-col">
            <ImageWithFallback
              src="/images/hero-fashion-banner.jpg"
              alt="Fashion for Everyone"
              className="zorevi-hero-banner__img"
              fallbackType="hero"
            />

            <div className="zorevi-hero-price-badge">
              <div className="zorevi-hero-price-badge__label">Starting at Just</div>
              <div className="zorevi-hero-price-badge__price">₹499 <small style={{ fontSize: '0.85rem' }}>/ 2 Hours</small></div>
              <ul className="zorevi-hero-price-badge__list">
                <li>✓ Designer Consultation</li>
                <li>✓ Styling Assistance</li>
                <li>✓ Personalized Suggestions</li>
                <li>✓ All-inclusive Standard Package</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="zorevi-categories-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`zorevi-cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </section>

      {/* Main Split: Left Nearby Designers, Right Snapshot of My Bookings & Malls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', marginTop: '24px' }}>
        {/* Left Column: Nearby Designers */}
        <div>
          <div className="zorevi-section__header">
            <h2 className="zorevi-section__title">
              Nearby Designers in Hyderabad
            </h2>
            <Link to="/customer/designers" className="zorevi-section__view-all">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {filteredDesigners.slice(0, 4).map((designer) => (
              <DesignerCard
                key={designer.id}
                designer={designer}
                onBook={handleBook}
                role="customer"
              />
            ))}
          </div>
        </div>

        {/* Right Column: My Bookings & Nearby Malls Snapshot */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* My Bookings Card */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #F3F4F6', padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1E1B4B', margin: 0 }}>My Bookings</h3>
              <Link to="/customer/bookings" style={{ fontSize: '0.78rem', color: '#7C3AED', fontWeight: '600', textDecoration: 'none' }}>
                View all →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {mockBookings.slice(0, 3).map((b) => (
                <Link
                  key={b.id}
                  to={`/customer/bookings/${b.id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '12px', background: '#FAFAFC', border: '1px solid #F3F4F6', textDecoration: 'none' }}
                >
                  <img src={b.designerAvatar} alt={b.designerName} style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '0.82rem', color: '#1E1B4B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.service}</strong>
                      <span style={{ fontSize: '0.65rem', fontWeight: '700', color: b.status === 'Confirmed' ? '#059669' : '#B45309', background: b.status === 'Confirmed' ? '#ECFDF5' : '#FFFBEB', padding: '2px 6px', borderRadius: '9999px' }}>
                        {b.status}
                      </span>
                    </div>
                    <small style={{ fontSize: '0.72rem', color: '#6B7280' }}>{b.date} • {b.startTime}</small>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Nearby Malls Snapshot */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #F3F4F6', padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1E1B4B', margin: 0 }}>Nearby Malls</h3>
              <Link to="/customer/malls" style={{ fontSize: '0.78rem', color: '#7C3AED', fontWeight: '600', textDecoration: 'none' }}>
                View all →
              </Link>
            </div>

            <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
              <img src={mockMalls[0].image} alt={mockMalls[0].name} style={{ width: '100%', height: '110px', objectFit: 'cover' }} />
              <div style={{ padding: '12px', background: '#FAFAFC' }}>
                <strong style={{ fontSize: '0.88rem', color: '#1E1B4B', display: 'block' }}>{mockMalls[0].name}</strong>
                <small style={{ color: '#6B7280', fontSize: '0.75rem', display: 'block', margin: '2px 0 8px' }}>
                  ★ {mockMalls[0].rating} • {mockMalls[0].distance} • Open till 10 PM
                </small>
                <Link to={`/customer/malls/${mockMalls[0].id}`} className="zorevi-btn zorevi-btn--outline zorevi-btn--sm zorevi-btn--full">
                  View Mall Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
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

