import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star, MapPin, CheckCircle2, Heart, Share2, Award, Sparkles,
  Calendar, Clock, ShieldCheck, ArrowRight, UserCheck, ChevronLeft
} from 'lucide-react';
import { mockDesigners, mockServices, mockReviews } from '../../../services/mockData';
import { publicDesigners } from '../../../services/publicDiscoveryData';
import BookingModal from '../../../components/cards/BookingModal';
import CustomerAccessDialog from '../../../components/common/CustomerAccessDialog';
import ImageWithFallback from '../../../components/common/ImageWithFallback';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import './PublicDesignerProfile.css';

export default function PublicDesignerProfile({ role = 'public' }) {
  const { designerId, id } = useParams();
  const currentId = id || designerId;
  const { isCustomer } = useAuth();
  const { isInWishlist, toggleWishlist, addToast } = useApp();

  const rawDesigner = mockDesigners.find((d) => d.id === currentId)
    || publicDesigners.find((d) => d.id === currentId)
    || mockDesigners[0];

  const designer = {
    ...rawDesigner,
    avatar: rawDesigner.avatar || rawDesigner.image || '/assets/images/designer-aarohi.jpg',
    experience: rawDesigner.experience || `${rawDesigner.yearsExperience || 5} Years Experience`,
    startingPrice: rawDesigner.startingPrice || 499,
    portfolio: rawDesigner.portfolio?.length ? rawDesigner.portfolio : [
      { id: 'p1', title: 'Bridal Elegance', image: '/assets/images/category-bridal.jpg', category: 'Bridal' },
      { id: 'p2', title: 'Family Styling', image: '/assets/images/category-family.jpg', category: 'Family' },
      { id: 'p3', title: 'Modern Classics', image: '/assets/images/category-western.jpg', category: 'Western' },
      { id: 'p4', title: 'Contemporary Ethnic', image: '/assets/images/category-traditional.jpg', category: 'Ethnic' },
    ],
  };

  const [activeTab, setActiveTab] = useState('overview'); // overview, portfolio, services, reviews, availability
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, [currentId]);

  const isSaved = isInWishlist('designer', designer.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Profile link copied to clipboard', 'info');
    }
  };

  const handleWishlistToggle = () => {
    toggleWishlist('designer', designer.id);
    addToast(isSaved ? 'Removed from wishlist' : 'Saved to wishlist', 'info');
  };

  const handleBookingClick = () => {
    if (!isCustomer) {
      setIsAccessDialogOpen(true);
      return;
    }
    setIsBookingModalOpen(true);
  };

  return (
    <div className="zorevi-designer-profile container">
      {/* Back button */}
      <div className="zorevi-profile-back-bar">
        <Link to={role === 'customer' ? '/customer/designers' : '/'} className="zorevi-profile-back-link">
          <ChevronLeft size={16} /> Back to Designers
        </Link>
      </div>

      {/* Hero Profile Header */}
      <div className="zorevi-profile-hero-card">
        <div className="zorevi-profile-hero__grid">
          <div className="zorevi-profile-avatar-col">
            <ImageWithFallback
              src={designer.avatar}
              alt={designer.name}
              className="zorevi-profile-avatar-lg"
              fallbackType="designer"
            />
          </div>

          <div className="zorevi-profile-info-col">
            <div className="zorevi-profile-name-row">
              <h1 className="zorevi-profile-name">{designer.name}</h1>
              {designer.isVerified && (
                <CheckCircle2 size={24} className="zorevi-verified-blue" title="Verified Designer" />
              )}
            </div>

            <p className="zorevi-profile-title">
              {designer.title} • {designer.experience}
            </p>

            <div className="zorevi-profile-meta-row">
              <div className="zorevi-profile-location">
                <MapPin size={15} />
                <span>{designer.location} • {designer.distance || '3.1 km'}</span>
              </div>
              <div className="zorevi-profile-rating">
                <Star size={15} fill="#F59E0B" color="#F59E0B" />
                <strong>{designer.rating}</strong>
                <span>({designer.reviewCount ? (designer.reviewCount >= 1000 ? `${(designer.reviewCount / 1000).toFixed(1)}k` : designer.reviewCount) : '0'} reviews)</span>
              </div>
            </div>

            {/* Badges strip */}
            <div className="zorevi-profile-badges-row">
              <span className="zorevi-badge zorevi-badge--verified">
                <CheckCircle2 size={13} /> Verified Designer
              </span>
              <span className="zorevi-badge zorevi-badge--top-rated">
                <Award size={13} /> Top Rated
              </span>
              <span className="zorevi-badge zorevi-badge--default">
                <Sparkles size={13} /> Wedding Specialist
              </span>
              <span className="zorevi-badge zorevi-badge--default">
                <Sparkles size={13} /> Custom Designs
              </span>
            </div>
          </div>

          <div className="zorevi-profile-actions-col">
            <div className="zorevi-profile-tool-btns">
              <button
                className={`zorevi-profile-round-btn ${isSaved ? 'active' : ''}`}
                onClick={handleWishlistToggle}
                aria-label="Save to Wishlist"
              >
                <Heart size={18} fill={isSaved ? '#EC4899' : 'none'} color={isSaved ? '#EC4899' : '#6B7280'} />
              </button>
              <button
                className="zorevi-profile-round-btn"
                onClick={handleShare}
                aria-label="Share Profile"
              >
                <Share2 size={18} />
              </button>
            </div>

            <button
              className="zorevi-btn zorevi-btn--primary zorevi-btn--lg"
              onClick={handleBookingClick}
            >
              Book a Styling Session <ArrowRight size={16} />
            </button>
            <small style={{ fontSize: '0.75rem', color: '#6B7280', textAlign: 'center', marginTop: '6px' }}>
              Standard 2-hour session starts at ₹{designer.startingPrice || 499}
            </small>
          </div>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="zorevi-profile-tabs-bar">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'portfolio', label: `Portfolio (${designer.portfolio?.length || 12})` },
          { id: 'services', label: 'Services & Pricing' },
          { id: 'reviews', label: `Reviews (${designer.reviewCount || 2105})` },
          { id: 'availability', label: 'Availability' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`zorevi-profile-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panes */}
      <div className="zorevi-profile-tab-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="zorevi-profile-overview-grid">
            <div className="zorevi-overview-left">
              {/* About */}
              <div className="zorevi-card zorevi-profile-section-card">
                <h3 className="zorevi-card-title">About {designer.name}</h3>
                <p className="zorevi-profile-bio">{designer.bio}</p>

                <div className="zorevi-profile-stats-row">
                  <div className="zorevi-profile-stat-box">
                    <strong>{designer.experience}</strong>
                    <span>Years Exp.</span>
                  </div>
                  <div className="zorevi-profile-stat-box">
                    <strong>2,100+</strong>
                    <span>Happy Clients</span>
                  </div>
                  <div className="zorevi-profile-stat-box">
                    <strong>4.9 ★</strong>
                    <span>Avg. Rating</span>
                  </div>
                </div>
              </div>

              {/* Services & Pricing preview */}
              <div className="zorevi-card zorevi-profile-section-card" style={{ marginTop: '20px' }}>
                <h3 className="zorevi-card-title">Services & Pricing</h3>
                <div className="zorevi-profile-services-list">
                  <div className="zorevi-profile-service-row">
                    <div>
                      <strong>Personal Styling Session</strong>
                      <small>2 hours standard package</small>
                    </div>
                    <span className="zorevi-service-cost">₹499 / 2 hrs</span>
                  </div>

                  <div className="zorevi-profile-service-row">
                    <div>
                      <strong>Bridal Styling (Consultation + Look)</strong>
                      <small>Complete bridal styling, jewelry coordination</small>
                    </div>
                    <span className="zorevi-service-cost">₹1,499 / session</span>
                  </div>

                  <div className="zorevi-profile-service-row">
                    <div>
                      <strong>Occasion Styling (Wedding / Party)</strong>
                      <small>Sangeet, cocktail, party ensemble curation</small>
                    </div>
                    <span className="zorevi-service-cost">₹999 / session</span>
                  </div>

                  <div className="zorevi-profile-service-row">
                    <div>
                      <strong>Wardrobe Curation</strong>
                      <small>Personal shopping & capsule wardrobe setup</small>
                    </div>
                    <span className="zorevi-service-cost">₹1,999 / package</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="zorevi-overview-right">
              {/* Portfolio Preview */}
              <div className="zorevi-card zorevi-profile-section-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h3 className="zorevi-card-title" style={{ margin: 0 }}>Portfolio Highlights</h3>
                  <button className="inline-link-btn" onClick={() => setActiveTab('portfolio')}>
                    View All →
                  </button>
                </div>

                <div className="zorevi-profile-portfolio-mini-grid">
                  {designer.portfolio?.slice(0, 4).map((item) => (
                    <div key={item.id} className="zorevi-portfolio-mini-item">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="zorevi-portfolio-mini-img"
                        fallbackType="bridal"
                      />
                      <span>{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next 7 Days Availability Snapshot */}
              <div className="zorevi-card zorevi-profile-section-card" style={{ marginTop: '20px' }}>
                <h3 className="zorevi-card-title">Next Available Slots</h3>
                <div className="zorevi-availability-days-row">
                  {[
                    { day: 'Sat', date: '22 Nov', time: '11:00 AM' },
                    { day: 'Sun', date: '23 Nov', time: '01:00 PM' },
                    { day: 'Mon', date: '24 Nov', time: '03:00 PM' },
                    { day: 'Tue', date: '25 Nov', time: '05:00 PM' },
                  ].map((slot) => (
                    <div key={slot.date} className="zorevi-avail-day-card">
                      <span className="avail-day">{slot.day}</span>
                      <strong className="avail-date">{slot.date}</strong>
                      <span className="avail-time">{slot.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="zorevi-card zorevi-profile-section-card">
            <h3 className="zorevi-card-title">Full Portfolio & Lookbook</h3>
            <div className="zorevi-portfolio-full-grid">
              {designer.portfolio?.map((item) => (
                <div key={item.id} className="zorevi-portfolio-card">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="zorevi-portfolio-img"
                    fallbackType="bridal"
                  />
                  <div className="zorevi-portfolio-caption">
                    <strong>{item.title}</strong>
                    <span>{item.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="zorevi-card zorevi-profile-section-card">
            <h3 className="zorevi-card-title">All Styling Services</h3>
            <div className="zorevi-services-full-grid">
              {mockServices.map((svc) => (
                <div key={svc.id} className="zorevi-service-full-item">
                  <div className="zorevi-service-full-header">
                    <h4>{svc.name}</h4>
                    <span className="zorevi-service-price">₹{svc.basePrice}</span>
                  </div>
                  <p>{svc.description}</p>
                  <div className="zorevi-service-full-footer">
                    <span>Duration: {svc.duration}</span>
                    <button
                      className="zorevi-btn zorevi-btn--primary zorevi-btn--sm"
                      onClick={handleBookingClick}
                    >
                      Book This Service
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="zorevi-card zorevi-profile-section-card">
            <h3 className="zorevi-card-title">Client Reviews & Testimonials</h3>
            <div className="zorevi-reviews-list">
              {mockReviews.map((rev) => (
                <div key={rev.id} className="zorevi-review-item">
                  <div className="zorevi-review-header">
                    <img src={rev.customerAvatar} alt={rev.customerName} className="zorevi-review-avatar" />
                    <div>
                      <strong>{rev.customerName}</strong>
                      <div className="zorevi-review-stars">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={13} fill="#F59E0B" color="#F59E0B" />
                        ))}
                        <small>{rev.date}</small>
                      </div>
                    </div>
                  </div>
                  <p className="zorevi-review-comment">"{rev.comment}"</p>
                  {rev.designerResponse && (
                    <div className="zorevi-designer-reply">
                      <strong>Response from {designer.name}:</strong>
                      <p>{rev.designerResponse}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Availability Tab */}
        {activeTab === 'availability' && (
          <div className="zorevi-card zorevi-profile-section-card">
            <h3 className="zorevi-card-title">Weekly Working Hours & Availability</h3>
            <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '20px' }}>
              Standard session slots are 2 hours each. In-person mall sessions and online video sessions available.
            </p>
            <div className="zorevi-avail-table">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <div key={day} className="zorevi-avail-row">
                  <strong>{day}</strong>
                  <span className="zorevi-avail-badge">10:00 AM – 07:00 PM</span>
                  <span style={{ color: '#059669', fontSize: '0.8rem', fontWeight: '600' }}>Slots Open</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Customer Access Dialog for unauthenticated guests */}
      <CustomerAccessDialog
        designer={designer}
        intent="booking"
        isOpen={isAccessDialogOpen}
        onClose={() => setIsAccessDialogOpen(false)}
      />

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          initialDesigner={designer}
        />
      )}
    </div>
  );
}

