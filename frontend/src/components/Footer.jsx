import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white border-t border-white/5 py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        
        {/* Konten Utama Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
          
          {/* Logo & Slogan */}
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-2xl font-black tracking-tighter">ALSIO</h2>
            <p className="text-gray-500 text-sm max-w-xs">
              Sistem Manajemen Aset & Logistik Digital Masa Depan untuk Sekolah.
            </p>
          </div>

          {/* Navigasi Cepat (Simpel) */}
          <div className="flex gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-blue-400 transition-colors">Bantuan</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Privasi</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Kontak</a>
          </div>

        </div>

        {/* Baris Hak Cipta */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 space-y-4 md:space-y-0">
          <p>© 2026 Kelompok 8 - Kelas XII SIJA A. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <span className="text-red-500">❤️</span>
            <span>using React + Vite</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;