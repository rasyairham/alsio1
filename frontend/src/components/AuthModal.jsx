import { useNavigate } from "react-router-dom";

const AuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null; // Jika tidak open, jangan gambar apa-apa

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl w-[90%] max-w-sm text-center shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Akses Terbatas</h2>
        <p className="text-gray-400 mb-6 text-sm">Silakan masuk ke akun ALSIO kamu untuk melanjutkan.</p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => { navigate("/login"); onClose(); }}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all"
          >
            Login
          </button>
          <button 
            onClick={() => { navigate("/register"); onClose(); }}
            className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl transition-all"
          >
            Belum punya akun? Daftar
          </button>
        </div>

        <button onClick={onClose} className="mt-4 text-gray-500 hover:text-white text-xs underline">
          Nanti Saja
        </button>
      </div>
    </div>
  );
};

export default AuthModal;