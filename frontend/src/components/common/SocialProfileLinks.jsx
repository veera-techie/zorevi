import './SocialProfileLinks.css';

const SOCIAL_PLATFORMS = [
  { key: 'instagram', label: 'Instagram', color: '#D9468D' },
  { key: 'youtube', label: 'YouTube', color: '#FF0000' },
];

export function SocialPlatformIcon({ platform, size = 16 }) {
  if (platform === 'instagram') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#D9468D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".8" fill="#D9468D" stroke="none" />
      </svg>
    );
  }
  if (platform === 'youtube') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2" y="5" width="20" height="14" rx="4" fill="#FF0000" />
        <path d="m10 9 5 3-5 3z" fill="#FFFFFF" />
      </svg>
    );
  }
  return null;
}

const safeSocialUrl = (value) => {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value.trim());
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
};

export default function SocialProfileLinks({ accounts = {}, owner = 'Designer', className = '' }) {
  return (
    <div className={`social-profile-links ${className}`.trim()} role="group" aria-label={`${owner} social profiles`}>
      {SOCIAL_PLATFORMS.map(({ key, label, color }) => {
        const href = safeSocialUrl(accounts[key]);
        const icon = <SocialPlatformIcon platform={key} size={18} />;
        const title = href ? `Open ${owner}'s ${label} profile` : `Add a ${label} URL in your profile to enable this link`;
        return href ? (
          <a className="social-profile-links__item" href={href} key={key} target="_blank" rel="noreferrer" aria-label={`Open ${owner}'s ${label} profile`} title={title} style={{ '--social-accent': color }}>
            {icon}
          </a>
        ) : (
          <span className="social-profile-links__item is-disabled" key={key} aria-label={`${label} profile link not added`} title={title} style={{ '--social-accent': color }}>
            {icon}
          </span>
        );
      })}
    </div>
  );
}
