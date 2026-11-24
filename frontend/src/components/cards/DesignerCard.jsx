import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, CheckCircle2, Check, Briefcase, Shirt, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ImageWithFallback from '../common/ImageWithFallback';
import './Cards.css';

function getSpecializationIcon(title) {
  const t = (title || '').toLowerCase();
  if (t.includes('men') || t.includes('formal') || t.includes('casual')) {
    return <Shirt size={14} className="dash-icon" />;
  }
  return (
    <svg className="dash-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2l6 4 6-4" />
      <path d="M12 6v3" />
      <path d="M4 14l3-5h10l3 5-3 8H7l-3-8z" />
    </svg>
  );
}

export default function DesignerCard({
  designer,
  onBook,
  showBookBtn = true,
  role = 'customer',
  variant = 'standard',
}) {
  const { isInWishlist, toggleWishlist, addToast } = useApp();
  const isSaved = isInWishlist('designer', designer.id);

  const handleScrollTop = () => {
    window.scrollTo(0, 0);
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist('designer', designer.id);
    addToast(
      isSaved ? `Removed ${designer.name} from wishlist` : `Saved ${designer.name} to wishlist`,
      'info'
    );
  };

  const profileUrl = role === 'customer'
    ? `/customer/designers/${designer.id}`
    : `/explore/designers/${designer.id}`;

  if (variant === 'dashboard') {
    return (
      <div className="zorevi-designer-card zorevi-designer-card--dashboard">
        <div className="zorevi-designer-card__img-wrap">
          <Link to={profileUrl} onClick={handleScrollTop} tabIndex={-1}>
            <ImageWithFallback
              src={designer.avatar}
              alt={designer.name}
              className="zorevi-designer-card__img"
              fallbackType="designer"
            />
          </Link>
          {designer.isVerified && (
            <span className="zorevi-designer-card__verified-pill">
              <Check size={12} strokeWidth={3} /> Verified
            </span>
          )}
        </div>

        <div className="zorevi-designer-card__dash-body">
          <Link to={profileUrl} onClick={handleScrollTop} className="zorevi-designer-card__dash-name">
            {designer.name}
          </Link>

          <div className="zorevi-designer-card__dash-details">
            <div className="zorevi-designer-card__dash-row">
              {getSpecializationIcon(designer.title)}
              <span>{designer.title}</span>
            </div>

            <div className="zorevi-designer-card__dash-row">
              <Briefcase size={14} className="dash-icon" />
              <span>{designer.experience}</span>
            </div>

            <div className="zorevi-designer-card__dash-row">
              <Star size={14} fill="#F59E0B" color="#F59E0B" className="dash-icon" />
              <span className="rating-text">
                <strong>{designer.rating}</strong> ({designer.reviewCount} reviews)
              </span>
            </div>

            <div className="zorevi-designer-card__dash-row">
              <MapPin size={14} className="dash-icon" />
              <span>{designer.locality ? `${designer.locality} • ` : ''}{designer.distance || '2.4 km'}</span>
            </div>
          </div>

          <div className="zorevi-designer-card__dash-price">
            Starting at <strong>₹{designer.startingPrice ? designer.startingPrice.toLocaleString('en-IN') : '499'}</strong>
          </div>

          <Link to={profileUrl} onClick={handleScrollTop} className="zorevi-btn zorevi-btn--dash-view">
            <span>View Profile</span>
            <Sparkles size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="zorevi-designer-card">
      <div className="zorevi-designer-card__img-wrap">
        <Link to={profileUrl} onClick={handleScrollTop}>
          <ImageWithFallback
            src={designer.avatar}
            alt={designer.name}
            className="zorevi-designer-card__img"
            fallbackType="designer"
          />
        </Link>
        <button
          className={`zorevi-designer-card__wishlist-btn ${isSaved ? 'active' : ''}`}
          onClick={handleWishlistClick}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={18} fill={isSaved ? '#EC4899' : 'none'} color={isSaved ? '#EC4899' : '#6B7280'} />
        </button>
      </div>

      <div className="zorevi-designer-card__body">
        <div className="zorevi-designer-card__header">
          <div>
            <div className="zorevi-designer-card__name-row">
              <Link to={profileUrl} onClick={handleScrollTop} className="zorevi-designer-card__name">
                {designer.name}
              </Link>
              {designer.isVerified && (
                <CheckCircle2 size={16} className="zorevi-designer-card__verified-icon" title="Verified Designer" />
              )}
            </div>
            <div className="zorevi-designer-card__role">
              {designer.title} • {designer.experience}
            </div>
          </div>
        </div>

        <div className="zorevi-designer-card__rating-row">
          <div className="zorevi-designer-card__stars">
            <Star size={14} fill="#F59E0B" color="#F59E0B" />
            <span>{designer.rating}</span>
          </div>
          <span className="zorevi-designer-card__reviews">
            ({designer.reviewCount ? `${(designer.reviewCount / 1000).toFixed(1)}k` : '0'} reviews)
          </span>
        </div>

        <div className="zorevi-designer-card__tags">
          {designer.specializations?.slice(0, 3).map((spec) => (
            <span key={spec} className="zorevi-designer-card__tag">
              {spec}
            </span>
          ))}
        </div>

        <div className="zorevi-designer-card__location-row">
          <MapPin size={13} />
          <span>{designer.location} • {designer.distance || '2.4 km'}</span>
        </div>

        <div className="zorevi-designer-card__footer">
          <div className="zorevi-designer-card__price-box">
            <span className="zorevi-designer-card__price">₹{designer.startingPrice || 499}</span>
            <span className="zorevi-designer-card__price-sub">/ 2 hrs</span>
          </div>

          <div className="zorevi-designer-card__actions">
            <Link to={profileUrl} onClick={handleScrollTop} className="zorevi-btn zorevi-btn--outline zorevi-btn--sm">
              View Profile
            </Link>
            {showBookBtn && (
              <button
                className="zorevi-btn zorevi-btn--primary zorevi-btn--sm"
                onClick={() => onBook && onBook(designer)}
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

