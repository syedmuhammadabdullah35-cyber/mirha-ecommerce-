import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="p-8 bg-brand-primary rounded-full inline-block mb-8">
          <ShoppingBag size={48} className="text-brand-gold/30" />
        </div>
        <h2 className="text-4xl font-serif mb-4">Your bag is empty</h2>
        <p className="text-gray-500 mb-12 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet. Discover our latest collections and find something you love.</p>
        <Link to="/shop" className="inline-block bg-brand-dark text-white px-12 py-5 uppercase tracking-widest text-xs font-bold hover:bg-brand-gold transition-all">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-4xl font-serif mb-12">Shopping Bag <span className="text-sm font-sans text-gray-400 font-normal ml-2">({totalItems} items)</span></h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          {items.map((item) => (
            <div key={item.productId} className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-brand-gold/10">
              <Link to={`/product/${item.productId}`} className="w-32 aspect-[3/4] flex-shrink-0 bg-gray-100 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-grow space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif font-bold text-lg">{item.title}</h3>
                    <p className="text-sm text-brand-gold font-bold">{formatPrice(item.price)}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2 text-gray-400 hover:text-brand-accent transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-brand-gold/20">
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-3 py-2 hover:bg-brand-gold/5 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 py-2 font-bold text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-3 py-2 hover:bg-brand-gold/5 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="text-sm font-bold ml-auto">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="lg:col-span-1">
          <div className="bg-white p-8 border border-brand-gold/20 sticky top-32">
            <h3 className="font-serif font-bold text-xl mb-8 uppercase tracking-widest text-sm">Order Summary</h3>
            <div className="space-y-6 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtital</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest mt-1">Free</span>
              </div>
              <div className="border-t border-brand-gold/10 pt-6 flex justify-between font-bold text-lg tracking-tighter">
                <span>Total</span>
                <span className="text-brand-gold">{formatPrice(totalPrice)}</span>
              </div>
              <p className="text-[10px] text-gray-500 italic">Taxes and shipping calculated at checkout.</p>
              
              <Link 
                to="/checkout" 
                className="block w-full bg-brand-dark text-white text-center py-5 uppercase tracking-widest text-xs font-bold hover:bg-brand-gold transition-all"
              >
                Proceed to Checkout
              </Link>
              
              <Link to="/shop" className="block text-center text-xs uppercase tracking-widest font-bold hover:text-brand-gold transition-colors py-2">
                Continue Shopping
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
