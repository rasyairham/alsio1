import { useNavigate } from "react-router-dom";

const AuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md px-0 sm:px-6 transition-all duration-300">
      
      {/* Overlay Close Area (Click outside to close) */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[3.5rem] p-8 md:p-12 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] sm:shadow-2xl relative animate-in slide-in-from-bottom duration-500 sm:zoom-in-95">
        
        {/* Mobile Indicator Bar (Hanya muncul di HP) */}
        <div className="w-12 h-1.5 bg-zinc-100 rounded-full mx-auto mb-6 sm:hidden"></div>

        {/* Brand Icon Area */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F8F5F2] rounded-2xl sm:rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-inner">
          <i className="ri-shield-keyhole-fill text-[#C29976] text-3xl sm:text-4xl"></i>
        </div>

        {/* Text Content */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 mb-2 tracking-tighter uppercase italic">
            Mission Locked
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-medium leading-relaxed px-2">
            Please log in to your <span className="text-[#C29976] font-bold">ALSIO</span> command center to proceed with your mission.
          </p>
        </div>
        
        {/* Responsive Action Buttons */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <button 
            onClick={() => { navigate("/login"); onClose(); }}
            className="w-full py-5 sm:py-6 bg-[#111] hover:bg-[#C29976] text-white font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] rounded-2xl sm:rounded-[2rem] transition-all shadow-lg active:scale-95"
          >
            Authenticate Login
          </button>
          
          <button 
            onClick={() => { navigate("/register"); onClose(); }}
            className="w-full py-5 sm:py-6 bg-zinc-50 hover:bg-zinc-100 text-zinc-900 font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] border border-zinc-200 rounded-2xl sm:rounded-[2rem] transition-all active:scale-95"
          >
            Create New Profile
          </button>
        </div>

        {/* Cancel Link */}
        <div className="mt-6 sm:mt-8 text-center">
          <button 
            onClick={onClose} 
            className="text-zinc-300 hover:text-zinc-500 text-[10px] font-bold uppercase tracking-widest transition-colors"
          >
            Return to Safety
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;