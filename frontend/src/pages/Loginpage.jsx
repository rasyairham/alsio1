import React, { useState } from 'react';
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
      const res = await api.post('/auth/login', {
        identifier: formData.identifier.trim(),
        password: formData.password
      });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        if (res.data.user) localStorage.setItem('user', JSON.stringify(res.data.user));
        setSuccessMsg(`Welcome back, ${res.data.user?.username || 'Commander'}!`);
        setTimeout(() => navigate('/dashboard'), 1200);
      }
    } catch (err) {
      const backendMsg = err.response?.data?.message || "Invalid credentials.";
      setErrorMsg(backendMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{fontStyle}</style>
      <div className="min-h-screen bg-[#FAF7F4] flex flex-col items-center justify-center p-6 antialiased" style={POP}>
        <div className="w-full max-w-[1050px] mb-4 z-20">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#946C44] hover:text-[#7A5836] transition-all group font-bold text-sm"
            style={PJS}
          >
            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:shadow-md group-hover:-translate-x-1 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span>Back to Home</span>
          </button>
        </div>

        <div className="w-full max-w-[1050px] h-auto md:h-[583px] bg-white rounded-[32px] shadow-lg flex flex-col md:flex-row overflow-hidden">
          <div
            className="hidden md:flex w-full md:w-[525px] h-[300px] md:h-full bg-cover bg-center p-12 flex-col justify-end"
            style={{ backgroundImage: "url('/images/Left_Panel.png')" }}
          >
            <h1 className="text-5xl text-white leading-tight mb-4 font-bold">Welcome.</h1>
            <p className="text-white font-bold text-sm">
              Ready to continue your mission? Enter the floating hall and start your productivity today.
            </p>
          </div>

          <div className="w-full md:w-[525px] h-full p-8 md:p-16 flex flex-col justify-center">
            <h2 className="text-3xl text-[#111] font-bold mb-2">Welcome Back</h2>
            <p className="text-xs font-medium text-gray-900 mb-6">
              Stay on track, complete your quests, and improve your skills with ALSIO.
            </p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-300"><User className="w-5 h-5"/></span>
                <input
                  type="text"
                  placeholder="Username / Email"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#F8F7F5] border-2 border-transparent focus:border-[#946C44] focus:bg-white outline-none text-sm"
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                />
              </div>

              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-300"><Lock className="w-5 h-5"/></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-4 rounded-2xl bg-[#F8F7F5] border-2 border-transparent focus:border-[#946C44] focus:bg-white outline-none text-sm"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-gray-300 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                </button>
              </div>

              {errorMsg && <p className="text-red-500 text-[10px]">{errorMsg}</p>}
              {successMsg && <p className="text-[#946C44] text-[10px]">{successMsg}</p>}

              <div className="flex justify-between items-center">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="hidden" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)}/>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${rememberMe ? "border-[#946C44] bg-[#946C44]" : "border-gray-300 bg-white"}`}>
                    {rememberMe && <Check className="w-3 h-3 text-white"/>}
                  </div>
                  <span className="ml-2 text-xs font-bold">Remember Me</span>
                </label>
                <Link to="/forgot-password" className="text-xs text-[#946C44] hover:text-[#7A5836] font-bold">Forgot Password?</Link>
              </div>

              <button type="submit" disabled={isLoading} className="w-full h-[40px] rounded-2xl flex items-center justify-center text-white mt-4" style={{ backgroundImage: "url('/images/Login_Button.png')", backgroundSize: "cover" }}>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2"/> : null} LOGIN
              </button>
            </form>

            <p className="mt-8 text-center text-gray-400 text-xs">
              Don't have an account? <Link to="/register" className="text-[#946C44] font-bold">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;