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

  // ✅ FIXED: explicit path (no dynamic string)
  const supportLinks = [
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms of Service', path: '/terms-of-service' },
    { label: 'FAQ', path: '/faq' },
  ];

  return (
    <>
      <style>{fontStyle}</style>

      <footer className="bg-[#FDFAF5] border-t border-[#EAE0D0] pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

            {/* Logo Section */}
            <div className="col-span-1 md:col-span-2 flex flex-col" style={{ gap: "24px", marginTop: "-60px" }}>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => navigate('/')}
              >
                <img
                  src="/alsio.webp"
                  alt="Logo"
                  className="object-contain"
                  style={{ width: "120px", height: "120px", marginLeft: "-40px" }}
                />
                <img
                  src="/Text_Alsio.webp"
                  alt="ALSIO"
                  className="object-contain"
                  style={{ width: "180px", height: "160px", marginLeft: "-75px" }}
                />
              </div>

              <p
                className="text-gray-500 text-sm leading-relaxed max-w-sm"
                style={{ ...POP, fontWeight: 400, marginTop: "-55px" }}
              >
                Maintain your productivity streak and earn bonus XP for completing tasks consistently.
              </p>
            </div>

            {/* Explore */}
            <div className="flex flex-col" style={{ gap: "24px" }}>
              <h4 className="text-sm text-gray-800" style={{ ...PJS, fontWeight: 700 }}>
                Explore
              </h4>

              <ul className="space-y-4">
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

            {/* Support */}
            <div className="flex flex-col" style={{ gap: "24px" }}>
              <h4 className="text-sm text-gray-800" style={{ ...PJS, fontWeight: 700 }}>
                Support
              </h4>

              <ul className="space-y-4">
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

          {/* Bottom */}
          <div className="pt-8 border-t border-[#EAE0D0] flex justify-center items-center">
            <p
              className="text-[12px] text-gray-400 text-center"
              style={{ ...POP, fontWeight: 400 }}
            >
              © {currentYear} ALSIO. All rights reserved.
            </p>
          </div>

        </div>
      </footer>
    </>
  );
};

export default Footer;