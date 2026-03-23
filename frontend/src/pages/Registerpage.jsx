import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&family=Poppins:wght@400;500;600&display=swap');
`;

const PJS = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const POP = { fontFamily: "'Poppins', sans-serif" };

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert("Registrasi Berhasil! Silakan Login.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.msg || "Gagal Registrasi");
    }
  };

  return (
    <>
      <style>{fontStyle}</style>
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center p-5 antialiased" style={POP}>
        {/* Background Decoration */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#C17A3A]/10 blur-[120px] rounded-full"></div>
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#A0652E]/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="flex flex-col md:flex-row w-full max-w-[900px] min-h-[580px] bg-white rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(193,122,58,0.12)] relative z-10 transition-all duration-500 hover:shadow-[0_30px_80px_rgba(193,122,58,0.18)]">

          {/* LEFT PANEL */}
          <div className="hidden md:flex flex-1 bg-gradient-to-br from-[#C17A3A] via-[#B06A2A] to-[#A0652E] p-12 flex-col justify-end text-white relative overflow-hidden">
            <div className="z-10">
              <h2 className="text-4xl text-white leading-tight mb-4" style={{ ...PJS, fontWeight: 900 }}>
                Welcome.
              </h2>
              <p className="text-white/80 leading-relaxed text-[15px]" style={{ ...POP, fontWeight: 400 }}>
                Daftar sekarang dan kelola aset serta logistik sekolah dengan sistem RPG yang menyenangkan.
              </p>
            </div>
          </div>

          {/* RIGHT PANEL - FORM */}
          <div className="flex-[1.2] p-8 md:p-16 flex flex-col justify-center bg-white">
            <div className="mb-8">
              <h2 className="text-3xl text-[#1A1310] mb-2" style={{ ...PJS, fontWeight: 900 }}>Buat Akun</h2>
              <p className="text-[#6B5E52] text-sm" style={{ ...POP, fontWeight: 400 }}>Daftar untuk akses fitur lengkap platform ALSIO.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2 group">
                <label className="block text-[11px] text-[#1A1310] uppercase tracking-widest text-left transition-colors group-focus-within:text-[#C17A3A]" style={{ ...PJS, fontWeight: 700 }}>
                  Username
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-300 group-focus-within:text-[#C17A3A] transition-colors">
                    <i className="ri-user-line text-xl"></i>
                  </span>
                  <input
                    type="text"
                    placeholder="Username Anda"
                    className="w-full pl-12 pr-4 py-4 bg-[#F8F7F5] border-2 border-transparent rounded-2xl text-sm outline-none focus:border-[#C17A3A] focus:bg-white focus:ring-4 focus:ring-[#C17A3A]/10 transition-all text-gray-800 placeholder:text-gray-300"
                    style={POP}
                    required
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="block text-[11px] text-[#1A1310] uppercase tracking-widest text-left transition-colors group-focus-within:text-[#C17A3A]" style={{ ...PJS, fontWeight: 700 }}>
                  Email Sekolah
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-300 group-focus-within:text-[#C17A3A] transition-colors">
                    <i className="ri-mail-line text-xl"></i>
                  </span>
                  <input
                    type="email"
                    placeholder="email@sekolah.sch.id"
                    className="w-full pl-12 pr-4 py-4 bg-[#F8F7F5] border-2 border-transparent rounded-2xl text-sm outline-none focus:border-[#C17A3A] focus:bg-white focus:ring-4 focus:ring-[#C17A3A]/10 transition-all text-gray-800 placeholder:text-gray-300"
                    style={POP}
                    required
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="block text-[11px] text-[#1A1310] uppercase tracking-widest text-left transition-colors group-focus-within:text-[#C17A3A]" style={{ ...PJS, fontWeight: 700 }}>
                  Password
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-300 group-focus-within:text-[#C17A3A] transition-colors">
                    <i className="ri-lock-line text-xl"></i>
                  </span>
                  <input
                    type="password"
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-12 pr-4 py-4 bg-[#F8F7F5] border-2 border-transparent rounded-2xl text-sm outline-none focus:border-[#C17A3A] focus:bg-white focus:ring-4 focus:ring-[#C17A3A]/10 transition-all text-gray-800 placeholder:text-gray-300"
                    style={POP}
                    required
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-[#C17A3A] to-[#A0652E] hover:opacity-90 text-white rounded-2xl text-xs uppercase tracking-[2px] shadow-lg shadow-[#C17A3A]/20 transform active:scale-[0.98] transition-all mt-2 flex items-center justify-center gap-2"
                style={{ ...PJS, fontWeight: 700 }}
              >
                Daftar Sekarang <i className="ri-arrow-right-line"></i>
              </button>
            </form>

            <p className="text-center mt-8 text-sm text-[#6B5E52]" style={{ ...POP, fontWeight: 400 }}>
              Sudah punya akun?{' '}
              <Link to="/login" className="text-[#C17A3A] hover:underline underline-offset-4" style={{ ...PJS, fontWeight: 700 }}>
                Login di sini
              </Link>
            </p>
          </div>

        </div>

        {/* Footer Branding */}
        <div className="fixed bottom-6 flex gap-6 text-[10px] text-gray-400 uppercase tracking-widest" style={{ ...PJS, fontWeight: 700 }}>
          <span className="hover:text-gray-600 cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-gray-600 cursor-pointer transition-colors">Terms of Service</span>
          <span className="hover:text-gray-600 cursor-pointer transition-colors">FAQ</span>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;