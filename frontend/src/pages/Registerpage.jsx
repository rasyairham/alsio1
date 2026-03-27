import React, { useState } from 'react';
// PERBAIKAN: Mengarah ke file axios.js sesuai standarisasi kita
import api from '../api/axios'; 
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
    // Notifikasi hilang otomatis dalam 5 detik
    setTimeout(() => setNotification({ message: "", type: "" }), 5000);
  };

  const handleRequestOTP = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setEmailError("");
    
    try {
      // PERBAIKAN: Endpoint untuk mengirim kode verifikasi ke email
      await api.post('/auth/send-otp', {
        email: formData.email,
        username: formData.username
      });
      showNotification("OTP code has been sent to your email.", "success");
      setStep(2); // Pindah ke tahap verifikasi OTP
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send code. Please try again.";
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
      // PERBAIKAN: Mengirim semua data (termasuk OTP) ke backend
      await api.post('/auth/register', formData);
      showNotification("Account created! Redirecting to login...", "success");
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      showNotification(err.response?.data?.message || "Invalid OTP code. Please check again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{fontStyle}</style>
      <div className="flex flex-col min-h-screen bg-[#FAF7F4] antialiased" style={POP}>
        <div className="flex-grow flex flex-col items-center justify-center p-6">
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#C17A3A]/10 blur-[120px] rounded-full"></div>
            <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#A0652E]/10 blur-[120px] rounded-full"></div>
          </div>

          <div className="w-full max-w-[1050px] mb-4 z-20">
            <button 
              onClick={() => step === 2 ? setStep(1) : navigate('/')}
              className="flex items-center gap-2 text-[#C17A3A] hover:text-[#A0652E] transition-all group font-bold text-sm"
              style={PJS}
            >
              <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:shadow-md group-hover:-translate-x-1 transition-all">
                <i className="ri-arrow-left-line text-lg"></i>
              </div>
              <span>{step === 2 ? "Back to Edit Info" : "Back to Home"}</span>
            </button>
          </div>

          <div className="w-full max-w-[1050px] h-auto md:min-h-[583px] bg-white rounded-[32px] shadow-[0_1px_9px_rgba(0,0,0,0.15)] flex flex-col md:flex-row overflow-hidden relative z-10 transition-all duration-500">
            <div
              className="hidden md:flex w-full md:w-[525px] bg-cover bg-center p-12 flex-col justify-end relative overflow-hidden z-20 transition-all"
              style={{ backgroundImage: "url('/images/Left_Panel.png')" }}
            >
              <div className="z-10 text-white">
                <h1 className="text-5xl leading-tight mb-4 tracking-tighter" style={{ ...PJS, fontWeight: 900 }}>
                  {step === 1 ? "Start Your Journey." : "Email Verification."}
                </h1>
                <p style={{ ...PJS, fontWeight: 700, fontSize: "16px" }}>
                  {step === 1 
                    ? "Create an account and boost your productivity with ALSIO." 
                    : "Check your email. We've sent a secret code for verification."}
                </p>
              </div>
            </div>

            <div className="w-full md:w-[525px] p-8 md:p-16 bg-white flex flex-col justify-center">
              <div className="mb-4 text-center md:text-left">
                <h2 className="text-3xl text-[#111] tracking-tight mb-2" style={{ ...PJS, fontWeight: 900, fontSize: "32px" }}>
                  {step === 1 ? "Create Account" : "Confirm Email"}
                </h2>
                <p style={{ ...POP, fontWeight: 600, fontSize: "11px", color: "#666", letterSpacing: "-0.2px" }}>
                  {step === 1 
                    ? "Join ALSIO and manage your tasks efficiently." 
                    : `Enter the 6-digit code sent to ${formData.email}`}
                </p>
              </div>

              {notification && (
                <div className="mb-4 p-3 text-sm text-white bg-[#C29976] rounded-lg text-center animate-in fade-in">
                  {notification}
                </div>
              )}

              <form onSubmit={step === 1 ? handleRequestOTP : handleFinalRegister} className="space-y-4">
                {step === 1 ? (
                  <>
                    <div className="space-y-2 group">
                      <label className="text-[13px] text-[#0C0C0D] tracking-normal ml-1 transition-colors group-focus-within:text-[#C17A3A]" style={{ ...PJS, fontWeight: 700 }}>
                        Username
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 text-gray-300 group-focus-within:text-[#C17A3A] transition-colors">
                          <User className="w-5 h-5" />
                        </span>
                        <input
                          type="text"
                          placeholder="Enter your username"
                          required
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#F8F7F5] border-2 border-transparent focus:border-[#C17A3A] focus:bg-white outline-none transition-all text-sm"
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          value={formData.username}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 group">
                      <label className="text-[13px] text-[#0C0C0D] tracking-normal ml-1 transition-colors group-focus-within:text-[#C17A3A]" style={{ ...PJS, fontWeight: 700 }}>
                        Email Address
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 text-gray-300 group-focus-within:text-[#C17A3A] transition-colors">
                          <Mail className="w-5 h-5" />
                        </span>
                        <input
                          type="email"
                          placeholder="email@example.com"
                          required
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#F8F7F5] border-2 border-transparent focus:border-[#C17A3A] focus:bg-white outline-none transition-all text-sm"
                          onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setEmailError(""); }}
                          value={formData.email}
                        />
                      </div>
                      {emailError && <span className="text-red-500 text-[10px] ml-2">{emailError}</span>}
                    </div>

                    <div className="space-y-2 group">
                      <label className="text-[13px] text-[#0C0C0D] tracking-normal ml-1 transition-colors group-focus-within:text-[#C17A3A]" style={{ ...PJS, fontWeight: 700 }}>
                        Password
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 text-gray-300 group-focus-within:text-[#C17A3A] transition-colors">
                          <Lock className="w-5 h-5" />
                        </span>
                        <input
                          type="password"
                          placeholder="At least 6 characters"
                          required
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#F8F7F5] border-2 border-transparent focus:border-[#C17A3A] focus:bg-white outline-none transition-all text-sm"
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          value={formData.password}
                        />
                      </div>
                      {formData.password && formData.password.length < 6 && (
                        <span className="text-[10px] text-red-500 ml-2">Password too short!</span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-4 group animate-in fade-in slide-in-from-bottom-2">
                    <label className="text-[13px] text-[#0C0C0D] tracking-normal text-center block w-full transition-colors group-focus-within:text-[#C17A3A]" style={{ ...PJS, fontWeight: 700 }}>
                      Security Code
                    </label>
                    <div className="relative flex items-center justify-center">
                      <span className="absolute left-4 text-gray-300 group-focus-within:text-[#C17A3A] transition-colors">
                        <ShieldCheck className="w-5 h-5" />
                      </span>
                      <input
                        type="text"
                        placeholder="------"
                        maxLength="6"
                        required
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F8F7F5] border-2 border-[#C17A3A]/20 focus:border-[#C17A3A] focus:bg-white outline-none text-2xl text-center font-bold tracking-[10px]"
                        onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                        value={formData.otp}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 text-center">
                      Didn't receive a code?{' '}
                      <span className="text-[#C17A3A] cursor-pointer hover:underline" onClick={handleRequestOTP}>Resend</span>
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[45px] rounded-2xl uppercase tracking-[2px] flex items-center justify-center gap-3 text-white shadow-lg transition-all transform active:scale-[0.98] overflow-hidden hover:opacity-90 disabled:opacity-50 mt-4"
                  style={{ ...PJS, fontWeight: 800, fontSize: "13px", backgroundImage: "url('/images/Login_Button.png')", backgroundSize: "cover", backgroundPosition: "center" }}
                >
                  {isLoading ? "Please Wait..." : (step === 1 ? "GET VERIFIED" : "FINISH REGISTRATION")}
                </button>
              </form>

              <p className="mt-8 text-center text-gray-400 text-xs" style={{ ...POP, fontWeight: 500 }}>
                Already have an account?{' '}
                <Link to="/login" className="text-[#C29976] hover:underline underline-offset-4 font-bold" style={PJS}>Login Now</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;