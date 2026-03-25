import React, { useState, useEffect, useCallback, useRef } from 'react';
// PERBAIKAN: Gunakan api dari config, bukan axios mentah
import api from '../api/axios'; 
import { Sword, Zap, Clock, CheckCircle2, Shield, Trash2, Ghost, ChevronRight, ClipboardList, X, AlertTriangle, Trophy, Skull } from "lucide-react";

// --- NOTIFICATION SYSTEM (Tetap Sama, Sudah Bagus) ---
const NotificationPortal = ({ notifications, onDismiss }) => (
  <div className="fixed top-4 right-4 sm:top-24 sm:right-6 z-[9999] flex flex-col gap-3 pointer-events-none w-[calc(100%-2rem)] sm:w-auto">
    {notifications.map(notif => <ToastCard key={notif.id} notif={notif} onDismiss={onDismiss} />)}
  </div>
);

const ToastCard = ({ notif, onDismiss }) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);
  const handleDismiss = () => { setLeaving(true); setTimeout(() => onDismiss(notif.id), 400); };

  const config = {
    success: { bg: '#111111', accent: '#C29976', icon: <Trophy size={18} color="#C29976" />, label: 'REWARD CLAIMED', bar: '#C29976' },
    error: { bg: '#2a0a0a', accent: '#ef4444', icon: <Skull size={18} color="#ef4444" />, label: 'MISSION FAILED', bar: '#ef4444' },
    confirm: { bg: '#0f0f1a', accent: '#818cf8', icon: <AlertTriangle size={18} color="#818cf8" />, label: 'CONFIRM ACTION', bar: '#818cf8' },
    info: { bg: '#111111', accent: '#C29976', icon: <Zap size={18} color="#C29976" />, label: 'SYSTEM ALERT', bar: '#C29976' },
  };
  const c = config[notif.type] || config.info;

  return (
    <div
      onClick={notif.type !== 'confirm' ? handleDismiss : undefined}
      className={`pointer-events-auto w-full sm:w-[340px] overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-2xl
      ${leaving ? 'translate-x-[120%] scale-90 opacity-0' : visible ? 'translate-x-0 scale-100 opacity-100' : 'translate-x-[120%] scale-90 opacity-0'}`}
      style={{ background: c.bg, border: `1px solid ${c.accent}33`, borderLeft: `3px solid ${c.accent}`, borderRadius: '1.25rem' }}
    >
      <div className="p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${c.accent}18` }}>{c.icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-[8px] font-black tracking-[0.2em] uppercase" style={{ color: c.accent }}>{c.label}</p>
          <p className="text-xs sm:text-sm font-bold text-white leading-tight truncate">{notif.message}</p>
        </div>
        {notif.type !== 'confirm' && <button onClick={(e) => { e.stopPropagation(); handleDismiss(); }} className="text-white/30 hover:text-white p-1"><X size={14} /></button>}
      </div>
      {notif.type === 'confirm' && (
        <div className="flex gap-2 p-3 pt-0">
          <button onClick={() => { notif.onConfirm?.(); handleDismiss(); }} className="flex-1 bg-red-500 text-white text-[9px] font-black uppercase py-2.5 rounded-lg">Abandon</button>
          <button onClick={handleDismiss} className="flex-1 bg-white/10 text-white/60 text-[9px] font-black uppercase py-2.5 rounded-lg border border-white/10">Cancel</button>
        </div>
      )}
      {notif.type !== 'confirm' && <ProgressBar duration={notif.duration || 4000} color={c.bar} />}
    </div>
  );
};

const ProgressBar = ({ duration, color }) => {
  const [width, setWidth] = useState(100);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const pct = Math.max(0, 100 - ((Date.now() - start) / duration) * 100);
      setWidth(pct);
      if (pct > 0) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [duration]);
  return <div className="h-[2px] bg-white/5"><div className="h-full opacity-70 transition-all duration-100 linear" style={{ width: `${width}%`, background: color }} /></div>;
};

const useNotify = () => {
    const [notifications, setNotifications] = useState([]);
    const idRef = useRef(0);
    const dismiss = useCallback(id => setNotifications(prev => prev.filter(n => n.id !== id)), []);
    const push = useCallback(notif => {
      const id = ++idRef.current;
      const full = { id, duration: 4000, ...notif };
      setNotifications(prev => [...prev.slice(-4), full]);
      if (notif.type !== 'confirm') setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), full.duration + 500);
      return id;
    }, []);
    return {
      notifications, dismiss,
      notify: {
        success: (m, s) => push({ type: 'success', message: m, sub: s }),
        error: (m, s) => push({ type: 'error', message: m, sub: s }),
        info: (m, s) => push({ type: 'info', message: m, sub: s }),
        confirm: (m, s, fn) => push({ type: 'confirm', message: m, sub: s, onConfirm: fn }),
      }
    };
};

