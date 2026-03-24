import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Check } from "lucide-react";

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&family=Poppins:wght@400;500;600&display=swap');
`;

const PJS = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const POP = { fontFamily: "'Poppins', sans-serif" };

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
      <div className="min-h-screen bg-[#FAF7F4] flex flex-col items-center justify-center p-6 antialiased" style={POP}>
        
        {/* Background Decoration */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#C17A3A]/10 blur-[120px] rounded-full"></div>
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#A0652E]/10 blur-[120px] rounded-full"></div>
        </div>

        {/* TOMBOL BACK (Di atas Card) */}
        <div className="w-full max-w-[1050px] mb-4 z-20">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#C17A3A] hover:text-[#A0652E] transition-all group font-bold text-sm"
            style={PJS}
          >
            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:shadow-md group-hover:-translate-x-1 transition-all">
              <i className="ri-arrow-left-line text-lg"></i>
            </div>
            <span>Back to Home</span>
          </button>
        </div>

        <div className="w-full max-w-[1050px] h-auto md:h-[583px] bg-white rounded-[32px] shadow-[0_1px_9px_rgba(0,0,0,0.15)] flex flex-col md:flex-row overflow-hidden relative z-10 transition-all duration-500 hover:shadow-[0_1px_9px_rgba(0,0,0,0.25)]">

          {/* LEFT PANEL */}
          <div
            className="hidden md:flex w-full md:w-[525px] h-[300px] md:h-full bg-cover bg-center p-12 flex-col justify-end relative overflow-hidden z-20"
            style={{ backgroundImage: "url('/images/Left_Panel.png')" }}
          >
            <div className="z-10">
              <h1 className="text-5xl text-white leading-tight mb-4 tracking-tighter" style={{ ...PJS, fontWeight: 900 }}>
                Welcome.
              </h1>
              <p style={{ ...PJS, fontWeight: 700, fontSize: "16px", color: "#FFFFFF" }}>
                Ready to continue your mission?<br />
                Enter the floating hall and start your productivity today.
              </p>
            </div>
          </div>

          {/* RIGHT PANEL - FORM */}
          <div className="w-full md:w-[525px] h-full p-8 md:p-16 bg-white flex flex-col justify-center">
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-3xl text-[#111] tracking-tight mb-2" style={{ ...PJS, fontWeight: 900, fontSize: "32px" }}>Welcome Back</h2>
              <p style={{ ...POP, fontWeight: 600, fontSize: "11px", color: "#0C0C0D", letterSpacing: "-0.2px" }}>
                Stay on track, complete your quests, and improve your skills with ALSIO.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email / Username */}
              <div className="space-y-2 group">
                <label className="text-[13px] text-[#0C0C0D] tracking-normal ml-1 transition-colors group-focus-within:text-[#C17A3A]" style={{ ...PJS, fontWeight: 700 }}>
                  Username / Email
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-300 group-focus-within:text-[#C17A3A] transition-colors">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    placeholder="Enter your username / email"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F8F7F5] border-2 border-transparent focus:border-[#C17A3A] focus:bg-white outline-none transition-all text-sm text-gray-800 placeholder:text-gray-300"
                    style={POP}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2 group">
                <label className="text-[13px] text-[#0C0C0D] tracking-normal ml-1 transition-colors group-focus-within:text-[#C17A3A]" style={{ ...PJS, fontWeight: 700 }}>
                  Password
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-300 group-focus-within:text-[#C17A3A] transition-colors">
                    <Lock className="w-5 h-5" />
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
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me + Forgot Password */}
              <div className="flex justify-between items-center py-1">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${rememberMe ? "border-[#C17A3A] bg-[#C17A3A]" : "border-gray-300 bg-white"}`}>
                    {rememberMe && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="ml-2 text-xs" style={{ ...PJS, fontWeight: 700, color: "#0C0C0D" }}>Remember Me</span>
                </label>
                <Link to="/forgot-password" size="xs" className="text-xs text-[#C17A3A] hover:text-[#A0652E] font-bold" style={PJS}>
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[40px] rounded-2xl uppercase tracking-[2px] flex items-center justify-center gap-3 text-white shadow-lg transition-all transform active:scale-[0.98] overflow-hidden hover:opacity-90 disabled:opacity-50"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 800,
                  fontSize: "13px",
                  letterSpacing: "-0.5px",
                  backgroundImage: "url('/images/Login_Button.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {isLoading ? "Authenticating..." : "LOGIN"}
              </button>
            </form>

            <p className="mt-8 text-center text-gray-400 text-xs" style={{ ...POP, fontWeight: 500 }}>
              Don't have an account?{' '}
              <Link to="/register" className="text-[#C17A3A] hover:underline underline-offset-4 font-bold" style={PJS}>
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="fixed bottom-0 w-full bg-[#FEFDFC] border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center px-8 py-3 text-[11px] md:text-[13px] text-gray-400" style={{ ...POP, fontWeight: 400 }}>
            <span>© 2026 ALSIO. All rights reserved.</span>
            <div className="flex gap-6 mt-2 md:mt-0">
              {['Privacy', 'Terms', 'Support'].map(item => (
                <span key={item} className="hover:text-gray-600 cursor-pointer transition-colors capitalize">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;