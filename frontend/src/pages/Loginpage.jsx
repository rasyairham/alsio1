import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // 1. Simpan Token & Username ke browser
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username); 

      alert(`Selamat Datang, ${res.data.username}!`);
      
      // 2. Lempar ke Home dan paksa refresh agar Navbar update otomatis
      window.location.href = "/"; 
      
    } catch (err) {
      alert(err.response?.data?.message || "Login Gagal!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md w-full max-w-md shadow-2xl relative overflow-hidden">
        {/* Dekorasi Cahaya di Belakang Form */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full"></div>
        
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Login ALSIO</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Masukkan detail akun kamu</p>
        
        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
          <div className="space-y-2">
            <label className="text-xs text-gray-400 ml-1">Email</label>
            <input 
              type="email" 
              placeholder="nama@email.com" 
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all"
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-gray-400 ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all"
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required
            />
          </div>

          <button className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all transform active:scale-95">
            Masuk Sekarang
          </button>
        </form>

        <p className="text-center text-gray-500 mt-8 text-sm">
          Belum punya akun? <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">Daftar gratis</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;