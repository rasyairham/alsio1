import React from 'react';
import { Link } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FDFAF5] border-t border-[#EAE0D0] pt-16 pb-8 px-6 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              {/* Menggunakan alsio.webp dari folder public */}
              <img 
                src="/alsio.webp" 
                alt="ALSio Logo" 
                className="w-12 h-12 object-contain drop-shadow-sm" 
              />
              <span className="text-2xl font-black text-[#C17A3A] tracking-tighter italic">
                ALSIO
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Level up your productivity. Turn your daily assignments into exciting RPG quests and maintain your streak to earn bonus XP.
            </p>
            <div className="flex gap-4">
              {['ri-instagram-line', 'ri-twitter-x-line', 'ri-github-line', 'ri-discord-line'].map((icon, index) => (
                <a key={index} href="#" className="w-9 h-9 rounded-full bg-[#F5F0E8] flex items-center justify-center text-[#C17A3A] hover:bg-[#C17A3A] hover:text-white transition-all shadow-sm">
                  <i className={icon}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Explore Links */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Explore</h4>
            <ul className="space-y-4">
              {['Home', 'About', 'Features', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-sm text-gray-600 hover:text-[#C17A3A] transition-colors font-medium">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Support</h4>
            <ul className="space-y-4">
              {['Privacy Policy', 'Terms of Service', 'FAQ', 'Help Center'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase().replace(/ /g, '-')}`} 
                    className="text-sm text-gray-600 hover:text-[#C17A3A] transition-colors font-medium"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#EAE0D0] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[12px] text-gray-400 font-medium text-center">
            © {currentYear} <span className="text-[#C17A3A]">ALSIO</span>. Built for Productivity Champions.
          </p>
          <div className="flex gap-6 items-center">
             <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Cimahi, Indonesia</span>
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;