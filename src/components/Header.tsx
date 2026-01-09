import { ChevronLeft, Settings, User } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  showProfile?: boolean;
  onBack?: () => void;
  onProfileClick?: () => void;
  rightElement?: React.ReactNode;
}

export function Header({
  title,
  subtitle,
  showBack = false,
  showProfile = false,
  onBack,
  onProfileClick,
  rightElement
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100 safe-area-top">
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors touch-feedback"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {rightElement}
          {showProfile && (
            <button
              onClick={onProfileClick}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-100 hover:bg-primary-200 transition-colors touch-feedback"
            >
              <User className="w-5 h-5 text-primary-600" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
