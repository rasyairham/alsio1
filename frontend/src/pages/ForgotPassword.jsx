import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ email: '', otp: '', newPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true); setStatus('');
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email: formData.email });
      setStatus('success'); setMessage("OTP has been sent to your email!"); setStep(2);
    } catch (err) {
      let msg = err.response?.data?.message || "Failed to send OTP. Try again.";
      if (msg === "Email tidak ditemukan") msg = "Email not found. Please check your email.";
      setStatus('error'); setMessage(msg);
    } finally { setIsLoading(false); }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (formData.newPassword.length < 6) return setStatus('validation'), setMessage("Password must be at least 6 characters!");
    if (!/^\d{6}$/.test(formData.otp)) return setStatus('validation'), setMessage("OTP must be a 6-digit code!");

    setIsLoading(true); setStatus('');
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', formData);
      setStatus('success'); setMessage("Password has been reset!"); 
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      let msg = err.response?.data?.message || "Failed to reset password. Try again.";
      if (msg === "OTP salah") msg = "Invalid OTP code. Please check your email.";
      if (msg === "Email tidak ditemukan") msg = "Email not found. Please check your email.";
      setStatus('error'); setMessage(msg);
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F4] flex items-center justify-center p-4 sm:p-6">
      {/* Card: Width auto pada mobile, max-width pada desktop */}
      <div className="w-full max-w-[450px] bg-white p-6 sm:p-10 rounded-[24px] sm:rounded-[32px] shadow-xl border border-[#EAE0D0]/50">
        
        {/* Back Button: Padding diperbesar untuk mobile agar mudah diklik */}
        <button 
          onClick={() => navigate('/login')} 
          className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-[#946C44] hover:text-[#7A5836] transition-colors font-bold group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Login
        </button>

        {/* Header Text: Skala font adaptif */}
        <h2 className="text-xl sm:text-2xl font-black mb-2 text-[#111] tracking-tight">
          {step === 1 ? "Forgot Password?" : "Create New Password"}
        </h2>
        <p className="text-[11px] sm:text-xs text-gray-400 mb-8 font-medium leading-relaxed">
          {step === 1 
            ? "Enter your registered email below. We'll send a 6-digit reset code to your inbox."
            : "Verification successful! Please enter the OTP code and your new strong password below."}
        </p>

        {/* Status Message: Animasi Fade In */}
        {status && (
          <div className={`text-[11px] sm:text-xs text-center mb-6 p-3 rounded-xl border animate-in fade-in duration-300 ${
            status === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 
            status === 'error' ? 'bg-red-50 text-red-500 border-red-100' : 
            'bg-yellow-50 text-yellow-600 border-yellow-100'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={step === 1 ? handleSendOTP : handleReset} className="space-y-4">
          {step === 1 ? (
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 transition-colors group-focus-within:text-[#946C44]" />
              <input 
                type="email" 
                placeholder="Your registered email" 
                required
                className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-[#F8F7F5] outline-none border-2 border-transparent focus:border-[#946C44] transition-all text-sm sm:text-base"
                onChange={e => setFormData({ ...formData, email: e.target.value })} 
              />
            </div>
          ) : (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 transition-colors group-focus-within:text-[#946C44]" />
                <input 
                  type="text" 
                  placeholder="6-digit OTP" 
                  maxLength={6}
                  required
                  className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-[#F8F7F5] outline-none border-2 border-transparent focus:border-[#946C44] transition-all text-sm sm:text-base tracking-[0.2em] font-bold"
                  onChange={e => setFormData({ ...formData, otp: e.target.value })} 
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 transition-colors group-focus-within:text-[#946C44]" />
                <input 
                  type="password" 
                  placeholder="New password" 
                  required
                  className="w-full pl-12 pr-4 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-[#F8F7F5] outline-none border-2 border-transparent focus:border-[#946C44] transition-all text-sm sm:text-base"
                  onChange={e => setFormData({ ...formData, newPassword: e.target.value })} 
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3.5 sm:py-4 mt-4 rounded-xl sm:rounded-2xl bg-[#946C44] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#946C44]/20 hover:bg-[#7A5836] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              step === 1 ? "SEND RESET CODE" : "RESET PASSWORD"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;