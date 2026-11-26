import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import BookingModal from '../../../components/cards/BookingModal';
import PublicDesignerCard from '../../../components/cards/PublicDesignerCard';
import { useApp } from '../../../context/AppContext';
import { discoveryCategories, designerStyleFilters, discoveryDemoNotice, publicDesigners } from '../../../services/publicDiscoveryData';
import './PublicDiscovery.css';

const categoryFor = (id) => discoveryCategories.find((category) => category.id === id) || discoveryCategories[0];

export default function PublicDesignerDirectory() {
  const [searchParams] = useSearchParams();
  const { selectedCity } = useApp();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(categoryFor(searchParams.get('category')).id);
  const [sortBy, setSortBy] = useState('recommended');
  const [visibleCount, setVisibleCount] = useState(4);
  const [bookingDesigner, setBookingDesigner] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const selectedCategoryData = categoryFor(selectedCategory);

  const filteredDesigners = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return publicDesigners
      .filter((designer) => designer.location.toLowerCase() === selectedCity.toLowerCase())
      .filter((designer) => !query || [
        designer.name,
        designer.title,
        designer.location,
        designer.area,
        ...designer.specializations,
      ].some((value) => value.toLowerCase().includes(query)))
      .filter((designer) => !selectedCategoryData.terms.length
        || selectedCategoryData.terms.some((term) => designer.specializations.some((specialization) => specialization.toLowerCase() === term)))
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price-low') return a.startingPrice - b.startingPrice;
        if (sortBy === 'price-high') return b.startingPrice - a.startingPrice;
        if (sortBy === 'experience') return b.yearsExperience - a.yearsExperience;
        return a.name.localeCompare(b.name);
      });
  }, [searchQuery, selectedCity, selectedCategoryData, sortBy]);

  const handleBook = (designer) => {
    setBookingDesigner(designer);
    setBookingOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('recommended');
    setVisibleCount(4);
  };

  return (
    <div className="discovery-page">
      <header className="discovery-page__header">
        <p className="discovery-eyebrow">Meet your next style partner</p>
        <h1>Explore designers in {selectedCity}</h1>
        <p>Browse sample profiles by specialty and compare the style preview that feels right for you.</p>
      </header>

      <p className="discovery-demo-notice" role="note">{discoveryDemoNotice} Location is selected manually; this demo does not use GPS.</p>

      <section className="discovery-filters" aria-label="Designer search and filters">
        <label className="discovery-search">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">Search designers, styles or areas</span>
          <input
            type="search"
            placeholder="Search designers, styles or areas"
            value={searchQuery}
            onChange={(event) => { setSearchQuery(event.target.value); setVisibleCount(4); }}
          />
        </label>
        <label className="discovery-sort">
          <SlidersHorizontal size={16} aria-hidden="true" />
          <span className="sr-only">Sort designers</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="recommended">Recommended</option>
            <option value="rating">Highest rated (demo)</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="experience">Most experience</option>
          </select>
        </label>
        <Link className="discovery-reset" to="/explore/designers" onClick={clearFilters}>Clear filters</Link>
      </section>

      <div className="discovery-chip-row" role="group" aria-label="Filter designers by style">
        {designerStyleFilters.map((category) => (
          <button
            type="button"
            key={category.id}
            className={`discovery-chip ${selectedCategory === category.id ? 'is-active' : ''}`}
            aria-pressed={selectedCategory === category.id}
            onClick={() => { setSelectedCategory(category.id); setVisibleCount(4); }}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="discovery-results-heading">
        <h2>{selectedCategory === 'all' ? `Verified designers near ${selectedCity}` : `${selectedCategoryData.label} designers near ${selectedCity}`}</h2>
        <p aria-live="polite">{filteredDesigners.length} sample profiles</p>
      </div>

      {filteredDesigners.length ? (
        <>
          <div className="public-designer-grid">
            {filteredDesigners.slice(0, visibleCount).map((designer) => (
              <PublicDesignerCard key={designer.id} designer={designer} onBook={handleBook} />
            ))}
          </div>
          {filteredDesigners.length > visibleCount && (
            <div className="discovery-load-more">
              <button type="button" className="zorevi-btn zorevi-btn--outline" onClick={() => setVisibleCount((count) => count + 4)}>
                Load more designers
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="discovery-empty">
          <h2>No sample designers found</h2>
          <p>Try a different search or choose another city from the location selector.</p>
          <button type="button" className="zorevi-btn zorevi-btn--outline" onClick={clearFilters}>Reset search</button>
        </div>
      )}

      {bookingOpen && (
        <BookingModal
          isOpen={bookingOpen}
          onClose={() => setBookingOpen(false)}
          initialDesigner={bookingDesigner}
        />
      )}
    </div>
  );
}
