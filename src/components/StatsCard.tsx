import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  color?: 'primary' | 'accent' | 'green' | 'blue' | 'purple';
  size?: 'sm' | 'md' | 'lg';
}

const colorClasses = {
  primary: {
    bg: 'bg-primary-100',
    icon: 'text-primary-600',
    value: 'text-primary-700'
  },
  accent: {
    bg: 'bg-amber-100',
    icon: 'text-amber-600',
    value: 'text-amber-700'
  },
  green: {
    bg: 'bg-green-100',
    icon: 'text-green-600',
    value: 'text-green-700'
  },
  blue: {
    bg: 'bg-blue-100',
    icon: 'text-blue-600',
    value: 'text-blue-700'
  },
  purple: {
    bg: 'bg-purple-100',
    icon: 'text-purple-600',
    value: 'text-purple-700'
  }
};

export function StatsCard({
  icon: Icon,
  label,
  value,
  subtitle,
  color = 'primary',
  size = 'md'
}: StatsCardProps) {
  const colors = colorClasses[color];

  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const valueSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${sizeClasses[size]} flex items-center gap-4 transition-all hover:shadow-md`}>
      <div className={`${iconSizes[size]} rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-1/2 h-1/2 ${colors.icon}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 truncate">{label}</p>
        <p className={`${valueSizes[size]} font-bold ${colors.value}`}>{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-400 truncate">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

interface MiniStatsProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
}

export function MiniStats({ label, value, icon: Icon }: MiniStatsProps) {
  return (
    <div className="flex flex-col items-center p-3">
      {Icon && <Icon className="w-5 h-5 text-primary-500 mb-1" />}
      <span className="text-xl font-bold text-gray-900">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

export default StatsCard;
