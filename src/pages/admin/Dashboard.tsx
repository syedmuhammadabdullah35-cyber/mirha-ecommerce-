import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Product, Order } from '../../types';
import { formatPrice } from '../../lib/utils';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Products count
    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snap) => {
      setStats(prev => ({ ...prev, totalProducts: snap.size }));
    });

    // Orders stats
    const unsubscribeOrders = onSnapshot(collection(db, 'orders'), (snap) => {
      const orders = snap.docs.map(doc => doc.data() as Order);
      const totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const pending = orders.filter(o => o.status === 'Pending').length;
      
      setStats(prev => ({ 
        ...prev, 
        totalOrders: snap.size,
        totalSales,
        pendingOrders: pending
      }));
    });

    // Recent orders
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5));
    const unsubscribeRecent = onSnapshot(q, (snap) => {
      setRecentOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Order));
      setLoading(false);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
      unsubscribeRecent();
    };
  }, []);

  const statCards = [
    { name: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Active Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-brand-gold', bg: 'bg-brand-primary' },
    { name: 'Gross Revenue', value: formatPrice(stats.totalSales), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'text-brand-accent', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white p-8 border border-gray-100 shadow-sm rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.name}</p>
            <h3 className="text-2xl font-serif font-bold mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-serif font-bold text-xl">Recent Orders</h3>
            <Link to="/admin/orders" className="text-brand-gold text-xs font-bold uppercase tracking-widest hover:underline flex items-center">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.length === 0 ? (
              <div className="p-12 text-center text-gray-400 italic">No orders yet.</div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-500">
                      {order.customerName[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm tracking-tight">{order.customerName}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">{order.customerPhone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{formatPrice(order.totalAmount)}</p>
                    <span className={`text-[8px] px-2 py-0.5 rounded-full uppercase font-bold tracking-widest ${
                      order.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="space-y-8">
          <div className="bg-brand-dark text-white p-8 rounded-xl shadow-xl space-y-6">
            <h3 className="font-serif text-xl italic underline decoration-brand-gold">Pro Tip</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Always update your inventory status! "Out of Stock" labels are automatically applied to the storefront when you toggle them in the products section.
            </p>
            <Link to="/admin/products" className="block w-full bg-brand-gold py-3 text-center text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-brand-dark transition-all">
              Manage Inventory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
