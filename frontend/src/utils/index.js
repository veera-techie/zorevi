export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatTime(timeStr) {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export function formatDateTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
}

export function formatRelativeTime(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

export function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function generateId(prefix = 'ZV') {
  return `${prefix}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export function truncateText(text, maxLen = 100) {
  if (!text || text.length <= maxLen) return text;
  return text.substring(0, maxLen).trim() + '...';
}

export function getStatusColor(status) {
  const map = {
    'Pending': 'warning',
    'Confirmed': 'success',
    'Upcoming': 'primary',
    'In Session': 'info',
    'Completed': 'completed',
    'Cancelled': 'error',
    'Rescheduled': 'warning',
    'Active': 'success',
    'Inactive': 'error',
    'Verified': 'success',
    'Unverified': 'warning',
    'Approved': 'success',
    'Rejected': 'error',
    'Resubmitted': 'info',
  };
  return map[status] || 'info';
}

export function getPlaceholderImage(type, index = 0) {
  const images = {
    avatar: '/images/customer-praveen.png',
    card: '/images/hero-banner-group.png',
    hero: '/images/hero-banner-group-generated.png',
    mall: '/images/mall-lakeside.jpg',
    portfolio: '/images/portfolio-bridal-hd.jpg',
  };
  const fallback = images[type] || images.card;
  return type === 'mall' && index > 0
    ? `/images/mall-${['lakeside', 'forum', 'inorbit', 'nexus', 'galleria', 'sarath'][index % 6]}.jpg`
    : fallback;
}

export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function calculateSessionEnd(startTime, durationHours) {
  const [h, m] = startTime.split(':').map(Number);
  const endH = h + durationHours;
  const endMin = m;
  return `${String(endH).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
}

export function getCountdown(endDateStr) {
  const now = new Date();
  const end = new Date(endDateStr);
  const diff = end - now;
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true };
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { hours, minutes, seconds, expired: false };
}

