import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";

const Dashboardpage = () => {
  const [userData, setUserData] = useState({ username: "", xp: 0, streak: 0, totalTasksDone: 0 });
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({ title: "", description: "", deadline: "" });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tierList = [
    { name: "Newbie", minLvl: 1, icon: "ri-seedling-line", color: "text-zinc-400 bg-zinc-100", accent: "bg-zinc-400", border: "border-zinc-200" },
    { name: "Explorer", minLvl: 6, icon: "ri-compass-line", color: "text-amber-600 bg-amber-50", accent: "bg-amber-500", border: "border-amber-200" },
    { name: "Commander", minLvl: 11, icon: "ri-medal-line", color: "text-blue-600 bg-blue-50", accent: "bg-blue-500", border: "border-blue-200" },
    { name: "Sentinel", minLvl: 16, icon: "ri-shield-flash-line", color: "text-emerald-600 bg-emerald-50", accent: "bg-emerald-500", border: "border-emerald-200" },
    { name: "Warlord", minLvl: 21, icon: "ri-sword-line", color: "text-red-600 bg-red-50", accent: "bg-red-500", border: "border-red-200" },
    { name: "Celestial", minLvl: 26, icon: "ri-mickey-line", color: "text-purple-600 bg-purple-50", accent: "bg-purple-500", border: "border-purple-200" },
  ];

  const calculateLevel = (xp = 0) => {
    const milestones = [
      { lvl: 1, xp: 0, tier: "Newbie" }, { lvl: 6, xp: 1000, tier: "Explorer" },
      { lvl: 11, xp: 5000, tier: "Commander" }, { lvl: 16, xp: 20000, tier: "Sentinel" },
      { lvl: 21, xp: 65000, tier: "Warlord" }, { lvl: 26, xp: 200000, tier: "Celestial" },
      { lvl: 30, xp: 500000, tier: "Celestial" },
    ];
    let current = milestones[0], next = milestones[1] || milestones[0];
    for (let i = 0; i < milestones.length; i++) {
      if (xp >= milestones[i].xp) { current = milestones[i]; next = milestones[i + 1] || milestones[i]; } else break;
    }
    const displayLevel = current.lvl + (next.lvl !== current.lvl ? Math.floor(((xp - current.xp) / (next.xp - current.xp)) * (next.lvl - current.lvl)) : 0);
    const tierData = tierList.find(t => t.name === current.tier) || tierList[0];
    return { level: displayLevel, tier: current.tier, tierColor: tierData.color, accentColor: tierData.accent, nextLevelXP: next.xp, progress: Math.min(((xp - current.xp) / ((next.xp - current.xp) || 1)) * 100, 100) };
  };

  const stats = useMemo(() => calculateLevel(userData.xp), [userData.xp]);
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
      const [userRes, tasksRes] = await Promise.all([axios.get("http://localhost:5000/api/auth/me", { headers }), axios.get("http://localhost:5000/api/tasks/", { headers })]);
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F8F5F2]"><div className="h-16 w-16 border-8 border-zinc-200 border-t-[#C29976] rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-[#F8F5F2] pt-36 pb-20 px-6 font-sans selection:bg-[#C29976]/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <h1 className="text-6xl font-black text-zinc-900 tracking-tighter">Welcome, <span className="text-[#C29976] drop-shadow-sm">{userData.username}</span></h1>
          <div className={`group px-8 py-5 rounded-[2.5rem] border shadow-xl flex items-center gap-5 transition-all duration-500 hover:scale-105 ${stats.tierColor} border-white/50 backdrop-blur-sm`}>
            <i className="ri-shield-user-line text-3xl animate-pulse"></i>
            <div>
              <p className="text-[10px] font-black uppercase opacity-50 tracking-widest">Active Rank</p>
              <p className="font-black uppercase italic text-lg leading-none tracking-tight">{stats.tier}</p>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 bg-white rounded-[4rem] p-12 border shadow-2xl relative overflow-hidden">
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
              <div className="h-full rounded-full transition-all duration-1000 ease-out shadow-lg" style={{ width: `${stats.progress}%`, background: 'linear-gradient(to right, #946C44, #B8895A)' }}></div>
            </div>
            <div className="flex justify-between text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] italic">
              <span>{stats.tier} Level</span>
              <span className="text-[#C29976]">{Math.floor(stats.progress)}% Progress</span>
            </div>
          </div>

          <div className="bg-[#111] rounded-[4rem] p-12 shadow-[0_30px_60px_rgba(0,0,0,0.3)] text-white flex flex-col justify-between relative overflow-hidden">
            <div className={`absolute top-10 right-10 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-tighter shadow-2xl backdrop-blur-md ${getActiveBuff.color}`}>
              <i className={`${getActiveBuff.icon} mr-2 text-sm`}></i>{getActiveBuff.label}
            </div>
            <div>
              <p className="text-[11px] uppercase font-bold text-zinc-500 tracking-[0.3em] mb-8">Active Streak</p>
              <h3 className="text-8xl font-black tracking-tighter">{userData.streak}</h3>
            </div>
          </div>
        </div>

        {/* Active Tasks */}
        <section className="mb-16">
          <div className="flex items-center gap-6 mb-12 px-4">
            <h2 className="text-3xl font-black text-zinc-800 flex items-center gap-4"><i className="ri-compass-3-fill text-[#C29976] text-4xl"></i> Active Missions</h2>
            <div className="h-[2px] flex-1 bg-zinc-200/50 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeTasks.length ? activeTasks.slice(0,6).map((task,idx) => (
              <div key={task._id} className="group p-10 rounded-[3.5rem] border transition-all duration-500 relative overflow-hidden bg-white border-zinc-100 hover:shadow-xl hover:-translate-y-3" style={{animationDelay:`${idx*150}ms`}}>
                <div className="flex justify-between items-start mb-8"><span className="px-4 py-1.5 bg-zinc-50 rounded-full text-[9px] font-black text-zinc-300 uppercase tracking-tighter">ID: {task._id.slice(-6)}</span><div className="w-3 h-3 rounded-full bg-[#C29976] animate-ping"></div></div>
                <h4 className="font-black text-2xl mb-3 tracking-tight text-zinc-800 group-hover:text-[#C29976]">{task.title}</h4>
                <p className="text-zinc-400 text-sm font-medium mb-10 italic line-clamp-2">"{task.description||"No specific data provided."}"</p>
                <div className="flex items-center pt-8 border-t border-zinc-50 gap-3"><i className="ri-calendar-event-line text-lg text-[#C29976]"></i><span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{new Date(task.deadline).toLocaleDateString('en-US',{day:'2-digit',month:'short'})}</span></div>
              </div>
            )) : <div className="col-span-full py-28 bg-white/40 border-4 border-dashed border-zinc-200 rounded-[4rem] text-center backdrop-blur-sm"><i className="ri-ghost-line text-6xl text-zinc-200 mb-6 block"></i><p className="text-zinc-300 font-black uppercase tracking-[0.5em] text-sm italic">Scanner: 0 Missions Found</p></div>}
          </div>
        </section>

        {/* Floating FAB & Modal */}
        <button onClick={()=>setIsModalOpen(true)} className="fixed bottom-12 right-12 bg-[#111] text-white w-24 h-24 rounded-[2.5rem] shadow-2xl flex items-center justify-center hover:bg-[#C29976] hover:rotate-[360deg] hover:scale-110 hover:rounded-full transition-all duration-700 z-[100]"><i className="ri-add-line text-5xl"></i></button>
        {isModalOpen && <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 backdrop-blur-xl bg-black/40">
          <div className="bg-white w-full max-w-xl rounded-[4rem] p-16 shadow-2xl relative">
            <button onClick={()=>setIsModalOpen(false)} className="absolute top-10 right-10 text-zinc-300 hover:text-zinc-800"><i className="ri-close-circle-fill text-4xl"></i></button>
            <div className="mb-12 text-center"><i className="ri-rocket-2-fill text-[#C29976] text-5xl mb-6 block animate-bounce"></i><h2 className="text-4xl font-black text-zinc-900 mb-2 tracking-tighter uppercase">Launch Mission</h2></div>
            <form onSubmit={handleAddTask} className="space-y-6">
              <input type="text" required placeholder="Mission Name" className="w-full bg-zinc-50 border-2 border-transparent rounded-[2rem] px-8 py-6 font-bold focus:border-[#C29976]/30 outline-none" onChange={e=>setTaskData({...taskData,title:e.target.value})} />
              <textarea rows="3" placeholder="Details" className="w-full bg-zinc-50 border-2 border-transparent rounded-[2rem] px-8 py-6 font-medium focus:border-[#C29976]/30 outline-none resize-none" onChange={e=>setTaskData({...taskData,description:e.target.value})}></textarea>
              <input type="datetime-local" required min={new Date().toISOString().slice(0,16)} className="w-full bg-zinc-50 border-2 border-transparent rounded-[2rem] px-8 py-6 font-bold outline-none" onChange={e=>setTaskData({...taskData,deadline:e.target.value})} />
              <div className="flex gap-4 pt-8"><button type="submit" className="flex-[2] py-6 bg-[#111] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-[#C29976] transition-all">Confirm Launch</button><button type="button" onClick={()=>setIsModalOpen(false)} className="flex-1 py-6 bg-zinc-100 text-zinc-400 rounded-[2rem] font-black text-xs uppercase hover:bg-zinc-200 transition-all">Abort</button></div>
            </form>
          </div>
        </div>}
      </div>
    </div>
  );
};

export default Dashboardpage;