import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Navigation, ShoppingBag, ArrowUpRight, Clock, Sparkles } from 'lucide-react';
import ImageWithFallback from '../common/ImageWithFallback';
import { useApp } from '../../context/AppContext';
import { calculateHaversineDistance, formatDistance, isCurrentlyOpen } from '../../services/locationService';
import './Cards.css';

export default function FashionHubCard({
  hub,
  role = 'customer',
  isSelected = false,
  onSelect = null,
}) {
  const { userLocation } = useApp();

  const detailsUrl = role === 'customer'
    ? `/customer/fashion-hubs/${hub.id}`
    : `/explore/fashion-hubs/${hub.id}`;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${hub.lat},${hub.lng}&destination_place_id=${encodeURIComponent(hub.name)}`;

  // Dynamic open/closed status check
  const openStatus = useMemo(() => {
    return isCurrentlyOpen(hub.openingHours);
  }, [hub.openingHours]);

  // Dynamic distance calculation from user's current GPS location
  const distanceFormatted = useMemo(() => {
    if (userLocation && userLocation.lat && userLocation.lng && hub.lat && hub.lng) {
      const dist = calculateHaversineDistance(userLocation.lat, userLocation.lng, hub.lat, hub.lng);
      return formatDistance(dist);
    }
    return hub.distance || 'Nearby';
  }, [userLocation, hub.lat, hub.lng, hub.distance]);

  const handleScrollTop = () => {
    window.scrollTo(0, 0);
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  return (
    <article
      className={`zorevi-mall-card ${isSelected ? 'is-selected' : ''}`}
      onClick={() => onSelect && onSelect(hub)}
      style={{
        outline: isSelected ? '2px solid #7C3AED' : 'none',
        cursor: onSelect ? 'pointer' : 'default',
      }}
    >
      <div className="zorevi-mall-card__img-wrap">
        <Link to={detailsUrl} onClick={handleScrollTop} aria-label={`View details for ${hub.name}`}>
          <ImageWithFallback
            src={hub.image}
            alt={hub.name}
            className="zorevi-mall-card__img"
            fallbackType="mall"
          />
        </Link>

        {/* Live Status Badge */}
        <span
          className="zorevi-mall-card__status-open"
          style={{
            background: openStatus.isOpen ? 'rgba(255, 255, 255, 0.96)' : 'rgba(254, 242, 242, 0.96)',
            color: openStatus.isOpen ? '#059669' : '#DC2626',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: openStatus.isOpen ? '#10B981' : '#EF4444',
              display: 'inline-block',
            }}
          />
          {openStatus.statusText}
        </span>

        {/* Category Badge on top-left of image */}
        <span
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.92) 0%, rgba(147, 51, 234, 0.92) 100%)',
            backdropFilter: 'blur(4px)',
            color: '#FFFFFF',
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '6px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            zIndex: 2,
          }}
        >
          {hub.category || 'Fashion Hub'}
        </span>
      </div>

      <div className="zorevi-mall-card__body">
        <Link to={detailsUrl} style={{ textDecoration: 'none' }}>
          <h3 className="zorevi-mall-card__title">{hub.name}</h3>
        </Link>

        <div className="zorevi-mall-card__address">
          <MapPin size={13} color="#7C3AED" style={{ flexShrink: 0 }} />
          <span title={hub.address}>
            {hub.locality || hub.location} • <strong style={{ color: '#6D28D9' }}>{distanceFormatted}</strong>
          </span>
        </div>

        <div className="zorevi-mall-card__stats">
          <div className="zorevi-mall-card__stat">
            <Star size={14} fill="#F59E0B" color="#F59E0B" />
            <strong>{hub.rating}</strong>
            <span style={{ color: '#9CA3AF' }}>({hub.reviewCount?.toLocaleString()})</span>
            {hub.isGoogleVerified && (
              <span
                style={{
                  fontSize: '0.65rem',
                  color: '#047857',
                  background: '#ECFDF5',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  marginLeft: '4px',
                  letterSpacing: '0.02em',
                }}
                title="Verified information from Google Maps"
              >
                Google Verified
              </span>
            )}
          </div>

          <div className="zorevi-mall-card__stat">
            <ShoppingBag size={14} color="#7C3AED" />
            <span>{hub.fashionStores ? `${hub.fashionStores} fashion stores` : 'Fashion Boutique'}</span>
          </div>
        </div>

        {/* Featured Brands / Tags */}
        {hub.featuredBrands && hub.featuredBrands.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '8px 0 12px 0' }}>
            {hub.featuredBrands.slice(0, 3).map((brand) => (
              <span
                key={brand}
                style={{
                  background: '#F5F3FF',
                  color: '#6D28D9',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: '4px',
                  border: '1px solid #EDE9FE',
                }}
              >
                {brand}
              </span>
            ))}
            {hub.featuredBrands.length > 3 && (
              <span style={{ fontSize: '0.7rem', color: '#8B5CF6', padding: '2px 4px', fontWeight: 600 }}>
                +{hub.featuredBrands.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="zorevi-mall-card__footer">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="zorevi-mall-card__btn-dir"
            title={`Get Directions to ${hub.name}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Navigation size={13} />
            <span>Directions</span>
          </a>

          <Link
            to={detailsUrl}
            className="zorevi-mall-card__btn-view"
            onClick={(e) => {
              e.stopPropagation();
              handleScrollTop();
            }}
          >
            <span>View Details</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}