// --- MAIN PAGE COMPONENT ---
const Questpage = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({ xp: 0, totalTasksDone: 0, username: "" });
  const { notifications, dismiss, notify } = useNotify();

  const tierList = [
    { name: "Newbie", minLvl: 1, xp: 0, color: "text-zinc-400 bg-zinc-100" },
    { name: "Explorer", minLvl: 6, xp: 1000, color: "text-amber-600 bg-amber-50" },
    { name: "Commander", minLvl: 11, xp: 5000, color: "text-blue-600 bg-blue-50" },
    { name: "Sentinel", minLvl: 16, xp: 20000, color: "text-emerald-600 bg-emerald-50" },
    { name: "Warlord", minLvl: 21, xp: 65000, color: "text-red-600 bg-red-50" },
    { name: "Celestial", minLvl: 26, xp: 200000, color: "text-purple-600 bg-purple-50" },
  ];

  const getTierInfo = xp => {
    let current = tierList[0];
    for (let i = 0; i < tierList.length; i++) if (xp >= tierList[i].xp) current = tierList[i]; else break;
    return current;
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // PERBAIKAN: Gunakan api instance & endpoint relatif
      const [resQuests, resUser] = await Promise.all([
        api.get("/tasks/"),
        api.get("/auth/me")
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

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleComplete = async (taskId, questTitle, questXp) => {
    try {
      // PERBAIKAN: Pakai api instance
      const res = await api.patch(`/tasks/${taskId}/complete`, {});
      if (res.data.success) {
        notify.success(`+${questXp || 100} XP Rewarded!`, `"${questTitle}" has been vanquished.`);
        fetchData(); // Sync ulang data setelah mission complete
      }
    } catch (err) { 
      notify.error("Claim Failed", err.response?.data?.message || "Failed to claim reward."); 
    }
  };

  const handleDelete = (taskId) => {
    notify.confirm("Abandon this record?", "XP stays safe.", async () => {
      try {
        // PERBAIKAN: Pakai api instance
        await api.delete(`/tasks/${taskId}`);
        notify.info("Log Purged", "Mission removed.");
        fetchData();
      } catch (err) { 
        notify.error("Delete Failed", "Could not remove mission."); 
      }
    });
  };

  const now = new Date();
  const filteredQuests = quests.filter(q => !(q.deadline && new Date(q.deadline) < now && q.status !== 'completed'))
    .filter(q => activeTab === 'active' ? q.status !== 'completed' : q.status === 'completed');
  const currentTier = getTierInfo(userStats.xp);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F5F2]">
      <div className="h-10 w-10 border-4 border-[#C29976] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <>
      <NotificationPortal notifications={notifications} onDismiss={dismiss} />
      <div className="min-h-screen bg-[#F8F5F2] p-4 sm:p-6 pt-24 sm:pt-32 pb-24 font-sans text-zinc-900 selection:bg-[#C29976]/20 overflow-x-hidden">
        
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-10 sm:mb-16">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-zinc-900 mb-2">
            Quest <span className="text-[#C29976]">Board</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base font-medium italic text-left">
            Welcome back, {userStats.username}.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
          
          {/* Main Content - Quests */}
          <div className="lg:col-span-8 order-2 lg:order-1 space-y-6 sm:space-y-8">
            <div className="flex bg-white p-2 rounded-2xl sm:rounded-[2.5rem] border border-zinc-100 shadow-sm w-full sm:w-fit overflow-x-auto">
              {['active', 'completed'].map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)} 
                  className={`flex-1 sm:flex-none px-6 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-[2rem] font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${activeTab === tab ? 'bg-[#111] text-white shadow-xl' : 'text-zinc-400 hover:text-zinc-800'}`}
                >
                  {tab} missions
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:gap-6">
              {filteredQuests.length > 0 ? filteredQuests.map((quest, idx) => (
                <div key={quest._id} className="group bg-white p-5 sm:p-8 rounded-[2rem] sm:rounded-[3.5rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4 sm:gap-8">
                    <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner ${quest.status === 'completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-[#F8F5F2] text-[#C29976]'}`}>
                      {quest.status === 'completed' ? <CheckCircle2 size={24} className="sm:w-8 sm:h-8" /> : <Sword size={24} className="sm:w-8 sm:h-8" />}
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="flex flex-wrap items-center gap-2 mb-1 sm:mb-2">
                        <span className="text-[7px] sm:text-[9px] font-black px-2 sm:px-4 py-1 rounded-full uppercase tracking-widest bg-zinc-900 text-white">Mission XP</span>
                        {quest.status !== 'completed' && (
                          <span className="flex items-center gap-1 text-[7px] sm:text-[9px] font-black text-zinc-400 uppercase tracking-widest shrink-0">
                            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#C29976]" />
                            {quest.deadline ? new Date(quest.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : '∞'}
                          </span>
                        )}
                      </div>
                      <h3 className="font-black text-lg sm:text-2xl text-zinc-800 tracking-tight truncate group-hover:text-[#C29976] transition-colors">{quest.title}</h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 pt-4 sm:pt-0 border-t sm:border-0 border-zinc-50">
                    <div className="flex flex-col sm:items-end">
                      <div className="flex items-center gap-1 sm:gap-2 text-zinc-900 font-black text-xl sm:text-3xl tracking-tighter">
                        <Zap className="w-4 h-4 sm:w-6 sm:h-6 fill-[#C29976] text-[#C29976]" /> +{quest.xp || 100}
                      </div>
                    </div>
                    <div>
                      {quest.status !== 'completed' ? (
                        <button onClick={() => handleComplete(quest._id, quest.title, quest.xp)} className="bg-[#111] hover:bg-[#C29976] text-white text-[9px] sm:text-[10px] px-6 sm:px-10 py-3.5 sm:py-5 rounded-xl sm:rounded-[1.5rem] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2">Claim <ChevronRight size={14} /></button>
                      ) : (
                        <button onClick={() => handleDelete(quest._id)} className="bg-zinc-50 hover:bg-red-50 text-zinc-300 hover:text-red-500 p-3 sm:p-5 rounded-2xl transition-all"><Trash2 size={20} className="sm:w-6 sm:h-6" /></button>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 sm:py-32 bg-white/50 rounded-[2.5rem] sm:rounded-[4rem] border-4 border-dashed border-zinc-200">
                  <Ghost className="w-12 h-12 text-zinc-300 mx-auto mb-6" />
                  <p className="text-zinc-400 font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs">Sector Clear</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Profile & Stats */}
          <div className="lg:col-span-4 order-1 lg:order-2 space-y-6 sm:space-y-8">
            <div className="bg-[#111] p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[4rem] shadow-2xl text-white relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 opacity-5 group-hover:rotate-45 transition-transform duration-1000"><Shield size={200} /></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8 sm:mb-10 text-left">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl ${currentTier.color}`}><Shield size={20} /></div>
                  <div>
                    <p className="text-[9px] font-black text-[#C29976] uppercase tracking-[0.2em] mb-0.5">Current Tier</p>
                    <p className="text-lg sm:text-xl font-black uppercase italic tracking-tighter">{currentTier.name}</p>
                  </div>
                </div>

                <div className="space-y-6 sm:space-y-8">
                  <div>
                    <div className="flex justify-between text-[10px] font-black mb-3 opacity-50 uppercase tracking-widest">
                      <span>Accumulation</span>
                      <span className="text-[#C29976]">{userStats.xp.toLocaleString()} XP</span>
                    </div>
                    <div className="w-full h-3 sm:h-4 bg-white/10 rounded-full overflow-hidden p-1 border border-white/5">
                      <div className="h-full bg-gradient-to-r from-[#C29976] to-amber-200 rounded-full transition-all duration-1000" style={{ width: `${Math.min((userStats.xp / 1000) * 100, 100)}%` }}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-white/5 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-white/5 text-left">
                      <p className="text-[8px] font-black opacity-30 uppercase mb-1 tracking-widest">Done</p>
                      <p className="text-2xl sm:text-4xl font-black tracking-tighter">{userStats.totalTasksDone}</p>
                    </div>
                    <div className="bg-white/5 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] border border-white/5 flex flex-col justify-center items-center">
                      <Zap className="text-[#C29976] mb-1" size={18} />
                      <p className="text-[8px] font-black opacity-30 uppercase tracking-widest">Active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] border border-zinc-100 shadow-sm relative overflow-hidden group text-left">
              <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-4 flex items-center gap-3"><ClipboardList size={16} className="text-[#C29976]" /> Guild Wisdom</h4>
              <p className="text-zinc-500 text-xs sm:text-sm font-medium leading-relaxed italic opacity-80">"Every completed mission is one step closer to the Celestial title."</p>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default Questpage;