import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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

  const handleNavClick = (id) => {
    const elementId = id.toLowerCase();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const supportLinks = [
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms of Service', path: '/terms-of-service' },
    { label: 'FAQ', path: '/faq' },
  ];

  return (
    <>
      <style>{fontStyle}</style>

      <footer className="bg-[#FDFAF5] border-t border-[#EAE0D0] pt-12 md:pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Grid Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12">

            {/* Logo Section - Responsive Alignment */}
            <div className="col-span-1 sm:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
              <div
                className="flex items-center cursor-pointer mb-2 md:mb-0"
                onClick={() => navigate('/')}
                style={{ marginLeft: "-20px" }} // Menyeimbangkan whitespace logo
              >
                <img
                  src="/alsio.webp"
                  alt="Logo"
                  className="object-contain w-[80px] h-[80px] md:w-[120px] md:h-[120px]"
                />
                <img
                  src="/Text_Alsio.webp"
                  alt="ALSIO"
                  className="object-contain w-[120px] h-[100px] md:w-[180px] md:h-[160px]"
                  style={{ marginLeft: "-45px" }} // Responsif margin untuk teks logo
                />
              </div>

              <p
                className="text-gray-500 text-sm leading-relaxed max-w-sm md:mt-[-40px]"
                style={{ ...POP, fontWeight: 400 }}
              >
                Maintain your productivity streak and earn bonus XP for completing tasks consistently.
              </p>
            </div>

            {/* Explore - Grid Layout */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
              <h4 className="text-sm text-gray-800 uppercase tracking-widest" style={{ ...PJS, fontWeight: 800 }}>
                Explore
              </h4>
              <ul className="space-y-3">
                {['About', 'Features', 'Contact'].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => handleNavClick(item)}
                      className="text-sm text-gray-500 hover:text-[#C17A3A] transition-colors bg-transparent border-none cursor-pointer p-0"
                      style={{ ...POP, fontWeight: 400 }}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support - Grid Layout */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
              <h4 className="text-sm text-gray-800 uppercase tracking-widest" style={{ ...PJS, fontWeight: 800 }}>
                Support
              </h4>
              <ul className="space-y-3">
                {supportLinks.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-sm text-gray-500 hover:text-[#C17A3A] transition-colors"
                      style={{ ...POP, fontWeight: 400 }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 border-t border-[#EAE0D0] flex flex-col md:flex-row justify-center items-center gap-4">
            <p
              className="text-[11px] md:text-[12px] text-gray-400 text-center"
              style={{ ...POP, fontWeight: 400 }}
            >
              © {currentYear} ALSIO — Level Up Your Productivity.
            </p>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;