import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false); // Tambahkan loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Mulai loading

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // 1. SIMPAN SEMUA DATA PENTING
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username); 
      localStorage.setItem('email', res.data.email); 
      // Simpan string kosong jika profileImage null agar tidak tersimpan sebagai string "null"
      localStorage.setItem('userImage', res.data.profileImage || ""); 

      // 2. Navigasi
      // Gunakan window.location.href jika ingin refresh total, 
      // atau navigate("/") jika Navbar kamu sudah menggunakan event listener 'storage'
      window.location.href = "/"; 
      
    } catch (err) {
      // Tampilkan pesan error yang lebih spesifik jika ada
      alert(err.response?.data?.message || "Login Gagal! Periksa koneksi atau akun anda.");
    } finally {
      setIsLoading(false); // Matikan loading
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Dekorasi Background */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full"></div>
      
      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md w-full max-w-md shadow-2xl relative z-10">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Login ALSIO</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Masuk untuk melanjutkan petualanganmu</p>
        
        <form onSubmit={handleLogin} className="space-y-5 mt-6">
          <div className="space-y-2">
            <label className="text-xs text-gray-400 ml-1 uppercase font-bold tracking-widest">Email Address</label>
            <input 
              type="email" 
              placeholder="nama@email.com" 
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-400 ml-1 uppercase font-bold tracking-widest">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 ${isLoading ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-500'} text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all transform active:scale-95 flex items-center justify-center gap-2`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Memproses...
              </>
            ) : "Masuk Sekarang"}
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