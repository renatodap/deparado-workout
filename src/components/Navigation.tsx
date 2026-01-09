import { Home, Dumbbell, History, TrendingUp, User } from 'lucide-react';
import { Page } from '../types';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

interface NavItem {
  id: Page;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'home', icon: Home, label: 'Início' },
  { id: 'workout', icon: Dumbbell, label: 'Treino' },
  { id: 'history', icon: History, label: 'Histórico' },
  { id: 'progress', icon: TrendingUp, label: 'Progresso' },
  { id: 'profile', icon: User, label: 'Perfil' }
];

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-200 touch-feedback min-w-[64px] ${
                isActive
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-primary-600' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-primary-600' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default Navigation;
