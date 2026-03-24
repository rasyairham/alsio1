import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck } from "lucide-react";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: Reset Form
  const [formData, setFormData] = useState({ email: '', otp: '', newPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email: formData.email });
      alert("OTP Terkirim!");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengirim OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', formData);
      alert("Password Berhasil Diganti!");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Gagal reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F4] flex items-center justify-center p-6">
      <div className="w-full max-w-[450px] bg-white p-8 rounded-[32px] shadow-lg">
        <h2 className="text-2xl font-black mb-2 text-[#111]">
          {step === 1 ? "Forgot Password?" : "Create New Password"}
        </h2>
        <p className="text-xs text-gray-500 mb-6 font-medium">
          {step === 1 
            ? "Enter your email and we'll send you a 6-digit code to reset your password."
            : "Enter the OTP code sent to your email and set your new secret key."}
        </p>

        <form onSubmit={step === 1 ? handleSendOTP : handleReset} className="space-y-4">
          {step === 1 ? (
            <div className="relative">
              <Mail className="absolute left-4 top-4 text-gray-300 w-5 h-5" />
              <input
                type="email"
                placeholder="Your Registered Email"
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F8F7F5] outline-none border-2 border-transparent focus:border-[#C17A3A]"
                required
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          ) : (
            <>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-4 text-gray-300 w-5 h-5" />
                <input
                  type="text"
                  placeholder="6-Digit OTP"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F8F7F5] outline-none border-2 border-transparent focus:border-[#C17A3A]"
                  required
                  onChange={(e) => setFormData({...formData, otp: e.target.value})}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-gray-300 w-5 h-5" />
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F8F7F5] outline-none border-2 border-transparent focus:border-[#C17A3A]"
                  required
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-[#C17A3A] text-white font-bold text-sm shadow-md hover:opacity-90 transition-all"
          >
            {isLoading ? "Processing..." : step === 1 ? "SEND RESET CODE" : "RESET PASSWORD"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;