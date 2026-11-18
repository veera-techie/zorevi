export function getSafeReturnTo(search) {
  const value = new URLSearchParams(search).get('returnTo');
  if (!value || !value.startsWith('/') || value.startsWith('//')) return null;

  const destination = new URL(value, 'https://zorevi.invalid');
  if (destination.origin !== 'https://zorevi.invalid') return null;
  if (/^\/(admin|designer|customer\/(login|register|verify))(\/|$)/.test(destination.pathname)) return null;

  return `${destination.pathname}${destination.search}${destination.hash}`;
}

export function withReturnTo(path, returnTo) {
  if (!returnTo) return path;
  const params = new URLSearchParams({ returnTo });
  return `${path}?${params.toString()}`;
}

export function designerDestination(designerId, intent = 'details') {
  const path = `/designers/${encodeURIComponent(designerId)}`;
  return intent === 'booking' || intent === 'favorite'
    ? `${path}?intent=${intent}`
    : path;
}
