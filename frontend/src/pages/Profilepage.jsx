import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate("/login");
      return;
    }
    setUser(username);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center px-6 py-20">
      {/* Background blur */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] text-center">
          
          {/* Avatar */}
          <div className="relative w-28 h-28 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 blur-md opacity-70"></div>
            <div className="relative w-full h-full rounded-full bg-slate-900 border border-white/10 flex items-center justify-center">
              <i className="ri-user-3-fill text-white text-5xl"></i>
            </div>
          </div>

          {/* Username */}
          <h1 className="text-3xl font-bold text-white tracking-wide">
            {user || "User ALSIO"}
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Selamat datang di halaman profil
          </p>

          {/* Info Card */}
          <div className="mt-8 grid gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left">
              <p className="text-gray-400 text-sm">Username</p>
              <p className="text-white font-semibold text-lg">{user || "User ALSIO"}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left">
              <p className="text-gray-400 text-sm">Status</p>
              <p className="text-green-400 font-medium">Aktif</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20 text-white font-semibold transition-all">
              Pengaturan Akun
            </button>

            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-xl bg-red-600/10 hover:bg-red-600 border border-red-500/30 text-red-400 hover:text-white font-semibold transition-all flex items-center justify-center gap-2"
            >
              <i className="ri-logout-box-r-line"></i>
              Logout & Keluar
            </button>
          </div>

          {/* Back */}
          <button
            onClick={() => navigate("/")}
            className="mt-6 text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1"
          >
            <i className="ri-arrow-left-line"></i>
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;