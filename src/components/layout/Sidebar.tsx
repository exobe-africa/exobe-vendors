'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  FolderOpen, 
  ShoppingCart, 
  BarChart3, 
  Tag,
  Settings,
  Bell,
  Store
} from 'lucide-react';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/dashboard/products', icon: Package },
  { name: 'Collections', href: '/dashboard/collections', icon: FolderOpen },
  { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
  { name: 'Discounts', href: '/dashboard/discounts', icon: Tag },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, fetchMe, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) fetchMe();
  }, [isAuthenticated, fetchMe]);

  return (
    <div className="flex flex-col w-64 bg-gray-900 h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-800">
        <Store className="w-8 h-8 text-red-500" />
        <div>
          <h1 className="text-xl font-bold text-white">eXobe</h1>
          <p className="text-xs text-gray-400">Vendor Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-red-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold">
            {user?.name?.[0]?.toUpperCase() || 'V'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'Vendor User'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email || '—'}</p>
            {user?.role && (
              <p className="text-xs text-gray-400 truncate mt-0.5">Role: {user.role}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

