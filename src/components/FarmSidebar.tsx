
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Cloud, 
  Wheat, 
  Microscope, 
  CalendarDays, 
  Users, 
  Settings 
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, active }: SidebarItemProps) => {
  return (
    <Link 
      to={href}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
        active 
          ? 'bg-farm-green text-white' 
          : 'hover:bg-farm-green-light hover:text-farm-green-dark'
      )}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const FarmSidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'DASHBOARD', href: '/dashboard' },
    { icon: Cloud, label: 'WEATHER', href: '/weather' },
    { icon: Wheat, label: 'CROP RECOMMENDATIONS', href: '/crops' },
    { icon: Microscope, label: 'SOIL HEALTH', href: '/soil' },
    { icon: CalendarDays, label: 'FARMING CALENDAR', href: '/calendar' },
    { icon: Users, label: 'COMMUNITY', href: '/community' },
    { icon: Settings, label: 'SETTINGS', href: '/settings' },
  ];

  return (
    <div className="w-60 h-full border-r bg-sidebar">
      {menuItems.map((item) => (
        <SidebarItem 
          key={item.href}
          icon={item.icon}
          label={item.label}
          href={item.href}
          active={pathname === item.href}
        />
      ))}
    </div>
  );
};

export default FarmSidebar;
