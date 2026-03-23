import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // 1. SIMPAN DATA PENTING KE LOCALSTORAGE
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('email', res.data.email);
      // Hindari menyimpan string "null" jika profileImage kosong
      localStorage.setItem('userImage', res.data.profileImage || "");

      // 2. NAVIGASI (Refresh total agar Navbar mendeteksi user baru)
      window.location.href = "/";
      
    } catch (err) {
      alert(err.response?.data?.message || "Login Gagal! Periksa kembali email dan password Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eeeae5] flex items-center justify-center p-6 font-sans antialiased">
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#c9a97a]/10 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#a07a4a]/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-[900px] bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex overflow-hidden relative z-10 transition-all duration-500 hover:shadow-[0_30px_80px_rgba(0,0,0,0.12)]">
        
        {/* LEFT PANEL - VISUAL (Hidden on Mobile) */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-[#c9a97a] via-[#b8915e] to-[#a07a4a] p-12 flex-col justify-end relative overflow-hidden">
          {/* Noise Texture Overlay */}
          <div className="absolute inset-0 opacity-20 contrast-150 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          
          <div className="relative z-10">
            <h1 className="text-5xl font-black text-white leading-tight mb-4 tracking-tighter">
              Welcome <br /> Back.
            </h1>
            <p className="text-white/80 text-sm font-medium leading-relaxed max-w-[240px]">
              Ready to continue your mission? Enter the floating hall and start your productivity today.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL - FORM */}
        <div className="flex-[1.2] p-8 md:p-16 bg-white flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black text-[#111] tracking-tight mb-2">Welcome Back</h2>
            <p className="text-gray-400 text-sm">Stay on track, complete your quests with ALSIO.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Input Email */}
            <div className="space-y-2 group">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#c9a97a]">
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-300 group-focus-within:text-[#c9a97a] transition-colors">
                  <i className="ri-mail-line text-xl"></i>
                </span>
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#f8f7f5] border-2 border-transparent focus:border-[#c9a97a] focus:bg-white outline-none transition-all text-sm text-gray-800 placeholder:text-gray-300"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2 group">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#c9a97a]">
                Security Key
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-300 group-focus-within:text-[#c9a97a] transition-colors">
                  <i className="ri-lock-line text-xl"></i>
                </span>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-4 rounded-2xl bg-[#f8f7f5] border-2 border-transparent focus:border-[#c9a97a] focus:bg-white outline-none transition-all text-sm text-gray-800 placeholder:text-gray-300"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-300 hover:text-gray-600 transition-colors"
                >
                  <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"}></i>
                </button>
              </div>
            </div>

            {/* Forgot Pass */}
            <div className="flex justify-end">
              <Link to="/forgot-password" size="sm" className="text-xs font-bold text-[#c9a97a] hover:text-[#a07a4a] transition-colors">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-bold text-white uppercase tracking-[2px] text-xs transition-all transform active:scale-[0.98] shadow-lg flex items-center justify-center gap-3
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#c9a97a] to-[#a07a4a] hover:opacity-90 shadow-[#c9a97a]/20'
                }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  Enter Dashboard <i className="ri-arrow-right-line"></i>
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-10 text-center text-gray-400 text-xs font-medium">
            New to the mission?{' '}
            <Link to="/register" className="text-[#c9a97a] font-black hover:underline underline-offset-4">
              Create an Account
            </Link>
          </p>
        </div>
      </div>

      {/* External Footer Branding */}
      <div className="fixed bottom-6 flex gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        <span className="hover:text-gray-600 cursor-pointer transition-colors">Privacy</span>
        <span className="hover:text-gray-600 cursor-pointer transition-colors">Terms</span>
        <span className="hover:text-gray-600 cursor-pointer transition-colors">Support</span>
      </div>
    </div>
  );
};

export default LoginPage;