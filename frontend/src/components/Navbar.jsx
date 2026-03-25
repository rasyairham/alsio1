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
  const [activeItem, setActiveItem] = useState("");
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
      <nav
        className="fixed left-1/2 -translate-x-1/2 z-[60] bg-white/90 backdrop-blur-md text-black border border-black/10 shadow-2xl flex items-center"
        style={{ width: "1163px", height: "81px", padding: "0 32px", borderRadius: "42px", top: "24px" }}
      >
        <div className="w-full flex justify-between items-center">

          <div
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => (isLogin ? navigate("/dashboard") : navigate("/"))}
            style={{ height: "100%" }}
          >
            <img
              src="/alsio.webp"
              alt="Logo"
              className="object-contain transition-transform group-hover:scale-105"
              style={{ width: "64px", height: "78px" }}
            />
            <img
              src="/Text_Alsio.webp"
              alt="ALSIO"
              className="object-contain transition-transform group-hover:scale-105"
              style={{ width: "118px", height: "118px", marginLeft: "-50px", marginTop: "5px" }}
            />
          </div>

          <div className="flex-1 flex justify-center gap-4">
            {isLogin ? (
              [
                { path: "/dashboard", label: "Dashboard" },
                { path: "/quests", label: "Quest Board" },
                { path: "/analytics", label: "Analytics" },
              ].map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm transition-colors ${isActive ? "text-black" : "text-black/60 hover:text-black"}`
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
              ["home", "about", "feature", "contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    scrollToSection(item);
                    setActiveItem(item);
                  }}
                  className="text-sm capitalize opacity-70 hover:opacity-100 transition-all"
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

          <div className="flex gap-3 items-center">
            {!isLogin ? (
              <>
                <NavLink
                  to="/login"
                  className="px-4 py-2 rounded-xl hover:bg-black/5 text-sm transition-all active:scale-95"
                  style={{ ...POP, fontWeight: 500 }}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-5 py-2 text-sm text-white transition-all active:scale-95"
                  style={{ ...PJS, fontWeight: 700, backgroundColor: "#946C44", borderRadius: "42px", boxShadow: "0 4px 15px #946C4444" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#7A5836")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#946C44")}
                >
                  Sign Up
                </NavLink>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex items-center gap-3 cursor-pointer select-none"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center border border-black/20 overflow-hidden">
                    {userImage ? (
                      <img src={userImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span
                        className="text-xs text-white bg-black w-full h-full flex items-center justify-center"
                        style={{ ...PJS, fontWeight: 900 }}
                      >
                        {getInitial(user)}
                      </span>
                    )}
                  </div>
                  <span className="text-sm hidden sm:block truncate max-w-[80px]" style={{ ...POP, fontWeight: 600 }}>
                    {user}
                  </span>
                  <i className={`ri-arrow-down-s-line text-xl transition-transform duration-300 ${showDropdown ? "rotate-180" : ""}`}></i>
                </div>

                {showDropdown && (
                  <div className="absolute right-0 mt-4 w-52 bg-white border border-black/10 rounded-2xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-black/5 mb-1">
                      <p className="text-sm text-black truncate" style={{ ...PJS, fontWeight: 700 }}>Hi, {user}</p>
                      <p className="text-[11px] text-black/40 mt-0.5" style={{ ...POP }}>Level 5 Quest Beginner</p>
                    </div>
                    <div className="px-2">
                      <button
                        onClick={() => { navigate("/profile"); setShowDropdown(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-black/60 hover:bg-black/5 rounded-xl transition-all"
                        style={{ ...POP }}
                      >
                        <i className="ri-user-line"></i> Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-black/60 hover:bg-black/5 rounded-xl transition-all"
                        style={{ ...POP }}
                      >
                        <i className="ri-logout-box-r-line"></i> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </nav>
    </>
  );
};

export default Navbar;