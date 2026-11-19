import { Link } from 'react-router-dom';
import { Star, MapPin, Navigation, ShoppingBag, ArrowUpRight } from 'lucide-react';
import ImageWithFallback from '../common/ImageWithFallback';
import './Cards.css';

export default function MallCard({ mall, role = 'customer' }) {
  const detailsUrl = role === 'customer'
    ? `/customer/malls/${mall.id}`
    : `/explore/malls/${mall.id}`;

  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${mall.name} ${mall.address || mall.location || ''}`
  )}`;

  const closingTime = mall.openingHours
    ? mall.openingHours.split('–')[1]?.trim() || '10 PM'
    : '10 PM';

  return (
    <div className="zorevi-mall-card">
      <div className="zorevi-mall-card__img-wrap">
        <Link to={detailsUrl} aria-label={`View details for ${mall.name}`}>
          <ImageWithFallback
            src={mall.image}
            alt={mall.name}
            className="zorevi-mall-card__img"
            fallbackType="mall"
          />
        </Link>
        <span className="zorevi-mall-card__status-open">
          Open till {closingTime}
        </span>
      </div>

      <div className="zorevi-mall-card__body">
        <Link to={detailsUrl} style={{ textDecoration: 'none' }}>
          <h3 className="zorevi-mall-card__title">{mall.name}</h3>
        </Link>

        <div className="zorevi-mall-card__address">
          <MapPin size={13} color="#7C3AED" />
          <span>{mall.location} • {mall.distance}</span>
        </div>

        <div className="zorevi-mall-card__stats">
          <div className="zorevi-mall-card__stat">
            <Star size={14} fill="#F59E0B" color="#F59E0B" />
            <strong>{mall.rating}</strong>
            <span style={{ color: '#9CA3AF' }}>({mall.reviewCount?.toLocaleString()})</span>
          </div>

          <div className="zorevi-mall-card__stat">
            <ShoppingBag size={14} color="#7C3AED" />
            <span>{mall.fashionStores} fashion stores</span>
          </div>
        </div>

        <div className="zorevi-mall-card__footer">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="zorevi-mall-card__btn-dir"
            title={`Get Directions to ${mall.name}`}
          >
            <Navigation size={13} />
            <span>Directions</span>
          </a>

          <Link to={detailsUrl} className="zorevi-mall-card__btn-view">
            <span>View Details</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}


