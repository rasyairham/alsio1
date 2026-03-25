import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api'; 
import { Sword, Zap, Clock, CheckCircle2, Shield, Trash2, Ghost, ChevronRight, ClipboardList, X, AlertTriangle, Trophy, Skull } from "lucide-react";

// --- REUSABLE NOTIFICATION PORTAL ---
const NotificationPortal = ({ notifications, onDismiss }) => (
  <div className="fixed top-4 right-4 sm:top-24 sm:right-6 z-[9999] flex flex-col gap-3 pointer-events-none w-[calc(100%-2rem)] sm:w-auto">
    {notifications.map(notif => (
      <ToastCard key={notif.id} notif={notif} onDismiss={onDismiss} />
    ))}
  </div>
);

const ToastCard = ({ notif, onDismiss }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setVisible(true); }, []);
  
  const config = {
    success: { bg: '#111111', accent: '#C29976', icon: <Trophy size={18} color="#C29976" />, label: 'MISSION COMPLETE' },
    error: { bg: '#2a0a0a', accent: '#ef4444', icon: <Skull size={18} color="#ef4444" />, label: 'SYSTEM ERROR' },
    info: { bg: '#111111', accent: '#C29976', icon: <Zap size={18} color="#C29976" />, label: 'GUILD ALERT' },
  };
  const c = config[notif.type] || config.info;

  return (
    <div 
      className={`pointer-events-auto w-full sm:w-[340px] p-4 rounded-2xl border-l-4 transition-all duration-500 shadow-2xl ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
      style={{ background: c.bg, borderLeftColor: c.accent, borderTop: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg" style={{ background: `${c.accent}15` }}>{c.icon}</div>
        <div className="flex-1">
          <p className="text-[8px] font-black tracking-widest uppercase mb-0.5" style={{ color: c.accent }}>{c.label}</p>
          <p className="text-sm font-bold text-white">{notif.message}</p>
        </div>
        <button onClick={() => onDismiss(notif.id)} className="text-white/20 hover:text-white"><X size={14}/></button>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const Questpage = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({ xp: 0, totalTasksDone: 0, username: "" });
  const [notifications, setNotifications] = useState([]);

  const notify = (type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [resQuests, resUser] = await Promise.all([
        api.get("/tasks"), 
        api.get("/auth/me")
      ]);
      setQuests(resQuests.data.data || []);
      setUserStats({ 
        xp: resUser.data.user?.xp || 0, 
        totalTasksDone: resUser.data.user?.totalTasksDone || 0, 
        username: resUser.data.user?.username || "Commander" 
      });
    } catch (err) { 
      console.error("Fetch Error:", err);
    } finally { 
      setLoading(false); 
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleComplete = async (taskId, title, xp) => {
    try {
      await api.patch(`/tasks/${taskId}/complete`);
      notify('success', `+${xp} XP: ${title} Finished!`);
      fetchData(); // Update stats & list secara realtime
    } catch (err) {
      notify('error', 'Failed to complete quest.');
    }
  };

  const filteredQuests = quests.filter(q => 
    activeTab === 'active' ? q.status !== 'completed' : q.status === 'completed'
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F5F2]">
      <div className="h-10 w-10 border-4 border-[#C29976] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <>
      <NotificationPortal notifications={notifications} onDismiss={(id) => setNotifications(n => n.filter(i => i.id !== id))} />
      <div className="min-h-screen bg-[#F8F5F2] p-6 pt-32 pb-24 font-sans text-zinc-900">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12">
            <h1 className="text-5xl font-black tracking-tighter mb-2">Quest <span className="text-[#C29976]">Board</span></h1>
            <p className="text-zinc-400 italic">Carry on your ambition, {userStats.username}.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* List Misi */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex bg-white p-2 rounded-full border border-zinc-100 shadow-sm w-fit">
                {['active', 'completed'].map(tab => (
                  <button 
                    key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-zinc-900 text-white' : 'text-zinc-400'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="grid gap-6">
                {filteredQuests.length > 0 ? filteredQuests.map(quest => (
                  <div key={quest._id} className="bg-white p-6 rounded-[2.5rem] border border-zinc-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                    <div className="flex items-center gap-6 text-left">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${quest.status === 'completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-zinc-50 text-[#C29976]'}`}>
                        {quest.status === 'completed' ? <CheckCircle2 /> : <Sword />}
                      </div>
                      <div>
                        <h3 className="font-black text-xl text-zinc-800">{quest.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                           <Zap size={14} className="text-[#C29976] fill-[#C29976]" />
                           <span className="text-xs font-bold text-zinc-400">+{quest.xp || 100} XP</span>
                        </div>
                      </div>
                    </div>
                    {quest.status !== 'completed' && (
                      <button 
                        onClick={() => handleComplete(quest._id, quest.title, quest.xp || 100)}
                        className="bg-zinc-900 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#C29976] transition-colors"
                      >
                        Claim
                      </button>
                    )}
                  </div>
                )) : (
                  <div className="py-20 text-center border-4 border-dashed border-zinc-200 rounded-[3rem]">
                    <Ghost className="mx-auto mb-4 text-zinc-300" />
                    <p className="text-zinc-400 font-black uppercase text-xs tracking-widest">No Quests Found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="lg:col-span-4">
              <div className="bg-zinc-900 p-10 rounded-[3.5rem] text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 text-left">
                  <p className="text-[10px] font-black text-[#C29976] uppercase tracking-widest mb-1">Total Progress</p>
                  <h2 className="text-4xl font-black tracking-tighter mb-6">{userStats.xp.toLocaleString()} <span className="text-sm opacity-50">XP</span></h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase opacity-50">
                      <span>Missions Vanquished</span>
                      <span>{userStats.totalTasksDone}</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden p-1">
                      <div className="h-full bg-[#C29976] rounded-full transition-all duration-1000" style={{ width: `${Math.min((userStats.xp/5000)*100, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Questpage;