import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { formatPrice } from '../lib/utils';
import { ChevronRight, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

// Helper function for conditional classes
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useCart();

  const activeCategory = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        let data: Product[] = await response.json();

        if (activeCategory !== 'All') {
          data = data.filter(p => p.category === activeCategory);
        }

        if (sort === 'price-low') {
          data.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
          data.sort((a, b) => b.price - a.price);
        } else {
          data.sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime());
        }

        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, sort]);

  const categories: (string | 'All')[] = ['All', 'Summer Lawn Collection', 'Summer Printed Lawn', 'Light Summer Unstitched'];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-gray-500 mb-12">
        <Link to="/" className="hover:text-brand-gold">Home</Link>
        <ChevronRight size={12} />
        <span className="text-brand-dark font-bold">Shop</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="lg:w-64 space-y-12 lg:sticky lg:top-32 h-fit">
          <div className="border-b border-gray-100 pb-8">
            <h3 className="text-xs uppercase tracking-[0.4em] font-black mb-8 text-brand-dark">Categories</h3>
            <div className="flex flex-col space-y-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSearchParams({ category: cat })}
                  className={cn(
                    "text-left text-[11px] uppercase tracking-[0.2em] transition-all duration-300 hover:pl-2 hover:text-brand-gold",
                    activeCategory === cat ? "text-brand-gold font-bold pl-2 border-l-2 border-brand-gold" : "text-gray-400"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.4em] font-black mb-8 text-brand-dark">Sort By</h3>
            <select 
              value={sort}
              onChange={(e) => setSearchParams({ ...Object.fromEntries(searchParams), sort: e.target.value })}
              className="w-full bg-transparent border-b border-gray-200 py-3 text-[11px] uppercase tracking-widest focus:outline-none focus:border-brand-gold transition-colors appearance-none"
            >
              <option value="newest">Latest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4 border-b border-gray-50 pb-8">
            <div>
              <h2 className="text-4xl font-serif">
                {activeCategory === 'All' ? 'Signature Shop' : activeCategory}
              </h2>
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mt-2">Showing {products.length} Exquisite Pieces</p>
            </div>
            <button 
              className="lg:hidden flex items-center space-x-2 bg-brand-dark text-white px-6 py-3 text-[10px] uppercase tracking-widest rounded-full"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={14} />
              <span>Refine</span>
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-6">
                  <div className="aspect-[3/4] bg-gray-50 rounded-2xl" />
                  <div className="h-4 bg-gray-50 w-3/4 rounded-full" />
                  <div className="h-4 bg-gray-50 w-1/4 rounded-full" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-32 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <ShoppingBag size={48} strokeWidth={1} className="mx-auto text-gray-200 mb-6" />
              <p className="font-serif text-2xl italic text-gray-400 mb-6">Collection Coming Soon</p>
              <Link to="/shop" onClick={() => setSearchParams({ category: 'All' })} className="inline-block bg-brand-dark text-white px-10 py-4 uppercase text-[10px] tracking-widest font-bold rounded-full">Explore All</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {products.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group"
                >
                  <div className="block relative aspect-[3/4] overflow-hidden bg-gray-50 mb-6 rounded-2xl shadow-sm group-hover:shadow-xl transition-all duration-700">
                    <Link to={`/product/${product.id}`}>
                      <img 
                        src={product.images[0]} 
                        alt={product.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.parentElement!.classList.add('bg-stone-50');
                          target.style.display = 'none';
                        }}
                      />
                    </Link>
                    
                    {!product.images[0] && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <ShoppingBag className="text-brand-gold/20 mb-2" size={32} />
                        <span className="text-[8px] uppercase tracking-widest text-gray-400">Mirha Selection</span>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/5 transition-colors pointer-events-none" />
                    
                    <div className="absolute bottom-6 inset-x-6 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product);
                        }}
                        className="w-full bg-white/90 backdrop-blur-sm text-brand-dark py-4 text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-brand-gold hover:text-white transition-all shadow-xl rounded-xl"
                      >
                        Add to Bag
                      </button>
                    </div>

                    {product.stockStatus === 'Out of Stock' && (
                      <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm text-brand-dark px-4 py-2 text-[8px] uppercase tracking-[0.4em] font-bold rounded-full shadow-lg">
                        Reserved
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 px-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Link to={`/product/${product.id}`} className="block">
                          <h3 className="font-serif text-xl text-gray-900 group-hover:text-brand-gold transition-colors leading-tight">{product.title}</h3>
                        </Link>
                        <p className="text-[9px] text-gray-400 uppercase tracking-[0.3em] font-bold mt-1">{product.category}</p>
                      </div>
                    </div>
                    <p className="text-sm font-black tracking-widest text-brand-dark">{formatPrice(product.price)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}