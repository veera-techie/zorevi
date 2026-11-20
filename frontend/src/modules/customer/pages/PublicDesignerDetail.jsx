import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Heart, LockKeyhole, MapPin, Star } from 'lucide-react';
import BookingModal from '../../../components/cards/BookingModal';
import CustomerAccessDialog from '../../../components/common/CustomerAccessDialog';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import { discoveryDemoNotice, publicDesigners } from '../../../services/publicDiscoveryData';
import './PublicDiscovery.css';

const sampleReviews = [
  { name: 'Demo customer', rating: 5, text: 'Helpful ideas and a thoughtful approach to building a look.' },
  { name: 'Demo customer', rating: 4, text: 'The sample profile made it easy to compare styles and services.' },
];

export default function PublicDesignerDetail() {
  const { id, designerId } = useParams();
  const designer = publicDesigners.find((item) => item.id === (id || designerId));
  const { isCustomer } = useAuth();
  const { addToast, isInWishlist, toggleWishlist } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const intent = new URLSearchParams(location.search).get('intent');
  const [dialogIntent, setDialogIntent] = useState('details');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const isSaved = isCustomer && designer ? isInWishlist('designer', designer.id) : false;

  useEffect(() => {
    if (!isCustomer || !designer || !['booking', 'favorite'].includes(intent)) {
      if (!isCustomer && intent === 'booking') {
        setDialogIntent('booking');
        setDialogOpen(true);
      }
      return;
    }

    if (intent === 'favorite' && !isSaved) {
      toggleWishlist('designer', designer.id);
      addToast(`Saved ${designer.name} to favorites`, 'info');
    }
    if (intent === 'booking') setBookingOpen(true);
    navigate(location.pathname, { replace: true });
  }, [addToast, designer, intent, isCustomer, isSaved, location.pathname, navigate, toggleWishlist]);

  if (!designer) {
    return (
      <main className="discovery-page discovery-empty">
        <h1>Designer profile not found</h1>
        <p>This sample profile may have been removed.</p>
        <Link className="zorevi-btn zorevi-btn--outline" to="/explore/designers">Back to designers</Link>
      </main>
    );
  }

  const handleFavorite = () => {
    if (!isCustomer) {
      setDialogIntent('favorite');
      setDialogOpen(true);
      return;
    }
    toggleWishlist('designer', designer.id);
    addToast(isSaved ? `Removed ${designer.name} from favorites` : `Saved ${designer.name} to favorites`, 'info');
  };

  const handleBook = () => {
    if (!isCustomer) {
      setDialogIntent('booking');
      setDialogOpen(true);
      return;
    }
    setBookingOpen(true);
  };

  return (
    <main className="discovery-page public-profile-page">
      <Link to="/explore/designers" className="discovery-back-link"><ArrowLeft size={16} /> Back to designers</Link>
      <p className="discovery-demo-notice" role="note">{discoveryDemoNotice}</p>

      <section className="public-profile-hero">
        <img src={designer.image} alt={`Illustrative stock portrait for demo profile ${designer.name}`} />
        <div className="public-profile-hero__info">
          <span className="public-demo-badge"><CheckCircle2 size={14} /> Demo verification state</span>
          <h1>{designer.name}</h1>
          <p>{designer.title} <span aria-hidden="true">·</span> {designer.experience}</p>
          <div className="public-profile-meta">
            <span><MapPin size={15} /> {designer.area}, {designer.location} <small>(sample area)</small></span>
            <span><Star size={15} fill="currentColor" /> {designer.rating.toFixed(1)} ({designer.reviewCount} sample reviews)</span>
          </div>
          <div className="public-designer-card__tags">
            {designer.specializations.map((specialization) => <span key={specialization}>{specialization}</span>)}
          </div>
          <div className="public-profile-actions">
            <button type="button" className="zorevi-btn zorevi-btn--outline" onClick={handleFavorite} aria-pressed={isSaved}>
              <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} /> {isSaved ? 'Saved' : 'Save designer'}
            </button>
            <button type="button" className="zorevi-btn zorevi-btn--primary public-book-button" onClick={handleBook}>
              <CalendarDays size={16} /> Book now
            </button>
          </div>
        </div>
      </section>

      <div className="public-profile-sections">
          <section className="public-detail-panel">
            <h2>About {designer.name}</h2>
            <p>{designer.bio}</p>
            <div className="public-detail-stats">
              <div><strong>{designer.experience}</strong><span>Experience (demo)</span></div>
              <div><strong>{designer.specializations.length}</strong><span>Specialties (demo)</span></div>
              <div><strong>₹499</strong><span>Standard package from / 2 hours</span></div>
            </div>
            <p className="public-detail-note">The ₹499 standard package is a starting point; custom services may cost more. All sample prices are illustrative.</p>
          </section>

          <section className="public-detail-panel">
            <div className="public-detail-heading">
              <div><p className="discovery-eyebrow">Selected work</p><h2>Portfolio</h2></div>
              <span>Sample portfolio</span>
            </div>
            <div className="public-portfolio-grid">
              {designer.portfolio.map((item) => (
                <figure key={item.id}>
                  <img src={item.image} alt={`Illustrative ${item.category} styling portfolio example`} loading="lazy" />
                  <figcaption>{item.title}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section className="public-detail-panel">
            <div className="public-detail-heading">
              <div><p className="discovery-eyebrow">Transparent demo pricing</p><h2>Services</h2></div>
              <span>Custom services may cost more</span>
            </div>
            <div className="public-service-list">
              {designer.services.map((service) => (
                <div key={service.name}>
                  <span><strong>{service.name}</strong><small>{service.duration}</small></span>
                  <strong>₹{service.price}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="public-detail-panel public-profile-columns">
            <div>
              <p className="discovery-eyebrow">Illustrative feedback</p>
              <h2>Reviews</h2>
              {sampleReviews.map((review, index) => (
                <blockquote key={`${review.name}-${index}`}>
                  <strong>{review.name} <span><Star size={13} fill="currentColor" /> {review.rating}</span></strong>
                  <p>{review.text}</p>
                </blockquote>
              ))}
            </div>
            <div>
              <p className="discovery-eyebrow">Availability preview</p>
              <h2>Next available</h2>
              <div className="public-availability-list">
                {['Today · 4:00 PM', 'Tomorrow · 11:00 AM', 'Saturday · 1:30 PM'].map((slot) => <span key={slot}>{slot} <small>Demo slot</small></span>)}
              </div>
            </div>
          </section>
          <div className="public-profile-booking-footer">
            <p>Ready to plan a styling session? Availability and booking are prototype interactions.</p>
            <button type="button" className="zorevi-btn zorevi-btn--primary public-book-button" onClick={handleBook}>Start booking <ArrowRight size={16} /></button>
          </div>
        </div>

      <CustomerAccessDialog
        designer={designer}
        intent={dialogIntent}
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
      {bookingOpen && isCustomer && (
        <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} initialDesigner={designer} />
      )}
    </main>
  );
}
