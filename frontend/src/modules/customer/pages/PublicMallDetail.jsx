import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, MapPin } from 'lucide-react';
import { publicDesigners, publicMalls } from '../../../services/publicDiscoveryData';
import './PublicDiscovery.css';

export default function PublicMallDetail() {
  const { id, mallId } = useParams();
  const mall = publicMalls.find((item) => item.id === (id || mallId));

  if (!mall) {
    return (
      <main className="discovery-page discovery-empty">
        <h1>Mall details not found</h1>
        <p>This venue is not in the current sample directory.</p>
        <Link className="zorevi-btn zorevi-btn--outline" to="/explore/malls">Back to malls</Link>
      </main>
    );
  }

  const cityDesigners = publicDesigners.filter((designer) => designer.location === 'Hyderabad').slice(0, 3);

  return (
    <main className="discovery-page public-mall-detail">
      <Link to="/explore/malls" className="discovery-back-link"><ArrowLeft size={16} /> Back to malls</Link>
      <section className="public-mall-detail__hero">
        <img src={mall.image} alt={`Illustrative mall interior, not a photograph of ${mall.name}`} />
        <div>
          <span className="public-demo-badge">Illustrative photo · not venue-specific</span>
          <h1>{mall.name}</h1>
          <p><MapPin size={16} /> {mall.location}</p>
        </div>
      </section>
      <section className="public-detail-panel public-mall-detail__facts">
        <div>
          <p className="discovery-eyebrow">Official information</p>
          <h2>Check current venue details</h2>
          <p>Only the venue name and city are listed here. For current address, hours, store information and accessibility details, use the mall’s official website.</p>
        </div>
        <div className="public-mall-detail__links">
          <a className="zorevi-btn zorevi-btn--primary" href={mall.officialUrl} target="_blank" rel="noreferrer">
            Official website <ArrowUpRight size={15} />
          </a>
          <a className="zorevi-btn zorevi-btn--outline" href={mall.mapsUrl} target="_blank" rel="noreferrer">
            Map directions <ArrowUpRight size={15} />
          </a>
        </div>
      </section>
      <p className="discovery-source-note">
        Source for the venue name and city: <a href={mall.sourceUrl} target="_blank" rel="noreferrer">official mall website</a>. Zorevi does not confirm that any designer is physically available at this mall.
      </p>
      <section className="public-detail-panel">
        <p className="discovery-eyebrow">Independent sample listings</p>
        <h2>Designers in Hyderabad</h2>
        <p className="public-detail-note">These are citywide demo profiles, not mall partners or on-site designers. Their locations and availability are illustrative.</p>
        <div className="public-nearby-designers">
          {cityDesigners.map((designer) => (
            <Link to={`/designers/${designer.id}`} key={designer.id} className="public-nearby-designer">
              <img src={designer.image} alt="" loading="lazy" />
              <span><strong>{designer.name}</strong><small>{designer.title}</small></span>
              <ArrowUpRight size={15} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
