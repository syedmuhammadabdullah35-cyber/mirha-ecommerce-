import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CheckCircle2, ChevronLeft, Loader2 } from 'lucide-react';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  address: z.string().min(10, 'Please provide a full delivery address'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema)
  });

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const orderData = {
        customerName: data.name,
        customerPhone: data.phone,
        customerAddress: data.address,
        customerEmail: data.email || null,
        items,
        totalAmount: totalPrice,
        status: 'Pending',
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      setOrderId(docRef.id);
      setSuccess(true);
      clearCart();
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again or contact us on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-32 text-center">
        <div className="flex justify-center mb-8">
          <div className="bg-green-100 p-6 rounded-full">
            <CheckCircle2 className="text-green-600" size={64} />
          </div>
        </div>
        <h2 className="text-4xl font-serif mb-4">Order Confirmed!</h2>
        <p className="text-gray-500 mb-8">Thank you for shopping with Mirha. Your order <span className="font-bold text-brand-dark">#{orderId.slice(-6).toUpperCase()}</span> has been placed successfully.</p>
        <p className="text-sm text-gray-400 mb-12">Our team will contact you shortly on {getValues('phone')} for confirmation before shipping.</p>
        <div className="flex flex-col space-y-4">
          <Link to="/" className="bg-brand-dark text-white px-12 py-5 uppercase tracking-widest text-xs font-bold hover:bg-brand-gold transition-all">
            Back to Home
          </Link>
          <a 
            href={`https://wa.me/9232147777795?text=Hello, I just placed order #${orderId}. Please confirm it.`}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-brand-gold text-brand-gold px-12 py-5 uppercase tracking-widest text-xs font-bold hover:bg-brand-gold hover:text-white transition-all text-center"
          >
            Confirm on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <Link to="/cart" className="flex items-center space-x-2 text-xs uppercase tracking-widest hover:text-brand-gold mb-12">
        <ChevronLeft size={16} />
        <span>Return to Bag</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Form */}
        <div>
          <h2 className="text-3xl font-serif mb-8">Delivery Information</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Full Name</label>
              <input 
                {...register('name')}
                placeholder="Enter your full name"
                className="w-full bg-white border border-brand-gold/20 p-4 font-sans text-sm focus:outline-none focus:border-brand-gold"
              />
              {errors.name && <p className="text-xs text-brand-accent">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Phone Number</label>
                <input 
                  {...register('phone')}
                  placeholder="e.g. 03001234567"
                  className="w-full bg-white border border-brand-gold/20 p-4 font-sans text-sm focus:outline-none focus:border-brand-gold"
                />
                {errors.phone && <p className="text-xs text-brand-accent">{errors.phone.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Email (Optional)</label>
                <input 
                  {...register('email')}
                  placeholder="you@example.com"
                  className="w-full bg-white border border-brand-gold/20 p-4 font-sans text-sm focus:outline-none focus:border-brand-gold"
                />
                {errors.email && <p className="text-xs text-brand-accent">{errors.email.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Full Address</label>
              <textarea 
                {...register('address')}
                placeholder="Apartment, Street, Area, City"
                rows={3}
                className="w-full bg-white border border-brand-gold/20 p-4 font-sans text-sm focus:outline-none focus:border-brand-gold resize-none"
              />
              {errors.address && <p className="text-xs text-brand-accent">{errors.address.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading || items.length === 0}
              className="w-full bg-brand-dark text-white py-5 uppercase tracking-widest text-xs font-bold hover:bg-brand-gold transition-all flex items-center justify-center space-x-3 disabled:bg-gray-300"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <span>Complete Order - {formatPrice(totalPrice)}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <aside>
          <div className="bg-white p-8 border border-brand-gold/20">
            <h3 className="font-serif font-bold text-xl mb-8 uppercase tracking-widest text-sm">Review Your Order</h3>
            <div className="space-y-6 max-h-96 overflow-y-auto mb-8 pr-2">
              {items.map((item) => (
                <div key={item.productId} className="flex space-x-4">
                  <img src={item.image} alt={item.title} className="w-16 h-20 object-cover bg-gray-50" />
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-bold truncate max-w-[200px]">{item.title}</h4>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-brand-gold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-4 pt-8 border-t border-brand-gold/10">
              <div className="flex justify-between text-sm font-bold">
                <span>Total Amount to Pay</span>
                <span className="text-xl tracking-tighter">{formatPrice(totalPrice)}</span>
              </div>
              <div className="bg-brand-primary p-4 rounded text-xs text-brand-gold flex items-start space-x-3">
                <div className="mt-0.5">ℹ️</div>
                <p>We currently accept **Cash on Delivery** only. Payment will be collected by the courier upon delivery.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
