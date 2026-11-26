import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';

export default function PublicMallCard({ mall, title = 'Fashion Malls' }) {
  const detailsUrl = `/malls/${mall.id}`;
  const mallsUrl = '/explore/fashion-hubs?category=mall';

  return (
    <article className="public-mall-card">
      <Link to={detailsUrl} className="public-mall-card__image-link">
        <img src={mall.image} alt={`Illustrative shopping mall interior; not a photograph of ${mall.name}`} loading="lazy" />
        <span>Illustrative photo</span>
      </Link>
      <div className="public-mall-card__content">
        <h3><Link to={detailsUrl}>{title}</Link></h3>
        <p><MapPin size={15} /> {mall.location}</p>
        <div className="public-mall-card__actions">
          <Link className="zorevi-btn zorevi-btn--outline" to="/explore/designers">Explore designers</Link>
          <Link className="public-mall-card__map-link" to={mallsUrl}>
            View Fashion Malls <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
