import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  useEffect(() => {
    const username = localStorage.getItem("username");
    // Proteksi halaman: Jika tidak ada username (belum login), tendang ke login
    if (!username) {
      navigate("/login");
    }
    setUser(username);
  }, [navigate]);

  const handleLogout = () => {
    // 1. Bersihkan semua data login dari browser
    localStorage.clear(); 

    // 2. Langsung arahkan ke Homepage ("/")
    // Menggunakan window.location agar Navbar ikut ter-refresh otomatis
    window.location.href = "/"; 
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-32 px-6 flex justify-center">
      <div className="bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-md w-full max-w-lg text-center shadow-2xl h-fit">
        
        {/* Avatar Profile */}
        <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
          <i className="ri-user-3-fill text-white text-5xl"></i>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2 uppercase tracking-widest">
          {user || "User ALSIO"}
        </h2>
        <p className="text-gray-400 mb-10 italic">Anggota Kelompok 8</p>

        <div className="space-y-4">
          <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all text-sm font-medium">
            Pengaturan Akun
          </button>
          
          {/* TOMBOL LOGOUT KE HOMEPAGE */}
          <button 
            onClick={handleLogout}
            className="w-full py-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl border border-red-600/30 transition-all font-bold flex items-center justify-center gap-2"
          >
            <i className="ri-logout-box-r-line"></i>
            Logout & Keluar
          </button>
        </div>

        <button 
          onClick={() => navigate("/")}
          className="mt-8 text-gray-500 hover:text-white text-sm transition-colors"
        >
          <i className="ri-arrow-left-line mr-1"></i> Kembali ke Beranda
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;