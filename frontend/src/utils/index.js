export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function parseValidDate(dateInput) {
  if (!dateInput) return null;
  if (dateInput instanceof Date) {
    return Number.isNaN(dateInput.getTime()) ? null : dateInput;
  }
  if (typeof dateInput === 'number') {
    const d = new Date(dateInput);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof dateInput === 'string') {
    const trimmed = dateInput.trim();
    if (!trimmed) return null;
    // Parse YYYY-MM-DD in local time so calendar dates never shift across timezones
    const isoDateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
    if (isoDateMatch) {
      const year = Number(isoDateMatch[1]);
      const month = Number(isoDateMatch[2]) - 1;
      const day = Number(isoDateMatch[3]);
      const localDate = new Date(year, month, day);
      return Number.isNaN(localDate.getTime()) ? null : localDate;
    }
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

export function formatDate(dateStr, fallback = '—') {
  const d = parseValidDate(dateStr);
  if (!d) return fallback;
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatTime(timeStr, fallback = '—') {
  if (!timeStr || typeof timeStr !== 'string') return fallback;
  const trimmed = timeStr.trim();
  if (!trimmed) return fallback;
  if (/(am|pm)$/i.test(trimmed)) return trimmed;
  const [h, m = '00'] = trimmed.split(':');
  const hour = parseInt(h, 10);
  if (Number.isNaN(hour)) return trimmed;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export function formatDateTime(dateStr, fallback = '—') {
  const d = parseValidDate(dateStr);
  if (!d) return fallback;
  return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
}

export function formatRelativeTime(dateStr, fallback = '—') {
  const d = parseValidDate(dateStr);
  if (!d) return fallback;
  const now = new Date();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr, fallback);
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
    'Pending Approval': 'warning',
    'Pending Designer Approval': 'warning',
    'Pending Confirmation': 'warning',
    'Accepted': 'success',
    'Awaiting Payment': 'success',
    'Alternative Proposed': 'info',
    'Confirmed': 'success',
    'Upcoming': 'primary',
    'In Session': 'info',
    'Completed': 'completed',
    'Cancelled': 'error',
    'Declined': 'error',
    'Rejected': 'error',
    'Rescheduled': 'warning',
    'Active': 'success',
    'Inactive': 'error',
    'Verified': 'success',
    'Unverified': 'warning',
    'Approved': 'success',
    'Resubmitted': 'info',
  };
  return map[status] || 'info';
}

export function normalizeBookingStatusKey(status) {
  const value = String(status || '').trim().toLowerCase();
  if (['pending approval', 'pending designer approval', 'pending confirmation', 'pending'].includes(value)) {
    return 'pending';
  }
  if (['accepted', 'awaiting payment'].includes(value)) {
    return 'accepted';
  }
  if (value === 'alternative proposed') {
    return 'alternative';
  }
  if (['confirmed', 'upcoming', 'in session', 'rescheduled'].includes(value)) {
    return 'confirmed';
  }
  if (value === 'completed') {
    return 'completed';
  }
  if (['rejected', 'declined'].includes(value)) {
    return 'rejected';
  }
  if (value === 'cancelled') {
    return 'cancelled';
  }
  return 'pending';
}

export function getBookingStatusMeta(status) {
  const key = normalizeBookingStatusKey(status);
  switch (key) {
    case 'pending':
      return { key, label: 'Pending Approval', bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' };
    case 'accepted':
      return {
        key,
        label: status === 'Accepted' ? 'Accepted' : 'Accepted • Awaiting 30% Advance',
        bg: '#ECFDF5',
        color: '#047857',
        border: '#6EE7B7',
      };
    case 'alternative':
      return { key, label: 'Alternative Slot Proposed', bg: '#EFF6FF', color: '#1D4ED8', border: '#93C5FD' };
    case 'confirmed':
      return { key, label: status === 'Rescheduled' ? 'Rescheduled' : 'Confirmed', bg: '#EDE9FE', color: '#6D28D9', border: '#C4B5FD' };
    case 'completed':
      return { key, label: 'Completed', bg: '#EEF2FF', color: '#4338CA', border: '#C7D2FE' };
    case 'rejected':
      return { key, label: status === 'Declined' ? 'Declined' : 'Rejected', bg: '#FEE2E2', color: '#B91C1C', border: '#FCA5A5' };
    case 'cancelled':
      return { key, label: 'Cancelled', bg: '#FEE2E2', color: '#B91C1C', border: '#FCA5A5' };
    default:
      return { key: 'other', label: status || 'Pending Approval', bg: '#F3F4F6', color: '#4B5563', border: '#E5E7EB' };
  }
}

export function isCustomerBooking(booking, user) {
  if (!booking) return false;
  if (!user) return booking.customerId === 'cust-001';
  if (user.id && booking.customerId) {
    return booking.customerId === user.id;
  }
  if (user.email && booking.customerEmail) {
    return booking.customerEmail.toLowerCase() === user.email.toLowerCase();
  }
  return false;
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

