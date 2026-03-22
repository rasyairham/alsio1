import React from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-slate-950 text-white overflow-x-hidden">
      
      {/* BACKGROUND DECORATION (Efek Cahaya) */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 blur-[100px] rounded-full"></div>
      </div>

      {/* 1. HERO SECTION (HOME) */}
      <section id="home" className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 relative">
        <div className="text-center space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          {/* Badge Kecil */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-4 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Project ALSIO v1.0 — Kelompok 8
          </div>

          {/* Judul Utama */}
          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[1.1]">
            Sistem Informasi <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500">
              Aset & Logistik
            </span>
          </h1>

          {/* Deskripsi */}
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Optimalkan pengelolaan inventaris sekolah Anda dengan platform ALSIO. 
            Cepat, transparan, dan terorganisir dalam satu sistem terintegrasi.
          </p>

          {/* Tombol Aksi */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button 
              onClick={() => navigate("/register")}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/25 active:scale-95 text-lg"
            >
              Mulai Sekarang
            </button>
            <button 
              onClick={() => document.getElementById("feature")?.scrollIntoView({ behavior: "smooth" })} 
              className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold transition-all backdrop-blur-md active:scale-95 text-lg"
            >
              Pelajari Fitur
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-24 border-t border-white/10 pt-12 w-full max-w-5xl text-center">
          <div className="space-y-1">
            <p className="text-4xl font-black text-blue-500">100%</p>
            <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">React Architecture</p>
          </div>
          <div className="space-y-1">
            <p className="text-4xl font-black text-indigo-500">Vite</p>
            <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Ultra Fast Load</p>
          </div>
          <div className="hidden md:block space-y-1">
            <p className="text-4xl font-black text-purple-500">Tailwind</p>
            <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Modern Design</p>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-white/[0.01]">
        <div className="max-w-4xl text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-6xl font-black">Tentang ALSIO</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>
          
          <p className="text-gray-400 text-xl md:text-2xl leading-relaxed font-medium italic">
            "Membangun efisiensi melalui transparansi data aset."
          </p>
          
          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
            ALSIO (Sistem Informasi Aset & Logistik) adalah solusi digital modern yang dirancang khusus 
            untuk membantu instansi pendidikan dalam mengelola aset berharga mereka. Dari pelacakan lokasi hingga audit inventaris, 
            semua dilakukan secara profesional dan otomatis.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 text-left">
             <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                <h4 className="text-blue-400 font-bold mb-2">Misi Kami</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Menghilangkan birokrasi manual dalam pendataan barang sekolah dan beralih ke sistem cloud yang aman.</p>
             </div>
             <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                <h4 className="text-purple-400 font-bold mb-2">Visi Kami</h4>
                <p className="text-sm text-gray-500 leading-relaxed">Menjadi standar utama platform manajemen logistik untuk seluruh sekolah di Indonesia.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURE SECTION */}
      <section id="feature" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black">Fitur Unggulan</h2>
          <p className="text-gray-500 max-w-lg mx-auto font-medium">Teknologi canggih untuk mempermudah pekerjaan admin logistik setiap hari.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          {/* Card 1 */}
          <div className="group bg-zinc-900/50 border border-white/10 p-10 rounded-3xl hover:border-blue-500/50 transition-all hover:-translate-y-2 duration-300 relative">
            <div className="w-16 h-16 bg-blue-500/20 text-blue-400 flex items-center justify-center rounded-2xl mb-8 text-3xl group-hover:scale-110 transition-transform">
              <i className="ri-dashboard-3-line"></i>
            </div>
            <h3 className="text-2xl font-bold mb-4">Dashboard Terpusat</h3>
            <p className="text-gray-500 text-base leading-relaxed">
              Pantau total aset, barang dipinjam, dan perbaikan secara real-time dalam satu tampilan dashboard interaktif.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group bg-zinc-900/50 border border-white/10 p-10 rounded-3xl hover:border-purple-500/50 transition-all hover:-translate-y-2 duration-300 relative">
            <div className="w-16 h-16 bg-purple-500/20 text-purple-400 flex items-center justify-center rounded-2xl mb-8 text-3xl group-hover:scale-110 transition-transform">
              <i className="ri-qr-code-line"></i>
            </div>
            <h3 className="text-2xl font-bold mb-4">Pelacakan Cerdas</h3>
            <p className="text-gray-500 text-base leading-relaxed">
              Temukan lokasi dan status barang dengan sistem labeling modern tanpa perlu mencatat manual lagi.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-zinc-900/50 border border-white/10 p-10 rounded-3xl hover:border-pink-500/50 transition-all hover:-translate-y-2 duration-300 relative">
            <div className="w-16 h-16 bg-pink-500/20 text-pink-400 flex items-center justify-center rounded-2xl mb-8 text-3xl group-hover:scale-110 transition-transform">
              <i className="ri-file-chart-line"></i>
            </div>
            <h3 className="text-2xl font-bold mb-4">Laporan Otomatis</h3>
            <p className="text-gray-500 text-base leading-relaxed">
              Hasilkan laporan inventaris dan audit dalam hitungan detik untuk kebutuhan dokumentasi resmi.
            </p>
          </div>
        </div>
      </section>

      <section id="contact" className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-20 border-t border-white/5">
        <div className="max-w-4xl w-full text-center space-y-10 bg-gradient-to-tr from-blue-600/10 via-transparent to-purple-600/10 p-10 md:p-20 rounded-[40px] border border-white/5 backdrop-blur-sm relative overflow-hidden">
          
          <div className="space-y-4 relative z-10">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">Butuh Bantuan?</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Tim Kelompok 8 siap membantu Anda. Hubungi kami untuk konsultasi penggunaan sistem atau laporan bug.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-4 relative z-10">
            <a href="mailto:contact@alsio.com" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 group text-lg">
              <i className="ri-mail-send-line text-blue-400 group-hover:rotate-12 transition-transform"></i> Kirim Email
            </a>
            <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 group text-lg">
              <i className="ri-whatsapp-line text-green-400 group-hover:rotate-12 transition-transform"></i> WhatsApp
            </a>
          </div>
        </div>
        
        {/* Simple Footer */}
        <footer className="mt-20 text-gray-600 text-sm font-medium">
          © {new Date().getFullYear()} ALSIO Team. All Rights Reserved.
        </footer>
      </section>

    </div>
  );
};

export default Homepage;