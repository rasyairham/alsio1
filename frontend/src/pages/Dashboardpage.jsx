import React, { useEffect, useState } from "react";

const Dashboardpage = () => {
  const [user, setUser] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk Modal
  const [taskName, setTaskName] = useState(""); // State input task

  useEffect(() => {
    const username = localStorage.getItem("username") || "Explorer";
    setUser(username);
  }, []);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;
    
    // Logika simpan task bisa ditambahkan di sini (misal ke state array atau backend)
    console.log("Task Baru:", taskName);
    
    // Reset dan tutup modal
    setTaskName("");
    setIsModalOpen(false);
    alert("Task berhasil ditambahkan!");
  };

  return (
    <div className="min-h-screen bg-[#F8F5F2] pt-28 pb-10 px-6 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">
            Welcome Back, <span className="text-[#C29976]">{user}</span>
          </h1>
          <p className="text-zinc-500 mt-1 font-medium">
            Stay on track, complete your quests, and improve your skills.
          </p>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Main Stats) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Level & XP Card */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-100">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest mb-1">Current Status</p>
                  <h2 className="text-3xl font-bold text-zinc-800">Level 5 – Newbie</h2>
                </div>
                <p className="text-sm font-bold text-zinc-800">1500 / 3000 XP</p>
              </div>
              <div className="w-full h-8 bg-zinc-100 rounded-full overflow-hidden p-1">
                <div className="h-full bg-[#C29976] rounded-full transition-all duration-1000" style={{ width: '50%' }}></div>
              </div>
            </div>

            {/* Bottom Grid (Streak & Progress) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Daily Streak */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-100 relative overflow-hidden">
                <div className="w-12 h-12 bg-[#C29976]/20 rounded-2xl flex items-center justify-center mb-4">
                  <i className="ri-fire-fill text-[#C29976] text-2xl"></i>
                </div>
                <h3 className="text-4xl font-black text-zinc-800">7 Days</h3>
                <p className="text-sm text-zinc-500 font-medium">Daily Streak</p>
              </div>

              {/* Today's Progress */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-zinc-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-[#C29976]/20 rounded-2xl flex items-center justify-center">
                    <i className="ri-rocket-2-fill text-[#C29976] text-2xl"></i>
                  </div>
                  <span className="text-[#C29976] font-bold">60%</span>
                </div>
                <h3 className="text-4xl font-black text-zinc-800">3/5 tasks</h3>
                <p className="text-sm text-zinc-500 font-medium">Today's Progress</p>
              </div>
            </div>
          </div>

          {/* Right Column (Achievements & Inspiration) */}
          <div className="space-y-6">
            <div className="bg-[#E9EFF6] rounded-[2.5rem] p-8 shadow-sm">
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-6">Recent Achievements</p>
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-[#C29976] rounded-full border-4 border-white shadow-md"></div>
                <div className="w-14 h-14 bg-zinc-300 rounded-full border-4 border-white shadow-md"></div>
              </div>
            </div>

            <div className="relative group rounded-[2.5rem] overflow-hidden h-64 shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000" 
                className="absolute inset-0 w-full h-full object-cover"
                alt="Mountain"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8">
                <p className="text-white text-xs italic font-light mb-4">
                  "The secret of getting ahead is getting started." — Mark Twain
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- FLOATING ACTION BUTTON --- */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-10 right-10 bg-[#C29976] text-zinc-900 font-bold px-8 py-4 rounded-full shadow-2xl shadow-[#C29976]/40 hover:scale-110 active:scale-95 transition-all flex items-center gap-3 z-40"
        >
          <span className="text-2xl leading-none">+</span> 
          <span className="uppercase tracking-widest text-xs">New Task</span>
        </button>

        {/* --- MODAL BOX (KOTAK INPUT TASK) --- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            {/* Backdrop Gelap */}
            <div 
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => setIsModalOpen(false)}
            ></div>

            {/* Kotak Modal */}
            <div className="relative w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 fade-in duration-300">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-zinc-800 tracking-tight">Add New Quest</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddTask} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">What's the mission?</label>
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Contoh: Belajar React 2 Jam"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="w-full mt-2 bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-[#C29976]/20 focus:border-[#C29976] transition-all text-zinc-800 font-medium placeholder:text-zinc-300"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 rounded-2xl bg-zinc-100 text-zinc-500 font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 rounded-2xl bg-[#C29976] text-zinc-900 font-black text-xs uppercase tracking-widest hover:shadow-lg shadow-[#C29976]/30 transition-all active:scale-95"
                  >
                    Mulai Quest
                  </button>
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