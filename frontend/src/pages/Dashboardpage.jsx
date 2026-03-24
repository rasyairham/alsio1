import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";

const Dashboardpage = () => {
  const [userData, setUserData] = useState({
    username: "",
    xp: 0,
    streak: 0,
    totalTasksDone: 0
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [taskData, setTaskData] = useState({ 
    title: "", 
    description: "", 
    deadline: ""
  });

  // --- DATA MASTER TIER DENGAN EKSTENSI EFEK ---
  const tierList = [
    { 
      name: "Newbie", minLvl: 1, icon: "ri-seedling-line", 
      color: "text-zinc-400 bg-zinc-100", accent: "bg-zinc-400",
      shadow: "shadow-zinc-200", border: "border-zinc-200"
    },
    { 
      name: "Explorer", minLvl: 6, icon: "ri-compass-line", 
      color: "text-amber-600 bg-amber-50", accent: "bg-amber-500",
      shadow: "shadow-amber-200", border: "border-amber-200"
    },
    { 
      name: "Commander", minLvl: 11, icon: "ri-medal-line", 
      color: "text-blue-600 bg-blue-50", accent: "bg-blue-500",
      shadow: "shadow-blue-200", border: "border-blue-200"
    },
    { 
      name: "Sentinel", minLvl: 16, icon: "ri-shield-flash-line", 
      color: "text-emerald-600 bg-emerald-50", accent: "bg-emerald-500",
      shadow: "shadow-emerald-200", border: "border-emerald-200"
    },
    { 
      name: "Warlord", minLvl: 21, icon: "ri-sword-line", 
      color: "text-red-600 bg-red-50", accent: "bg-red-500",
      shadow: "shadow-red-200", border: "border-red-200"
    },
    { 
      name: "Celestial", minLvl: 26, icon: "ri-mickey-line", 
      color: "text-purple-600 bg-purple-50", accent: "bg-purple-500",
      shadow: "shadow-purple-300", border: "border-purple-200"
    },
  ];

  const calculateLevel = (xp = 0) => {
    const milestones = [
      { lvl: 1, xp: 0, tier: "Newbie" },
      { lvl: 6, xp: 1000, tier: "Explorer" },
      { lvl: 11, xp: 5000, tier: "Commander" },
      { lvl: 16, xp: 20000, tier: "Sentinel" },
      { lvl: 21, xp: 65000, tier: "Warlord" },
      { lvl: 26, xp: 200000, tier: "Celestial" },
      { lvl: 30, xp: 500000, tier: "Celestial" },
    ];

    let current = milestones[0];
    let next = milestones[1] || milestones[0];

    for (let i = 0; i < milestones.length; i++) {
      if (xp >= milestones[i].xp) {
        current = milestones[i];
        next = milestones[i + 1] || milestones[i];
      } else { break; }
    }

    let displayLevel = current.lvl;
    if (next.lvl !== current.lvl) {
      displayLevel += Math.floor(((xp - current.xp) / (next.xp - current.xp)) * (next.lvl - current.lvl));
    }

    const currentTierData = tierList.find(t => t.name === current.tier) || tierList[0];

    return { 
      level: displayLevel, 
      tier: current.tier, 
      tierColor: currentTierData.color,
      accentColor: currentTierData.accent,
      nextLevelXP: next.xp,
      progress: Math.min(((xp - current.xp) / ((next.xp - current.xp) || 1)) * 100, 100)
    };
  };

  const stats = useMemo(() => calculateLevel(userData?.xp || 0), [userData.xp]);

  const getActiveBuff = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour <= 11) return { label: "Morning Owl", icon: "ri-sun-cloudy-line", color: "text-amber-500 bg-amber-50" };
    if (hour >= 18 || hour <= 4) return { label: "Night Crawler", icon: "ri-moon-clear-line", color: "text-indigo-500 bg-indigo-50" };
    return { label: "Steady Flow", icon: "ri-windy-line", color: "text-emerald-500 bg-emerald-50" };
  }, []);

  const refreshAllData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };
      const [userRes, tasksRes] = await Promise.all([
        axios.get("http://localhost:5000/api/auth/me", { headers }),
        axios.get("http://localhost:5000/api/tasks/", { headers })
      ]);
      if (userRes.data) setUserData(userRes.data);
      if (tasksRes.data?.data) setTasks(tasksRes.data.data);
    } catch (err) {
      console.error("Sync Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshAllData(); }, [refreshAllData]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/tasks/create", 
        { ...taskData, deadline: new Date(taskData.deadline).toISOString(), category: "General" }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsModalOpen(false);
      setTaskData({ title: "", description: "", deadline: "" });
      refreshAllData();
    } catch (err) { alert("Failed to deploy mission."); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F5F2]">
      <div className="h-16 w-16 border-8 border-zinc-200 border-t-[#C29976] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F5F2] pt-28 pb-20 px-6 font-sans selection:bg-[#C29976]/30">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="animate-in slide-in-from-left duration-700">
            <p className="text-[#C29976] font-black text-xs uppercase tracking-[0.3em] mb-3 italic">ALSIO COMMANDER v1.0</p>
            <h1 className="text-6xl font-black text-zinc-900 tracking-tighter">
              Welcome, <span className="text-[#C29976] drop-shadow-sm">{userData.username}</span>
            </h1>
          </div>
          
          <div className={`group px-8 py-5 rounded-[2.5rem] border shadow-xl flex items-center gap-5 transition-all duration-500 hover:scale-105 ${stats.tierColor} border-white/50 backdrop-blur-sm`}>
            <div className="relative">
              <i className="ri-shield-user-line text-3xl animate-pulse"></i>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
                <p className="text-[10px] font-black uppercase opacity-50 tracking-widest">Active Rank</p>
                <p className="font-black uppercase italic text-lg leading-none tracking-tight">{stats.tier}</p>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Main Level Card */}
          <div className="lg:col-span-2 bg-white rounded-[4rem] p-12 border border-white shadow-2xl shadow-zinc-200/50 relative overflow-hidden group transition-all duration-500 hover:shadow-zinc-300/60">
            {/* Animated Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C29976]/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-[#C29976]/10 transition-colors"></div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-end mb-8">
                  <div>
                      <p className="text-xs uppercase font-black text-zinc-400 mb-3 tracking-[0.2em]">Current Power Level</p>
                      <h2 className="text-7xl font-black text-zinc-800 italic tracking-tighter">Level {stats.level}</h2>
                  </div>
                  <div className="text-right">
                      <p className="text-3xl font-black text-zinc-900 mb-1">{userData.xp.toLocaleString()}</p>
                      <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">/ {stats.nextLevelXP.toLocaleString()} XP</p>
                  </div>
                </div>
                
                <div className="w-full h-6 bg-zinc-50 rounded-full overflow-hidden mb-6 border border-zinc-100 p-1.5 shadow-inner">
                  <div 
                    className={`h-full ${stats.accentColor} rounded-full transition-all duration-1000 ease-out shadow-lg`} 
                    style={{ width: `${stats.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] italic">
                   <span>{stats.tier} Milestone</span>
                   <span className="text-[#C29976]">{Math.floor(stats.progress)}% Progress</span>
                </div>
            </div>
          </div>

          {/* Streak Card */}
          <div className="bg-[#111] rounded-[4rem] p-12 shadow-[0_30px_60px_rgba(0,0,0,0.3)] text-white flex flex-col justify-between group relative overflow-hidden transition-all duration-500 hover:-translate-y-2">
            <div className={`absolute top-10 right-10 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-tighter shadow-2xl backdrop-blur-md ${getActiveBuff.color}`}>
               <i className={`${getActiveBuff.icon} mr-2 text-sm`}></i> {getActiveBuff.label}
            </div>
            <div className="relative z-10">
                <p className="text-[11px] uppercase font-bold text-zinc-500 tracking-[0.3em] mb-8">Active Streak</p>
                <div className="flex items-baseline gap-3">
                  <h3 className="text-8xl font-black tracking-tighter group-hover:text-[#C29976] transition-colors">{userData.streak}</h3>
                  <span className="text-2xl font-black text-zinc-600 italic">Days</span>
                </div>
                <p className="mt-4 text-[10px] font-black text-[#C29976] uppercase tracking-[0.2em]">Consistency Protocol: Active</p>
            </div>
            {/* Background pattern */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#C29976]/10 to-transparent"></div>
          </div>
        </div>

        {/* Quests Section */}
        <section className="mb-16">
          <div className="flex items-center gap-6 mb-12 px-4">
            <h2 className="text-3xl font-black text-zinc-800 flex items-center gap-4">
               <i className="ri-compass-3-fill text-[#C29976] text-4xl"></i> Active Missions
            </h2>
            <div className="h-[2px] flex-1 bg-zinc-200/50 rounded-full"></div>
            <button className="text-[10px] font-black text-zinc-400 hover:text-zinc-800 uppercase tracking-widest transition-colors">View All Archive</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tasks.filter(t => t.status !== 'completed').length > 0 ? (
                tasks.filter(t => t.status !== 'completed').slice(0, 3).map((task, idx) => (
                <div key={task._id} className="group bg-white p-10 rounded-[3.5rem] border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-3 transition-all duration-500 relative overflow-hidden animate-in fade-in slide-in-from-bottom-5" style={{ animationDelay: `${idx * 150}ms` }}>
                    <div className="flex justify-between items-start mb-8">
                        <span className="px-4 py-1.5 bg-zinc-50 rounded-full text-[9px] font-black text-zinc-300 uppercase tracking-tighter">ID: {task._id.slice(-6)}</span>
                        <div className="w-3 h-3 rounded-full bg-[#C29976] animate-ping"></div>
                    </div>
                    <h4 className="font-black text-2xl text-zinc-800 mb-3 group-hover:text-[#C29976] transition-colors tracking-tight">{task.title}</h4>
                    <p className="text-zinc-400 text-sm font-medium mb-10 italic leading-relaxed line-clamp-2">"{task.description || "No specific data provided for this mission."}"</p>
                    
                    <div className="flex items-center justify-between pt-8 border-t border-zinc-50">
                        <div className="flex items-center gap-3">
                          <i className="ri-calendar-event-line text-[#C29976] text-lg"></i>
                          <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                            {new Date(task.deadline).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                        <i className="ri-arrow-right-up-line text-zinc-200 text-2xl group-hover:text-[#C29976] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"></i>
                    </div>
                </div>
                ))
              ) : (
                <div className="col-span-full py-28 bg-white/40 border-4 border-dashed border-zinc-200 rounded-[4rem] text-center backdrop-blur-sm animate-pulse">
                    <i className="ri-ghost-line text-6xl text-zinc-200 mb-6 block"></i>
                    <p className="text-zinc-300 font-black uppercase tracking-[0.5em] text-sm italic">Scanner: 0 Missions Found</p>
                </div>
              )}
          </div>
        </section>

        {/* Rank Discovery Board */}
        <section className="mb-24 pb-12">
          <div className="flex items-center gap-6 mb-12 px-4">
            <h2 className="text-3xl font-black text-zinc-800 flex items-center gap-4">
               <i className="ri-medal-fill text-[#C29976] text-4xl"></i> Rank Discovery
            </h2>
            <div className="h-[2px] flex-1 bg-zinc-200/50 rounded-full"></div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic tracking-[0.2em]">Evolution Roadmap</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 px-2">
            {tierList.map((tier, idx) => {
              const isCurrent = stats.tier === tier.name;
              const isLocked = stats.level < tier.minLvl;

              return (
                <div 
                  key={tier.name} 
                  className={`relative p-8 rounded-[3.5rem] border transition-all duration-700 group
                    ${isCurrent ? `bg-white scale-110 z-20 shadow-[0_40px_80px_rgba(0,0,0,0.1)] ${tier.border} -translate-y-4` : 'bg-white/60 border-transparent hover:bg-white hover:shadow-xl'} 
                    ${isLocked ? 'grayscale opacity-40' : 'grayscale-0'}`}
                >
                  {/* Visual Background for Current */}
                  {isCurrent && (
                    <div className="absolute inset-0 opacity-5 animate-pulse rounded-[3.5rem] bg-gradient-to-br from-[#C29976] to-transparent"></div>
                  )}
                  
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-8 text-2xl transition-all duration-500 
                    ${isCurrent ? `${tier.color} shadow-lg scale-110 animate-bounce` : isLocked ? 'bg-zinc-100 text-zinc-300' : `${tier.color} opacity-80`}`}>
                    <i className={tier.icon}></i>
                  </div>

                  <h3 className={`font-black text-sm uppercase tracking-tighter mb-2 transition-colors 
                    ${isCurrent ? 'text-zinc-900' : 'text-zinc-400 group-hover:text-zinc-800'}`}>
                    {tier.name}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <p className={`text-[9px] font-black uppercase tracking-widest ${isLocked ? 'text-zinc-300' : 'text-[#C29976]'}`}>
                      {isLocked ? `Lvl ${tier.minLvl}+` : isCurrent ? 'Active' : 'Unlocked'}
                    </p>
                    {!isLocked && !isCurrent && <i className="ri-checkbox-circle-fill text-emerald-400 text-xs"></i>}
                  </div>

                  {/* Tiny Progress Bar for each rank */}
                  <div className="mt-6 h-[4px] w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${tier.accent} transition-all duration-1000`} 
                      style={{ width: isLocked ? '0%' : isCurrent ? `${stats.progress}%` : '100%' }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Floating Action Button */}
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="fixed bottom-12 right-12 bg-[#111] text-white w-24 h-24 rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.4)] flex items-center justify-center hover:bg-[#C29976] hover:rotate-[360deg] hover:scale-110 hover:rounded-full transition-all duration-700 z-[100] group"
        >
          <i className="ri-add-line text-5xl group-hover:scale-125 transition-transform"></i>
          {/* Tooltip */}
          <span className="absolute right-28 px-6 py-3 bg-[#111] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">New Mission Launch</span>
        </button>

        {/* Modal Deployment */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 backdrop-blur-xl bg-black/40 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-xl rounded-[4rem] p-16 shadow-[0_50px_100px_rgba(0,0,0,0.4)] animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-zinc-300 hover:text-zinc-800 transition-colors">
                <i className="ri-close-circle-fill text-4xl"></i>
              </button>

              <div className="mb-12 text-center">
                <i className="ri-rocket-2-fill text-[#C29976] text-5xl mb-6 block animate-bounce"></i>
                <h2 className="text-4xl font-black text-zinc-900 mb-2 tracking-tighter uppercase">Launch Mission</h2>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] italic">Prepare for Deployment Explorer</p>
              </div>
              
              <form onSubmit={handleAddTask} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-zinc-400 ml-4 tracking-widest">Mission Name</label>
                  <input 
                      type="text" required placeholder="Ex: Master React Props"
                      className="w-full bg-zinc-50 border-2 border-transparent rounded-[2rem] px-8 py-6 font-bold text-zinc-800 outline-none focus:border-[#C29976]/30 focus:bg-white transition-all shadow-inner"
                      onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-zinc-400 ml-4 tracking-widest">Intel Details</label>
                  <textarea 
                      rows="3" placeholder="Objective summary..."
                      className="w-full bg-zinc-50 border-2 border-transparent rounded-[2rem] px-8 py-6 font-medium text-zinc-600 outline-none resize-none focus:border-[#C29976]/30 focus:bg-white transition-all shadow-inner"
                      onChange={(e) => setTaskData({...taskData, description: e.target.value})}
                  ></textarea>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-zinc-400 ml-4 tracking-widest">Deployment Deadline</label>
                  <input 
                      type="datetime-local" required
                      className="w-full bg-zinc-50 border-2 border-transparent rounded-[2rem] px-8 py-6 font-bold text-zinc-800 outline-none focus:border-[#C29976]/30 transition-all shadow-inner"
                      onChange={(e) => setTaskData({...taskData, deadline: e.target.value})}
                  />
                </div>

                <div className="flex gap-4 pt-8">
                    <button type="submit" className="flex-[2] py-6 bg-[#111] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-[#C29976] hover:-translate-y-1 transition-all active:scale-95">Confirm Launch</button>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-6 bg-zinc-100 text-zinc-400 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all">Abort</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboardpage;