/**
 * ZOREVI LOCATION SERVICE
 * Real browser geolocation, Nominatim reverse-geocoding,
 * manual location search with autocomplete, and Haversine distance calculation.
 */

// Major Indian cities and localities for instant offline/sandbox fallback
export const POPULAR_LOCATIONS = [
  { label: 'Jubilee Hills, Hyderabad', locality: 'Jubilee Hills', city: 'Hyderabad', lat: 17.4319, lng: 78.4073 },
  { label: 'Banjara Hills, Hyderabad', locality: 'Banjara Hills', city: 'Hyderabad', lat: 17.4156, lng: 78.4357 },
  { label: 'Gachibowli, Hyderabad', locality: 'Gachibowli', city: 'Hyderabad', lat: 17.4401, lng: 78.3489 },
  { label: 'HITEC City, Hyderabad', locality: 'HITEC City', city: 'Hyderabad', lat: 17.4474, lng: 78.3762 },
  { label: 'Kondapur, Hyderabad', locality: 'Kondapur', city: 'Hyderabad', lat: 17.4699, lng: 78.3578 },
  { label: 'Kukatpally, Hyderabad', locality: 'Kukatpally', city: 'Hyderabad', lat: 17.4849, lng: 78.4138 },
  { label: 'Indiranagar, Bengaluru', locality: 'Indiranagar', city: 'Bengaluru', lat: 12.9784, lng: 77.6408 },
  { label: 'Koramangala, Bengaluru', locality: 'Koramangala', city: 'Bengaluru', lat: 12.9352, lng: 77.6245 },
  { label: 'Whitefield, Bengaluru', locality: 'Whitefield', city: 'Bengaluru', lat: 12.9698, lng: 77.7499 },
  { label: 'Bandra West, Mumbai', locality: 'Bandra West', city: 'Mumbai', lat: 19.0596, lng: 72.8295 },
  { label: 'Lower Parel, Mumbai', locality: 'Lower Parel', city: 'Mumbai', lat: 18.9986, lng: 72.8311 },
  { label: 'Connaught Place, New Delhi', locality: 'Connaught Place', city: 'New Delhi', lat: 28.6304, lng: 77.2177 },
  { label: 'South Extension, New Delhi', locality: 'South Extension', city: 'New Delhi', lat: 28.5729, lng: 77.2215 },
  { label: 'T. Nagar, Chennai', locality: 'T. Nagar', city: 'Chennai', lat: 13.0418, lng: 80.2341 },
];

export const DEFAULT_LOCATION = POPULAR_LOCATIONS[0];

/**
 * Request real device / browser coordinates via Geolocation API
 */
export function getCurrentDevicePosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let msg = 'Unable to retrieve location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg = 'Location permission was denied. Please allow location access or search manually.';
            break;
          case error.POSITION_UNAVAILABLE:
            msg = 'Location information is currently unavailable.';
            break;
          case error.TIMEOUT:
            msg = 'Location request timed out. Please try again.';
            break;
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}

/**
 * Reverse geocode latitude & longitude to locality, area, city using OpenStreetMap Nominatim
 */
export async function reverseGeocodeCoordinates(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};

      const locality = addr.suburb || addr.neighbourhood || addr.residential || addr.quarter || addr.village || addr.subdistrict || 'Current Area';
      const city = addr.city || addr.town || addr.municipality || addr.state_district || addr.state || 'Detected City';
      const state = addr.state || '';
      const postcode = addr.postcode || '';

      const formatted = `${locality}, ${city}${state ? `, ${state}` : ''}`;

      return {
        lat,
        lng,
        locality,
        city,
        state,
        postcode,
        formatted,
        displayName: data.display_name || formatted,
      };
    }
  } catch (err) {
    console.warn('Network reverse-geocoding unavailable, using nearest coordinate reference.', err);
  }

  // Graceful fallback: find closest known reference location
  let closest = DEFAULT_LOCATION;
  let minDistance = Infinity;
  for (const loc of POPULAR_LOCATIONS) {
    const dist = calculateHaversineDistance(lat, lng, loc.lat, loc.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = loc;
    }
  }

  return {
    lat,
    lng,
    locality: closest.locality,
    city: closest.city,
    state: 'India',
    postcode: '',
    formatted: `${closest.locality}, ${closest.city}`,
    displayName: `${closest.locality}, ${closest.city}`,
  };
}

/**
 * Search locations with real geocoding autocomplete (Nominatim + local fallback)
 */
export async function searchLocationsAutocomplete(query) {
  if (!query || query.trim().length < 2) return [];

  const cleanQuery = query.trim().toLowerCase();

  // Try live Nominatim search
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=in`;
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (res.ok) {
      const results = await res.json();
      if (Array.isArray(results) && results.length > 0) {
        return results.map((item) => {
          const addr = item.address || {};
          const locality = addr.suburb || addr.neighbourhood || addr.quarter || addr.commercial || addr.village || item.name;
          const city = addr.city || addr.town || addr.state_district || addr.state || '';
          return {
            label: item.display_name,
            locality: locality || city || 'Area',
            city: city || 'City',
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
          };
        });
      }
    }
  } catch (err) {
    // network or sandbox offline fallback
  }

  // Fallback to local instant matching
  return POPULAR_LOCATIONS.filter((item) =>
    item.label.toLowerCase().includes(cleanQuery) ||
    item.locality.toLowerCase().includes(cleanQuery) ||
    item.city.toLowerCase().includes(cleanQuery)
  );
}

/**
 * Calculate precise distance between two GPS coordinates using the Haversine formula
 * Returns distance in kilometers (rounded to 1 decimal place)
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;

  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10;
}

/**
 * Format distance string nicely (e.g. "1.8 km" or "800 m")
 */
export function formatDistance(distanceKm) {
  if (distanceKm == null || isNaN(distanceKm)) return 'Nearby';
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Determine if a store is currently open based on operating hours string
 * e.g. "10:00 AM – 10:00 PM"
 */
export function isCurrentlyOpen(hoursString) {
  if (!hoursString) return true;
  try {
    const parts = hoursString.split('–').map((p) => p.trim());
    if (parts.length < 2) return true;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const parseToMinutes = (timeStr) => {
      const match = timeStr.match(/(\d+):?(\d+)?\s*(AM|PM)/i);
      if (!match) return null;
      let hour = parseInt(match[1], 10);
      const min = match[2] ? parseInt(match[2], 10) : 0;
      const meridiem = match[3].toUpperCase();
      if (meridiem === 'PM' && hour < 12) hour += 12;
      if (meridiem === 'AM' && hour === 12) hour = 0;
      return hour * 60 + min;
    };

    const openMin = parseToMinutes(parts[0]);
    const closeMin = parseToMinutes(parts[1]);

    if (openMin != null && closeMin != null) {
      return currentMinutes >= openMin && currentMinutes <= closeMin;
    }
  } catch (e) {
    return true;
  }
  return true;
}
