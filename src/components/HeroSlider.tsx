import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface Banner {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  order: number;
}

const DEFAULT_BANNERS: Banner[] = [];

export function HeroSlider() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/banners');
        const data = await response.json();
        setBanners(data.length > 0 ? data : DEFAULT_BANNERS);
      } catch (error) {
        console.error("API error in HeroSlider:", error);
        setBanners(DEFAULT_BANNERS);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (isHovered || banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length, isHovered]);

  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % banners.length);

  if (loading) return <div className="h-[75vh] bg-[#F8F8F8] flex items-center justify-center"><Loader2 className="animate-spin text-brand-gold" /></div>;

   
  if (banners.length === 0) {
    return (
      <section className="relative h-[40vh] bg-stone-50 flex items-center justify-center border-b border-gray-100">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-serif text-brand-dark tracking-tighter">Mirha BY Insaf Cloth House</h1>
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-brand-gold">Collection Awaiting Upload</p>
        </div>
      </section>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <section 
      className="relative h-[65vh] md:h-[85vh] overflow-hidden bg-[#F8F8F8] group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* 1. Image Container */}
          <div className="absolute inset-0 z-0">
            {currentBanner.imageUrl ? (
              <img 
                src={currentBanner.imageUrl} 
                alt={currentBanner.title || 'Brand Banner'}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full bg-stone-200 flex items-center justify-center">
                <h2 className="text-3xl opacity-10 font-serif">MIRHA</h2>
              </div>
            )}
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-black/20" />
          </div>
          
          {/* 2. Content Container - Aligned to Left Side */}
          <div className="relative z-30 h-full flex flex-col justify-center items-start px-10 md:px-20 lg:px-32 max-w-[1440px] mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-left"
            >
              <span className="text-brand-gold text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] block mb-4 drop-shadow-lg">
                {currentBanner.subtitle || 'Mirha BY Insaf Cloth House'}
              </span>
              
              <h1 
                className="text-white text-4xl md:text-7xl font-serif leading-[1.1] mb-8 font-bold tracking-tighter drop-shadow-2xl max-w-2xl"
                dangerouslySetInnerHTML={{ __html: currentBanner.title || 'Exquisite <br /> Elegance' }}
              />

              <div className="flex justify-start">
                <Link 
                  to="/shop" 
                  className="bg-brand-gold text-white px-12 py-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-brand-dark transition-all duration-500 shadow-2xl rounded-full"
                >
                  {currentBanner.buttonText || 'Explore Collections'}
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      {banners.length > 1 && (
        <div className="z-40">
          <button 
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={48} strokeWidth={1} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={48} strokeWidth={1} />
          </button>
        </div>
      )}
    </section>
  );
}