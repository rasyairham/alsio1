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
    <div className="min-h-screen bg-[#FAF7F4] flex items-center justify-center p-6">
      <div className="w-full max-w-[450px] bg-white p-8 rounded-[32px] shadow-lg">
        <button onClick={() => navigate('/login')} className="mb-6 flex items-center gap-2 text-sm text-[#946C44] hover:text-[#7A5836] transition-colors font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </button>

        <h2 className="text-2xl font-black mb-2 text-[#111]">{step === 1 ? "Forgot Password?" : "Create New Password"}</h2>
        <p className="text-xs text-gray-500 mb-6 font-medium">
          {step === 1 
            ? "Enter your email to receive a 6-digit reset code."
            : "Enter the OTP code sent to your email and create a new password."}
        </p>

        {status && <p className={`text-sm text-center mb-4 ${status==='success'?'text-green-500':status==='error'?'text-red-500':'text-yellow-500'}`}>{message}</p>}

        <form onSubmit={step===1?handleSendOTP:handleReset} className="space-y-4">
          {step===1 ? (
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-gray-300 w-5 h-5" />
              <input type="email" placeholder="Your registered email" required
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F8F7F5] outline-none border-2 border-transparent focus:border-[#946C44]"
                onChange={e=>setFormData({...formData,email:e.target.value})} />
            </div>
          ) : (
            <>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-4 text-gray-300 w-5 h-5" />
                <input type="text" placeholder="6-digit OTP" required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F8F7F5] outline-none border-2 border-transparent focus:border-[#946C44]"
                  onChange={e=>setFormData({...formData,otp:e.target.value})} />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-gray-300 w-5 h-5" />
                <input type="password" placeholder="New password" required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F8F7F5] outline-none border-2 border-transparent focus:border-[#946C44]"
                  onChange={e=>setFormData({...formData,newPassword:e.target.value})} />
              </div>
            </>
          )}
          <button type="submit" disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-[#946C44] text-white font-bold text-sm shadow-md hover:opacity-90 transition-all">
            {isLoading ? "Processing..." : step===1?"SEND RESET CODE":"RESET PASSWORD"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;