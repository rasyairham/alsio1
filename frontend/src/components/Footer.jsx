import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&family=Poppins:wght@400;500;600&display=swap');
`;

const PJS = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const POP = { fontFamily: "'Poppins', sans-serif" };

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const location = useLocation();

  // Fungsi untuk handle scroll halus
  const handleNavClick = (id) => {
    const elementId = id.toLowerCase();
    
    // Jika user sedang tidak di Home page, pindah ke Home dulu baru scroll
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // Jika sudah di Home, langsung scroll
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Jika ID tidak ditemukan (misal Home), scroll ke paling atas
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <style>{fontStyle}</style>
      <footer className="bg-[#FDFAF5] border-t border-[#EAE0D0] pt-16 pb-8 px-6 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <img
                  src="/alsio.webp"
                  alt="ALSio Logo"
                  className="w-12 h-12 object-contain drop-shadow-sm"
                />
                <span className="text-2xl tracking-tighter italic text-[#C17A3A]" style={{ ...PJS, fontWeight: 900 }}>
                  ALSIO
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm" style={{ ...POP, fontWeight: 400 }}>
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

            {/* Explore Links - Menggunakan Button/Anchor untuk Scroll */}
            <div className="space-y-6">
              <h4 className="text-[11px] text-gray-400 uppercase tracking-widest" style={{ ...PJS, fontWeight: 900 }}>Explore</h4>
              <ul className="space-y-4">
                {['Home', 'About', 'Features', 'Contact'].map((item) => (
                  <li key={item}>
                    <button 
                      onClick={() => handleNavClick(item)}
                      className="text-sm text-gray-600 hover:text-[#C17A3A] transition-colors bg-transparent border-none cursor-pointer p-0" 
                      style={{ ...POP, fontWeight: 500 }}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div className="space-y-6">
              <h4 className="text-[11px] text-gray-400 uppercase tracking-widest" style={{ ...PJS, fontWeight: 900 }}>Support</h4>
              <ul className="space-y-4">
                {['Privacy Policy', 'Terms of Service', 'FAQ', 'Help Center'].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => navigate(`/${item.toLowerCase().replace(/ /g, '-')}`)}
                      className="text-sm text-gray-600 hover:text-[#C17A3A] transition-colors bg-transparent border-none cursor-pointer p-0 text-left"
                      style={{ ...POP, fontWeight: 500 }}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-[#EAE0D0] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[12px] text-gray-400 text-center" style={{ ...POP, fontWeight: 500 }}>
              © {currentYear} <span className="text-[#C17A3A]" style={{ ...PJS, fontWeight: 700 }}>ALSIO</span>. Built for Productivity Champions.
            </p>
            <div className="flex gap-6 items-center">
              <span className="text-[10px] text-gray-300 uppercase tracking-widest" style={{ ...PJS, fontWeight: 700 }}>Cimahi, Indonesia</span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;