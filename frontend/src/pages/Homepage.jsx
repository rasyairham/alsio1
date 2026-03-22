import React from 'react';

const Homepage = () => {
  return (
    <div className="w-full bg-slate-950 text-white">
      
      {/* 1. HERO SECTION (HOME) */}
      <section id="home" className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
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

          {/* Tombol Aksi */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20">
              Mulai Sekarang
            </button>
            <button 
              onClick={() => document.getElementById("feature")?.scrollIntoView({ behavior: "smooth" })} 
              className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all"
            >
              Pelajari Fitur
            </button>
          </div>

        </div>

        {/* Stats */}
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
      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="min-h-screen flex flex-col items-center justify-center px-6 border-t border-white/5">
        <div className="max-w-4xl text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">Tentang ALSIO</h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
          <p className="text-gray-400 text-lg leading-relaxed">
            ALSIO (Sistem Informasi Aset & Logistik) adalah platform digital yang dirancang untuk membantu instansi dan sekolah dalam mendata, melacak, dan mengelola inventaris aset mereka secara profesional dan *real-time*. Proyek ini merupakan hasil karya Kelompok 8 yang didekasikan untuk memajukan tata kelola aset yang transparan.
          </p>
        </div>
      </section>

      {/* 3. FEATURE SECTION */}
      <section id="feature" className="min-h-screen flex flex-col items-center justify-center px-6 border-t border-white/5 py-20">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">Fitur Unggulan</h2>
          <p className="text-gray-400">Solusi tepat untuk manajemen aset logistik Anda.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
          {/* Card 1 */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
            <div className="w-14 h-14 bg-blue-500/20 text-blue-400 flex items-center justify-center rounded-xl mb-6 text-2xl">
              <i className="ri-dashboard-3-line"></i>
            </div>
            <h3 className="text-xl font-bold mb-3">Dashboard Terpusat</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Pantau total aset, barang dipinjam, dan perbaikan secara real-time dalam satu tampilan dashboard interaktif.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
            <div className="w-14 h-14 bg-purple-500/20 text-purple-400 flex items-center justify-center rounded-xl mb-6 text-2xl">
              <i className="ri-qr-code-line"></i>
            </div>
            <h3 className="text-xl font-bold mb-3">Pelacakan Mudah</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Temukan lokasi dan status barang dengan cepat tanpa perlu mencatat manual di buku besar.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
            <div className="w-14 h-14 bg-pink-500/20 text-pink-400 flex items-center justify-center rounded-xl mb-6 text-2xl">
              <i className="ri-file-chart-line"></i>
            </div>
            <h3 className="text-xl font-bold mb-3">Laporan Otomatis</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Hasilkan laporan inventaris dan audit dalam hitungan detik untuk diekspor ke format yang dibutuhkan.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CONTACT SECTION */}
      <section id="contact" className="min-h-screen flex flex-col items-center justify-center px-6 border-t border-white/5">
        <div className="max-w-2xl text-center space-y-8 bg-gradient-to-b from-blue-900/20 to-transparent p-10 md:p-16 rounded-3xl border border-blue-500/10">
          <h2 className="text-4xl md:text-5xl font-bold">Hubungi Kami</h2>
          <p className="text-gray-400 text-lg">
            Punya pertanyaan mengenai sistem ALSIO atau ingin melaporkan kendala? Jangan ragu untuk menghubungi tim pengembang kami.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a href="mailto:emailmu@domain.com" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
              <i className="ri-mail-send-line text-blue-400"></i> Kirim Email
            </a>
            <a href="https://wa.me/0800000" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-all flex items-center justify-center gap-2">
              <i className="ri-whatsapp-line text-green-400"></i> WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Homepage;