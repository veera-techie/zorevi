import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search, MapPin, Star, Navigation, Filter, ShoppingBag,
  Crosshair, Compass, Loader2, Sparkles, Building2, SlidersHorizontal,
  X, Check, ChevronDown, ArrowRight, Edit2, Grid, Map as MapIcon,
  Columns
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import FashionHubCard from '../../../components/cards/FashionHubCard';
import FashionHubMap from '../../../components/common/FashionHubMap';
import {
  REAL_FASHION_HUBS,
  FASHION_HUB_CATEGORIES,
  FASHION_HUB_OCCASIONS,
  searchFashionHubs,
} from '../../../services/fashionHubsService';
import {
  searchLocationsAutocomplete,
  POPULAR_LOCATIONS,
  calculateHaversineDistance,
  formatDistance,
} from '../../../services/locationService';
import './PublicMalls.css';

export default function PublicMalls({ role = 'public' }) {
  const {
    userLocation,
    updateUserLocation,
    detectUserLocation,
    isDetectingLocation,
    addToast,
  } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearchParam = searchParams.get('search') || searchParams.get('q') || '';

  // Filters State
  const [searchQuery, setSearchQuery] = useState(urlSearchParam);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedOccasion, setSelectedOccasion] = useState(searchParams.get('occasion') || 'All Occasions');
  const [selectedFashionCategory, setSelectedFashionCategory] = useState('All');
  const [radiusKm, setRadiusKm] = useState(20);
  const [sortBy, setSortBy] = useState('nearest');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'grid' | 'map'
  const [selectedHub, setSelectedHub] = useState(null);

  // Sync state if URL query changes (e.g. from header search or direct link)
  useEffect(() => {
    const currentUrlQ = searchParams.get('search') || searchParams.get('q') || '';
    if (currentUrlQ !== searchQuery) {
      setSearchQuery(currentUrlQ);
      setPage(1);
    }
  }, [searchParams]);

  // Manual Location Autocomplete Modal State
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationSearchInput, setLocationSearchInput] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const searchDebounceRef = useRef(null);

  // Execute Search & Filtering
  const searchResults = useMemo(() => {
    return searchFashionHubs({
      lat: userLocation?.lat || 17.4319,
      lng: userLocation?.lng || 78.4073,
      userLat: userLocation?.lat || 17.4319,
      userLng: userLocation?.lng || 78.4073,
      radiusKm: radiusKm === 0 ? null : radiusKm,
      category: selectedCategory,
      occasion: selectedOccasion,
      fashionCategory: selectedFashionCategory,
      query: searchQuery,
      searchQuery: searchQuery,
      sortBy: sortBy,
      page: page,
      limit: 12,
    });
  }, [
    userLocation,
    radiusKm,
    selectedCategory,
    selectedOccasion,
    selectedFashionCategory,
    searchQuery,
    sortBy,
    page,
  ]);

  const { hubs, total, hasMore } = searchResults;

  // Sync selected hub for map when hubs load
  useEffect(() => {
    if (hubs.length > 0 && (!selectedHub || !hubs.some((h) => h.id === selectedHub.id))) {
      setSelectedHub(hubs[0]);
    }
  }, [hubs]);

  // Handle GPS location detection
  const handleDetectLocation = async () => {
    try {
      await detectUserLocation();
      setPage(1);
    } catch {
      // Notification handled in AppContext
    }
  };

  // Handle live location autocomplete
  const handleLocationInputChange = (val) => {
    setLocationSearchInput(val);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    if (!val || val.trim().length < 2) {
      setLocationSuggestions([]);
      setIsSearchingLocation(false);
      return;
    }

    setIsSearchingLocation(true);
    searchDebounceRef.current = setTimeout(async () => {
      try {
        const results = await searchLocationsAutocomplete(val.trim());
        setLocationSuggestions(results);
      } catch (e) {
        console.error('Location search error:', e);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 300);
  };

  // Select a location from suggestions
  const handleSelectLocation = (loc) => {
    updateUserLocation(loc);
    setShowLocationModal(false);
    setLocationSearchInput('');
    setLocationSuggestions([]);
    setPage(1);
    addToast(`Location set to ${loc.formatted || loc.label}`, 'success');
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSearchParams({});
    setSelectedCategory('all');
    setSelectedOccasion('All Occasions');
    setSelectedFashionCategory('All');
    setRadiusKm(20);
    setSortBy('nearest');
    setPage(1);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setPage(1);
    if (val.trim()) {
      setSearchParams({ search: val.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
    setPage(1);
  };

  return (
    <div className="zorevi-malls-page container">
      {/* 1. Header Banner */}
      <div className="zorevi-malls-header">
        <div className="zorevi-malls-header-text">
          <h1 className="zorevi-malls-title">Explore Nearby Fashion Hubs</h1>
          <p className="zorevi-malls-subtitle">
            Discover premier shopping malls, designer boutiques, ethnic wear studios, and luxury fashion destinations near you.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="zorevi-malls-tags">
          <span className="zorevi-malls-tag">✓ 10+ Fashion Categories</span>
          <span className="zorevi-malls-tag">✓ Google Maps & Places Verified</span>
          <span className="zorevi-malls-tag">✓ Real GPS Distance Calculation</span>
          <span className="zorevi-malls-tag">✓ Official Stylist Meeting Spots</span>
          <span className="zorevi-malls-tag">✓ Live Operating Status</span>
        </div>
      </div>

      {/* 2. Current Location Bar (Requirement 2 & 3) */}
      <div className="zorevi-hub-location-bar">
        <div className="zorevi-hub-current-location">
          <span className="zorevi-hub-loc-label">Your Current Location</span>
          <div className="zorevi-hub-loc-display">
            <MapPin size={20} className="zorevi-hub-loc-pin" />
            <strong className="zorevi-hub-loc-text">
              {userLocation?.locality
                ? `${userLocation.locality}, ${userLocation.city}`
                : userLocation?.formatted || 'Jubilee Hills, Hyderabad'}
            </strong>
            {userLocation?.isDetected && (
              <span className="zorevi-hub-loc-badge">GPS Detected</span>
            )}
          </div>
        </div>

        <div className="zorevi-hub-loc-actions">
          <button
            type="button"
            className="zorevi-btn zorevi-btn--outline"
            onClick={() => setShowLocationModal(true)}
            title="Search city, area, locality, or PIN code"
          >
            <Edit2 size={14} /> Change Location
          </button>

          <button
            type="button"
            className="zorevi-btn zorevi-btn--primary"
            onClick={handleDetectLocation}
            disabled={isDetectingLocation}
            title="Detect location automatically via browser"
          >
            {isDetectingLocation ? (
              <Loader2 size={15} className="spin-animation" />
            ) : (
              <Crosshair size={15} />
            )}
            <span>{isDetectingLocation ? 'Detecting...' : 'Use My Current Location'}</span>
          </button>
        </div>
      </div>

      {/* 3. Category Filter Chips (Requirement 6) */}
      <div className="zorevi-hub-categories-scroll">
        {FASHION_HUB_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              className={`zorevi-hub-cat-chip ${isActive ? 'is-active' : ''}`}
              onClick={() => {
                setSelectedCategory(cat.id);
                setPage(1);
              }}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Search and Advanced Filters Toolbar */}
      <div className="zorevi-malls-filter-bar">
        {/* Keyword Search */}
        <div className="zorevi-malls-search">
          <Search size={18} className="zorevi-malls-search-icon" />
          <input
            type="text"
            placeholder="Search fashion hubs by name, area, or brands (e.g. Inorbit, Zara, Sabyasachi)..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="zorevi-search-clear"
              onClick={handleClearSearch}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Occasion Dropdown (Requirement 8) */}
        <div className="zorevi-filter-dropdown-wrap">
          <select
            className="zorevi-filter-select"
            value={selectedOccasion}
            onChange={(e) => {
              setSelectedOccasion(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by occasion"
          >
            {FASHION_HUB_OCCASIONS.map((occ) => (
              <option key={occ} value={occ}>
                {occ === 'All Occasions' ? 'All Occasions' : `Occasion: ${occ}`}
              </option>
            ))}
          </select>
        </div>

        {/* Fashion Category Dropdown */}
        <div className="zorevi-filter-dropdown-wrap">
          <select
            className="zorevi-filter-select"
            value={selectedFashionCategory}
            onChange={(e) => {
              setSelectedFashionCategory(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by target category"
          >
            <option value="All">All Categories</option>
            <option value="Women">Women's Fashion</option>
            <option value="Men">Men's Fashion</option>
            <option value="Kids">Kids' Fashion</option>
            <option value="Family">Family Styling</option>
          </select>
        </div>

        {/* Radius Dropdown (Requirement 4) */}
        <div className="zorevi-filter-dropdown-wrap">
          <select
            className="zorevi-filter-select"
            value={radiusKm}
            onChange={(e) => {
              setRadiusKm(Number(e.target.value));
              setPage(1);
            }}
            aria-label="Filter by distance radius"
          >
            <option value={5}>Radius: Within 5 km</option>
            <option value={10}>Radius: Within 10 km</option>
            <option value={20}>Radius: Within 20 km</option>
            <option value={50}>Radius: Within 50 km</option>
            <option value={0}>Radius: Any distance</option>
          </select>
        </div>

        {/* Sorting Dropdown (Requirement 7) */}
        <div className="zorevi-filter-dropdown-wrap">
          <select
            className="zorevi-filter-select"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            aria-label="Sort fashion hubs"
          >
            <option value="nearest">Sort: Nearest First</option>
            <option value="rating">Sort: Top Rated</option>
            <option value="reviews">Sort: Most Reviewed</option>
            <option value="popular">Sort: Popular</option>
            <option value="openNow">Sort: Open Now</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="zorevi-view-toggle">
          <button
            type="button"
            className={`zorevi-view-btn ${viewMode === 'split' ? 'is-active' : ''}`}
            onClick={() => setViewMode('split')}
            title="Split List & Map View"
          >
            <Columns size={16} />
          </button>
          <button
            type="button"
            className={`zorevi-view-btn ${viewMode === 'grid' ? 'is-active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Cards Grid View"
          >
            <Grid size={16} />
          </button>
          <button
            type="button"
            className={`zorevi-view-btn ${viewMode === 'map' ? 'is-active' : ''}`}
            onClick={() => setViewMode('map')}
            title="Map View"
          >
            <MapIcon size={16} />
          </button>
        </div>
      </div>

      {/* 5. Main Content Area */}
      {viewMode === 'split' && (
        <div className="zorevi-malls-split-grid">
          {/* Left Column: Discovered Hubs List */}
          <div className="zorevi-malls-list-col">
            <div className="zorevi-results-header">
              <div>
                <h3 className="zorevi-results-title">
                  {searchQuery ? `Matching "${searchQuery}" (${total})` : `Nearby Fashion Hubs (${total})`}
                </h3>
                {searchQuery && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                      Showing verified fashion hubs matching your query
                    </span>
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      style={{
                        background: '#EDE9FE',
                        color: '#6D28D9',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '2px 8px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      Clear search <X size={12} />
                    </button>
                  </div>
                )}
              </div>
              {(searchQuery || selectedCategory !== 'all' || selectedOccasion !== 'All Occasions' || selectedFashionCategory !== 'All' || radiusKm !== 20) && (
                <button
                  type="button"
                  className="zorevi-reset-btn"
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </button>
              )}
            </div>

            {hubs.length > 0 ? (
              <div className="zorevi-hub-cards-stack">
                {hubs.map((hub) => (
                  <FashionHubCard
                    key={hub.id}
                    hub={hub}
                    role={role}
                    isSelected={selectedHub?.id === hub.id}
                    onSelect={(h) => setSelectedHub(h)}
                  />
                ))}
              </div>
            ) : (
              <div className="zorevi-empty-hubs">
                <Building2 size={44} color="#A78BFA" />
                <h4>No Fashion Hubs Found</h4>
                <p>
                  No hubs match your current filter within {radiusKm ? `${radiusKm} km` : 'this area'}. Try expanding the radius or clearing filters.
                </p>
                <button
                  type="button"
                  className="zorevi-btn zorevi-btn--primary"
                  onClick={handleResetFilters}
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination / Load More Button */}
            {hasMore && (
              <div className="zorevi-load-more-wrap">
                <button
                  type="button"
                  className="zorevi-btn zorevi-btn--outline zorevi-btn--load-more"
                  onClick={() => setPage((p) => p + 1)}
                >
                  Load More Fashion Hubs ({total - hubs.length} remaining)
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Map */}
          <div className="zorevi-malls-map-col">
            <FashionHubMap
              hubs={hubs}
              userLocation={userLocation}
              selectedHub={selectedHub}
              onSelectHub={(h) => setSelectedHub(h)}
              radiusKm={radiusKm || 20}
            />
          </div>
        </div>
      )}

      {/* Grid Only View */}
      {viewMode === 'grid' && (
        <div className="zorevi-grid-view-wrap">
          <div className="zorevi-results-header">
            <div>
              <h3 className="zorevi-results-title">
                {searchQuery ? `Matching "${searchQuery}" (${total})` : `Discovered Fashion Hubs (${total})`}
              </h3>
              {searchQuery && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                    Showing verified fashion hubs matching your query
                  </span>
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    style={{
                      background: '#EDE9FE',
                      color: '#6D28D9',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '2px 8px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    Clear search <X size={12} />
                  </button>
                </div>
              )}
            </div>
            {(searchQuery || selectedCategory !== 'all' || selectedOccasion !== 'All Occasions' || selectedFashionCategory !== 'All' || radiusKm !== 20) && (
              <button
                type="button"
                className="zorevi-reset-btn"
                onClick={handleResetFilters}
              >
                Reset Filters
              </button>
            )}
          </div>

          {hubs.length > 0 ? (
            <div className="zorevi-hub-full-grid">
              {hubs.map((hub) => (
                <FashionHubCard
                  key={hub.id}
                  hub={hub}
                  role={role}
                  isSelected={selectedHub?.id === hub.id}
                  onSelect={(h) => setSelectedHub(h)}
                />
              ))}
            </div>
          ) : (
            <div className="zorevi-empty-hubs">
              <Building2 size={44} color="#A78BFA" />
              <h4>No Fashion Hubs Found</h4>
              <p>Try expanding the distance radius or changing category.</p>
              <button
                type="button"
                className="zorevi-btn zorevi-btn--primary"
                onClick={handleResetFilters}
              >
                Reset All Filters
              </button>
            </div>
          )}

          {hasMore && (
            <div className="zorevi-load-more-wrap">
              <button
                type="button"
                className="zorevi-btn zorevi-btn--outline zorevi-btn--load-more"
                onClick={() => setPage((p) => p + 1)}
              >
                Load More Fashion Hubs
              </button>
            </div>
          )}
        </div>
      )}

      {/* Map Only View */}
      {viewMode === 'map' && (
        <div className="zorevi-map-only-view">
          <FashionHubMap
            hubs={hubs}
            userLocation={userLocation}
            selectedHub={selectedHub}
            onSelectHub={(h) => setSelectedHub(h)}
            radiusKm={radiusKm || 20}
          />
        </div>
      )}

      {/* 6. Manual Location Search Modal (Requirement 3) */}
      {showLocationModal && (
        <div
          className="zorevi-loc-modal-backdrop"
          onClick={() => setShowLocationModal(false)}
        >
          <div
            className="zorevi-loc-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="zorevi-loc-modal-header">
              <div>
                <h3 className="zorevi-loc-modal-title">Select or Search Location</h3>
                <p className="zorevi-loc-modal-subtitle">
                  Enter city, area, locality, or PIN code to find nearby Fashion Hubs
                </p>
              </div>
              <button
                type="button"
                className="zorevi-loc-modal-close"
                onClick={() => setShowLocationModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Input with live geocoding autocomplete */}
            <div className="zorevi-loc-modal-search">
              <Search size={18} className="zorevi-loc-search-icon" />
              <input
                type="text"
                autoFocus
                placeholder="e.g. Kondapur, Bandra West, Indiranagar, 500084..."
                value={locationSearchInput}
                onChange={(e) => handleLocationInputChange(e.target.value)}
              />
              {isSearchingLocation && (
                <Loader2 size={16} className="spin-animation zorevi-loc-search-loader" />
              )}
            </div>

            {/* Use Current GPS Location quick button inside modal */}
            <button
              type="button"
              className="zorevi-loc-modal-gps-btn"
              onClick={async () => {
                setShowLocationModal(false);
                await handleDetectLocation();
              }}
            >
              <Crosshair size={16} color="#7C3AED" />
              <div style={{ textAlign: 'left' }}>
                <strong>Use My Current Device Location</strong>
                <small style={{ display: 'block', color: '#6B7280' }}>
                  Auto-detect GPS coordinates with browser permission
                </small>
              </div>
            </button>

            {/* Autocomplete Suggestions */}
            {locationSuggestions.length > 0 && (
              <div className="zorevi-loc-suggestions-list">
                <span className="zorevi-loc-section-label">Search Results</span>
                {locationSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="zorevi-loc-suggestion-item"
                    onClick={() => handleSelectLocation(item)}
                  >
                    <MapPin size={16} className="zorevi-loc-sugg-icon" />
                    <div className="zorevi-loc-sugg-text">
                      <strong>{item.locality || item.city}</strong>
                      <small>{item.formatted || item.displayName}</small>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Popular Locations Quick Pick */}
            <div className="zorevi-loc-popular-wrap">
              <span className="zorevi-loc-section-label">Popular Fashion Hub Locations</span>
              <div className="zorevi-loc-popular-grid">
                {POPULAR_LOCATIONS.map((loc) => {
                  const isCurrent =
                    userLocation?.locality === loc.locality &&
                    userLocation?.city === loc.city;
                  return (
                    <button
                      key={loc.label}
                      type="button"
                      className={`zorevi-loc-popular-chip ${isCurrent ? 'is-active' : ''}`}
                      onClick={() => handleSelectLocation(loc)}
                    >
                      <MapPin size={13} />
                      <span>{loc.label}</span>
                      {isCurrent && <Check size={13} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
