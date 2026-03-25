import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Check, ArrowLeft } from "lucide-react";

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&family=Poppins:wght@400;500;600&display=swap');
`;

const PJS = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const POP = { fontFamily: "'Poppins', sans-serif" };

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError("");
    setSuccessMsg("");

    try {
      // PERBAIKAN: Menggunakan relative path agar sesuai dengan konfigurasi Vercel Rewrites
      const res = await axios.post('/api/auth/login', formData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('email', res.data.email);
      localStorage.setItem('userImage', res.data.profileImage || "");

      setSuccessMsg("Login successful! Redirecting...");
      
      // Redirect ke dashboard setelah login berhasil
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      let backendMsg = err.response?.data?.message || "Login failed. Please check your credentials.";
      setEmailError(backendMsg);
    }
  };

  return (
    <>
      <style>{fontStyle}</style>
      <div className="min-h-screen bg-[#FAF7F4] flex flex-col items-center justify-center p-4 sm:p-6 antialiased relative" style={POP}>
        
        {/* Background Decorative Blurs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#946C44]/10 blur-[80px] sm:blur-[120px] rounded-full"></div>
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#7A5836]/10 blur-[80px] sm:blur-[120px] rounded-full"></div>
        </div>

        {/* Back Button Container */}
        <div className="w-full max-w-[1050px] mb-6 z-20 flex justify-start">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#946C44] hover:text-[#7A5836] transition-all group font-bold text-sm"
            style={PJS}
          >
            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:shadow-md group-hover:-translate-x-1 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="hidden sm:inline">Back to Home</span>
          </button>
        </div>

        {/* Main Card Container */}
        <div className="w-full max-w-[1050px] bg-white rounded-[24px] sm:rounded-[32px] shadow-[0_1px_9px_rgba(0,0,0,0.15)] flex flex-col md:flex-row overflow-hidden relative z-10 transition-all duration-500 hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
          
          {/* Left Panel (Visible on Desktop only) */}
          <div
            className="hidden md:flex w-1/2 bg-cover bg-center p-12 flex-col justify-end relative overflow-hidden z-20"
            style={{ backgroundImage: "url('/images/Left_Panel.png')" }}
          >
            <div className="z-10 bg-black/10 backdrop-blur-[2px] p-6 rounded-2xl">
              <h1 className="text-4xl lg:text-5xl text-white leading-tight mb-4 tracking-tighter" style={{ ...PJS, fontWeight: 900 }}>
                Welcome.
              </h1>
              <p style={{ ...PJS, fontWeight: 700, fontSize: "16px", color: "#FFFFFF" }}>
                Ready to continue your mission?<br />
                Enter the floating hall and start your productivity today.
              </p>
            </div>
          </div>

          {/* Right Panel (Form) */}
          <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-16 bg-white flex flex-col justify-center">
            
            {/* Header Content */}
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl text-[#111] tracking-tight mb-2" style={{ ...PJS, fontWeight: 900 }}>
                Welcome Back
              </h2>
              <p className="max-w-[280px] mx-auto md:mx-0" style={{ ...POP, fontWeight: 600, fontSize: "11px", color: "#0C0C0D", letterSpacing: "-0.1px" }}>
                Stay on track, complete your quests, and improve your skills with ALSIO.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
              {/* Input Username/Email */}
              <div className="space-y-1.5 group">
                <label className="text-[12px] text-[#0C0C0D] ml-1 transition-colors group-focus-within:text-[#946C44]" style={{ ...PJS, fontWeight: 700 }}>
                  Username / Email
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-300 group-focus-within:text-[#946C44] transition-colors">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    placeholder="Enter your username / email"
                    required
                    className="w-full pl-11 pr-4 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-[#F8F7F5] border-2 border-transparent focus:border-[#946C44] focus:bg-white outline-none transition-all text-sm text-gray-800 placeholder:text-gray-300"
                    style={POP}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Input Password */}
              <div className="space-y-1.5 group">
                <label className="text-[12px] text-[#0C0C0D] ml-1 transition-colors group-focus-within:text-[#946C44]" style={{ ...PJS, fontWeight: 700 }}>
                  Password
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-gray-300 group-focus-within:text-[#946C44] transition-colors">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-12 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-[#F8F7F5] border-2 border-transparent focus:border-[#946C44] focus:bg-white outline-none transition-all text-sm text-gray-800 placeholder:text-gray-300"
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

              {/* Status Messages */}
              {(emailError || successMsg) && (
                <div className={`text-[10px] sm:text-xs p-2.5 rounded-lg border animate-in fade-in duration-300 ${
                  emailError ? 'bg-red-50 text-red-500 border-red-100' : 'bg-amber-50 text-[#946C44] border-amber-100'
                }`}>
                  {emailError || successMsg}
                </div>
              )}

              {/* Remember Me & Forgot Password */}
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center py-1">
                <label className="flex items-center cursor-pointer group w-fit">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${rememberMe ? "border-[#946C44] bg-[#946C44]" : "border-gray-300 bg-white"}`}>
                    {rememberMe && <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />}
                  </div>
                  <span className="ml-2 text-[11px] sm:text-xs" style={{ ...PJS, fontWeight: 700, color: "#0C0C0D" }}>Remember Me</span>
                </label>
                <Link to="/forgot-password" 
                  className="text-[11px] sm:text-xs text-[#946C44] hover:text-[#7A5836] font-bold text-left" 
                  style={PJS}
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full h-[44px] sm:h-[48px] rounded-xl sm:rounded-2xl uppercase flex items-center justify-center gap-3 text-white shadow-lg transition-all transform active:scale-[0.98] overflow-hidden hover:opacity-90 mt-2"
                style={{
                  ...PJS,
                  fontWeight: 800,
                  fontSize: "12px",
                  letterSpacing: "1.5px",
                  backgroundImage: "url('/images/Login_Button.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                LOGIN
              </button>
            </form>

            {/* Footer Link */}
            <p className="mt-8 text-center text-gray-400 text-[11px] sm:text-xs" style={{ ...POP, fontWeight: 500 }}>
              Don't have an account?{' '}
              <Link to="/register" className="text-[#946C44] hover:underline underline-offset-4 font-bold" style={PJS}>
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;