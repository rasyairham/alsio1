import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const Analyticspage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync Data Riwayat
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/tasks/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Kita hanya ambil yang sudah selesai (completed) atau gagal (failed)
        const history = res.data?.data?.filter(t => t.status !== 'pending') || [];
        setTasks(history);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Kalkulasi Ringkasan (Stats Kecil)
  const summary = useMemo(() => {
    const completed = tasks.filter(t => t.status === 'completed').length;
    const failed = tasks.filter(t => t.status === 'failed').length;
    const totalXP = tasks.reduce((acc, curr) => curr.status === 'completed' ? acc + (curr.xp || 100) : acc, 0);
    return { completed, failed, totalXP };
  }, [tasks]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F5F2]">
      <div className="h-12 w-12 border-4 border-zinc-200 border-t-[#C29976] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F5F2] pt-28 pb-20 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Archive */}
        <header className="mb-12">
          <p className="text-[#C29976] font-black text-xs uppercase tracking-[0.3em] mb-3 italic">System Archives</p>
          <h1 className="text-5xl font-black text-zinc-900 tracking-tighter">Mission <span className="text-[#C29976]">History</span></h1>
        </header>

        {/* Quick Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm transition-all hover:shadow-md">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Success Rate</p>
            <h3 className="text-4xl font-black text-emerald-500 italic">{summary.completed} <span className="text-zinc-300 text-lg">Missions</span></h3>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm transition-all hover:shadow-md">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Failed Operations</p>
            <h3 className="text-4xl font-black text-red-400 italic">{summary.failed} <span className="text-zinc-300 text-lg">Tasks</span></h3>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm transition-all hover:shadow-md">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Total Loot Gained</p>
            <h3 className="text-4xl font-black text-[#C29976] italic">{summary.totalXP.toLocaleString()} <span className="text-zinc-300 text-lg">XP</span></h3>
          </div>
        </div>

        {/* Log Table / List */}
        <div className="bg-white rounded-[3.5rem] border border-zinc-100 shadow-2xl overflow-hidden">
          <div className="p-10 border-b border-zinc-50 bg-zinc-50/30 flex justify-between items-center">
            <h2 className="font-black text-xl text-zinc-800 uppercase tracking-tighter italic">Battle Logs</h2>
            <i className="ri-history-line text-2xl text-zinc-300"></i>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                  <th className="px-10 py-6">Mission Details</th>
                  <th className="px-10 py-6">Status</th>
                  <th className="px-10 py-6">Rewards / Penalty</th>
                  <th className="px-10 py-6">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <tr key={task._id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-10 py-8">
                        <div className="flex flex-col">
                          <span className="font-black text-zinc-800 text-lg group-hover:text-[#C29976] transition-colors">{task.title}</span>
                          <span className="text-xs text-zinc-400 font-medium truncate max-w-[200px] italic">"{task.description || "No records"}"</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest 
                          ${task.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                          {task.status === 'completed' ? 'Success' : 'Failed'}
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        <span className={`font-black italic ${task.status === 'completed' ? 'text-emerald-500' : 'text-red-400'}`}>
                          {task.status === 'completed' ? `+${task.xp || 100} XP` : '-50 XP'}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-zinc-400 font-bold text-xs uppercase tracking-tighter">
                        {new Date(task.updatedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-10 py-20 text-center">
                      <i className="ri-inbox-archive-line text-5xl text-zinc-200 block mb-4"></i>
                      <p className="text-zinc-300 font-black uppercase tracking-widest text-xs italic">Archive is Empty</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <p className="mt-8 text-center text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em] italic">
          End of Encrypted Logs - Alsio System
        </p>
      </div>
    </div>
  );
};

export default Analyticspage;