import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import bannersData from "../../data/banners.json";

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
    if (bannersData && bannersData.length > 0) {
      setBanners(bannersData);
    } else {
      setBanners(DEFAULT_BANNERS);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (isHovered || banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length, isHovered]);

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % banners.length);

  if (loading) {
    return (
      <div className="h-[75vh] bg-[#F8F8F8] flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-gold" />
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <section className="relative h-[40vh] bg-stone-50 flex items-center justify-center border-b border-gray-100">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-serif text-brand-dark tracking-tighter">
            Mirha BY Insaf Cloth House
          </h1>

          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-brand-gold">
            Collection Awaiting Upload
          </p>
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
          {/* IMAGE */}
          <div className="absolute inset-0 z-0">
            <img
              src={currentBanner.imageUrl}
              alt={currentBanner.title || "Banner"}
             className="w-full h-full object-contain bg-[#f3f3f3]"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/25" />
          </div>

          {/* TEXT */}
          <div className="relative z-30 h-full flex flex-col justify-center items-start px-10 md:px-20 lg:px-32">
            
            {/* SMALL TEXT */}
            <span className="text-white text-sm md:text-lg font-semibold uppercase tracking-[0.4em] mb-4 drop-shadow-lg">
              {currentBanner.subtitle || "UNSTITCHED"}
            </span>

            {/* BIG TITLE */}
            <h1
              className="text-white text-4xl md:text-7xl font-serif leading-[1.1] mb-8 font-bold tracking-tight drop-shadow-2xl max-w-3xl"
              dangerouslySetInnerHTML={{
                __html:
                  currentBanner.title || "Lawn Collection",
              }}
            />

            {/* BUTTON */}
            <Link
              to="/shop"
              className="bg-brand-gold text-white px-10 py-4 text-xs font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500 rounded-full"
            >
              {currentBanner.buttonText || "Shop Now"}
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* BUTTONS */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-40 text-white"
          >
            <ChevronLeft size={42} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-40 text-white"
          >
            <ChevronRight size={42} />
          </button>
        </>
      )}
    </section>
  );
}
