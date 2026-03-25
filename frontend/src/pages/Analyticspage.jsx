import React, { useEffect, useState } from "react";
import axios from "axios";

const Analyticspage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/tasks/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const now = new Date();
        const filtered = res.data?.data?.filter(t => 
          t.status !== "pending" && (t.status !== "completed" || (now - new Date(t.updatedAt)) <= 86400000)
        ) || [];

        setTasks(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

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
    <div className="min-h-screen bg-[#F8F5F2] pt-32 pb-20 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-black text-zinc-900 tracking-tighter">
            Mission <span className="text-[#C29976]">History</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Successful Missions', value: completed, color: 'text-emerald-500', suffix: 'Missions' },
            { label: 'Failed Tasks', value: failed, color: 'text-red-400', suffix: 'Tasks' },
            { label: 'Total XP Earned', value: totalXP.toLocaleString(), color: 'text-[#C29976]', suffix: 'XP' },
          ].map((card, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-md transition-all">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">{card.label}</p>
              <h3 className={`text-4xl font-black italic ${card.color}`}>{card.value} <span className="text-zinc-300 text-lg">{card.suffix}</span></h3>
            </div>
          ))}
        </div>

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
                {tasks.length ? tasks.map(task => (
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
                )) : (
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
      </div>
    </div>
  );
};

export default Analyticspage;