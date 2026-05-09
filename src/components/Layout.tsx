import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export function Layout() {
  const whatsappNumber = "+923001234567";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hello Mirha, I'm interested in your collections.`;

  return (
    <div className="min-h-screen flex flex-col bg-brand-primary selection:bg-brand-gold/20 selection:text-brand-dark">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />

      {/* Floating WhatsApp Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-[#128C7E] transition-colors"
        title="Order on WhatsApp"
      >
        <MessageCircle size={28} />
      </motion.a>
    </div>
  );
}
