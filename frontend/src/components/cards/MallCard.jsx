import { Link } from 'react-router-dom';
import { Star, MapPin, Navigation, ShoppingBag } from 'lucide-react';
import ImageWithFallback from '../common/ImageWithFallback';
import './Cards.css';

export default function MallCard({ mall, role = 'customer' }) {
  const detailsUrl = role === 'customer'
    ? `/customer/malls/${mall.id}`
    : `/explore/malls/${mall.id}`;

  return (
    <div className="zorevi-mall-card">
      <div className="zorevi-mall-card__img-wrap">
        <Link to={detailsUrl}>
          <ImageWithFallback
            src={mall.image}
            alt={mall.name}
            className="zorevi-mall-card__img"
            fallbackType="mall"
          />
        </Link>
      </div>

      <div className="zorevi-mall-card__body">
        <Link to={detailsUrl} style={{ textDecoration: 'none' }}>
          <h3 className="zorevi-mall-card__title">{mall.name}</h3>
        </Link>

        <div className="zorevi-mall-card__address">
          <MapPin size={13} />
          <span>{mall.location} • {mall.distance}</span>
        </div>

        <div className="zorevi-mall-card__stats">
          <div className="zorevi-mall-card__stat">
            <Star size={14} fill="#F59E0B" color="#F59E0B" />
            <strong>{mall.rating}</strong>
            <span style={{ color: '#9CA3AF' }}>({mall.reviewCount})</span>
          </div>

          <div className="zorevi-mall-card__stat">
            <ShoppingBag size={14} color="#7C3AED" />
            <span>{mall.fashionStores} fashion stores</span>
          </div>
        </div>

        <div className="zorevi-mall-card__footer">
          <span className="zorevi-mall-card__status-open">
            Open till 10 PM
          </span>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to={detailsUrl} className="zorevi-btn zorevi-btn--outline zorevi-btn--sm">
              <Navigation size={12} /> Directions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

