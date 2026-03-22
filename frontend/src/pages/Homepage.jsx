import React from 'react';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6">
      
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl animate-fade-in">
        
        {/* Badge Kecil */}
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
          Project ALSIO v1.0 — Kelompok 8
        </div>

        {/* Judul Utama dengan Gradasi */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
          Sistem Informasi <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Aset & Logistik
          </span>
        </h1>

        {/* Deskripsi */}
        <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
          Selamat datang di platform ALSIO. Saat ini sistem sedang dalam tahap pengembangan 
          untuk mempermudah manajemen aset sekolah secara efisien.
        </p>

        {/* Tombol Aksi (Hanya untuk Visual) */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20">
            Mulai Sekarang
          </button>
          <button className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all">
            Pelajari Fitur
          </button>
        </div>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-20 border-t border-white/5 pt-10 w-full max-w-4xl text-center">
        <div>
          <p className="text-3xl font-bold">100%</p>
          <p className="text-gray-500 text-sm">React Driven</p>
        </div>
        <div>
          <p className="text-3xl font-bold">Vite</p>
          <p className="text-gray-500 text-sm">Fast Build</p>
        </div>
        <div className="hidden md:block">
          <p className="text-3xl font-bold">Tailwind</p>
          <p className="text-gray-500 text-sm">Modern Styling</p>
        </div>
      </div>

    </div>
  );
};

export default Homepage;