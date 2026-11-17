import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ImageWithFallback from '../common/ImageWithFallback';
import './Cards.css';

export default function DesignerCard({ designer, onBook, showBookBtn = true, role = 'customer' }) {
  const { isInWishlist, toggleWishlist, addToast } = useApp();
  const isSaved = isInWishlist('designer', designer.id);

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

  return (
    <div className="zorevi-designer-card">
      <div className="zorevi-designer-card__img-wrap">
        <Link to={profileUrl}>
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
              <Link to={profileUrl} className="zorevi-designer-card__name">
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
            <Link to={profileUrl} className="zorevi-btn zorevi-btn--outline zorevi-btn--sm">
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

