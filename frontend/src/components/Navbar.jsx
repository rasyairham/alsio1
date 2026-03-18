import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState("");

  // Fungsi cek login
  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    
    if (token && username) {
      setIsLogin(true);
      setUser(username);
    } else {
      setIsLogin(false);
      setUser("");
    }
  }, []);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50 bg-black/80 backdrop-blur-md text-white p-4 rounded-2xl border border-white/10 shadow-2xl">
      <div className="container mx-auto flex justify-between items-center px-2">
        {/* LOGO */}
        <h1 className="text-xl font-bold tracking-tighter cursor-pointer" onClick={() => navigate("/")}>
          ALSIO
        </h1>
        
        <div className="flex gap-6 items-center">
          {/* Menu Home selalu ada */}
          <NavLink to="/" className={({ isActive }) => isActive ? "text-blue-400" : "hover:text-blue-300 transition-colors"}>
            Home
          </NavLink>

          {/* KONDISI: JIKA BELUM LOGIN */}
          {!isLogin ? (
            <div className="flex gap-3">
              <NavLink 
                to="/login" 
                className="px-4 py-2 border border-white/20 rounded-xl hover:bg-white/10 text-sm font-medium transition-all"
              >
                Login
              </NavLink>
              <NavLink 
                to="/register" 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20"
              >
                Daftar
              </NavLink>
            </div>
          ) : (
            /* KONDISI: JIKA SUDAH LOGIN */
            <div className="flex items-center gap-6">
              {/* Dashboard hanya muncul saat login */}
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-blue-400" : "hover:text-blue-300"}>
                Dashboard
              </NavLink>

              {/* Icon & Nama User SEKARANG MENJADI LINK KE PROFILE */}
              <NavLink 
                to="/profile" 
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-1.5 rounded-full border border-white/10 transition-all group"
              >
                <i className="ri-user-3-line text-blue-400 text-lg group-hover:scale-110 transition-transform"></i>
                <span className="text-sm font-medium group-hover:text-blue-200">{user}</span>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;