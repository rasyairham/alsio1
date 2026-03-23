import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&family=Poppins:wght@400;500;600&display=swap');
`;

const PJS = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const POP = { fontFamily: "'Poppins', sans-serif" };

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
    <>
      <style>{fontStyle}</style>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-[60] bg-white/80 backdrop-blur-md text-black p-4 rounded-2xl border border-black/10 shadow-2xl">
        <div className="container mx-auto flex justify-between items-center px-2">

          {/* LOGO & BRAND SECTION */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => (isLogin ? navigate("/dashboard") : navigate("/"))}
          >
            <div className="w-10 h-10 rounded-full">
              <img
                src="/alsio.webp"
                alt="Logo"
                className="w-full h-full object-contain rounded-full border border-black/20 shadow-lg group-hover:ring-2 ring-blue-500/50 transition-all"
                onError={(e) => {
                  e.target.src = "https://ui-avatars.com/api/?name=A&background=2563eb&color=fff";
                }}
              />
            </div>
            <h1 className="text-xl tracking-tighter group-hover:text-blue-400 transition-colors uppercase" style={{ ...PJS, fontWeight: 900 }}>
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
                      className="hover:text-blue-300 transition-colors text-sm capitalize opacity-70 hover:opacity-100"
                      style={{ ...POP, fontWeight: 500 }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 ml-4 border-l border-white/20 pl-6">
                  <NavLink
                    to="/login"
                    className="px-4 py-2 border border-white/20 rounded-xl hover:bg-white/10 text-sm transition-all active:scale-95"
                    style={{ ...POP, fontWeight: 500 }}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="px-4 py-2 rounded-xl text-sm active:scale-95 transition-all text-white"
                    style={{ ...PJS, fontWeight: 700, backgroundColor: "#C17A3A", boxShadow: "0 4px 15px #C17A3A44" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#a8672e")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C17A3A")}
                  >
                    Daftar
                  </NavLink>
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
                        `text-sm transition-colors ${isActive ? "text-black-400" : "text-black/60 hover:text-black"}`
                      }
                      style={({ isActive }) => (isActive ? { ...PJS, fontWeight: 700 } : { ...POP, fontWeight: 500 })}
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
                    <div className="w-9 h-9 rounded-full flex items-center justify-center border border-black/20 shadow-lg group-hover:ring-2 ring-black-500/50 transition-all overflow-hidden">
                      {userImage ? (
                        <img src={userImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-white" style={{ ...PJS, fontWeight: 900 }}>{getInitial(user)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm hidden sm:block truncate max-w-[80px]" style={{ ...POP, fontWeight: 600 }}>
                        {user}
                      </span>
                      <i className={`ri-arrow-down-s-line text-xl transition-transform duration-300 ${showDropdown ? "rotate-180 text-black-400" : "text-black/40"}`}></i>
                    </div>
                  </div>

                  {showDropdown && (
                    <div className="absolute right-0 mt-4 w-52 bg-white border border-black/10 rounded-2xl shadow-xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-black/5 mb-1">
                        <p className="text-sm text-black truncate" style={{ ...PJS, fontWeight: 700 }}>Hi, {user}</p>
                        <p className="text-[11px] text-black/40 mt-0.5" style={{ ...POP, fontWeight: 400 }}>Level 5 Quest Beginner</p>
                      </div>
                      <div className="px-2">
                        <button
                          onClick={() => { navigate("/profile"); setShowDropdown(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-black/60 hover:bg-black/5 hover:text-black rounded-xl transition-all"
                          style={{ ...POP, fontWeight: 400 }}
                        >
                          <i className="ri-user-line text-black/40 text-lg"></i>
                          Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-black/60 hover:bg-black/5 hover:text-black rounded-xl transition-all"
                          style={{ ...POP, fontWeight: 400 }}
                        >
                          <i className="ri-logout-box-r-line text-black/40 text-lg"></i>
                          Logout
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
    </>
  );
};

export default Navbar;