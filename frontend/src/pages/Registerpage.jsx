import React, { useState } from 'react';
// PERBAIKAN: Import dari file konfigurasi api kamu
import api from '../api/axios'; 
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, ArrowLeft } from "lucide-react";

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&family=Poppins:wght@400;500;600&display=swap');
`;

const PJS = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const POP = { fontFamily: "'Poppins', sans-serif" };

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', otp: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [notification, setNotification] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 4000);
  };

  const handleRequestOTP = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      // PERBAIKAN: Menggunakan relative path dan instance 'api'
      await api.post('/auth/send-otp', {
        email: formData.email,
        password: formData.password
      });
      showNotification("OTP code has been sent to your email.");
      setEmailError("");
      setStep(2);
    } catch (err) {
      if (err.response?.data?.message?.toLowerCase().includes("email")) {
        setEmailError("This email is already registered.");
      } else {
        showNotification(err.response?.data?.message || "Failed to send code.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // PERBAIKAN: Menggunakan relative path dan instance 'api'
      await api.post('/auth/register', formData);
      showNotification("Welcome to ALSIO!");
      navigate('/login');
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
        
        {/* Background Blobs */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[60%] sm:w-[40%] h-[40%] bg-[#C17A3A]/10 blur-[80px] sm:blur-[120px] rounded-full"></div>
          <div className="absolute -bottom-[10%] -right-[10%] w-[60%] sm:w-[40%] h-[40%] bg-[#A0652E]/10 blur-[80px] sm:blur-[120px] rounded-full"></div>
        </div>

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

        {/* Main Card Container */}
        <div className="w-full max-w-[1050px] mx-auto bg-white rounded-[24px] sm:rounded-[32px] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] flex flex-col lg:flex-row overflow-hidden relative z-10 transition-all duration-500 min-h-[500px]">
          
          <div
            className="hidden lg:flex w-1/2 bg-cover bg-center p-12 flex-col justify-end relative overflow-hidden transition-all"
            style={{ backgroundImage: "url('/images/Left_Panel.png')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="relative z-10 text-white">
              <h1 className="text-4xl xl:text-5xl leading-tight mb-4 tracking-tighter" style={{ ...PJS, fontWeight: 900 }}>
                {step === 1 ? "Start Your Journey." : "Email Verification."}
              </h1>
              <p className="text-base opacity-90" style={{ ...PJS, fontWeight: 600 }}>
                {step === 1 
                  ? "Create an account and boost your productivity with ALSIO." 
                  : "Check your email. We've sent a secret code for verification."}
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl text-[#111] tracking-tight mb-2" style={{ ...PJS, fontWeight: 900 }}>
                {step === 1 ? "Create Account" : "Confirm Email"}
              </h2>
              <p className="text-[11px] sm:text-[12px] font-semibold text-gray-500 tracking-tight leading-relaxed">
                {step === 1 
                  ? "Join ALSIO and manage your tasks efficiently." 
                  : `Enter the 6-digit code sent to ${formData.email}`}
              </p>
            </div>

            {notification && (
              <div className="mb-6 p-4 text-xs font-bold text-[#A0652E] bg-[#C29976]/10 border border-[#C29976]/20 rounded-xl text-center animate-in fade-in slide-in-from-top-1">
                {notification}
              </div>
            )}

            <form onSubmit={step === 1 ? handleRequestOTP : handleFinalRegister} className="space-y-5">
              {step === 1 ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-2 group">
                    <label className="text-xs text-[#0C0C0D] ml-1 group-focus-within:text-[#C17A3A] transition-colors" style={{ ...PJS, fontWeight: 700 }}>
                      Username
                    </label>
                    <div className="relative flex items-center">
                      <User className="absolute left-4 w-5 h-5 text-gray-300 group-focus-within:text-[#C17A3A] transition-colors" />
                      <input
                        type="text"
                        placeholder="Choose a username"
                        required
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl sm:rounded-2xl bg-[#F8F7F5] border-2 border-transparent focus:border-[#C17A3A] focus:bg-white outline-none transition-all text-sm"
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        value={formData.username}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-xs text-[#0C0C0D] ml-1 group-focus-within:text-[#C17A3A] transition-colors" style={{ ...PJS, fontWeight: 700 }}>
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-4 w-5 h-5 text-gray-300 group-focus-within:text-[#C17A3A] transition-colors" />
                      <input
                        type="email"
                        placeholder="email@example.com"
                        required
                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl sm:rounded-2xl bg-[#F8F7F5] border-2 outline-none transition-all text-sm ${emailError ? 'border-red-400 bg-red-50' : 'border-transparent focus:border-[#C17A3A] focus:bg-white'}`}
                        onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setEmailError(""); }}
                        value={formData.email}
                      />
                    </div>
                    {emailError && <span className="text-red-500 text-[10px] font-bold ml-2">{emailError}</span>}
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-xs text-[#0C0C0D] ml-1 group-focus-within:text-[#C17A3A] transition-colors" style={{ ...PJS, fontWeight: 700 }}>
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-4 w-5 h-5 text-gray-300 group-focus-within:text-[#C17A3A] transition-colors" />
                      <input
                        type="password"
                        placeholder="At least 6 characters"
                        required
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl sm:rounded-2xl bg-[#F8F7F5] border-2 border-transparent focus:border-[#C17A3A] focus:bg-white outline-none transition-all text-sm"
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        value={formData.password}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="space-y-4">
                    <label className="text-xs text-[#0C0C0D] text-center block font-bold" style={PJS}>
                      Security Code
                    </label>
                    <div className="relative flex items-center justify-center group">
                      <ShieldCheck className="absolute left-4 w-6 h-6 text-gray-300 group-focus-within:text-[#C17A3A] transition-colors" />
                      <input
                        type="text"
                        placeholder="000000"
                        maxLength="6"
                        required
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F8F7F5] border-2 border-[#C17A3A]/20 focus:border-[#C17A3A] focus:bg-white outline-none text-xl sm:text-2xl text-center font-black tracking-[8px] sm:tracking-[12px]"
                        onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                        value={formData.otp}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 text-center font-medium">
                      Didn't receive a code?{' '}
                      <button type="button" className="text-[#C17A3A] font-bold hover:underline" onClick={handleRequestOTP}>Resend</button>
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[50px] sm:h-[55px] rounded-xl sm:rounded-2xl uppercase tracking-[2px] flex items-center justify-center gap-3 text-white shadow-xl transition-all transform active:scale-[0.98] overflow-hidden hover:opacity-90 disabled:opacity-50 mt-6 group"
                style={{ ...PJS, fontWeight: 800, fontSize: "12px", backgroundImage: "url('/images/Login_Button.png')", backgroundSize: "cover", backgroundPosition: "center" }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span>{step === 1 ? "Verify Email" : "Complete Registration"}</span>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-400 text-xs font-medium" style={POP}>
                Already have an account?{' '}
                <Link to="/login" className="text-[#C29976] hover:text-[#A0652E] font-bold ml-1 transition-colors" style={PJS}>Login Now</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;