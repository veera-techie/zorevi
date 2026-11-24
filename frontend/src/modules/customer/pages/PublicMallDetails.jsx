import { useState, useMemo, useLayoutEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Star, Clock, Navigation, ShoppingBag, ShieldCheck,
  ChevronLeft, Sparkles, Building2, Phone, ArrowRight, CheckCircle2
} from 'lucide-react';
import { mockDesigners, mockMalls } from '../../../services/mockData';
import { REAL_FASHION_HUBS, getFashionHubById } from '../../../services/fashionHubsService';
import { calculateHaversineDistance, formatDistance, isCurrentlyOpen } from '../../../services/locationService';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import BookingModal from '../../../components/cards/BookingModal';
import { useApp } from '../../../context/AppContext';

export default function PublicMallDetails({ role = 'public' }) {
  const { mallId, hubId, id } = useParams();
  const targetId = hubId || mallId || id;
  const { addToast, userLocation } = useApp();

  // Find hub from rich verified hubs or legacy mock malls
  const hub = useMemo(() => {
    return (
      REAL_FASHION_HUBS.find((h) => h.id === targetId) ||
      mockMalls.find((m) => m.id === targetId) ||
      REAL_FASHION_HUBS[0]
    );
  }, [targetId]);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedDesigner, setSelectedDesigner] = useState(null);

  useLayoutEffect(() => {
    const html = document.documentElement;
    const prevBehavior = html ? html.style.scrollBehavior : '';
    if (html) html.style.scrollBehavior = 'auto';

    window.scrollTo(0, 0);
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;

    const rAF = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
      if (html) html.style.scrollBehavior = prevBehavior;
    });

    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }, 50);

    return () => {
      cancelAnimationFrame(rAF);
      clearTimeout(timer);
      if (html) html.style.scrollBehavior = prevBehavior;
    };
  }, [targetId]);

  // Dynamic open status
  const openStatus = useMemo(() => {
    return isCurrentlyOpen(hub.openingHours);
  }, [hub.openingHours]);

  // Dynamic distance calculation
  const distanceFormatted = useMemo(() => {
    if (userLocation && userLocation.lat && userLocation.lng && hub.lat && hub.lng) {
      const dist = calculateHaversineDistance(userLocation.lat, userLocation.lng, hub.lat, hub.lng);
      return formatDistance(dist);
    }
    return hub.distance || 'Nearby';
  }, [userLocation, hub.lat, hub.lng, hub.distance]);

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${hub.lat || 17.4319},${hub.lng || 78.4073}&destination_place_id=${encodeURIComponent(hub.name)}`;

  const backLink = role === 'customer' ? '/customer/fashion-hubs' : '/explore/fashion-hubs';

  const handleBook = (designer) => {
    setSelectedDesigner(designer);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="container" style={{ paddingTop: '20px', paddingBottom: '60px' }}>
      {/* Back button */}
      <div style={{ marginBottom: '16px' }}>
        <Link
          to={backLink}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#6B7280',
            fontSize: '0.85rem',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          <ChevronLeft size={16} /> Back to Fashion Hubs
        </Link>
      </div>

      {/* Hero Fashion Hub Card */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #EDE9FE',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(124, 58, 237, 0.06)',
          marginBottom: '32px',
        }}
      >
        <div style={{ height: '340px', width: '100%', position: 'relative' }}>
          <ImageWithFallback
            src={hub.image}
            alt={hub.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            fallbackType="mall"
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(15,23,42,0.88))',
              padding: '36px 32px 28px',
              color: '#FFFFFF',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  background: '#7C3AED',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {hub.category || 'Fashion Hub'}
              </span>
              <span
                style={{
                  background: openStatus.isOpen ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '6px',
                }}
              >
                {openStatus.statusText}
              </span>
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
              {hub.name}
            </h1>
            <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', margin: '8px 0 0', opacity: 0.92 }}>
              <MapPin size={16} /> {hub.address || hub.location} • <strong style={{ color: '#E9D5FF' }}>{distanceFormatted} away</strong>
            </p>
          </div>
        </div>

        {/* Info Toolbar */}
        <div
          style={{
            padding: '20px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            background: '#FAFAFC',
            borderTop: '1px solid #F3F4F6',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={18} fill="#F59E0B" color="#F59E0B" />
              <strong style={{ fontSize: '1.05rem', color: '#1E1B4B' }}>{hub.rating}</strong>
              <span style={{ color: '#6B7280', fontSize: '0.85rem' }}>
                ({hub.reviewCount?.toLocaleString()} verified reviews)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontWeight: '650', fontSize: '0.9rem' }}>
              <ShoppingBag size={17} />
              <span>{hub.fashionStores ? `${hub.fashionStores} Fashion Outlets` : 'Exclusive Designer Store'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: '650', fontSize: '0.9rem' }}>
              <Clock size={17} />
              <span>Hours: {hub.openingHours || '10:30 AM – 10:00 PM'}</span>
            </div>
          </div>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="zorevi-btn zorevi-btn--primary"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Navigation size={16} /> Get Directions
          </a>
        </div>
      </div>

      {/* Main Split Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '28px' }}>
        {/* Left Column: Description, Meeting Points & Brands */}
        <div>
          {/* About this Fashion Hub */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #EDE9FE',
              padding: '26px',
              marginBottom: '24px',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: '750', color: '#1E1B4B', marginBottom: '12px' }}>
              About {hub.name}
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#4B5563', lineHeight: '1.6', margin: 0 }}>
              {hub.description ||
                `${hub.name} is a premier fashion destination located at ${hub.address}. It offers a distinguished selection of designer collections, contemporary styles, and trusted trial amenities.`}
            </p>
          </div>

          {/* Official Zorevi Meeting Points */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #EDE9FE',
              padding: '26px',
              marginBottom: '24px',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: '750', color: '#1E1B4B', marginBottom: '10px' }}>
              Official Zorevi Stylist Meeting Spots
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#6B7280', lineHeight: '1.5', marginBottom: '18px' }}>
              When you book a stylist for an in-person shopping, consultation, or trial session at {hub.name}, meet seamlessly at these designated spots:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(hub.meetingPoints || [
                'Ground Floor – Main Central Atrium',
                'First Floor – Designer Fashion Corridor',
                'Second Floor – Stylist Cafe Lounge',
              ]).map((point, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: '#F5F0FF',
                    borderRadius: '12px',
                    border: '1px solid #DDD6FE',
                  }}
                >
                  <MapPin size={17} color="#7C3AED" style={{ flexShrink: 0 }} />
                  <strong style={{ fontSize: '0.88rem', color: '#1E1B4B' }}>{point}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Brands */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #EDE9FE',
              padding: '26px',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: '750', color: '#1E1B4B', marginBottom: '14px' }}>
              Featured Brands & Outlets
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(hub.featuredBrands || [
                'Zara', 'H&M', 'FabIndia', 'Manyavar & Mohey', 'Marks & Spencer',
                'Lifestyle', 'Shoppers Stop', 'Westside', 'Tommy Hilfiger'
              ]).map((brand) => (
                <span
                  key={brand}
                  style={{
                    padding: '8px 16px',
                    background: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: '#374151',
                  }}
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Stylists Available to Meet at this Hub */}
        <div>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #EDE9FE',
              padding: '26px',
              position: 'sticky',
              top: '90px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={18} color="#7C3AED" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '750', color: '#1E1B4B', margin: 0 }}>
                Stylists Servicing This Hub
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '20px', lineHeight: '1.5' }}>
              Top rated personal stylists ready to meet you at {hub.name} for wardrobe selection, fittings, and styling advice.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {mockDesigners.slice(0, 4).map((des) => (
                <div
                  key={des.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: '1px solid #EDE9FE',
                    background: '#FAFAFC',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <img
                    src={des.avatar}
                    alt={des.name}
                    style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link
                      to={`/designers/${des.id}`}
                      style={{ textDecoration: 'none', color: '#1E1B4B', fontWeight: '700', fontSize: '0.88rem' }}
                    >
                      {des.name}
                    </Link>
                    <div style={{ fontSize: '0.74rem', color: '#6B7280', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {des.title} • ★ {des.rating}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#7C3AED', fontWeight: '750' }}>
                      ₹{des.startingPrice || 499} / 2 hrs
                    </span>
                  </div>
                  <button
                    type="button"
                    className="zorevi-btn zorevi-btn--primary zorevi-btn--sm"
                    onClick={() => handleBook(des)}
                  >
                    Book
                  </button>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: '20px',
                padding: '14px',
                background: '#F5F3FF',
                borderRadius: '12px',
                border: '1px solid #DDD6FE',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}
            >
              <CheckCircle2 size={16} color="#7C3AED" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.78rem', color: '#5B21B6', margin: 0, lineHeight: '1.4' }}>
                All in-person styling sessions booked at {hub.name} include verified stylist coordination, private trial lounge guidance, and money-back satisfaction guarantee.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          initialDesigner={selectedDesigner}
          preselectedHub={hub}
        />
      )}
    </div>
  );
}
