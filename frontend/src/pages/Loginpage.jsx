import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&family=Poppins:wght@400;500;600&display=swap');
`;

const PJS = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const POP = { fontFamily: "'Poppins', sans-serif" };

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
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('email', res.data.email);
      localStorage.setItem('userImage', res.data.profileImage || "");
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.message || "Login Gagal! Periksa kembali email dan password Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{fontStyle}</style>
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center p-6 antialiased" style={POP}>
        {/* Background Decoration */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#C17A3A]/10 blur-[120px] rounded-full"></div>
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#A0652E]/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="w-full max-w-[900px] bg-white rounded-[32px] shadow-[0_20px_60px_rgba(193,122,58,0.12)] flex overflow-hidden relative z-10 transition-all duration-500 hover:shadow-[0_30px_80px_rgba(193,122,58,0.18)]">

          {/* LEFT PANEL */}
          <div className="hidden md:flex flex-1 bg-gradient-to-br from-[#C17A3A] via-[#B06A2A] to-[#A0652E] p-12 flex-col justify-end relative overflow-hidden">
            <div className="z-10">
              <h1 className="text-5xl text-white leading-tight mb-4 tracking-tighter" style={{ ...PJS, fontWeight: 900 }}>
                Welcome.
              </h1>
              <p className="text-white/80 text-sm leading-relaxed max-w-[240px]" style={{ ...POP, fontWeight: 400 }}>
                Ready to continue your mission? Enter the floating hall and start your productivity today.
              </p>
            </div>
          </div>

          {/* RIGHT PANEL - FORM */}
          <div className="flex-[1.2] p-8 md:p-16 bg-white flex flex-col justify-center">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl text-[#111] tracking-tight mb-2" style={{ ...PJS, fontWeight: 900 }}>Welcome Back</h2>
              <p className="text-gray-400 text-sm" style={{ ...POP, fontWeight: 400 }}>Stay on track, complete your quests with ALSIO.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div className="space-y-2 group">
                <label className="text-[11px] text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#C17A3A]" style={{ ...PJS, fontWeight: 700 }}>
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-300 group-focus-within:text-[#C17A3A] transition-colors">
                    <i className="ri-mail-line text-xl"></i>
                  </span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F8F7F5] border-2 border-transparent focus:border-[#C17A3A] focus:bg-white outline-none transition-all text-sm text-gray-800 placeholder:text-gray-300"
                    style={POP}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2 group">
                <label className="text-[11px] text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#C17A3A]" style={{ ...PJS, fontWeight: 700 }}>
                  Security Key
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-300 group-focus-within:text-[#C17A3A] transition-colors">
                    <i className="ri-lock-line text-xl"></i>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-[#F8F7F5] border-2 border-transparent focus:border-[#C17A3A] focus:bg-white outline-none transition-all text-sm text-gray-800 placeholder:text-gray-300"
                    style={POP}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs text-[#C17A3A] hover:text-[#A0652E] transition-colors" style={{ ...PJS, fontWeight: 700 }}>
                  Forgot Password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-2xl text-white uppercase tracking-[2px] text-xs transition-all transform active:scale-[0.98] shadow-lg flex items-center justify-center gap-3
                  ${isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#C17A3A] to-[#A0652E] hover:opacity-90 shadow-[#C17A3A]/20'
                  }`}
                style={{ ...PJS, fontWeight: 700 }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Authenticating...
                  </>
                ) : (
                  <>Enter Dashboard <i className="ri-arrow-right-line"></i></>
                )}
              </button>
            </form>

            <p className="mt-10 text-center text-gray-400 text-xs" style={{ ...POP, fontWeight: 500 }}>
              New to the mission?{' '}
              <Link to="/register" className="text-[#C17A3A] hover:underline underline-offset-4" style={{ ...PJS, fontWeight: 700 }}>
                Create an Account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="fixed bottom-6 flex gap-6 text-[10px] text-gray-400 uppercase tracking-widest" style={{ ...PJS, fontWeight: 700 }}>
          <span className="hover:text-gray-600 cursor-pointer transition-colors">Privacy</span>
          <span className="hover:text-gray-600 cursor-pointer transition-colors">Terms</span>
          <span className="hover:text-gray-600 cursor-pointer transition-colors">Support</span>
        </div>
      </div>
    </>
  );
};

export default LoginPage;