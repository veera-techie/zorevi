import { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, Search, Check, ChevronDown, Sparkles, Loader2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CITIES } from '../../constants';
import { POPULAR_LOCATIONS, searchLocationsAutocomplete } from '../../services/locationService';

export default function HeaderLocationSelector({ isMobile = false }) {
  const {
    userLocation,
    updateUserLocation,
    detectUserLocation,
    isDetectingLocation,
    selectedCity,
    setSelectedCity,
    addToast,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle autocomplete search with debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchLocationsAutocomplete(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error('Location autocomplete error', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle auto GPS detection
  const handleDetectGPS = async () => {
    try {
      const detected = await detectUserLocation();
      if (detected) {
        setIsOpen(false);
      }
    } catch {
      // Error is handled with toast in context
    }
  };

  // Select a location from results or popular list
  const handleSelectLocation = (loc) => {
    const formatted = loc.label || `${loc.locality || ''}, ${loc.city || ''}`;
    const newLoc = {
      lat: loc.lat,
      lng: loc.lng,
      locality: loc.locality || loc.city,
      city: loc.city,
      area: loc.locality,
      formatted,
      isDetected: false,
    };
    updateUserLocation(newLoc);
    if (loc.city) {
      setSelectedCity(loc.city);
    }
    addToast(`Location set to ${loc.locality || loc.city}`, 'info');
    setIsOpen(false);
    setSearchQuery('');
  };

  // Quick select standard city
  const handleSelectCity = (city) => {
    setSelectedCity(city);
    // Find matching popular location coords if available
    const match = POPULAR_LOCATIONS.find((l) => l.city.toLowerCase() === city.toLowerCase());
    if (match) {
      updateUserLocation({
        ...match,
        formatted: `${match.locality}, ${match.city}`,
        isDetected: false,
      });
    } else {
      updateUserLocation({
        locality: city,
        city: city,
        formatted: city,
        isDetected: false,
      });
    }
    addToast(`City changed to ${city}`, 'info');
    setIsOpen(false);
  };

  // Display label on trigger button
  const displayLabel = userLocation?.locality
    ? `${userLocation.locality}, ${userLocation.city || selectedCity}`
    : selectedCity;

  return (
    <div className={`navbar__location-selector ${isMobile ? 'navbar__location-selector--mobile' : ''}`} ref={dropdownRef}>
      <button
        type="button"
        className={`navbar__city-btn ${userLocation?.isDetected ? 'is-gps-active' : ''}`}
        aria-expanded={isOpen}
        aria-label={`Current location: ${displayLabel}. Click to change location.`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="navbar__city-pin-wrap">
          <MapPin size={15} className="navbar__city-pin-icon" />
          {userLocation?.isDetected && <span className="navbar__city-gps-dot" title="GPS Detected" />}
        </span>
        <span className="navbar__city-text" title={userLocation?.formatted || displayLabel}>
          {displayLabel}
        </span>
        <ChevronDown size={13} className={`navbar__city-chevron ${isOpen ? 'is-open' : ''}`} />
      </button>

      {isOpen && (
        <div className="navbar__location-dropdown" role="dialog" aria-label="Select location">
          {/* Header */}
          <div className="navbar__loc-dropdown-header">
            <div>
              <span className="navbar__loc-dropdown-title">Select Your Location</span>
              <p className="navbar__loc-dropdown-sub">
                Discover fashion hubs, boutiques & stylists near you
              </p>
            </div>
            <button
              type="button"
              className="navbar__loc-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close location selector"
            >
              <X size={16} />
            </button>
          </div>

          {/* Current detected pill */}
          <div className="navbar__loc-current-pill">
            <div className="navbar__loc-current-icon">
              <MapPin size={15} />
            </div>
            <div className="navbar__loc-current-info">
              <span className="navbar__loc-current-label">
                {userLocation?.isDetected ? 'GPS Active Location' : 'Selected Location'}
              </span>
              <strong className="navbar__loc-current-name">
                {userLocation?.formatted || `${userLocation?.locality || selectedCity}, ${userLocation?.city || ''}`}
              </strong>
            </div>
            <span className={`navbar__loc-badge ${userLocation?.isDetected ? 'is-detected' : 'is-manual'}`}>
              {userLocation?.isDetected ? 'Live GPS' : 'Manual'}
            </span>
          </div>

          {/* Use My Current Location GPS Button */}
          <button
            type="button"
            className="navbar__loc-gps-btn"
            onClick={handleDetectGPS}
            disabled={isDetectingLocation}
          >
            {isDetectingLocation ? (
              <>
                <Loader2 size={16} className="navbar__loc-spin" />
                <span>Detecting your live coordinates & area...</span>
              </>
            ) : (
              <>
                <Navigation size={16} />
                <span>Use My Current Location</span>
                <span className="navbar__loc-gps-tag">Accurate</span>
              </>
            )}
          </button>

          {/* Manual Search Input */}
          <div className="navbar__loc-search-box">
            <Search size={15} className="navbar__loc-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search area, locality, city, PIN code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="navbar__loc-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="navbar__loc-clear-search"
                onClick={() => setSearchQuery('')}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Autocomplete Results */}
          {searchQuery.trim().length >= 2 && (
            <div className="navbar__loc-results-list">
              {isSearching ? (
                <div className="navbar__loc-searching">
                  <Loader2 size={14} className="navbar__loc-spin" /> Searching locations...
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((res, i) => (
                  <button
                    key={`${res.lat}-${res.lng}-${i}`}
                    type="button"
                    className="navbar__loc-result-item"
                    onClick={() => handleSelectLocation(res)}
                  >
                    <MapPin size={14} className="navbar__loc-res-pin" />
                    <div className="navbar__loc-res-info">
                      <strong>{res.locality}</strong>
                      <small>{res.city} • {res.label}</small>
                    </div>
                  </button>
                ))
              ) : (
                <div className="navbar__loc-empty">
                  No locations found for "{searchQuery}". Try a city or PIN code.
                </div>
              )}
            </div>
          )}

          {/* Popular Localities in Current Region */}
          <div className="navbar__loc-section">
            <span className="navbar__loc-section-label">
              <Sparkles size={12} /> Popular Fashion Hub Localities
            </span>
            <div className="navbar__loc-chips-grid">
              {POPULAR_LOCATIONS.slice(0, 8).map((loc) => {
                const isActive =
                  userLocation?.locality?.toLowerCase() === loc.locality.toLowerCase();
                return (
                  <button
                    key={loc.label}
                    type="button"
                    className={`navbar__loc-chip ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleSelectLocation(loc)}
                  >
                    <span>{loc.locality}</span>
                    <small>{loc.city}</small>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Major Cities */}
          <div className="navbar__loc-section">
            <span className="navbar__loc-section-label">All Cities</span>
            <div className="navbar__loc-cities-row">
              {CITIES.map((city) => {
                const isActive = selectedCity.toLowerCase() === city.toLowerCase();
                return (
                  <button
                    key={city}
                    type="button"
                    className={`navbar__loc-city-pill ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleSelectCity(city)}
                  >
                    {isActive && <Check size={12} />}
                    <span>{city}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
