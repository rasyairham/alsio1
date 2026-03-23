import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Alur logic asli kamu tetap terjaga
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert("Registrasi Berhasil! Silakan Login.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.msg || "Gagal Registrasi");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center p-5 font-sans">
      <div className="flex flex-col md:flex-row w-full max-w-[900px] min-h-[580px] bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-[#c17a3a]/20">
        
        {/* Panel Kiri - Visual (Hidden on Mobile) */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-[#C17A3A] to-[#A0652E] p-12 flex-col justify-between text-white relative overflow-hidden">
          {/* Decorative Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7z' fill='%23ffffff' /%3E%3C/svg%3E")` }}>
          </div>

          <div className="flex items-center gap-3 z-10">
            <img src="/alsio.webp" alt="ALSIO" className="w-10 h-10 object-contain" />
            <span className="font-['Sora'] font-extrabold text-2xl tracking-tighter italic">ALSIO</span>
          </div>

          <div className="z-10">
            <h2 className="font-['Sora'] text-4xl font-extrabold mb-4 leading-tight">
              Level Up Your Potential.
            </h2>
            <p className="text-white/80 leading-relaxed text-[15px]">
              Daftar sekarang dan kelola aset serta logistik sekolah dengan sistem RPG yang menyenangkan.
            </p>
          </div>

          <div className="text-[11px] text-white/60 z-10 tracking-widest uppercase font-bold">
            © 2026 ALSIO Ecosystem • SMKN 1 Cimahi
          </div>
        </div>

        {/* Panel Kanan - Form */}
        <div className="flex-[1.2] p-8 md:p-16 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h2 className="font-['Sora'] text-3xl font-extrabold text-[#1A1310] mb-2">Buat Akun</h2>
            <p className="text-[#6B5E52] text-sm">Daftar untuk akses fitur lengkap platform ALSIO.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#1A1310] uppercase tracking-wider mb-2 text-left">Username</label>
              <input 
                type="text" 
                placeholder="Username Anda" 
                className="w-full px-4 py-3 bg-[#F8F7F5] border-1.5 border-[#EAE0D0] rounded-xl text-sm outline-none focus:border-[#C17A3A] focus:bg-white focus:ring-4 focus:ring-[#C17A3A]/10 transition-all"
                required
                onChange={(e) => setFormData({...formData, username: e.target.value})} 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1310] uppercase tracking-wider mb-2 text-left">Email Sekolah</label>
              <input 
                type="email" 
                placeholder="email@sekolah.sch.id" 
                className="w-full px-4 py-3 bg-[#F8F7F5] border-1.5 border-[#EAE0D0] rounded-xl text-sm outline-none focus:border-[#C17A3A] focus:bg-white focus:ring-4 focus:ring-[#C17A3A]/10 transition-all"
                required
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1310] uppercase tracking-wider mb-2 text-left">Password</label>
              <input 
                type="password" 
                placeholder="Minimal 6 karakter" 
                className="w-full px-4 py-3 bg-[#F8F7F5] border-1.5 border-[#EAE0D0] rounded-xl text-sm outline-none focus:border-[#C17A3A] focus:bg-white focus:ring-4 focus:ring-[#C17A3A]/10 transition-all"
                required
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-4 bg-[#C17A3A] hover:bg-[#A0652E] text-white font-['Sora'] font-bold rounded-xl text-sm shadow-lg shadow-[#C17A3A]/20 transform active:scale-[0.98] transition-all mt-2"
            >
              DAFTAR SEKARANG
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-[#6B5E52]">
            Sudah punya akun? 
            <Link to="/login" className="ml-1 text-[#C17A3A] font-bold hover:underline">Login di sini</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;