import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';

export default function PublicMallCard({ mall }) {
  const detailsUrl = `/malls/${mall.id}`;

  return (
    <article className="public-mall-card">
      <Link to={detailsUrl} className="public-mall-card__image-link">
        <img src={mall.image} alt={`Illustrative shopping mall interior; not a photograph of ${mall.name}`} loading="lazy" />
        <span>Illustrative photo</span>
      </Link>
      <div className="public-mall-card__content">
        <h3><Link to={detailsUrl}>{mall.name}</Link></h3>
        <p><MapPin size={15} /> {mall.location}</p>
        <div className="public-mall-card__actions">
          <Link className="zorevi-btn zorevi-btn--outline" to={detailsUrl}>View mall details</Link>
          <a className="public-mall-card__map-link" href={mall.mapsUrl} target="_blank" rel="noreferrer">
            Directions <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </article>
  );
}
