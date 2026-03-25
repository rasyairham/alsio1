import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";

const Dashboardpage = () => {
  const [userData, setUserData] = useState({ username: "", xp: 0, streak: 0, totalTasksDone: 0 });
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({ title: "", description: "", deadline: "" });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tierList = [
    { name: "Newbie", minXp: 0, icon: "ri-seedling-line", color: "text-zinc-400 bg-zinc-100", accent: "bg-zinc-400", border: "border-zinc-200" },
    { name: "Explorer", minXp: 1000, icon: "ri-compass-line", color: "text-amber-600 bg-amber-50", accent: "bg-amber-500", border: "border-amber-200" },
    { name: "Commander", minXp: 5000, icon: "ri-medal-line", color: "text-blue-600 bg-blue-50", accent: "bg-blue-500", border: "border-blue-200" },
    { name: "Sentinel", minXp: 20000, icon: "ri-shield-flash-line", color: "text-emerald-600 bg-emerald-50", accent: "bg-emerald-500", border: "border-emerald-200" },
    { name: "Warlord", minXp: 65000, icon: "ri-sword-line", color: "text-red-600 bg-red-50", accent: "bg-red-500", border: "border-red-200" },
    { name: "Celestial", minXp: 200000, icon: "ri-mickey-line", color: "text-purple-600 bg-purple-50", accent: "bg-purple-500", border: "border-purple-200" },
  ];

  const calculateLevel = (xp = 0) => {
    const milestones = [
      { lvl: 1, xp: 0, tier: "Newbie" }, { lvl: 6, xp: 1000, tier: "Explorer" },
      { lvl: 11, xp: 5000, tier: "Commander" }, { lvl: 16, xp: 20000, tier: "Sentinel" },
      { lvl: 21, xp: 65000, tier: "Warlord" }, { lvl: 26, xp: 200000, tier: "Celestial" },
    ];
    let current = milestones[0], next = milestones[1] || milestones[0];
    for (let i = 0; i < milestones.length; i++) {
      if (xp >= milestones[i].xp) { current = milestones[i]; next = milestones[i + 1] || milestones[i]; } else break;
    }
    const displayLevel = current.lvl + (next.lvl !== current.lvl ? Math.floor(((xp - current.xp) / (next.xp - current.xp)) * (next.lvl - current.lvl)) : 0);
    const tierData = tierList.find(t => t.name === current.tier) || tierList[0];
    return { level: displayLevel, tier: current.tier, tierData, nextLevelXP: next.xp, progress: Math.min(((xp - current.xp) / ((next.xp - current.xp) || 1)) * 100, 100) };
  };

  const stats = useMemo(() => calculateLevel(userData.xp), [userData.xp]);

  const refreshAllData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };
      const [userRes, tasksRes] = await Promise.all([
        axios.get("http://localhost:5000/api/auth/me", { headers }),
        axios.get("http://localhost:5000/api/tasks/", { headers })
      ]);
      userRes.data && setUserData(userRes.data);
      tasksRes.data?.data && setTasks(tasksRes.data.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }, []);

  useEffect(() => { refreshAllData(); }, [refreshAllData]);

  const handleAddTask = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/tasks/create", { ...taskData, deadline: new Date(taskData.deadline).toISOString(), category: "General" }, { headers: { Authorization: `Bearer ${token}` } });
      setIsModalOpen(false); setTaskData({ title: "", description: "", deadline: "" }); refreshAllData();
    } catch { alert("Failed to deploy mission."); }
  };

  const activeTasks = tasks.filter(t => t.status !== 'completed' && t.status !== 'failed' && new Date(t.deadline) > new Date());

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F8F5F2]"><div className="h-12 w-12 md:h-16 md:w-16 border-4 md:border-8 border-zinc-200 border-t-[#C29976] rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-[#F8F5F2] pt-24 md:pt-36 pb-20 px-4 md:px-6 font-sans selection:bg-[#C29976]/30 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section - Stacked on Mobile */}
        <header className="mb-10 md:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8 text-center lg:text-left">
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[#C29976] mb-2 md:mb-4">Command Center</p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-zinc-900 tracking-tighter leading-tight">
              Welcome, <span className="text-zinc-400 break-words">{userData.username}</span>
            </h1>
          </div>
          <div className={`mx-auto lg:mx-0 px-6 md:px-10 py-4 md:py-6 rounded-[2rem] md:rounded-[3rem] border-2 shadow-xl flex items-center gap-4 md:gap-6 transition-all duration-500 hover:scale-105 ${stats.tierData.color} ${stats.tierData.border} backdrop-blur-md`}>
            <i className={`${stats.tierData.icon} text-2xl md:text-4xl animate-pulse`}></i>
            <div className="text-left">
              <p className="text-[8px] md:text-[10px] font-black uppercase opacity-40 tracking-widest">Current Rank</p>
              <p className="font-black uppercase italic text-lg md:text-2xl tracking-tighter">{stats.tier}</p>
            </div>
          </div>
        </header>

        {/* Tier System Overview - Scrollable on Mobile */}
        <section className="mb-12 md:mb-16">
          <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8 px-2 md:px-4">
            <h2 className="text-[10px] md:text-xs font-black text-zinc-400 uppercase tracking-[0.2em] md:tracking-[0.3em] whitespace-nowrap">Tier Progression</h2>
            <div className="h-[1px] flex-1 bg-zinc-200"></div>
          </div>
          {/* Mobile Scroll Hint */}
          <div className="lg:hidden text-[8px] text-zinc-300 font-bold uppercase mb-2 px-2 tracking-widest italic">Swipe to explore →</div>
          <div className="flex lg:grid lg:grid-cols-6 gap-3 md:gap-4 overflow-x-auto pb-4 lg:pb-0 no-scrollbar snap-x">
            {tierList.map((tier) => (
              <div key={tier.name} className={`flex-shrink-0 w-36 lg:w-auto snap-center p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border-2 transition-all duration-500 group relative overflow-hidden ${stats.tier === tier.name ? `${tier.color} ${tier.border} scale-105 shadow-lg` : 'bg-white border-zinc-50 grayscale opacity-60'}`}>
                <i className={`${tier.icon} text-xl md:text-2xl mb-3 md:mb-4 block ${stats.tier === tier.name ? 'animate-bounce' : ''}`}></i>
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1">{tier.name}</p>
                <p className="text-[8px] font-bold opacity-50 italic">{tier.minXp.toLocaleString()} XP</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Grid - 1 Col on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 border border-zinc-100 shadow-2xl relative overflow-hidden group">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-10 gap-4">
              <div>
                <p className="text-[9px] md:text-[10px] uppercase font-black text-zinc-300 mb-2 md:mb-3 tracking-[0.3em]">Power Level</p>
                <h2 className="text-6xl md:text-8xl font-black text-zinc-900 italic tracking-tighter group-hover:text-[#C29976] transition-colors leading-none text-left">Lv. {stats.level}</h2>
              </div>
              <div className="text-left sm:text-right w-full sm:w-auto">
                <p className="text-3xl md:text-4xl font-black text-zinc-900 mb-1">{userData.xp.toLocaleString()}<span className="text-sm md:text-lg text-zinc-200 ml-2 italic text-left">XP</span></p>
                <p className="text-[8px] md:text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Required: {stats.nextLevelXP.toLocaleString()}</p>
              </div>
            </div>
            <div className="w-full h-6 md:h-8 bg-zinc-50 rounded-full overflow-hidden mb-4 md:mb-6 border-2 md:border-4 border-white shadow-inner p-1">
              <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${stats.progress}%`, background: 'linear-gradient(90deg, #111 0%, #C29976 100%)' }}></div>
            </div>
            <div className="flex justify-between text-[9px] md:text-[11px] font-black text-zinc-400 uppercase tracking-widest md:tracking-[0.3em] italic">
              <span>{stats.tier} Path</span>
              <span className="text-[#C29976]">{Math.floor(stats.progress)}% progress</span>
            </div>
          </div>

          <div className="bg-[#111] rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 shadow-2xl text-white flex flex-col justify-between relative overflow-hidden min-h-[250px] md:min-h-auto">
            <div>
              <p className="text-[10px] md:text-[11px] uppercase font-bold text-zinc-600 tracking-[0.3em] mb-4 md:mb-12 text-left">Current Streak</p>
              <h3 className="text-7xl md:text-[9rem] font-black tracking-tighter leading-none text-left">{userData.streak}</h3>
            </div>
            <div className="flex items-center gap-3 text-[#C29976] mt-4">
              <i className="ri-fire-fill text-2xl md:text-3xl animate-pulse"></i>
              <span className="text-[10px] font-black uppercase tracking-widest italic">In Flow</span>
            </div>
          </div>
        </div>

        {/* Active Tasks Grid */}
        <section className="mb-20">
          <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12 px-2 md:px-4">
            <h2 className="text-2xl md:text-4xl font-black text-zinc-900 flex items-center gap-3 md:gap-4 tracking-tighter uppercase"><i className="ri-flashlight-fill text-[#C29976] text-3xl md:text-5xl"></i> Missions</h2>
            <div className="h-[2px] flex-1 bg-zinc-200/50 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {activeTasks.length ? activeTasks.slice(0,6).map((task,idx) => (
              <div key={task._id} className="group p-8 md:p-10 rounded-[3rem] md:rounded-[4rem] border-2 transition-all duration-500 bg-white border-zinc-100 hover:border-[#C29976]/20 hover:shadow-xl sm:hover:-translate-y-2">
                <div className="flex justify-between items-center mb-6 md:mb-10">
                   <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#F8F5F2] flex items-center justify-center text-[#C29976] font-black">0{idx+1}</div>
                   <div className="px-3 md:px-5 py-1.5 md:py-2 rounded-full bg-zinc-50 text-[8px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest border border-zinc-100 text-left">Pending</div>
                </div>
                <h4 className="font-black text-xl md:text-3xl mb-3 tracking-tight text-zinc-900 text-left">{task.title}</h4>
                <p className="text-zinc-400 text-xs md:text-sm font-medium mb-8 md:mb-12 italic leading-relaxed text-left line-clamp-3">"{task.description || "Mission details are classified."}"</p>
                <div className="flex items-center justify-between pt-6 md:pt-8 border-t border-zinc-50">
                  <div className="flex items-center gap-2">
                    <i className="ri-time-line text-[#C29976]"></i>
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500">{new Date(task.deadline).toLocaleDateString('en-US',{day:'2-digit',month:'short'})}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-20 md:py-32 bg-zinc-100/50 border-4 border-dashed border-zinc-200 rounded-[3rem] md:rounded-[5rem] text-center">
                <i className="ri-radar-line text-5xl md:text-7xl text-zinc-200 mb-6 md:mb-8 block"></i>
                <p className="text-zinc-400 font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-xs md:text-sm italic">All Zones Clear</p>
              </div>
            )}
          </div>
        </section>

        {/* Responsive Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-8 backdrop-blur-2xl bg-black/60">
            <div className="bg-white w-full max-w-2xl rounded-t-[3rem] sm:rounded-[4rem] md:rounded-[5rem] p-8 sm:p-12 md:p-20 shadow-2xl relative overflow-y-auto max-h-[90vh] animate-in slide-in-from-bottom duration-300">
              <button onClick={()=>setIsModalOpen(false)} className="absolute top-6 right-6 sm:top-10 sm:right-10 text-zinc-200 hover:text-red-500 transition-colors"><i className="ri-close-circle-fill text-3xl sm:text-5xl"></i></button>
              <div className="mb-8 sm:mb-16 text-center text-left">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[#F8F5F2] rounded-2xl sm:rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 sm:mb-8">
                  <i className="ri-rocket-2-fill text-[#C29976] text-3xl sm:text-5xl"></i>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 mb-2 tracking-tighter uppercase italic">New Mission</h2>
              </div>
              <form onSubmit={handleAddTask} className="space-y-6 sm:space-y-8">
                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest ml-4 sm:ml-6 text-zinc-400 text-left">Objective Name</label>
                  <input type="text" required placeholder="Ex: Master MongoDB" className="w-full bg-zinc-50 border-none rounded-2xl sm:rounded-[2.5rem] px-6 sm:px-10 py-5 sm:py-8 font-black text-sm sm:text-lg focus:ring-4 ring-[#C29976]/10 outline-none" onChange={e=>setTaskData({...taskData,title:e.target.value})} />
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest ml-4 sm:ml-6 text-zinc-400">Tactical Details</label>
                  <textarea rows="3" placeholder="Define the scope..." className="w-full bg-zinc-50 border-none rounded-2xl sm:rounded-[2.5rem] px-6 sm:px-10 py-5 sm:py-8 font-medium text-sm focus:ring-4 ring-[#C29976]/10 outline-none resize-none" onChange={e=>setTaskData({...taskData,description:e.target.value})}></textarea>
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest ml-4 sm:ml-6 text-zinc-400">Deadline</label>
                  <input type="datetime-local" required className="w-full bg-zinc-50 border-none rounded-2xl sm:rounded-[2.5rem] px-6 sm:px-10 py-5 sm:py-8 font-black text-sm outline-none" onChange={e=>setTaskData({...taskData,deadline:e.target.value})} />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-6 sm:pt-10">
                  <button type="submit" className="flex-[2] py-5 sm:py-8 bg-[#111] text-white rounded-2xl sm:rounded-[2.5rem] font-black text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.4em] hover:bg-[#C29976] shadow-xl">Confirm Launch</button>
                  <button type="button" onClick={()=>setIsModalOpen(false)} className="flex-1 py-5 sm:py-8 bg-zinc-100 text-zinc-400 rounded-2xl sm:rounded-[2.5rem] font-black text-[10px] sm:text-xs uppercase hover:bg-zinc-200">Abort</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Floating Button - Smaller on Mobile */}
        <button onClick={()=>setIsModalOpen(true)} className="fixed bottom-6 right-6 md:bottom-12 md:right-12 bg-[#111] text-white w-16 h-16 md:w-28 md:h-28 rounded-2xl md:rounded-[3.5rem] shadow-2xl flex items-center justify-center hover:bg-[#C29976] transition-all duration-500 z-[100] group active:scale-90">
          <i className="ri-add-line text-3xl md:text-6xl group-hover:rotate-90 transition-transform"></i>
        </button>
      </div>
    </div>
  );
};

export default Dashboardpage;