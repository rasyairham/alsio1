import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Mail, LogOut, Edit3, User, ShieldCheck, ChevronLeft, Bell, Star, Trophy } from 'lucide-react';
// PERBAIKAN: Mengarah ke instance axios yang benar
import api from "../api/axios"; 

const ProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [userData, setUserData] = useState({
    username: localStorage.getItem("username") || "Explorer",
    email: localStorage.getItem("email") || "",
    profileImage: localStorage.getItem("userImage") || null,
    xp: parseInt(localStorage.getItem("xp") || "0"),
    streak: parseInt(localStorage.getItem("streak") || "0")
  });

  const [unreadCount, setUnreadCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempImage, setTempImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const tierList = [
    { name: "Newbie", xp: 0, color: "text-zinc-400 bg-zinc-100", icon: <Star size={14} />, next: 1000 },
    { name: "Explorer", xp: 1000, color: "text-amber-600 bg-amber-50", icon: <Star size={14} />, next: 5000 },
    { name: "Commander", xp: 5000, color: "text-blue-600 bg-blue-50", icon: <ShieldCheck size={14} />, next: 20000 },
    { name: "Sentinel", xp: 20000, color: "text-emerald-600 bg-emerald-50", icon: <ShieldCheck size={14} />, next: 200000 },
    { name: "Celestial", xp: 200000, color: "text-purple-600 bg-purple-50", icon: <Trophy size={14} />, next: 1000000 },
  ];

  const currentTier = useMemo(() => {
    const numericXp = userData.xp;
    let current = tierList[0];
    for (let i = 0; i < tierList.length; i++) {
      if (numericXp >= tierList[i].xp) {
        current = tierList[i];
      } else break;
    }
    return current;
  }, [userData.xp]);

  const progress = useMemo(() => {
    const earnedInTier = userData.xp - currentTier.xp;
    const neededForNext = currentTier.next - currentTier.xp;
    return Math.min((earnedInTier / neededForNext) * 100, 100);
  }, [userData.xp, currentTier]);

  const fetchSyncData = useCallback(async () => {
    try {
      const [userRes, notifRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/notifications")
      ]);

      const freshUser = userRes.data?.user || userRes.data;
      if (freshUser) {
        setUserData({
          username: freshUser.username,
          email: freshUser.email,
          profileImage: freshUser.profileImage,
          xp: freshUser.xp,
          streak: freshUser.streak || 0
        });
        
        localStorage.setItem("username", freshUser.username);
        localStorage.setItem("email", freshUser.email);
        localStorage.setItem("xp", freshUser.xp);
        if (freshUser.profileImage) localStorage.setItem("userImage", freshUser.profileImage);
      }

      if (notifRes.data?.success) {
        setUnreadCount(notifRes.data.data.filter(n => !n.read).length);
      }
    } catch (err) {
      console.error("Sync failed:", err);
      if (err.response?.status === 401) navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchSyncData();
  }, [fetchSyncData]);

  const openEditModal = () => {
    setTempName(userData.username);
    setTempImage(userData.profileImage);
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) return alert("File too large! Max 2MB.");
      const reader = new FileReader();
      reader.onloadend = () => setTempImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/auth/update-profile", {
        username: tempName,
        profileImage: tempImage 
      });

      if (res.data) {
        const updated = res.data.user || res.data;
        setUserData(prev => ({ ...prev, username: updated.username, profileImage: updated.profileImage }));
        localStorage.setItem("username", updated.username);
        if (updated.profileImage) localStorage.setItem("userImage", updated.profileImage);
        setIsModalOpen(false);
        window.dispatchEvent(new Event("storage"));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if(window.confirm("End session?")) {
      localStorage.clear();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F2] font-sans text-zinc-900 p-4 sm:p-6 pt-24 sm:pt-32 pb-24 relative overflow-hidden">
      <div className="max-w-xl mx-auto relative z-10">
        
        {/* Nav Header */}
        <div className="flex justify-between items-center mb-6 sm:mb-8 px-2">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-[#C29976] font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all">
            <ChevronLeft size={16} /> Back
          </button>
          
          <button onClick={() => navigate('/notifications')} className="relative p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-zinc-100 shadow-sm active:scale-90 transition-all">
            <Bell size={20} className={unreadCount > 0 ? "text-[#C29976]" : "text-zinc-400"} />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-4 h-4 sm:w-5 sm:h-5 bg-[#C29976] border-2 border-white rounded-full flex items-center justify-center text-[8px] font-black text-white animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-[2.5rem] sm:rounded-[4rem] p-8 sm:p-12 border border-zinc-100 shadow-sm text-center relative overflow-hidden">
          
          {/* Avatar Section */}
          <div className="relative inline-block mb-8 sm:mb-10">
            <div className="absolute inset-0 rounded-[2rem] sm:rounded-[3rem] bg-[#C29976]/20 blur-2xl scale-125"></div>
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] sm:rounded-[3.5rem] bg-white p-1.5 sm:p-2 shadow-2xl rotate-3 border border-zinc-50 overflow-hidden flex items-center justify-center">
                {userData.profileImage ? (
                  <img src={userData.profileImage} alt="Profile" className="w-full h-full rounded-[2rem] sm:rounded-[2.8rem] object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-900 rounded-[2rem] sm:rounded-[2.8rem] text-white text-4xl sm:text-6xl font-black italic">
                    {userData.username.charAt(0)}
                  </div>
                )}
            </div>
          </div>

          {/* User Info & Tier */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-zinc-900 mb-2 truncate px-4">
              {userData.username}
            </h1>
            
            <div className={`inline-flex items-center gap-2 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-black tracking-widest text-[8px] sm:text-[10px] uppercase italic mb-4 sm:mb-6 ${currentTier.color}`}>
                {currentTier.icon} {currentTier.name} Tier
            </div>

            {/* Progress Bar */}
            <div className="max-w-[180px] sm:max-w-[200px] mx-auto text-left">
              <div className="flex justify-between text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-2 italic">
                <span>XP: {userData.xp}</span>
                <span>Next: {currentTier.next}</span>
              </div>
              <div className="h-1 sm:h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#C29976] transition-all duration-1000" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4 text-left mb-8 sm:mb-12">
            <div className="bg-[#F8F5F2] p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] flex items-center gap-4 sm:gap-5 border border-zinc-100 shadow-inner">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center shadow-sm text-[#C29976] shrink-0">
                <Mail size={18} className="sm:w-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[8px] text-zinc-400 uppercase font-black tracking-widest mb-0.5 sm:mb-1">Authenticated Email</p>
                <p className="text-xs sm:text-sm font-bold text-zinc-700 truncate">{userData.email || "No Email Bound"}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <button onClick={openEditModal} className="w-full py-5 sm:py-6 rounded-[1.5rem] sm:rounded-[2rem] bg-[#111] text-white font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-[#C29976] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95">
              <Edit3 size={16} className="sm:w-[18px]" /> Update Identity
            </button>
            <button onClick={handleLogout} className="w-full py-2 text-zinc-300 font-black text-[8px] sm:text-[9px] uppercase tracking-[0.3em] hover:text-red-500 transition-colors">
              <LogOut size={12} className="inline mr-2" /> Leave the Guild Board
            </button>
          </div>
        </div>
      </div>

      {/* MODAL EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white border border-zinc-100 rounded-[2.5rem] sm:rounded-[4rem] p-6 sm:p-10 shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-black mb-6 sm:mb-10 text-center tracking-tight">Identity <span className="text-[#C29976]">Update</span></h2>
            <form onSubmit={handleSaveChanges} className="space-y-6 sm:space-y-8">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-[2rem] sm:rounded-[2.5rem] border-4 border-[#F8F5F2] p-1 cursor-pointer overflow-hidden" onClick={() => fileInputRef.current.click()}>
                    <div className="w-full h-full rounded-[1.8rem] sm:rounded-[2.2rem] bg-zinc-50 flex items-center justify-center border border-zinc-100">
                        {tempImage ? <img src={tempImage} alt="Preview" className="w-full h-full object-cover" /> : <Camera size={28} className="text-zinc-200" />}
                    </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-[9px] sm:text-[10px] font-black text-zinc-400 uppercase ml-4 tracking-[0.2em]">New Alias</label>
                <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                    <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} className="w-full bg-[#F8F5F2] border-none rounded-xl sm:rounded-[1.5rem] pl-12 sm:pl-14 pr-6 py-4 sm:py-5 outline-none font-bold text-sm" required />
                </div>
              </div>
              <div className="flex gap-3 sm:gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 sm:py-5 rounded-xl sm:rounded-[1.5rem] bg-zinc-50 text-zinc-400 font-black text-[10px] sm:text-xs uppercase tracking-widest">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-4 sm:py-5 rounded-xl sm:rounded-[1.5rem] bg-[#C29976] text-white font-black text-[10px] sm:text-xs uppercase tracking-widest">
                    {loading ? "..." : "Update"}
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