import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert("Registrasi Berhasil! Silakan Login.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.msg || "Gagal Registrasi");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-md w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">Buat Akun</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Daftar untuk akses fitur ALSIO</p>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <input 
            type="text" placeholder="Username" 
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none transition-all"
            onChange={(e) => setFormData({...formData, username: e.target.value})} 
          />
          <input 
            type="email" placeholder="Email Sekolah" 
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none transition-all"
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
          <input 
            type="password" placeholder="Password" 
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500 outline-none transition-all"
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
          />
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all pt-4">
            Daftar Sekarang
          </button>
        </form>
        <p className="text-center text-gray-500 mt-6 text-sm">
          Sudah punya akun? <Link to="/login" className="text-blue-400 hover:underline">Login di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;