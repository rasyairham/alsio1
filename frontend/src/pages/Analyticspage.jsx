import React, { useEffect, useState } from "react";
import axios from "axios";

const Analyticspage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/tasks/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const now = new Date();
      const filtered = res.data?.data?.filter(t => {
        const taskDate = new Date(t.updatedAt);
        const isUnder24Hours = (now - taskDate) <= 86400000;
        return (t.status === "completed" || t.status === "failed") && isUnder24Hours;
      }) || [];

      setTasks(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const completed = tasks.filter(t => t.status === 'completed').length;
  const failed = tasks.filter(t => t.status === 'failed').length;
  const totalXP = tasks.reduce((acc, t) => t.status === 'completed' ? acc + (t.xp || 100) : acc, 0);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F5F2]">
      <div className="h-12 w-12 border-4 border-zinc-200 border-t-[#C29976] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F5F2] pt-24 md:pt-32 pb-10 md:pb-20 px-4 md:px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header - Center on mobile */}
        <header className="mb-8 md:mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tighter">
            Mission <span className="text-[#C29976]">History</span>
          </h1>
          <p className="text-zinc-400 text-xs mt-2 font-bold uppercase tracking-widest md:hidden">Battle Logs 24h</p>
        </header>

        {/* Stats Cards - Adaptive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {[
            { label: 'Successful Missions', value: completed, color: 'text-emerald-500', suffix: 'Missions' },
            { label: 'Failed Tasks', value: failed, color: 'text-red-400', suffix: 'Tasks' },
            { label: 'Total XP Earned', value: totalXP.toLocaleString(), color: 'text-[#C29976]', suffix: 'XP' },
          ].map((card, i) => (
            <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-zinc-100 shadow-sm transition-all group overflow-hidden">
              <p className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 md:mb-2 group-hover:text-[#C29976] transition-colors">
                {card.label}
              </p>
              <h3 className={`text-2xl md:text-4xl font-black italic ${card.color}`}>
                {card.value} <span className="text-zinc-300 text-sm md:text-lg font-normal italic lowercase">{card.suffix}</span>
              </h3>
            </div>
          ))}
        </div>

        {/* Table Container - Mobile Card Layout */}
        <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] border border-zinc-100 shadow-2xl overflow-hidden">
          <div className="p-6 md:p-10 border-b border-zinc-50 bg-zinc-50/30 flex justify-between items-center">
            <h2 className="font-black text-lg md:text-xl text-zinc-800 uppercase tracking-tighter italic">Battle Logs</h2>
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">Auto-Purge 24h</span>
              <i className="ri-history-line text-xl md:text-2xl"></i>
            </div>
          </div>

          <div className="w-full">
            {/* Desktop Table - Hidden on Mobile */}
            <table className="w-full text-left border-collapse hidden md:table">
              <thead>
                <tr className="bg-white text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                  <th className="px-10 py-6 text-nowrap">Mission Details</th>
                  <th className="px-10 py-6">Status</th>
                  <th className="px-10 py-6 text-nowrap">Rewards / Penalty</th>
                  <th className="px-10 py-6">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {tasks.length > 0 ? tasks.map(task => (
                  <tr key={task._id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <span className="font-black text-zinc-800 text-lg group-hover:text-[#C29976] transition-colors">{task.title}</span>
                        <span className="text-xs text-zinc-400 font-medium truncate max-w-[200px] italic">"{task.description || "No records"}"</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${task.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                        {task.status === 'completed' ? 'Success' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`font-black italic ${task.status === 'completed' ? 'text-emerald-500' : 'text-red-400'}`}>
                        {task.status === 'completed' ? `+${task.xp || 100} XP` : '-50 XP'}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-zinc-400 font-bold text-xs uppercase tracking-tighter">
                      {new Date(task.updatedAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                )) : null}
              </tbody>
            </table>

            {/* Mobile View - Cards Layout (Visible only on small screens) */}
            <div className="md:hidden divide-y divide-zinc-50">
              {tasks.length > 0 ? tasks.map(task => (
                <div key={task._id} className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col flex-1 pr-4">
                      <span className="font-black text-zinc-800 text-base leading-tight mb-1">{task.title}</span>
                      <span className="text-[11px] text-zinc-400 italic">"{task.description || "No records"}"</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shrink-0 ${task.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                      {task.status === 'completed' ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-zinc-400 font-black uppercase tracking-widest">Effect</span>
                      <span className={`font-black italic text-sm ${task.status === 'completed' ? 'text-emerald-500' : 'text-red-400'}`}>
                        {task.status === 'completed' ? `+${task.xp || 100} XP` : '-50 XP'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-zinc-400 font-black uppercase tracking-widest block">Date</span>
                      <span className="text-zinc-500 font-bold text-[10px] uppercase">
                        {new Date(task.updatedAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center">
                   <i className="ri-inbox-archive-line text-5xl text-zinc-200"></i>
                   <p className="text-zinc-300 font-black uppercase tracking-widest text-[9px] mt-4 italic">No Archive for today</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analyticspage;