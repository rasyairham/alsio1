import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Inbox, Zap, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';

const NotificationPage = () => {
  const navigate = useNavigate();
  
  // Data dummy notifikasi
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'reward',
      title: 'Quest Reward Claimed!',
      desc: 'Kamu baru saja mendapatkan +150 XP dari misi "Daily Coding".',
      time: '2 mins ago',
      read: false,
    },
    {
      id: 2,
      type: 'system',
      title: 'New Tier Unlocked',
      desc: 'Selamat! Kamu sekarang adalah seorang "Commander".',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      type: 'alert',
      title: 'Deadline Approaching',
      desc: 'Misi "Final Project UI" akan berakhir dalam 3 jam!',
      time: '5 hours ago',
      read: true,
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'reward': return <Zap className="text-amber-500" size={20} />;
      case 'alert': return <AlertCircle className="text-red-500" size={20} />;
      default: return <CheckCircle2 className="text-blue-500" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F2] font-sans text-zinc-900 p-6 pt-32 pb-24 relative overflow-hidden">
      <div className="max-w-2xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-[#C29976] font-black text-xs uppercase tracking-widest mb-4 transition-all">
              <ChevronLeft size={16} /> Back
            </button>
            <h1 className="text-5xl font-black tracking-tighter">Inbox <span className="text-[#C29976]">Center</span></h1>
          </div>
          <button 
            onClick={markAllAsRead}
            className="text-[10px] font-black uppercase tracking-widest text-[#C29976] hover:underline"
          >
            Mark all read
          </button>
        </div>

        {/* Notification List */}
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div 
                key={n.id}
                className={`group relative bg-white p-6 rounded-[2.5rem] border transition-all duration-300 flex gap-5 items-start ${
                  n.read ? 'border-zinc-100 opacity-70' : 'border-zinc-200 shadow-md scale-[1.02]'
                }`}
              >
                {!n.read && (
                  <div className="absolute top-6 right-8 w-2 h-2 bg-[#C29976] rounded-full"></div>
                )}
                
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                  n.read ? 'bg-zinc-50' : 'bg-[#F8F5F2]'
                }`}>
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 pr-8">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-black text-lg tracking-tight ${n.read ? 'text-zinc-500' : 'text-zinc-800'}`}>
                      {n.title}
                    </h3>
                  </div>
                  <p className="text-sm text-zinc-500 font-medium leading-relaxed mb-3">{n.desc}</p>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 italic">{n.time}</span>
                </div>

                <button 
                  onClick={() => deleteNotification(n.id)}
                  className="opacity-0 group-hover:opacity-100 p-3 text-zinc-300 hover:text-red-500 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-24 bg-white/50 rounded-[4rem] border-4 border-dashed border-zinc-200">
              <Inbox className="w-16 h-16 text-zinc-200 mx-auto mb-6" />
              <p className="text-zinc-400 font-black uppercase tracking-[0.4em] text-xs">No Incoming Transmission</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;