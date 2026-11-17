import { CheckCircle2, Award, Clock, AlertCircle } from 'lucide-react';
import './Badge.css';

export default function Badge({
  variant = 'default',
  size = 'md',
  icon = true,
  children,
  className = '',
}) {
  const getIcon = () => {
    if (!icon) return null;
    switch (variant) {
      case 'verified':
        return <CheckCircle2 size={size === 'sm' ? 12 : 14} />;
      case 'top-rated':
        return <Award size={size === 'sm' ? 12 : 14} />;
      case 'pending':
        return <Clock size={size === 'sm' ? 12 : 14} />;
      case 'confirmed':
        return <CheckCircle2 size={size === 'sm' ? 12 : 14} />;
      case 'cancelled':
        return <AlertCircle size={size === 'sm' ? 12 : 14} />;
      default:
        return null;
    }
  };

  return (
    <span className={`zorevi-badge zorevi-badge--${variant} zorevi-badge--${size} ${className}`}>
      {getIcon()}
      <span>{children}</span>
    </span>
  );
}

