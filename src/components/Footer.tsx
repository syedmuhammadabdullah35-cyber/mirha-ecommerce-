import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-12">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-16">
          
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="inline-block group">
              <div className="flex items-center gap-4">
                <img 
                  src="/mirha-logo.png" 
                  alt="Mirha Logo" 
                  className="h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="flex flex-col items-start leading-none border-l border-gray-200 pl-4">
                  <span className="text-xl md:text-2xl font-serif text-[#C5A059] tracking-widest uppercase font-black">
                    Mirha
                  </span>
                  <span className="text-[7px] md:text-[8px] text-gray-500 uppercase tracking-[0.2em] font-bold mt-1">
                    By Insaf Cloth House
                  </span>
                </div>
              </div>
            </Link>

            <p className="text-[11px] text-gray-400 leading-loose uppercase tracking-[0.2em] max-w-xs font-medium">
              Curating thousands of digital printed pieces and unstitched lawn collections for the modern Pakistani woman since 2018.
            </p>

            <div className="flex space-x-6">
              <a href="https://www.instagram.com/mirha_by_insaf_cloth_house/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#C5A059] transition-all">
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#C5A059] transition-all">
                <Facebook size={18} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#C5A059] transition-all">
                <Twitter size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Quick Links Group */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-black mb-8 text-gray-900">Shop Collections</h4>
              <ul className="space-y-4 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">
                <li><Link to="/shop?category=Luxury Lawn" className="hover:text-[#C5A059] transition-colors">Luxury Lawn</Link></li>
                <li><Link to="/shop?category=Digital Printed" className="hover:text-[#C5A059] transition-colors">Printed Collection</Link></li>
                <li><Link to="/shop?category=Unstitched" className="hover:text-[#C5A059] transition-colors">Unstitched Series</Link></li>
                <li><Link to="/shop?category=Ready to Wear" className="hover:text-[#C5A059] transition-colors">Ready to Wear</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-black mb-8 text-gray-900">Boutique Care</h4>
              <ul className="space-y-4 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">
                <li><a href="#" className="hover:text-[#C5A059] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#C5A059] transition-colors">Shipping Information</a></li>
                <li><a href="#" className="hover:text-[#C5A059] transition-colors">Exchange & Returns</a></li>
                <li><a href="#" className="hover:text-[#C5A059] transition-colors">Store Locator</a></li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-black mb-8 text-gray-900">Concierge</h4>
              <ul className="space-y-6 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">
                <li className="flex items-center space-x-3">
                  <Phone size={14} strokeWidth={1.5} className="text-[#C5A059] shrink-0" />
                  <span>+923214777795</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail size={14} strokeWidth={1.5} className="text-[#C5A059] shrink-0" />
                  <span className="truncate">insafclothhouse1718@gmail.com</span>
                </li>
                <li className="flex items-start space-x-3">
                  <MapPin size={14} strokeWidth={1.5} className="text-[#C5A059] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">Insaf Cloth House P/S-17,18 Ameen Bazar Azam Cloth Market Lahore.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-50 pt-12 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <p className="text-[9px] text-gray-400 uppercase tracking-[0.4em] font-bold text-center md:text-left">
            © {new Date().getFullYear()} Mirha By Insaf Cloth House. 
            <Link to="/admin" className="ml-2 hover:text-[#C5A059] opacity-30 hover:opacity-100 italic transition-all">Admin Access.</Link>
          </p>
          <div className="flex items-center space-x-8">
            <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-4 opacity-30 grayscale hover:grayscale-0 transition-all" />
            <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" className="h-4 opacity-30 grayscale hover:grayscale-0 transition-all" />
          </div>
        </div>
      </div>
    </footer>
  );
}
