import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Sword, Zap, Clock, CheckCircle2, Shield, Trash2, Ghost, ChevronRight, ClipboardList } from "lucide-react";

const Questpage = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({ xp: 0, totalTasksDone: 0, username: "" });

  // Sinkronisasi logika Rank dengan Dashboard
  const tierList = [
    { name: "Newbie", minLvl: 1, xp: 0, color: "text-zinc-400 bg-zinc-100" },
    { name: "Explorer", minLvl: 6, xp: 1000, color: "text-amber-600 bg-amber-50" },
    { name: "Commander", minLvl: 11, xp: 5000, color: "text-blue-600 bg-blue-50" },
    { name: "Sentinel", minLvl: 16, xp: 20000, color: "text-emerald-600 bg-emerald-50" },
    { name: "Warlord", minLvl: 21, xp: 65000, color: "text-red-600 bg-red-50" },
    { name: "Celestial", minLvl: 26, xp: 200000, color: "text-purple-600 bg-purple-50" },
  ];

  const getTierInfo = (xp) => {
    let current = tierList[0];
    for (let i = 0; i < tierList.length; i++) {
      if (xp >= tierList[i].xp) current = tierList[i];
      else break;
    }
    return current;
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [resQuests, resUser] = await Promise.all([
        axios.get("http://localhost:5000/api/tasks/", config),
        axios.get("http://localhost:5000/api/auth/me", config)
      ]);

      setQuests(resQuests.data.data || []);
      setUserStats({
        xp: resUser.data.xp || 0,
        totalTasksDone: resUser.data.totalTasksDone || 0,
        username: resUser.data.username || "Commander"
      });
    } catch (err) {
      console.error("Sync Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleComplete = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(`http://localhost:5000/api/tasks/${taskId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        // Optimistic UI update atau refresh data
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Gagal klaim reward.");
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Hapus jejak misi ini dari sejarah? (XP tetap aman)")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert("Gagal menghapus data.");
    }
  };

  // Memastikan filter status bekerja dengan benar sesuai enum backend (biasanya 'pending'/'completed')
  const filteredQuests = quests.filter(q => 
    activeTab === 'active' ? q.status !== 'completed' : q.status === 'completed'
  );

  const currentTier = getTierInfo(userStats.xp);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F5F2]">
      <div className="h-12 w-12 border-4 border-[#C29976] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F5F2] p-6 pt-32 pb-24 font-sans text-zinc-900 selection:bg-[#C29976]/20">
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="flex items-center gap-4 mb-4">
          <span className="w-12 h-[2px] bg-[#C29976]"></span>
          <p className="text-[#C29976] font-black text-xs uppercase tracking-[0.4em] italic">Quest Bulletin v1.0</p>
        </div>
        <h1 className="text-6xl font-black tracking-tighter text-zinc-900 mb-2">Quest <span className="text-[#C29976]">Board</span></h1>
        <p className="text-zinc-400 font-medium italic">Welcome back, {userStats.username}. New missions have been deployed.</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Mission List */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex justify-between items-center bg-white p-3 rounded-[2.5rem] border border-zinc-100 shadow-sm w-fit">
            {['active', 'completed'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all duration-500 ${
                  activeTab === tab 
                  ? 'bg-[#111] text-white shadow-2xl scale-105' 
                  : 'text-zinc-400 hover:text-zinc-800'
                }`}
              >
                {tab} missions
              </button>
            ))}
          </div>

          <div className="grid gap-6">
            {filteredQuests.length > 0 ? (
              filteredQuests.map((quest, idx) => (
                <div 
                  key={quest._id} 
                  className="group bg-white p-8 rounded-[3.5rem] border border-zinc-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-center gap-8">
                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-700 group-hover:rotate-[360deg] shadow-inner ${
                      quest.status === 'completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-[#F8F5F2] text-[#C29976]'
                    }`}>
                      {quest.status === 'completed' ? <CheckCircle2 size={32} /> : <Sword size={32} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm bg-zinc-900 text-white">
                          Mission XP
                        </span>
                        {quest.status !== 'completed' && (
                           <span className="flex items-center gap-1 text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                             <Clock className="w-3 h-3 text-[#C29976]" /> {quest.deadline ? new Date(quest.deadline).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'}) : 'No Date'}
                           </span>
                        )}
                      </div>
                      <h3 className="font-black text-2xl text-zinc-800 tracking-tight group-hover:text-[#C29976] transition-colors">{quest.title}</h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-8 pt-6 md:pt-0 border-t md:border-0 border-zinc-50">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2 text-zinc-900 font-black text-3xl tracking-tighter">
                        <Zap className="w-6 h-6 fill-[#C29976] text-[#C29976]" /> +{quest.xp || 100}
                      </div>
                    </div>
                    
                    <div>
                      {quest.status !== 'completed' ? (
                        <button 
                          onClick={() => handleComplete(quest._id)}
                          className="bg-[#111] hover:bg-[#C29976] text-white text-[10px] px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] transition-all hover:shadow-xl active:scale-95 flex items-center gap-2"
                        >
                          Claim <ChevronRight size={14} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleDelete(quest._id)}
                          className="bg-zinc-50 hover:bg-red-50 text-zinc-300 hover:text-red-500 p-5 rounded-3xl transition-all duration-500 active:rotate-12"
                        >
                          <Trash2 size={24} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-32 bg-white/50 rounded-[4rem] border-4 border-dashed border-zinc-200">
                <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                   <Ghost className="w-12 h-12 text-zinc-300" />
                </div>
                <p className="text-zinc-400 font-black uppercase tracking-[0.4em] text-xs">Awaiting New Orders In This Sector</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Mini Profile & Stats */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#111] p-10 rounded-[4rem] shadow-2xl text-white relative overflow-hidden group transition-all duration-500">
            <div className="absolute -top-10 -right-10 opacity-5 group-hover:rotate-45 transition-transform duration-1000">
                <Shield size={200} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${currentTier.color}`}>
                  <Shield size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#C29976] uppercase tracking-[0.3em] leading-none mb-1">Current Tier</p>
                  <p className="text-xl font-black uppercase italic tracking-tighter">{currentTier.name}</p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-[11px] font-black mb-4 opacity-50 uppercase tracking-[0.2em]">
                    <span>Battle XP Accumulation</span>
                    <span className="text-[#C29976]">{userStats.xp.toLocaleString()} XP</span>
                  </div>
                  <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden p-1 shadow-inner border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-[#C29976] to-amber-200 rounded-full transition-all duration-1000" 
                      style={{ width: `${Math.min((userStats.xp / 1000) * 100, 100)}%` }} 
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-colors">
                    <p className="text-[9px] font-black opacity-30 uppercase mb-2 tracking-widest">Completed</p>
                    <p className="text-4xl font-black tracking-tighter">{userStats.totalTasksDone}</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-colors flex flex-col justify-center items-center">
                    <Zap className="text-[#C29976] mb-1" size={20} />
                    <p className="text-[9px] font-black opacity-30 uppercase tracking-widest">Sync Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-10 rounded-[3.5rem] border border-zinc-100 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-[#C29976]/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
             <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
               <ClipboardList size={16} className="text-[#C29976]" /> Guild Wisdom
             </h4>
             <p className="text-zinc-500 text-sm font-medium leading-relaxed italic opacity-80">
               "Setiap misi yang terselesaikan adalah satu langkah lebih dekat menuju gelar Celestial. Bersihkan papan tugasmu secara teratur untuk menjaga fokus sang Commander."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questpage;