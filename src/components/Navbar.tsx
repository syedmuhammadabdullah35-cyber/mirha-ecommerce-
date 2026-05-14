import { Link } from 'react-router-dom';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user } = useAuth();

  // Admin email check
  const isAdminEmail = user?.email === 'insafclothhouse1718@gmail.com';

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-24 md:h-32">
          
          {/* LEFT: Logo Section */}
          <div className="flex items-center flex-1">
            <button className="lg:hidden p-2 mr-4" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link to="/" className="flex items-center gap-6 group">
              {/* Arabic Logo Image */}
              <img 
                src="/clint.png" 
                alt="Mirha Logo" 
                className="h-16 md:h-24 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Golden Text Section */}
              <div className="flex flex-col items-start justify-center border-l-2 border-gray-200 pl-6 leading-tight">
               <span 
                className="text-3xl md:text-5xl font-serif tracking-[0.2em] uppercase font-black"
                style={{ color: '#ad853b' }} 
                  >
                Mirha
              </span>
                <span className="text-[8px] md:text-[12px] text-gray-500 uppercase tracking-[0.2em] font-bold mt-1">
                  By Insaf Cloth House
                </span>
              </div>
            </Link>
          </div>

          {/* RIGHT: User Icons & Signup */}
          <div className="flex items-center justify-end space-x-3 md:space-x-8 flex-1">
            
            {user ? (
              /* User is logged in */
              <Link to={isAdminEmail ? "/admin" : "/"} className="hidden md:flex items-center space-x-2 p-2 hover:text-[#C5A059]">
                <User size={24} strokeWidth={1.5} />
                <span className="text-[11px] uppercase tracking-widest font-bold">
                  {isAdminEmail ? "Admin Panel" : "Profile"}
                </span>
              </Link>
            ) : (
              /* User is not logged in */
              <Link to="/admin" className="hidden md:block text-[11px] uppercase tracking-widest font-bold hover:text-[#C5A059]">
                Signup
              </Link>
            )}

            <Link to="/cart" className="p-2 hover:text-[#C5A059] transition-colors relative group">
              <ShoppingBag size={26} strokeWidth={1.5} />
              <span className="absolute top-1 right-1 bg-black text-white text-[10px] h-5 w-5 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="hidden lg:flex items-center justify-center border-t border-gray-50 py-5 space-x-14">
        <Link to="/" className="text-[12px] uppercase tracking-[0.3em] font-bold text-gray-400 hover:text-black border-b-2 border-transparent hover:border-[#C5A059] pb-1">Home</Link>
        <Link to="/shop" className="text-[12px] uppercase tracking-[0.3em] font-bold text-gray-400 hover:text-black border-b-2 border-transparent hover:border-[#C5A059] pb-1">Shop All</Link>
        <Link to="/shop?category=Summer Lawn Collection" className="text-[12px] uppercase tracking-[0.3em] font-bold text-gray-400 hover:text-black border-b-2 border-transparent hover:border-[#C5A059] pb-1">Summer Lawn</Link>
        <Link to="/shop?category=Summer Printed Lawn" className="text-[12px] uppercase tracking-[0.3em] font-bold text-gray-400 hover:text-black border-b-2 border-transparent hover:border-[#C5A059] pb-1">Printed Lawn</Link>
        <Link to="/shop?category=Light Summer Unstitched" className="text-[12px] uppercase tracking-[0.3em] font-bold text-gray-400 hover:text-black border-b-2 border-transparent hover:border-[#C5A059] pb-1">Unstitched</Link>
      </nav>
    </header>
  );
}
