import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { discoveryCategories, discoveryDemoNotice } from '../../../services/publicDiscoveryData';
import './PublicDiscovery.css';

export default function CategoriesPage() {
  return (
    <main className="discovery-page public-info-page">
      <header className="public-info-hero">
        <p className="discovery-eyebrow">Explore your way</p>
        <h1>Style for every person and occasion.</h1>
        <p>Browse sample categories and discover the kinds of looks and styling perspectives available across the Zorevi demo.</p>
      </header>
      <p className="discovery-demo-notice" role="note">{discoveryDemoNotice}</p>
      <div className="public-category-grid">
        {discoveryCategories.filter((category) => category.id !== 'all').map((category) => (
          <article className="public-category-card" key={category.id}>
            <img src={category.image} alt={`Illustrative ${category.title} fashion`} loading="lazy" />
            <div className="public-category-card__body">
              <p className="discovery-eyebrow">Styling category</p>
              <h2>{category.title}</h2>
              <p>{category.description}</p>
              <Link to={`/explore/designers?category=${encodeURIComponent(category.id)}`} className="public-section-link">
                Explore sample designers <ArrowRight size={15} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
