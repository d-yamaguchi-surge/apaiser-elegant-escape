import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Newspaper, 
  Calendar, 
  Image, 
  LogOut,
  CalendarX,
  UtensilsCrossed
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import logo from '@/assets/apaiser_logo.svg';

const navigation = [
  { name: 'ダッシュボード', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'お知らせ', href: '/admin/news', icon: Newspaper },
  { name: '予約管理', href: '/admin/reservations', icon: Calendar },
  { name: 'コース管理', href: '/admin/courses', icon: UtensilsCrossed },
  { name: '営業日管理', href: '/admin/business-days', icon: CalendarX },
  { name: 'ギャラリー', href: '/admin/gallery', icon: Image },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <div className="w-64 bg-card border-r border-border">
      <div className="p-6 flex justify-center">
        <img 
          src={logo} 
          alt="apaiser logo" 
          className="h-16 w-auto object-contain"
        />
      </div>
      
      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-64 p-4 border-t border-border">
        <Button
          onClick={signOut}
          variant="outline"
          className="w-full justify-start gap-3"
        >
          <LogOut className="w-4 h-4" />
          ログアウト
        </Button>
      </div>
    </div>
  );
};