import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  LogOut, 
  Home,
  User,
  ChevronRight
} from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '../lib/utils';

export function AdminLayout() {
  const { user, isAdmin, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading || !user || !isAdmin) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-primary">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
    </div>
  );

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Banners', path: '/admin/banners', icon: Home },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-brand-dark text-white flex flex-col fixed inset-y-0 z-50">
        <div className="p-8 border-b border-white/10">
          <Link to="/" className="flex flex-col">
            <span className="text-xl font-serif text-white tracking-tighter uppercase font-bold">
              Mirha Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-4 px-4 py-4 rounded-lg transition-all text-sm font-medium",
                location.pathname === item.path 
                  ? "bg-brand-gold text-white" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10 space-y-4">
          <div className="flex items-center space-x-3 px-4">
            <div className="h-8 w-8 rounded-full bg-brand-gold flex items-center justify-center text-xs font-bold">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{user.displayName || 'Admin'}</p>
              <p className="text-[10px] text-white/40 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center space-x-4 px-4 py-3 text-white/60 hover:text-brand-accent transition-colors text-sm font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-12">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest text-gray-400">
            <span>Admin</span>
            <ChevronRight size={12} />
            <span className="text-brand-dark">{menuItems.find(m => m.path === location.pathname)?.name || 'Control Panel'}</span>
          </div>
          <Link to="/" className="flex items-center space-x-2 text-xs uppercase font-bold tracking-widest text-brand-gold hover:underline">
            <Home size={14} />
            <span>View Storefront</span>
          </Link>
        </header>
        
        <Outlet />
      </main>
    </div>
  );
}
