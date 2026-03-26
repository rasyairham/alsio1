import React, { useState } from 'react';
// PERBAIKAN: Mengarah ke file axios.js yang sudah kita buat sebelumnya
import api from '../api/axios'; 
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Check, ArrowLeft, Loader2 } from "lucide-react";

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&family=Poppins:wght@400;500;600&display=swap');
`;

const PJS = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const POP = { fontFamily: "'Poppins', sans-serif" };

const LoginPage = () => {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      // PERBAIKAN: Mengirim identifier ke backend. 
      // Kita kirim sebagai email DAN username agar backend ALSIO bisa memproses salah satunya.
      const res = await api.post('/auth/login', {
        email: formData.identifier,
        username: formData.identifier,
        password: formData.password
      }); 
      
      if (res.data.token) {
        // Simpan token ke localStorage
        localStorage.setItem('token', res.data.token);
        
        // Simpan data user jika ada
        if (res.data.user) {
            localStorage.setItem('user', JSON.stringify(res.data.user));
        }
        
        setSuccessMsg("Welcome back, Commander!");
        
        // Delay sedikit agar user bisa melihat pesan sukses
        setTimeout(() => {
          navigate('/dashboard'); 
        }, 1200);
      }
    } catch (err) {
      // Mengambil pesan error dari backend jika ada, jika tidak pakai pesan default
      const backendMsg = err.response?.data?.message || "Invalid credentials. Check your key.";
      setErrorMsg(backendMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{fontStyle}</style>
      <div className="min-h-screen bg-[#FAF7F4] flex flex-col items-center justify-center p-4 sm:p-6 antialiased relative" style={POP}>
        
        {/* Back Button */}
        <div className="w-full max-w-[1050px] mb-6 z-20 flex justify-start">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#946C44] hover:text-[#7A5836] transition-all group font-bold text-sm"
            style={PJS}
          >
            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:-translate-x-1 transition-all border border-zinc-100">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Back to Home</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-[1050px] bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] flex flex-col md:flex-row overflow-hidden relative z-10 border border-zinc-100">
          
          {/* Left Panel - Image */}
          <div
            className="hidden md:flex w-1/2 bg-cover bg-center p-12 flex-col justify-end relative min-h-[600px]"
            style={{ backgroundImage: "url('/images/Left_Panel.png')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            
            <div className="z-10 bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20 shadow-2xl">
              <h1 className="text-4xl lg:text-5xl text-white leading-tight mb-4 tracking-tighter" style={{ ...PJS, fontWeight: 900 }}>
                Welcome.
              </h1>
              <p className="text-white/90 font-medium text-sm lg:text-base leading-relaxed" style={PJS}>
                Ready to continue your mission?<br />
                Enter the floating hall and start your productivity today.
              </p>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="w-full md:w-1/2 p-8 sm:p-12 md:p-16 bg-white flex flex-col justify-center">
            
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl text-[#111] tracking-tighter mb-2" style={{ ...PJS, fontWeight: 900 }}>
                Welcome Back
              </h2>
              <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.2em]" style={POP}>
                Ambisi Leveling Siswa Intelektual Optimal
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Input Identifier */}
              <div className="space-y-2 group text-left">
                <label className="text-[10px] text-zinc-400 uppercase tracking-widest ml-1 font-black group-focus-within:text-[#946C44] transition-colors">
                  Email / Username
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-4 w-5 h-5 text-zinc-300 group-focus-within:text-[#946C44] transition-colors" />
                  <input
                    type="text"
                    value={formData.identifier}
                    placeholder="yourname@email.com"
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F8F7F5] border-2 border-transparent focus:border-[#946C44]/20 focus:bg-white outline-none transition-all text-sm font-medium disabled:opacity-50"
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  />
                </div>
              </div>

              {/* Input Password */}
              <div className="space-y-2 group text-left">
                <label className="text-[10px] text-zinc-400 uppercase tracking-widest ml-1 font-black group-focus-within:text-[#946C44] transition-colors">
                  Security Key
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 w-5 h-5 text-zinc-300 group-focus-within:text-[#946C44] transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-[#F8F7F5] border-2 border-transparent focus:border-[#946C44]/20 focus:bg-white outline-none transition-all text-sm font-medium disabled:opacity-50"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-zinc-300 hover:text-zinc-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Notifications */}
              {(errorMsg || successMsg) && (
                <div className={`text-[11px] font-bold p-4 rounded-2xl border transition-all ${
                  errorMsg ? 'bg-red-50 text-red-500 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                }`}>
                  {errorMsg || successMsg}
                </div>
              )}

              {/* Options */}
              <div className="flex justify-between items-center px-1">
                <button 
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${rememberMe ? "border-[#946C44] bg-[#946C44]" : "border-zinc-200 group-hover:border-zinc-300"}`}>
                    {rememberMe && <Check className="w-3 h-3 text-white" strokeWidth={4} />}
                  </div>
                  <span className="text-[11px] font-black text-zinc-400 group-hover:text-zinc-800 transition-colors">Remember Me</span>
                </button>
                <Link to="/forgot-password" size={11} className="text-[11px] text-[#946C44] font-black hover:underline tracking-tight">
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-zinc-900 text-white font-black text-[11px] uppercase tracking-[0.25em] shadow-xl hover:bg-[#946C44] hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-70 disabled:hover:bg-zinc-900 disabled:transform-none flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Enter The Hall"
                )}
              </button>
            </form>

            <p className="mt-10 text-center text-zinc-400 text-[11px] font-bold tracking-tight">
              New to the Guild?{' '}
              <Link to="/register" className="text-[#946C44] hover:underline font-black">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;