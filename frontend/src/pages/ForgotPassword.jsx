import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Mail, LogOut, Edit3, User, ShieldCheck, ChevronLeft, Bell, Star, Trophy, Loader2 } from 'lucide-react';
// PERBAIKAN: Gunakan instance api yang sudah kita buat sebelumnya agar base URL konsisten
import api from '../api/api'; 

const ProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    profileImage: null,
    xp: 0
  });
  
  const [unreadCount, setUnreadCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempData, setTempData] = useState({ username: "", profileImage: null });
  const [loading, setLoading] = useState(false);

  // Configuration Tier List
  const tierList = useMemo(() => [
    { name: "Newbie", xp: 0, color: "text-zinc-400 bg-zinc-100", icon: <Star size={14} />, next: 1000 },
    { name: "Explorer", xp: 1000, color: "text-amber-600 bg-amber-50", icon: <Star size={14} />, next: 5000 },
    { name: "Commander", xp: 5000, color: "text-blue-600 bg-blue-50", icon: <ShieldCheck size={14} />, next: 20000 },
    { name: "Sentinel", xp: 20000, color: "text-emerald-600 bg-emerald-50", icon: <ShieldCheck size={14} />, next: 200000 },
    { name: "Celestial", xp: 200000, color: "text-purple-600 bg-purple-50", icon: <Trophy size={14} />, next: 1000000 },
  ], []);

  const currentTier = useMemo(() => {
    const xp = userData.xp;
    return [...tierList].reverse().find(t => xp >= t.xp) || tierList[0];
  }, [userData.xp, tierList]);

  const progress = useMemo(() => {
    const currentTierXp = currentTier.xp;
    const nextTierXp = currentTier.next;
    const earnedInTier = userData.xp - currentTierXp;
    const neededForNext = nextTierXp - currentTierXp;
    return Math.min(Math.max((earnedInTier / neededForNext) * 100, 0), 100);
  }, [userData.xp, currentTier]);

  const fetchProfileData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      // 1. Ambil Notifikasi
      const resNotif = await api.get("/notifications");
      if (resNotif.data.success) {
        setUnreadCount(resNotif.data.data.filter(n => !n.read).length);
      }

      // 2. Ambil data user terbaru dari server/local
      // PERBAIKAN: Selalu prioritaskan data dari localStorage yang paling update setelah login/edit
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      
      setUserData({
        username: localStorage.getItem("username") || storedUser.username || "Explorer",
        email: localStorage.getItem("email") || storedUser.email || "not-synced@alsio.com",
        xp: parseInt(localStorage.getItem("xp") || storedUser.xp || "0"),
        profileImage: localStorage.getItem("userImage") || storedUser.profileImage || null
      });

    } catch (err) {
      console.error("Sync failed:", err);
      if (err.response?.status === 401) navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const openEditModal = () => {
    setTempData({
      username: userData.username,
      profileImage: userData.profileImage
    });
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) return alert("File too large! Max 2MB.");
      const reader = new FileReader();
      reader.onloadend = () => setTempData(prev => ({ ...prev, profileImage: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.put("/auth/update-profile", {
        username: tempData.username,
        profileImage: tempData.profileImage 
      });

      if (res.data) {
        // PERBAIKAN: Update semua storage key agar konsisten di seluruh app
        localStorage.setItem("username", res.data.username);
        if (res.data.profileImage) localStorage.setItem("userImage", res.data.profileImage);
        
        setUserData(prev => ({
          ...prev,
          username: res.data.username,
          profileImage: res.data.profileImage
        }));
        
        setIsModalOpen(false);
        // Trigger event agar komponen lain (seperti Sidebar) ikut terupdate
        window.dispatchEvent(new Event("storage"));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if(window.confirm("End session and leave the Hall?")) {
        localStorage.clear();
        navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F4] font-sans text-zinc-900 p-4 sm:p-6 pt-24 sm:pt-32 pb-24 relative overflow-hidden">
      <div className="max-w-xl mx-auto relative z-10">
        
        {/* Nav Header */}
        <div className="flex justify-between items-center mb-8 px-2">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-[#C29976] font-black text-[10px] uppercase tracking-widest transition-all">
            <ChevronLeft size={16} /> Back
          </button>
          
          <button onClick={() => navigate('/notifications')} className="relative p-3.5 bg-white rounded-2xl border border-zinc-100 shadow-sm active:scale-90 transition-all">
            <Bell size={20} className={unreadCount > 0 ? "text-[#C29976]" : "text-zinc-300"} />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-[#C29976] border-[3px] border-white rounded-full flex items-center justify-center text-[8px] font-black text-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-[3rem] sm:rounded-[4rem] p-8 sm:p-14 border border-zinc-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] text-center relative">
          
          {/* Avatar Section */}
          <div className="relative inline-block mb-10">
            <div className="absolute inset-0 rounded-[3rem] bg-[#C29976]/10 blur-3xl scale-150"></div>
            <div className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-[2.5rem] sm:rounded-[3.8rem] bg-white p-2 shadow-2xl rotate-3 border border-zinc-50 overflow-hidden">
                {userData.profileImage ? (
                  <img src={userData.profileImage} alt="Profile" className="w-full h-full rounded-[2.2rem] sm:rounded-[3.2rem] object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-900 rounded-[2.2rem] sm:rounded-[3.2rem] text-white text-4xl sm:text-6xl font-black italic">
                    {userData.username ? userData.username.charAt(0) : "A"}
                  </div>
                )}
            </div>
          </div>

          {/* User Info & Tier */}
          <div className="mb-10">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-zinc-900 mb-3 truncate">{userData.username}</h1>
            
            <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-black tracking-[0.2em] text-[9px] uppercase italic mb-6 shadow-sm border border-black/5 ${currentTier.color}`}>
                {currentTier.icon} {currentTier.name} Tier
            </div>

            {/* Progress Bar */}
            <div className="max-w-[220px] mx-auto">
              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-2.5 italic">
                <span>XP: {userData.xp}</span>
                <span>Next: {currentTier.next}</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden p-[2px]">
                <div 
                  className="h-full bg-[#C29976] rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(194,153,118,0.4)]" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4 text-left mb-10">
            <div className="bg-[#F8F7F5] p-5 rounded-[2rem] flex items-center gap-5 border border-zinc-100/50">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-[#C29976]">
                <Mail size={20} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[9px] text-zinc-400 uppercase font-black tracking-widest mb-0.5">Authenticated Email</p>
                <p className="text-sm font-bold text-zinc-700 truncate">{userData.email}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4">
            <button onClick={openEditModal} className="w-full py-6 rounded-[2rem] bg-zinc-900 text-white font-black text-[11px] uppercase tracking-[0.3em] hover:bg-[#C29976] hover:-translate-y-1 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95">
              <Edit3 size={18} /> Update Identity
            </button>
            <button onClick={handleLogout} className="text-zinc-300 font-black text-[9px] uppercase tracking-[0.4em] hover:text-red-500 transition-colors py-2">
              <LogOut size={12} className="inline mr-2" /> Leave the Guild Board
            </button>
          </div>
        </div>
      </div>

      {/* MODAL EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-md animate-in fade-in duration-300" onClick={() => !loading && setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-black mb-10 text-center tracking-tighter">Identity <span className="text-[#C29976]">Update</span></h2>
            <form onSubmit={handleSaveChanges} className="space-y-8">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-28 h-28 rounded-[2.5rem] border-4 border-[#F8F5F2] p-1 cursor-pointer group overflow-hidden" onClick={() => fileInputRef.current.click()}>
                    <div className="w-full h-full rounded-[2.2rem] bg-zinc-50 flex items-center justify-center border border-zinc-100 group-hover:bg-zinc-100 transition-colors">
                        {tempData.profileImage ? <img src={tempData.profileImage} alt="Preview" className="w-full h-full object-cover" /> : <Camera size={28} className="text-zinc-200" />}
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Edit3 size={20} className="text-white" />
                    </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase ml-4 tracking-widest">New Alias</label>
                <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                    <input 
                      type="text" 
                      value={tempData.username} 
                      onChange={(e) => setTempData(prev => ({ ...prev, username: e.target.value }))} 
                      className="w-full bg-[#F8F7F5] border-2 border-transparent focus:border-[#C29976]/20 rounded-[1.5rem] pl-14 pr-6 py-5 outline-none font-bold text-sm transition-all" 
                      required 
                    />
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 rounded-2xl bg-zinc-50 text-zinc-400 font-black text-[11px] uppercase tracking-widest hover:bg-zinc-100 transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-5 rounded-2xl bg-[#C29976] text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-[#C29976]/30 flex items-center justify-center">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;