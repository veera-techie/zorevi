import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, ArrowRight, ShieldCheck, CreditCard, MapPin,
  Heart, Users, Crown, Grid, CheckCircle2, ChevronRight
} from 'lucide-react';
import DesignerCard from '../../../components/cards/DesignerCard';
import MallCard from '../../../components/cards/MallCard';
import BookingModal from '../../../components/cards/BookingModal';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import { mockDesigners, mockMalls, mockServices } from '../../../services/mockData';
import { CATEGORIES } from '../../../constants';
import './LandingPage.css';

export default function LandingPage() {
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

  return (
    <div className="zorevi-landing container">
      {/* Hero Banner matching screenshot */}
      <section className="zorevi-hero-banner">
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
              <Link to="/explore/designers" className="zorevi-btn zorevi-btn--primary zorevi-btn--lg">
                Explore Designers <ArrowRight size={18} />
              </Link>
              <Link to="/explore/malls" className="zorevi-btn zorevi-btn--outline zorevi-btn--lg">
                Find Nearby Malls <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="zorevi-hero-banner__img-col">
            <ImageWithFallback
              src="/images/hero-fashion-banner.png"
              alt="Fashion for Everyone"
              className="zorevi-hero-banner__img"
              fallbackType="hero"
            />

            <div className="zorevi-hero-price-badge">
              <div className="zorevi-hero-price-badge__label">Starting at Just</div>
              <div className="zorevi-hero-price-badge__price">₹499 <small style={{ fontSize: '0.9rem', fontWeight: '500' }}>/ 2 Hours</small></div>
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

      {/* Categories Bar */}
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

      {/* Nearby Designers Section */}
      <section className="zorevi-section">
        <div className="zorevi-section__header">
          <h2 className="zorevi-section__title">
            <Crown size={22} color="#F59E0B" /> Nearby Designers in Hyderabad
          </h2>
          <Link to="/explore/designers" className="zorevi-section__view-all">
            View all designers <ArrowRight size={16} />
          </Link>
        </div>

        <div className="zorevi-designers-grid">
          {filteredDesigners.slice(0, 4).map((designer) => (
            <DesignerCard
              key={designer.id}
              designer={designer}
              onBook={handleBook}
              role="public"
            />
          ))}
        </div>
      </section>

      {/* Nearby Malls Section */}
      <section className="zorevi-section">
        <div className="zorevi-section__header">
          <h2 className="zorevi-section__title">
            <MapPin size={22} color="#7C3AED" /> Explore Nearby Shopping Malls
          </h2>
          <Link to="/explore/malls" className="zorevi-section__view-all">
            View all malls <ArrowRight size={16} />
          </Link>
        </div>

        <div className="zorevi-malls-grid">
          {mockMalls.slice(0, 3).map((mall) => (
            <MallCard key={mall.id} mall={mall} role="public" />
          ))}
        </div>
      </section>

      {/* Trust & Guarantee Strip */}
      <section className="zorevi-trust-bar">
        <div className="zorevi-trust-item">
          <div className="zorevi-trust-item__icon">
            <ShieldCheck size={24} />
          </div>
          <div>
            <strong>Verified Designers</strong>
            <span>Background checked & vetted</span>
          </div>
        </div>

        <div className="zorevi-trust-item">
          <div className="zorevi-trust-item__icon">
            <CreditCard size={24} />
          </div>
          <div>
            <strong>Transparent Pricing</strong>
            <span>Starts at ₹499/2 hrs with zero surprise fees</span>
          </div>
        </div>

        <div className="zorevi-trust-item">
          <div className="zorevi-trust-item__icon">
            <MapPin size={24} />
          </div>
          <div>
            <strong>Location-Based Matching</strong>
            <span>Meet at top shopping malls near you</span>
          </div>
        </div>

        <div className="zorevi-trust-item" style={{ background: '#FAF5FF', padding: '12px 16px', borderRadius: '14px', border: '1px solid #DDD6FE' }}>
          <div>
            <strong style={{ color: '#7C3AED' }}>Special occasion?</strong>
            <span>Find your dedicated wedding or party stylist</span>
          </div>
          <Link to="/explore/designers" className="zorevi-btn zorevi-btn--primary zorevi-btn--sm" style={{ marginLeft: 'auto' }}>
            Explore
          </Link>
        </div>
      </section>

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

