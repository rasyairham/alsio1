import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&family=Poppins:wght@400;500;600&display=swap');
`;

const PJS = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const POP = { fontFamily: "'Poppins', sans-serif" };

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Data Navigasi yang konsisten untuk Desktop & Mobile
  const authLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/quests", label: "Quest Board" },
    { path: "/analytics", label: "Analytics" },
  ];

  const publicLinks = ["home", "about", "feature", "contact"];

  const loadUserData = () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const savedImage = localStorage.getItem("userImage");
    if (token && username) {
      setIsLogin(true);
      setUser(username);
      setUserImage(savedImage && savedImage !== "null" && savedImage !== "undefined" ? savedImage : null);
    } else {
      setIsLogin(false);
      setUser("");
      setUserImage(null);
    }
  };

  useEffect(() => { loadUserData(); }, [location.pathname]);

  useEffect(() => {
    window.addEventListener("storage", loadUserData);
    return () => window.removeEventListener("storage", loadUserData);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLogin(false);
    setShowDropdown(false);
    window.location.href = "/";
  };

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "A");

  return (
    <>
      <style>{fontStyle}</style>
      <nav
        className="fixed left-1/2 -translate-x-1/2 z-[60] bg-white/90 backdrop-blur-md text-black border border-black/10 shadow-2xl flex items-center transition-all duration-300"
        style={{ 
          width: "95%", 
          maxWidth: "1163px", 
          height: "70px", 
          padding: "0 20px", 
          borderRadius: "42px", 
          top: "20px" 
        }}
      >
        <div className="w-full flex justify-between items-center relative">

          {/* Logo Section */}
          <div
            className="flex items-center cursor-pointer group z-50"
            onClick={() => (isLogin ? navigate("/dashboard") : navigate("/"))}
          >
            <img
              src="/alsio.webp"
              alt="Logo"
              className="object-contain transition-transform group-hover:scale-105 w-[50px] h-[60px] sm:w-[64px] sm:h-[78px]"
            />
            <img
              src="/Text_Alsio.webp"
              alt="ALSIO"
              className="object-contain transition-transform group-hover:scale-105 w-[90px] h-[90px] sm:w-[118px] sm:h-[118px] ml-[-35px] sm:ml-[-50px] mt-1"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex flex-1 justify-center gap-2 xl:gap-4">
            {isLogin ? (
              authLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-xs xl:text-sm transition-colors ${isActive ? "text-black" : "text-black/60 hover:text-black"}`
                  }
                  style={({ isActive }) => ({
                    ...(isActive ? PJS : POP),
                    fontWeight: isActive ? 700 : 500,
                    borderRadius: isActive ? "42px" : "0px",
                    backgroundColor: isActive ? "#E0DCDC" : "transparent",
                    boxShadow: isActive ? "0 2px 10px rgba(0,0,0,0.15)" : "none",
                    padding: "6px 14px",
                  })}
                >
                  {link.label}
                </NavLink>
              ))
            ) : (
              publicLinks.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    scrollToSection(item);
                    setActiveItem(item);
                  }}
                  className="text-xs xl:text-sm capitalize opacity-70 hover:opacity-100 transition-all"
                  style={{
                    ...POP,
                    fontWeight: 500,
                    borderRadius: activeItem === item ? "42px" : "0px",
                    backgroundColor: activeItem === item ? "#E0DCDC" : "transparent",
                    boxShadow: activeItem === item ? "0 2px 10px rgba(0,0,0,0.15)" : "none",
                    padding: "6px 14px",
                  }}
                >
                  {item}
                </button>
              ))
            )}
          </div>

          {/* Right Section */}
          <div className="flex gap-2 items-center z-50">
            {!isLogin ? (
              <div className="hidden sm:flex gap-2">
                <NavLink
                  to="/login"
                  className="px-4 py-2 rounded-xl hover:bg-black/5 text-sm transition-all"
                  style={{ ...POP, fontWeight: 500 }}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-5 py-2 text-sm text-white transition-all rounded-[42px]"
                  style={{ ...PJS, fontWeight: 700, backgroundColor: "#946C44", boxShadow: "0 4px 15px #946C4444" }}
                >
                  Sign Up
                </NavLink>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border border-black/20 overflow-hidden bg-gray-100">
                    {userImage ? (
                      <img src={userImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-white bg-black w-full h-full flex items-center justify-center font-black" style={PJS}>
                        {getInitial(user)}
                      </span>
                    )}
                  </div>
                  <span className="text-sm hidden md:block truncate max-w-[80px]" style={{ ...POP, fontWeight: 600 }}>
                    {user}
                  </span>
                  <i className={`ri-arrow-down-s-line text-lg sm:text-xl transition-transform ${showDropdown ? "rotate-180" : ""}`}></i>
                </div>

                {showDropdown && (
                  <div className="absolute right-0 mt-4 w-52 bg-white border border-black/10 rounded-2xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-black/5 mb-1">
                      <p className="text-sm text-black truncate font-bold" style={PJS}>Hi, {user}</p>
                      <p className="text-[10px] text-black/40 mt-0.5" style={POP}>Quest Beginner</p>
                    </div>
                    <button onClick={() => { navigate("/profile"); setShowDropdown(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-black/60 hover:bg-black/5 transition-all" style={POP}>
                      <UserIcon size={16} /> Profile
                    </button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-all" style={POP}>
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Hamburger Button */}
            <button 
              className="lg:hidden p-2 hover:bg-black/5 rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Overlay Menu - FIXED LOGIC */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-[80px] left-0 right-0 bg-white border border-black/10 rounded-[32px] shadow-2xl p-6 animate-in zoom-in-95 duration-200">
              <div className="flex flex-col gap-4 text-center">
                {isLogin ? (
                  authLinks.map((link) => (
                    <NavLink 
                      key={link.path} 
                      to={link.path} 
                      className={({ isActive }) => 
                        `py-3 text-lg font-bold border-b border-black/5 transition-colors ${isActive ? "text-black bg-black/5 rounded-xl" : "text-black/60"}`
                      }
                      style={PJS}
                    >
                      {link.label}
                    </NavLink>
                  ))
                ) : (
                  <>
                    {publicLinks.map((item) => (
                      <button key={item} onClick={() => scrollToSection(item)} className="py-3 text-lg capitalize font-medium border-b border-black/5" style={POP}>
                        {item}
                      </button>
                    ))}
                    <div className="flex flex-col gap-3 pt-4">
                      <NavLink to="/login" className="py-3 rounded-2xl bg-black/5 font-bold" style={PJS}>Login</NavLink>
                      <NavLink to="/register" className="py-3 rounded-2xl bg-[#946C44] text-white font-bold shadow-lg" style={PJS}>Sign Up</NavLink>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </nav>
    </>
  );
};

export default Navbar;