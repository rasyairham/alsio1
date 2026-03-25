import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Sword, Zap, Clock, CheckCircle2, Shield, Trash2, Ghost, ChevronRight, ClipboardList, X, AlertTriangle, Trophy, Skull } from "lucide-react";

const NotificationPortal = ({ notifications, onDismiss }) => (
  <div style={{
    position: 'fixed', top: '6rem', right: '1.5rem', zIndex: 9999,
    display: 'flex', flexDirection: 'column', gap: '0.75rem', pointerEvents: 'none'
  }}>
    {notifications.map(notif => <ToastCard key={notif.id} notif={notif} onDismiss={onDismiss} />)}
  </div>
);

const ToastCard = ({ notif, onDismiss }) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  const handleDismiss = () => { setLeaving(true); setTimeout(() => onDismiss(notif.id), 400); };

  const config = {
    success: { bg: '#111111', accent: '#C29976', icon: <Trophy size={20} color="#C29976" />, label: 'REWARD CLAIMED', bar: '#C29976' },
    error: { bg: '#2a0a0a', accent: '#ef4444', icon: <Skull size={20} color="#ef4444" />, label: 'MISSION FAILED', bar: '#ef4444' },
    confirm: { bg: '#0f0f1a', accent: '#818cf8', icon: <AlertTriangle size={20} color="#818cf8" />, label: 'CONFIRM ACTION', bar: '#818cf8' },
    info: { bg: '#111111', accent: '#C29976', icon: <Zap size={20} color="#C29976" />, label: 'SYSTEM ALERT', bar: '#C29976' },
  };

  const c = config[notif.type] || config.info;

  return (
    <div
      onClick={notif.type !== 'confirm' ? handleDismiss : undefined}
      style={{
        pointerEvents: 'all', width: '340px', background: c.bg,
        border: `1px solid ${c.accent}33`, borderLeft: `3px solid ${c.accent}`,
        borderRadius: '1.5rem', overflow: 'hidden', cursor: notif.type !== 'confirm' ? 'pointer' : 'default',
        transform: leaving ? 'translateX(120%) scale(0.9)' : visible ? 'translateX(0) scale(1)' : 'translateX(120%) scale(0.9)',
        opacity: leaving ? 0 : visible ? 1 : 0,
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease',
        boxShadow: `0 8px 32px ${c.accent}22, 0 2px 8px rgba(0,0,0,0.5)`,
      }}
    >
      <div style={{ padding: '0.75rem 1rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '0.75rem', background: `${c.accent}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>{c.icon}</div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: '9px', fontWeight: 900, letterSpacing: '0.25em', color: c.accent, fontFamily: 'sans-serif' }}>{c.label}</p>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#ffffff', fontFamily: 'sans-serif', lineHeight: 1.3, marginTop: '2px' }}>{notif.message}</p>
        </div>
        {notif.type !== 'confirm' && (
          <button onClick={(e) => { e.stopPropagation(); handleDismiss(); }} style={{
            background: 'transparent', border: 'none', cursor: 'pointer', color: '#ffffff44',
            padding: '4px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}><X size={14} /></button>
        )}
      </div>

      {notif.sub && <p style={{ margin: '0 1rem 0.5rem', fontSize: '11px', color: '#ffffff55', fontFamily: 'sans-serif', fontWeight: 500, fontStyle: 'italic' }}>{notif.sub}</p>}

      {notif.type === 'confirm' && (
        <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem 1rem 0.75rem' }}>
          <button
            onClick={() => { notif.onConfirm?.(); handleDismiss(); }}
            style={{ flex: 1, background: '#ef4444', border: 'none', borderRadius: '0.75rem', color: '#fff', fontSize: '10px', fontWeight: 900, letterSpacing: '0.15em', padding: '0.6rem 0', cursor: 'pointer', fontFamily: 'sans-serif', textTransform: 'uppercase', transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.target.style.opacity = '0.8'} onMouseLeave={e => e.target.style.opacity = '1'}
          >Abandon</button>
          <button
            onClick={handleDismiss}
            style={{ flex: 1, background: '#ffffff11', border: '1px solid #ffffff22', borderRadius: '0.75rem', color: '#ffffffaa', fontSize: '10px', fontWeight: 900, letterSpacing: '0.15em', padding: '0.6rem 0', cursor: 'pointer', fontFamily: 'sans-serif', textTransform: 'uppercase', transition: 'opacity 0.2s' }}
            onMouseEnter={e => e.target.style.opacity = '0.7'} onMouseLeave={e => e.target.style.opacity = '1'}
          >Cancel</button>
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
  return (
    <div style={{ height: '2px', background: '#ffffff11', margin: '0' }}>
      <div style={{ height: '100%', background: color, width: `${width}%`, transition: 'width 0.1s linear', borderRadius: '0 2px 2px 0', opacity: 0.7 }} />
    </div>
  );
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
    notifications,
    dismiss,
    notify: {
      success: (m, s) => push({ type: 'success', message: m, sub: s }),
      error: (m, s) => push({ type: 'error', message: m, sub: s }),
      info: (m, s) => push({ type: 'info', message: m, sub: s }),
      confirm: (m, s, fn) => push({ type: 'confirm', message: m, sub: s, onConfirm: fn }),
    }
  };
};

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
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [resQuests, resUser] = await Promise.all([
        axios.get("http://localhost:5000/api/tasks/", config),
        axios.get("http://localhost:5000/api/auth/me", config)
      ]);
      setQuests(resQuests.data.data || []);
      setUserStats({ xp: resUser.data.xp || 0, totalTasksDone: resUser.data.totalTasksDone || 0, username: resUser.data.username || "Commander" });
    } catch (err) { console.error("Sync Error:", err); } 
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setQuests(prev => prev.filter(q => !(q.deadline && new Date(q.deadline) < now && q.status !== 'completed')));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleComplete = async (taskId, questTitle, questXp) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(`http://localhost:5000/api/tasks/${taskId}/complete`, {}, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        notify.success(`+${questXp || 100} XP Rewarded!`, `"${questTitle}" has been vanquished.`);
        fetchData();
      }
    } catch (err) { notify.error("Claim Failed", err.response?.data?.message || "Failed to claim reward."); }
  };

  const handleDelete = (taskId) => {
    notify.confirm("Abandon this record?", "XP stays safe — only the log is purged.", async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, { headers: { Authorization: `Bearer ${token}` } });
        notify.info("Log Purged", "Mission record removed from the board.");
        fetchData();
      } catch (err) { notify.error("Delete Failed", "Could not remove mission log."); }
    });
  };

  const now = new Date();
  const filteredQuests = quests.filter(q => !(q.deadline && new Date(q.deadline) < now && q.status !== 'completed'))
    .filter(q => activeTab === 'active' ? q.status !== 'completed' : q.status === 'completed');
  const currentTier = getTierInfo(userStats.xp);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F8F5F2]"><div className="h-12 w-12 border-4 border-[#C29976] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <>
      <NotificationPortal notifications={notifications} onDismiss={dismiss} />
      <div className="min-h-screen bg-[#F8F5F2] p-6 pt-32 pb-24 font-sans text-zinc-900 selection:bg-[#C29976]/20">
        <div className="max-w-7xl mx-auto mb-16">
          <h1 className="text-6xl font-black tracking-tighter text-zinc-900 mb-2">Quest <span className="text-[#C29976]">Board</span></h1>
          <p className="text-zinc-400 font-medium italic">Welcome back, {userStats.username}. New missions have been deployed.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            <div className="flex justify-between items-center bg-white p-3 rounded-[2.5rem] border border-zinc-100 shadow-sm w-fit">
              {['active', 'completed'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all duration-500 ${activeTab === tab ? 'bg-[#111] text-white shadow-2xl scale-105' : 'text-zinc-400 hover:text-zinc-800'}`}>{tab} missions</button>
              ))}
            </div>

            <div className="grid gap-6">
              {filteredQuests.length > 0 ? filteredQuests.map((quest, idx) => (
                <div key={quest._id} className="group bg-white p-8 rounded-[3.5rem] border border-zinc-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="flex items-center gap-8">
                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-700 group-hover:rotate-[360deg] shadow-inner ${quest.status === 'completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-[#F8F5F2] text-[#C29976]'}`}>
                      {quest.status === 'completed' ? <CheckCircle2 size={32} /> : <Sword size={32} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm bg-zinc-900 text-white">Mission XP</span>
                        {quest.status !== 'completed' && <span className="flex items-center gap-1 text-[9px] font-black text-zinc-400 uppercase tracking-widest"><Clock className="w-3 h-3 text-[#C29976]" />{quest.deadline ? new Date(quest.deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : 'No Date'}</span>}
                      </div>
                      <h3 className="font-black text-2xl text-zinc-800 tracking-tight group-hover:text-[#C29976] transition-colors">{quest.title}</h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-8 pt-6 md:pt-0 border-t md:border-0 border-zinc-50">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2 text-zinc-900 font-black text-3xl tracking-tighter"><Zap className="w-6 h-6 fill-[#C29976] text-[#C29976]" /> +{quest.xp || 100}</div>
                    </div>
                    <div>
                      {quest.status !== 'completed' ? (
                        <button onClick={() => handleComplete(quest._id, quest.title, quest.xp)} className="bg-[#111] hover:bg-[#C29976] text-white text-[10px] px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] transition-all hover:shadow-xl active:scale-95 flex items-center gap-2">Claim <ChevronRight size={14} /></button>
                      ) : (
                        <button onClick={() => handleDelete(quest._id)} className="bg-zinc-50 hover:bg-red-50 text-zinc-300 hover:text-red-500 p-5 rounded-3xl transition-all duration-500 active:rotate-12"><Trash2 size={24} /></button>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-32 bg-white/50 rounded-[4rem] border-4 border-dashed border-zinc-200">
                  <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"><Ghost className="w-12 h-12 text-zinc-300" /></div>
                  <p className="text-zinc-400 font-black uppercase tracking-[0.4em] text-xs">Awaiting new missions in this sector</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#111] p-10 rounded-[4rem] shadow-2xl text-white relative overflow-hidden group transition-all duration-500">
              <div className="absolute -top-10 -right-10 opacity-5 group-hover:rotate-45 transition-transform duration-1000"><Shield size={200} /></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${currentTier.color}`}><Shield size={24} /></div>
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
                      <div className="h-full bg-gradient-to-r from-[#C29976] to-amber-200 rounded-full transition-all duration-1000" style={{ width: `${Math.min((userStats.xp / 1000) * 100, 100)}%` }}></div>
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
              <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-6 flex items-center gap-3"><ClipboardList size={16} className="text-[#C29976]" /> Guild Wisdom</h4>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed italic opacity-80">"Every completed mission is one step closer to the Celestial title. Clear your task board regularly to maintain the focus of the Commander."</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Questpage;