import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import PublicMallCard from '../../../components/cards/PublicMallCard';
import { useApp } from '../../../context/AppContext';
import { publicMalls } from '../../../services/publicDiscoveryData';
import './PublicDiscovery.css';

export default function PublicMallDirectory() {
  const [searchParams] = useSearchParams();
  const { selectedCity } = useApp();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [visibleCount, setVisibleCount] = useState(2);
  const malls = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return publicMalls
      .filter((mall) => mall.location.toLowerCase().includes(selectedCity.toLowerCase()))
      .filter((mall) => !query || `${mall.name} ${mall.location}`.toLowerCase().includes(query));
  }, [searchQuery, selectedCity]);

  return (
    <main className="discovery-page">
      <header className="discovery-page__header">
        <p className="discovery-eyebrow">Explore the city</p>
        <h1>Fashion destinations in {selectedCity}</h1>
        <p>Browse mall information and follow official links for current venue details.</p>
      </header>
      <p className="discovery-demo-notice" role="note">Mall names and city context are checked against the linked official websites. Photos are illustrative only, not photographs of these venues. Location is selected manually in this demo.</p>
      <label className="discovery-search discovery-mall-search">
        <Search size={18} aria-hidden="true" />
        <span className="sr-only">Search malls by name or location</span>
        <input
          type="search"
          placeholder="Search malls by name or location"
          value={searchQuery}
          onChange={(event) => { setSearchQuery(event.target.value); setVisibleCount(2); }}
        />
      </label>
      <div className="discovery-results-heading">
        <h2>Malls in {selectedCity}</h2>
        <p aria-live="polite">{malls.length} listings</p>
      </div>
      {malls.length ? (
        <>
          <div className="public-mall-grid">
            {malls.slice(0, visibleCount).map((mall) => <PublicMallCard key={mall.id} mall={mall} />)}
          </div>
          {malls.length > visibleCount && (
            <div className="discovery-load-more">
              <button type="button" className="zorevi-btn zorevi-btn--outline" onClick={() => setVisibleCount((count) => count + 2)}>
                Load more malls
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="discovery-empty">
          <h2>No mall listings for {selectedCity}</h2>
          <p>Try a different search or select Hyderabad to view the verified sample directory.</p>
          <Link className="zorevi-btn zorevi-btn--outline" to="/explore/malls" onClick={() => setSearchQuery('')}>Clear search</Link>
        </div>
      )}
    </main>
  );
}
