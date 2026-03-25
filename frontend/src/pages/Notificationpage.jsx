import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Inbox, Zap, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import axios from 'axios';

const NotificationPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/notifications/read-all", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err) {
      alert("Failed to delete notification");
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'reward': return <Zap className="text-amber-500" size={20} />;
      case 'alert': return <AlertCircle className="text-red-500" size={20} />;
      default: return <CheckCircle2 className="text-[#C29976]" size={20} />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' - ' + 
           date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F5F2]">
      <div className="h-10 w-10 border-4 border-zinc-200 border-t-[#C29976] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F5F2] font-sans text-zinc-900 p-4 sm:p-6 pt-24 sm:pt-32 pb-24 relative overflow-hidden">
      <div className="max-w-2xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
          <div className="w-full sm:w-auto">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-[#C29976] font-black text-[10px] sm:text-xs uppercase tracking-widest mb-2 sm:mb-4 transition-all">
              <ChevronLeft size={16} /> Back
            </button>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tighter leading-tight">
              Inbox <span className="text-[#C29976]">Center</span>
            </h1>
          </div>
          
          {notifications.some(n => !n.read) && (
            <button 
              onClick={markAllAsRead}
              className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#C29976] hover:underline transition-all self-end sm:self-auto"
            >
              Mark All as Read
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div 
                key={n._id}
                className={`group relative bg-white p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border transition-all duration-500 flex gap-4 sm:gap-5 items-start ${
                  n.read ? 'border-zinc-100 opacity-70' : 'border-white shadow-lg sm:shadow-xl shadow-zinc-200/50 sm:scale-[1.02]'
                }`}
              >
                {!n.read && (
                  <div className="absolute top-6 right-6 sm:top-8 sm:right-8 w-2 h-2 bg-[#C29976] rounded-full animate-pulse"></div>
                )}
                
                {/* Icon Container - Smaller on Mobile */}
                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-inner transition-colors ${
                  n.read ? 'bg-zinc-50' : 'bg-[#FDFBF9]'
                }`}>
                  <div className="scale-75 sm:scale-100">
                    {getIcon(n.type)}
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 pr-4 sm:pr-8">
                  <h3 className={`font-black text-sm sm:text-lg tracking-tight mb-0.5 transition-colors ${n.read ? 'text-zinc-500' : 'text-zinc-800'}`}>
                    {n.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-500 font-medium leading-relaxed mb-2 line-clamp-2 sm:line-clamp-none">
                    {n.desc}
                  </p>
                  <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-300 italic">
                    {formatTime(n.createdAt)}
                  </span>
                </div>

                {/* Action Buttons - More accessible on mobile */}
                <button 
                  onClick={() => deleteNotification(n._id)}
                  className="sm:opacity-0 group-hover:opacity-100 p-2 text-zinc-300 hover:text-red-500 transition-all transform hover:scale-110 active:scale-95"
                >
                  <Trash2 size={16} className="sm:w-[18px]" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-20 sm:py-28 bg-white/40 rounded-[2rem] sm:rounded-[4rem] border-4 border-dashed border-zinc-200 backdrop-blur-sm">
              <Inbox className="w-12 h-12 sm:w-16 sm:h-16 text-zinc-200 mx-auto mb-4 sm:mb-6" />
              <p className="text-zinc-300 font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-[10px] sm:text-xs italic">
                No Incoming Data
              </p>
            </div>
          )}
        </div>

        {/* Footer Meta */}
        <p className="mt-12 text-center text-[8px] sm:text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em] sm:tracking-[0.5em] italic px-4">
          Secure Connection Active // ALSIO v1.0
        </p>
      </div>
    </div>
  );
};

export default NotificationPage;