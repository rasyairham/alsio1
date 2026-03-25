import React, { useEffect, useState, useCallback, useMemo } from "react";
import api from "../api/api"; // PERBAIKAN: Pastikan path ke config axios baru kamu benar
import { useNavigate } from "react-router-dom";

const Dashboardpage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ username: "Commander", xp: 0, streak: 0, totalTasksDone: 0 });
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
    // Definisi Milestone yang lebih presisi
    const milestones = [
      { lvl: 1, xp: 0, tier: "Newbie" },
      { lvl: 6, xp: 1000, tier: "Explorer" },
      { lvl: 11, xp: 5000, tier: "Commander" },
      { lvl: 16, xp: 20000, tier: "Sentinel" },
      { lvl: 21, xp: 65000, tier: "Warlord" },
      { lvl: 26, xp: 200000, tier: "Celestial" },
    ];

    let current = milestones[0];
    let next = milestones[1];

    for (let i = 0; i < milestones.length; i++) {
      if (xp >= milestones[i].xp) {
        current = milestones[i];
        next = milestones[i + 1] || { lvl: current.lvl + 5, xp: current.xp * 2, tier: current.tier };
      } else break;
    }

    // Hitung display level (interpolasi)
    const xpRange = next.xp - current.xp;
    const xpGained = xp - current.xp;
    const lvlRange = next.lvl - current.lvl;
    const displayLevel = current.lvl + Math.floor((xpGained / (xpRange || 1)) * lvlRange);
    
    const tierData = tierList.find(t => t.name === current.tier) || tierList[0];

    return { 
      level: displayLevel, 
      tier: current.tier, 
      tierData, 
      nextLevelXP: next.xp, 
      progress: Math.min((xpGained / (xpRange || 1)) * 100, 100) 
    };
  };

  const stats = useMemo(() => calculateLevel(userData.xp), [userData.xp]);

  const refreshAllData = useCallback(async () => {
    try {
      const [userRes, tasksRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/tasks")
      ]);
      
      // PERBAIKAN: Validasi data user dari backend
      if (userRes.data?.user) {
        setUserData(userRes.data.user);
      }
      if (tasksRes.data?.data) {
        setTasks(tasksRes.data.data);
      }
    } catch (err) { 
      console.error("Fetch Error:", err);
      // Jika token tidak valid, arahkan ke login
      if (err.response?.status === 401) navigate("/login");
    } finally { 
      setLoading(false); 
    }
  }, [navigate]);

  useEffect(() => { refreshAllData(); }, [refreshAllData]);

  const handleAddTask = async e => {
    e.preventDefault();
    try {
      // PERBAIKAN: Proteksi deadline agar tidak kosong
      const payload = { 
        ...taskData, 
        deadline: new Date(taskData.deadline).toISOString(), 
        category: "General" 
      };

      await api.post("/tasks/create", payload);
      setIsModalOpen(false); 
      setTaskData({ title: "", description: "", deadline: "" }); 
      refreshAllData(); // Refresh list setelah tambah data
    } catch (err) { 
      alert(err.response?.data?.message || "Failed to launch mission."); 
    }
  };

  // Filter tugas yang masih aktif
  const activeTasks = useMemo(() => {
    return tasks.filter(t => 
      t.status !== 'completed' && 
      t.status !== 'failed' && 
      new Date(t.deadline) > new Date()
    );
  }, [tasks]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F5F2]">
      <div className="h-16 w-16 border-8 border-zinc-100 border-t-[#C29976] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F5F2] pt-24 md:pt-36 pb-20 px-4 md:px-6 selection:bg-[#C29976]/30 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Welcome Header */}
        <header className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C29976] mb-3">System Status: Active</p>
            <h1 className="text-4xl sm:text-6xl font-black text-zinc-900 tracking-tighter leading-tight">
              Welcome, <span className="text-zinc-400 break-words">{userData.username}</span>
            </h1>
          </div>
          <div className={`px-8 py-5 rounded-[2.5rem] border-2 shadow-xl flex items-center gap-5 transition-all hover:scale-105 ${stats.tierData.color} ${stats.tierData.border} backdrop-blur-md`}>
            <i className={`${stats.tierData.icon} text-3xl animate-pulse`}></i>
            <div className="text-left">
              <p className="text-[9px] font-black uppercase opacity-50 tracking-widest">Current Rank</p>
              <p className="font-black uppercase italic text-xl tracking-tighter">{stats.tier}</p>
            </div>
          </div>
        </header>

        {/* Tier Roadmap */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] whitespace-nowrap">Tier Progression</h2>
            <div className="h-[1px] flex-1 bg-zinc-200"></div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x">
            {tierList.map((tier) => (
              <div key={tier.name} className={`flex-shrink-0 w-40 snap-center p-6 rounded-[2rem] border-2 transition-all duration-500 ${stats.tier === tier.name ? `${tier.color} ${tier.border} scale-105 shadow-lg` : 'bg-white border-zinc-50 grayscale opacity-40'}`}>
                <i className={`${tier.icon} text-2xl mb-4 block`}></i>
                <p className="text-[10px] font-black uppercase tracking-widest mb-1">{tier.name}</p>
                <p className="text-[8px] font-bold opacity-50">{tier.minXp.toLocaleString()} XP</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* XP Card */}
          <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 md:p-14 border border-zinc-100 shadow-2xl relative overflow-hidden group">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4 text-left">
              <div>
                <p className="text-[10px] uppercase font-black text-zinc-300 mb-3 tracking-widest">Power Level</p>
                <h2 className="text-7xl md:text-8xl font-black text-zinc-900 italic tracking-tighter group-hover:text-[#C29976] transition-colors leading-none">Lv. {stats.level}</h2>
              </div>
              <div className="sm:text-right">
                <p className="text-4xl font-black text-zinc-900 mb-1">{userData.xp.toLocaleString()}<span className="text-sm text-zinc-200 ml-2 italic">XP</span></p>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest italic">Required: {stats.nextLevelXP.toLocaleString()}</p>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-8 bg-zinc-50 rounded-full overflow-hidden mb-6 border-4 border-white shadow-inner p-1">
              <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${stats.progress}%`, background: 'linear-gradient(90deg, #111 0%, #C29976 100%)' }}></div>
            </div>
            <div className="flex justify-between text-[11px] font-black text-zinc-400 uppercase tracking-widest italic">
              <span>{stats.tier} Path</span>
              <span className="text-[#C29976]">{Math.floor(stats.progress)}% to next level</span>
            </div>
          </div>

          {/* Streak Card */}
          <div className="bg-zinc-900 rounded-[3rem] p-10 md:p-14 shadow-2xl text-white flex flex-col justify-between relative overflow-hidden">
            <div className="text-left">
              <p className="text-[11px] uppercase font-bold text-zinc-600 tracking-widest mb-10">Active Streak</p>
              <h3 className="text-8xl md:text-[9rem] font-black tracking-tighter leading-none">{userData.streak}</h3>
            </div>
            <div className="flex items-center gap-3 text-[#C29976]">
              <i className="ri-fire-fill text-3xl animate-pulse"></i>
              <span className="text-[10px] font-black uppercase tracking-widest italic">Days of Ambition</span>
            </div>
          </div>
        </div>

        {/* Mission List */}
        <section className="mb-20">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tighter uppercase flex items-center gap-4">
              <i className="ri-flashlight-fill text-[#C29976]"></i> Deployment
            </h2>
            <div className="h-[2px] flex-1 bg-zinc-200/50"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeTasks.length > 0 ? activeTasks.slice(0, 6).map((task, idx) => (
              <div key={task._id} className="group p-10 rounded-[3.5rem] border-2 bg-white border-zinc-100 hover:border-[#C29976]/30 transition-all duration-500 hover:-translate-y-2">
                <div className="flex justify-between items-center mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-[#F8F5F2] flex items-center justify-center text-[#C29976] font-black">0{idx+1}</div>
                    <div className="px-4 py-2 rounded-full bg-zinc-50 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active</div>
                </div>
                <h4 className="font-black text-2xl mb-4 tracking-tight text-zinc-900 text-left">{task.title}</h4>
                <p className="text-zinc-400 text-sm font-medium mb-10 italic leading-relaxed text-left line-clamp-2">
                  {task.description || "No tactical details provided."}
                </p>
                <div className="flex items-center gap-2 pt-6 border-t border-zinc-50">
                  <i className="ri-time-line text-[#C29976]"></i>
                  <span className="text-[10px] font-black uppercase text-zinc-500">
                    {new Date(task.deadline).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-24 bg-zinc-50 border-4 border-dashed border-zinc-200 rounded-[4rem] text-center">
                <i className="ri-radar-line text-6xl text-zinc-200 mb-6 block"></i>
                <p className="text-zinc-400 font-black uppercase tracking-[0.5em] text-xs italic">All Sectors Secured</p>
              </div>
            )}
          </div>
        </section>

        {/* Modal: New Mission */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-xl bg-black/40">
            <div className="bg-white w-full max-w-xl rounded-[4rem] p-10 md:p-16 shadow-2xl relative animate-in zoom-in duration-300">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-zinc-300 hover:text-zinc-900 transition-colors">
                <i className="ri-close-line text-3xl"></i>
              </button>
              <div className="text-center mb-10">
                <h2 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase italic">Assign Quest</h2>
              </div>
              <form onSubmit={handleAddTask} className="space-y-6">
                <input 
                  type="text" required placeholder="Mission Objective" 
                  className="w-full bg-zinc-50 rounded-3xl px-8 py-6 font-bold focus:ring-4 ring-[#C29976]/10 outline-none transition-all"
                  onChange={e => setTaskData({ ...taskData, title: e.target.value })} 
                />
                <textarea 
                  placeholder="Intelligence Report (Optional)" 
                  className="w-full bg-zinc-50 rounded-3xl px-8 py-6 font-medium h-32 outline-none focus:ring-4 ring-[#C29976]/10"
                  onChange={e => setTaskData({ ...taskData, description: e.target.value })} 
                ></textarea>
                <input 
                  type="datetime-local" required 
                  className="w-full bg-zinc-50 rounded-3xl px-8 py-6 font-black outline-none"
                  onChange={e => setTaskData({ ...taskData, deadline: e.target.value })} 
                />
                <button type="submit" className="w-full py-6 bg-zinc-900 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-[#C29976] transition-all">
                  Confirm Deployment
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Floating Action Button */}
        <button onClick={() => setIsModalOpen(true)} className="fixed bottom-10 right-10 bg-zinc-900 text-white w-20 h-20 md:w-24 md:h-24 rounded-[2.5rem] shadow-2xl flex items-center justify-center hover:bg-[#C29976] transition-all active:scale-90 z-[100] group">
          <i className="ri-add-line text-4xl group-hover:rotate-90 transition-transform"></i>
        </button>
      </div>
    </div>
  );
};

export default Dashboardpage;