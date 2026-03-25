import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Mail, LogOut, Edit3, User, ShieldCheck, ChevronLeft, Bell, Star, Trophy } from 'lucide-react';
import axios from 'axios';

const ProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [xp, setXp] = useState(0);
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
    const numericXp = parseInt(xp) || 0;
    let current = tierList[0];
    for (let i = 0; i < tierList.length; i++) {
      if (numericXp >= tierList[i].xp) {
        current = tierList[i];
      } else {
        break;
      }
    }
    return current;
  }, [xp]);

  const progress = useMemo(() => {
    if (!currentTier) return 0;
    const currentTierXp = currentTier.xp;
    const nextTierXp = currentTier.next;
    const earnedInTier = xp - currentTierXp;
    const neededForNext = nextTierXp - currentTierXp;
    return Math.min((earnedInTier / neededForNext) * 100, 100);
  }, [xp, currentTier]);

  const fetchSyncData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const resNotif = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resNotif.data.success) {
        const unread = resNotif.data.data.filter(n => !n.read).length;
        setUnreadCount(unread);
      }

      const username = localStorage.getItem("username");
      const userEmail = localStorage.getItem("email");
      const savedImage = localStorage.getItem("userImage");
      const userXp = parseInt(localStorage.getItem("xp") || "0");

      setUser(username || "Explorer");
      setEmail(userEmail || "not-synced@alsio.com");
      setXp(userXp);
      setProfileImage(savedImage && savedImage !== "null" ? savedImage : null);

    } catch (err) {
      console.error("Sync failed:", err);
    }
  }, [navigate]);

  useEffect(() => {
    fetchSyncData();
  }, [fetchSyncData]);

  const openEditModal = () => {
    setTempName(user);
    setTempImage(profileImage);
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) {
        alert("File too large! Max 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setTempImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/auth/update-profile", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          username: tempName,
          profileImage: tempImage 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("username", data.username);
        if (data.profileImage) localStorage.setItem("userImage", data.profileImage);
        setUser(data.username);
        setProfileImage(data.profileImage || null);
        setIsModalOpen(false);
        window.dispatchEvent(new Event("storage"));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if(window.confirm("End session?")) {
        localStorage.clear();
        window.location.href = "/";
    }
  };

  if (!currentTier) return null;

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
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] sm:rounded-[3.5rem] bg-white p-1.5 sm:p-2 shadow-2xl rotate-3 border border-zinc-50 overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full rounded-[2rem] sm:rounded-[2.8rem] object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-900 rounded-[2rem] sm:rounded-[2.8rem] text-white text-4xl sm:text-6xl font-black italic">
                    {user ? user.charAt(0) : "A"}
                  </div>
                )}
            </div>
          </div>

          {/* User Info & Tier */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-zinc-900 mb-2 truncate px-4">{user}</h1>
            
            <div className={`inline-flex items-center gap-2 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-black tracking-[0.1em] sm:tracking-[0.2em] text-[8px] sm:text-[10px] uppercase italic mb-4 sm:mb-6 ${currentTier.color}`}>
                {currentTier.icon} {currentTier.name} Tier
            </div>

            {/* Progress Bar */}
            <div className="max-w-[180px] sm:max-w-[200px] mx-auto">
              <div className="flex justify-between text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-2 italic">
                <span>XP: {xp}</span>
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
                <p className="text-xs sm:text-sm font-bold text-zinc-700 truncate">{email}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <button onClick={openEditModal} className="w-full py-5 sm:py-6 rounded-[1.5rem] sm:rounded-[2rem] bg-[#111] text-white font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:bg-[#C29976] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95">
              <Edit3 size={16} className="sm:w-[18px]" /> Update Identity
            </button>
            <button onClick={handleLogout} className="w-full py-2 text-zinc-300 font-black text-[8px] sm:text-[9px] uppercase tracking-[0.3em] sm:tracking-[0.4em] hover:text-red-500 transition-colors">
              <LogOut size={12} className="inline mr-2" /> Leave the Guild Board
            </button>
          </div>
        </div>
      </div>

      {/* MODAL EDIT - Responsive adjust */}
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
              <div className="space-y-2">
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