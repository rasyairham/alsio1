import React, { useState } from 'react';
// PERBAIKAN: Gunakan file axios/api yang konsisten (sesuai diskusi sebelumnya)
import api from '../api/api'; 
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&family=Poppins:wght@400;500;600&display=swap');
`;

const PJS = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const POP = { fontFamily: "'Poppins', sans-serif" };

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', otp: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const showNotification = (message, type = "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 5000);
  };

  const handleRequestOTP = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setEmailError("");
    
    try {
      // PERBAIKAN: Kirim data yang dibutuhkan backend untuk verifikasi awal
      await api.post('/auth/send-otp', {
        email: formData.email,
        username: formData.username
      });
      showNotification("OTP code has been sent to your email.", "success");
      setStep(2);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send code.";
      if (msg.toLowerCase().includes("email") || msg.toLowerCase().includes("registered")) {
        setEmailError(msg);
      } else {
        showNotification(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // PERBAIKAN: Pastikan endpoint register menerima semua field termasuk OTP
      await api.post('/auth/register', formData);
      showNotification("Account created! Redirecting to login...", "success");
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      showNotification(err.response?.data?.message || "Invalid OTP code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{fontStyle}</style>
      <div className="min-h-screen bg-[#FAF7F4] antialiased relative overflow-x-hidden flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8" style={POP}>
        
        {/* Navigation Header */}
        <div className="w-full max-w-[1050px] mx-auto mb-6 z-20">
          <button 
            onClick={() => step === 2 ? setStep(1) : navigate('/')}
            className="flex items-center gap-3 text-[#C17A3A] hover:text-[#A0652E] transition-all group font-bold text-sm"
            style={PJS}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:shadow-md group-hover:-translate-x-1 transition-all border border-gray-100">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline">{step === 2 ? "Back to Edit Info" : "Back to Home"}</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-[1050px] mx-auto bg-white rounded-[24px] sm:rounded-[32px] shadow-2xl flex flex-col lg:flex-row overflow-hidden relative z-10 min-h-[600px] border border-zinc-100">
          
          {/* Left Panel */}
          <div
            className="hidden lg:flex w-1/2 bg-cover bg-center p-12 flex-col justify-end relative overflow-hidden"
            style={{ backgroundImage: "url('/images/Left_Panel.png')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div className="relative z-10 text-white">
              <h1 className="text-4xl xl:text-5xl leading-tight mb-4 tracking-tighter" style={{ ...PJS, fontWeight: 900 }}>
                {step === 1 ? "Start Your Journey." : "Verification."}
              </h1>
              <p className="text-base opacity-90 font-medium" style={PJS}>
                {step === 1 
                  ? "Create an account and boost your productivity with ALSIO." 
                  : "We've sent a secret code to your email for security."}
              </p>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl text-[#111] tracking-tighter mb-2" style={{ ...PJS, fontWeight: 900 }}>
                {step === 1 ? "Create Account" : "Confirm Email"}
              </h2>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
                {step === 1 
                  ? "Ambisi Leveling Siswa Intelektual Optimal" 
                  : `Enter the 6-digit code sent to ${formData.email}`}
              </p>
            </div>

            {notification.message && (
              <div className={`mb-6 p-4 text-[11px] font-bold rounded-2xl border text-center animate-in fade-in slide-in-from-top-1 ${
                notification.type === "success" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-500 border-red-100"
              }`}>
                {notification.message}
              </div>
            )}

            <form onSubmit={step === 1 ? handleRequestOTP : handleFinalRegister} className="space-y-4">
              {step === 1 ? (
                <div className="space-y-4">
                  {/* Username */}
                  <div className="space-y-2 group">
                    <label className="text-[10px] text-zinc-400 font-black uppercase tracking-widest ml-1 group-focus-within:text-[#C17A3A] transition-colors">Username</label>
                    <div className="relative flex items-center">
                      <User className="absolute left-4 w-5 h-5 text-gray-300 group-focus-within:text-[#C17A3A] transition-colors" />
                      <input
                        type="text"
                        placeholder="Choose a username"
                        required
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F8F7F5] border-2 border-transparent focus:border-[#C17A3A]/20 focus:bg-white outline-none transition-all text-sm font-medium"
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        value={formData.username}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2 group">
                    <label className="text-[10px] text-zinc-400 font-black uppercase tracking-widest ml-1 group-focus-within:text-[#C17A3A] transition-colors">Email Address</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-4 w-5 h-5 text-gray-300 group-focus-within:text-[#C17A3A] transition-colors" />
                      <input
                        type="email"
                        placeholder="email@example.com"
                        required
                        className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F8F7F5] border-2 outline-none transition-all text-sm font-medium ${emailError ? 'border-red-400 bg-red-50' : 'border-transparent focus:border-[#C17A3A]/20 focus:bg-white'}`}
                        onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setEmailError(""); }}
                        value={formData.email}
                      />
                    </div>
                    {emailError && <p className="text-red-500 text-[10px] font-bold ml-2">{emailError}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-2 group">
                    <label className="text-[10px] text-zinc-400 font-black uppercase tracking-widest ml-1 group-focus-within:text-[#C17A3A] transition-colors">Password</label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-4 w-5 h-5 text-gray-300 group-focus-within:text-[#C17A3A] transition-colors" />
                      <input
                        type="password"
                        placeholder="Min. 6 characters"
                        required
                        minLength={6}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F8F7F5] border-2 border-transparent focus:border-[#C17A3A]/20 focus:bg-white outline-none transition-all text-sm font-medium"
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        value={formData.password}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 text-center">
                  <div className="space-y-4">
                    <label className="text-[10px] text-zinc-400 font-black uppercase tracking-widest" style={PJS}>OTP Security Code</label>
                    <div className="relative flex items-center justify-center group">
                      <ShieldCheck className="absolute left-4 w-6 h-6 text-gray-300 group-focus-within:text-[#C17A3A] transition-colors" />
                      <input
                        type="text"
                        placeholder="000000"
                        maxLength="6"
                        required
                        className="w-full pl-12 pr-4 py-5 rounded-2xl bg-[#F8F7F5] border-2 border-[#C17A3A]/20 focus:border-[#C17A3A] focus:bg-white outline-none text-2xl text-center font-black tracking-[10px] transition-all shadow-inner"
                        onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                        value={formData.otp}
                      />
                    </div>
                    <button type="button" onClick={handleRequestOTP} className="text-[11px] text-[#C17A3A] font-black hover:underline tracking-tight">
                      Resend Code?
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-zinc-900 text-white font-black text-[11px] uppercase tracking-[0.25em] shadow-xl hover:bg-[#C17A3A] hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 mt-6"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span>{step === 1 ? "Get Security Code" : "Create Account"}</span>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-zinc-50 text-center">
              <p className="text-zinc-400 text-[11px] font-bold tracking-tight">
                Already part of the Guild?{' '}
                <Link to="/login" className="text-[#C17A3A] hover:underline font-black ml-1">Login Now</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;