import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { formatPrice } from '../lib/utils';
import { ShoppingBag, ChevronRight, Truck, ShieldCheck, Heart, Share2, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import ReactMarkdown from 'react-markdown';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        const response = await fetch('/api/products');
        const products: Product[] = await response.json();
        const found = products.find(p => p.id === id);
        if (found) {
          setProduct(found);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-24 animate-pulse h-[80vh] bg-gray-50 mb-12" />;
  if (!product) return <div className="py-24 text-center font-serif text-2xl">Product not found</div>;

  const whatsappUrl = `https://wa.me/9232147777795?text=Hello Mirha, I'm interested in ordering ${product.title} (ID: ${product.id}). Price: ${formatPrice(product.price)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
      <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.4em] text-gray-400 mb-16">
        <Link to="/" className="hover:text-brand-gold transition-colors">Home</Link>
        <ChevronRight size={10} />
        <Link to="/shop" className="hover:text-brand-gold transition-colors text-brand-dark font-black">Collection</Link>
        <ChevronRight size={10} />
        <span className="truncate">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        {/* Image Gallery */}
        <div className="lg:col-span-7 space-y-6">
          <div className="aspect-[3/4] overflow-hidden bg-stone-50 rounded-2xl shadow-sm relative">
            <motion.img
              key={activeImage}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              src={product.images[activeImage]}
              alt={product.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {!product.images[activeImage] && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <ShoppingBag className="text-brand-gold/20 mb-4" size={48} />
                <span className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-black">Image Pending</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`aspect-[3/4] overflow-hidden rounded-xl border transition-all duration-500 ${activeImage === idx ? 'border-brand-gold p-1 shadow-lg' : 'border-gray-100 opacity-50 hover:opacity-100'}`}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover rounded-lg" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-6">
            <span className="text-brand-gold uppercase tracking-[0.4em] text-[10px] font-black">{product.category}</span>
            <h1 className="text-5xl md:text-6xl font-serif leading-tight text-brand-dark">{product.title}</h1>
            <div className="flex items-baseline space-x-4">
              <p className="text-3xl font-black tracking-widest text-brand-dark">{formatPrice(product.price)}</p>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Tax Included</span>
            </div>
          </div>

          <div className="prose prose-sm font-sans text-gray-500 border-y border-gray-50 py-12 leading-loose">
            <ReactMarkdown>{product.description}</ReactMarkdown>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-100 rounded-xl overflow-hidden bg-gray-50/50">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-6 py-4 hover:bg-white transition-colors text-gray-400"
                  >
                    -
                  </button>
                  <span className="px-6 py-4 font-black text-xs text-brand-dark">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-6 py-4 hover:bg-white transition-colors text-gray-400"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => addToCart(product, quantity)}
                  disabled={product.stockStatus === 'Out of Stock'}
                  className="flex-1 bg-brand-dark text-white py-5 uppercase tracking-[0.3em] text-[10px] font-black hover:bg-brand-gold transition-all duration-500 disabled:bg-gray-100 disabled:text-gray-400 rounded-xl shadow-xl hover:shadow-brand-gold/20 flex items-center justify-center space-x-3"
                >
                  <ShoppingBag size={18} strokeWidth={2} />
                  <span>{product.stockStatus === 'In Stock' ? 'Secure to Bag' : 'Collection Reserved'}</span>
                </button>
              </div>
              
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border-2 border-brand-dark text-brand-dark py-5 uppercase tracking-[0.3em] text-[10px] font-black hover:bg-brand-dark hover:text-white transition-all duration-500 flex items-center justify-center space-x-3 rounded-xl"
              >
                <MessageCircle size={18} strokeWidth={2} />
                <span>Order via WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 py-12 border-t border-gray-50">
            <div className="flex items-center space-x-4 group">
              <div className="p-3 bg-gray-50 rounded-full group-hover:bg-brand-gold/10 transition-colors">
                <Truck size={20} strokeWidth={1.5} className="text-brand-gold" />
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-dark">Priority Shipping</h4>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">3-5 Days across Pakistan</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 group">
              <div className="p-3 bg-gray-50 rounded-full group-hover:bg-brand-gold/10 transition-colors">
                <ShieldCheck size={20} strokeWidth={1.5} className="text-brand-gold" />
              </div>
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-dark">Premium Quality</h4>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">Authentic Insaf Cloth Heritage</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-8 pt-8 border-t border-gray-50">
            <button className="flex items-center space-x-2 text-gray-400 hover:text-brand-dark transition-all text-[10px] uppercase tracking-widest font-black">
              <Heart size={16} strokeWidth={1.5} />
              <span>Save</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-400 hover:text-brand-dark transition-all text-[10px] uppercase tracking-widest font-black">
              <Share2 size={16} strokeWidth={1.5} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
