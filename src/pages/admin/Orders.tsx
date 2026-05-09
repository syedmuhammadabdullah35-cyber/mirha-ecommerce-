import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Order, OrderStatus } from '../../types';
import { formatPrice } from '../../lib/utils';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Trash2,
  Calendar,
  User,
  Phone,
  MapPin,
  X
} from 'lucide-react';

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Order));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      await updateDoc(doc(db, 'orders', id), { status });
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (error) {
      alert('Failed to update status.');
    }
  };

  const deleteOrder = async (id: string) => {
    if (window.confirm('Delete this order record permanently?')) {
      try {
        await deleteDoc(doc(db, 'orders', id));
        setSelectedOrder(null);
      } catch (error) {
        alert('Failed to delete.');
      }
    }
  };

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-serif">Customer Orders</h2>
        <div className="flex bg-white rounded-lg p-1 border border-gray-100 shadow-sm">
          {['All', 'Pending', 'Shipped', 'Delivered'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as any)}
              className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold transition-all rounded ${
                filter === s ? 'bg-brand-gold text-white shadow-md' : 'text-gray-400 hover:text-brand-dark'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-500">Order ID</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-500">Customer</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-500">Amount</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-500">Status</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-500">Date</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-500 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 font-mono text-xs text-gray-400">#{order.id.slice(-6).toUpperCase()}</td>
                <td className="px-6 py-4">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold">{order.customerName}</p>
                    <p className="text-[10px] text-gray-400 uppercase">{order.customerPhone}</p>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-sm tracking-tight">{formatPrice(order.totalAmount)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className={`h-2 w-2 rounded-full ${
                      order.status === 'Pending' ? 'bg-orange-400 animate-pulse' :
                      order.status === 'Shipped' ? 'bg-blue-400' : 'bg-green-400'
                    }`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      order.status === 'Pending' ? 'text-orange-600' :
                      order.status === 'Shipped' ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500">
                  {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Just now'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 text-gray-400 hover:text-brand-dark transition-colors"
                  >
                    <ExternalLink size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div className="p-12 text-center text-gray-400 italic">No orders found.</div>
        )}
      </div>

      {/* Detail Overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-end bg-brand-dark/30 backdrop-blur-sm">
          <div className="h-full w-full max-w-xl bg-white shadow-2xl overflow-y-auto flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-2xl font-serif font-bold">Order Details</h3>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">ID: #{selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="p-2 hover:bg-gray-100 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-12">
              {/* Status Update */}
              <div className="space-y-4">
                <p className="text-[10px] uppercase font-bold tracking-widest text-brand-gold">Update Order Status</p>
                <div className="grid grid-cols-3 gap-3">
                  {(['Pending', 'Shipped', 'Delivered'] as OrderStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedOrder.id, s)}
                      className={`py-3 text-[10px] uppercase font-bold tracking-widest border transition-all ${
                        selectedOrder.status === s 
                          ? 'bg-brand-dark text-white border-brand-dark' 
                          : 'bg-white text-gray-500 border-gray-200 hover:border-brand-gold'
                      }`}
                    >
                      {s === 'Pending' && <Clock size={12} className="inline mr-2" />}
                      {s === 'Shipped' && <Truck size={12} className="inline mr-2" />}
                      {s === 'Delivered' && <CheckCircle2 size={12} className="inline mr-2" />}
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-8 py-8 border-y border-gray-50">
                <div className="space-y-4">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-brand-gold">Customer</p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-sm">
                      <User size={16} className="text-gray-300" />
                      <span className="font-bold">{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <Phone size={16} className="text-gray-300" />
                      <span>{selectedOrder.customerPhone}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-brand-gold">Shipping Address</p>
                  <div className="flex items-start space-x-3 text-sm text-gray-600">
                    <MapPin size={16} className="text-gray-300 mt-1 flex-shrink-0" />
                    <p className="leading-relaxed">{selectedOrder.customerAddress}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-6">
                <p className="text-[10px] uppercase font-bold tracking-widest text-brand-gold">Order Items</p>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex space-x-4 items-center">
                      <img src={item.image} alt="" className="h-16 w-12 object-cover rounded bg-gray-50" />
                      <div className="flex-1">
                        <h4 className="text-sm font-bold truncate">{item.title}</h4>
                        <p className="text-xs text-gray-400">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                      <p className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-gray-50 flex justify-between items-center font-bold text-xl tracking-tighter">
                  <span>Total Bill</span>
                  <span className="text-brand-gold">{formatPrice(selectedOrder.totalAmount)}</span>
                </div>
                <p className="text-[10px] text-gray-400 italic text-center">Payment Method: Cash on Delivery</p>
              </div>

              {/* Dangerous Area */}
              <div className="pt-12">
                <button 
                  onClick={() => deleteOrder(selectedOrder.id)}
                  className="w-full py-4 border border-red-100 text-red-500 text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-red-50 transition-all rounded-lg flex items-center justify-center space-x-2"
                >
                  <Trash2 size={14} />
                  <span>Archive Order permanently</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
