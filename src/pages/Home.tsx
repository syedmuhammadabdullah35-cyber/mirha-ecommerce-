import { Link } from 'react-router-dom';
import { Star, ShoppingBag, ShieldCheck, Truck, Instagram } from 'lucide-react';
import { motion } from 'motion/react';
import { HeroSlider } from '../components/HeroSlider';

export function Home() {
  const categories = [
    { 
      name: 'LAWN COLLECTION', 
      image: '/uploads/1778086272691-433356014-dalni.jpeg' 
    },
    { 
      name: 'SUMMER LAWN COLLECTION', 
      image: '/uploads/1778086515922-618025471-dalni-2.jpg' 
    },
    { 
     name: 'UNSTITCHED COLLECTION', 
     image: 'https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=1000&auto=format&fit=crop' 
     },
  ];

  
  const instagramPosts = [
    { img: "/uploads/insta.webp" },
    { img: "/uploads/insta1.webp" },
    { img: "/uploads/insta 2.jfif" },
    { img: "/uploads/insta3.webp" },
    { img: "/uploads/insta 4.webp" },
    { img: "/uploads/insta 5.jfif" },
  ];

  return (
    <div className="bg-white">
      <HeroSlider />

      {/* Trust Badges */}
      <section className="py-8 border-b border-stone-100 bg-stone-50/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Truck size={20}/>, text: "Fast Delivery" },
            { icon: <ShieldCheck size={20}/>, text: "Secure Payment" },
            { icon: <Star size={20}/>, text: "Premium Quality" },
            { icon: <ShoppingBag size={20}/>, text: "Easy Returns" }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-center gap-3 text-brand-dark/60">
              <span className="text-brand-gold">{item.icon}</span>
              <span className="text-[10px] uppercase tracking-widest font-bold">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Boutique Categories */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 py-16">
        <div className="text-center mb-10 px-4">
          <h2 className="text-xl md:text-3xl font-serif mb-2 tracking-tight">Discover <span className="italic text-brand-gold">Lawn</span> Series</h2>
          <div className="w-10 h-[1px] bg-brand-gold/30 mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat, idx) => (
            <motion.div 
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group text-center"
            >
              <Link to={`/shop?category=${encodeURIComponent(cat.name)}`}>
                <div className="aspect-[4/5] overflow-hidden mb-4 relative rounded-md shadow-sm group-hover:shadow-md transition-all duration-500 bg-stone-50 flex items-center justify-center">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                </div>
                <h3 className="text-xs font-serif font-bold uppercase tracking-widest group-hover:text-brand-gold transition-colors">{cat.name}</h3>
                <span className="text-[7px] uppercase tracking-[0.4em] text-gray-400 mt-1 block">View Series</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Brand Conversion Banner */}
      <section className="bg-brand-dark py-24 md:py-32 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 border border-brand-gold/20 py-16 md:py-24 rounded-sm">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="space-y-8"
          >
            <h2 className="text-white text-3xl md:text-5xl font-serif leading-tight font-medium">
              Where <span className="text-brand-gold italic">Heritage</span> Meets <br />
              Digital <span className="text-brand-gold italic">Perfection</span>
            </h2>
            <div className="w-16 h-[1px] bg-brand-gold mx-auto" />
            <p className="text-brand-gold/80 text-sm md:text-xl max-w-2xl mx-auto font-serif italic leading-relaxed tracking-wide mt-4">
              "Experience the fusion of traditional craftsmanship and modern aesthetics. Mirha : Your signature of timeless Pakistani grace."
            </p>
            <div className="pt-6">
              <Link 
                to="/shop" 
                className="inline-block border border-brand-gold text-brand-gold px-12 py-4 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-brand-gold hover:text-white transition-all duration-700 shadow-xl"
              >
                Start Shopping Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Instagram Feed Section - Fixed Layout */}
      <section className="pb-24 px-4 overflow-hidden pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-serif font-bold italic text-brand-dark">Social <span className="font-normal not-italic">& Moments</span></h2>
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mt-2">Tag us @MirhaBoutique to be featured</p>
            </div>
            <a href="https://www.instagram.com/mirha_by_insaf_cloth_house/" target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-[0.4em] font-black border-b border-brand-dark pb-1 hover:text-brand-gold hover:border-brand-gold transition-all">
              Follow us on Instagram
            </a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
            {instagramPosts.map((post, idx) => (
              <motion.a 
                key={idx} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                href="https://www.instagram.com/mirha_by_insaf_cloth_house/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="aspect-[4/5] relative group overflow-hidden rounded-md bg-stone-100 shadow-sm border border-gray-100 block"
              >
                <img 
                  src={post.img} 
                  alt={`Instagram post ${idx + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1589410313150-f86a9bc2985f?q=80&w=800&auto=format&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px]">
                  <Instagram className="text-white mb-2" size={24} strokeWidth={1.5} />
                  <span className="text-white text-[10px] uppercase tracking-widest font-bold">View Post</span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}