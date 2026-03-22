import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const loadUserData = () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const savedImage = localStorage.getItem("userImage");
    
    if (token && username) {
      setIsLogin(true);
      setUser(username);
      if (savedImage && savedImage !== "null" && savedImage !== "undefined") {
        setUserImage(savedImage);
      } else {
        setUserImage(null);
      }
    } else {
      setIsLogin(false);
      setUser("");
      setUserImage(null);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [location.pathname]);

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

  const handleLogout = () => {
    localStorage.clear();
    setIsLogin(false);
    setShowDropdown(false);
    window.location.href = "/";
  };

  const scrollToSection = (id) => {
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
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-[60] bg-black/80 backdrop-blur-md text-white p-4 rounded-2xl border border-white/10 shadow-2xl">
      <div className="container mx-auto flex justify-between items-center px-2">
        
        {/* LOGO & BRAND SECTION */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => (isLogin ? navigate("/dashboard") : navigate("/"))}
        >
          <div className="w-10 h-10 rounded-full ">
            {/* HANYA IMG, Tanpa Span di belakangnya */}
            <img 
              src="/alsio.webp" 
              alt="Logo" 
              className="w-full h-full object-contain rounded-full border border-white/20 shadow-lg group-hover:ring-2 ring-blue-500/50 transition-all" 
              onError={(e) => { 
                e.target.src = "https://ui-avatars.com/api/?name=A&background=2563eb&color=fff"; 
              }} 
            />
          </div>
          <h1 className="text-xl font-black tracking-tighter group-hover:text-blue-400 transition-colors uppercase">
            ALSIO
          </h1>
        </div>

        <div className="flex gap-4 md:gap-6 items-center">
          {!isLogin ? (
            <>
              <div className="hidden md:flex gap-6">
                {["home", "about", "feature", "contact"].map((item) => (
                  <button 
                    key={item}
                    onClick={() => scrollToSection(item)} 
                    className="hover:text-blue-300 transition-colors text-sm font-medium capitalize opacity-70 hover:opacity-100"
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 ml-4 border-l border-white/20 pl-6">
                <NavLink to="/login" className="px-4 py-2 border border-white/20 rounded-xl hover:bg-white/10 text-sm font-medium transition-all active:scale-95">Login</NavLink>
                <NavLink to="/register" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all">Daftar</NavLink>
              </div>
            </>
          ) : (
            <>
              <div className="hidden lg:flex gap-6">
                {[
                  { path: "/dashboard", label: "Dashboard" },
                  { path: "/quests", label: "Quest Board" },
                  { path: "/analytics", label: "Analytics" },
                ].map((link) => (
                  <NavLink 
                    key={link.path}
                    to={link.path} 
                    className={({ isActive }) => 
                      `text-sm transition-colors ${isActive ? "text-blue-400 font-bold" : "text-white/60 hover:text-white"}`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>

              {/* Profile Dropdown */}
              <div className="relative ml-4 border-l border-white/20 pl-6" ref={dropdownRef}>
                <div
                  className="flex items-center gap-3 cursor-pointer group select-none py-1"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center border border-white/20 shadow-lg group-hover:ring-2 ring-blue-500/50 transition-all overflow-hidden relative">
                    {userImage ? (
                      <img src={userImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-black text-white">{getInitial(user)}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold hidden sm:block truncate max-w-[80px]">
                      {user}
                    </span>
                    <i className={`ri-arrow-down-s-line text-xl transition-transform duration-300 ${showDropdown ? "rotate-180 text-blue-400" : "text-white/40"}`}></i>
                  </div>
                </div>

                {showDropdown && (
                  <div className="absolute right-0 mt-4 w-52 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-white/5 mb-1 bg-white/[0.02]">
                      <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Signed in as</p>
                      <p className="text-sm font-bold truncate text-blue-400">{user}</p>
                    </div>

                    <div className="px-2">
                      <button
                        onClick={() => { navigate("/profile"); setShowDropdown(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white rounded-xl transition-all"
                      >
                        <i className="ri-user-settings-line text-blue-400 text-lg"></i>
                        Profile Saya
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <i className="ri-shut-down-line text-lg"></i>
                        Logout System
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;