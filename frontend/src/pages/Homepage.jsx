import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollText, CheckCircle, Medal, BarChart2, Map, Star, Flame, LineChart } from 'lucide-react';
import emailjs from '@emailjs/browser';

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&family=Poppins:wght@400;500&display=swap');

  body, .font-sans {
    font-family: 'Poppins', sans-serif;
  }

  h1, h2, h3, .font-bold, .font-extrabold, .font-black, .font-semibold {
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
`;

const Homepage = () => {
  const navigate = useNavigate();

  const steps = [
    { icon: <ScrollText size={22} />, title: "Create Your Quests", desc: "Add your assignments and study tasks to the Quest Board. Set deadlines and difficulty levels for each quest.", tags: ["SCROLL", "CHECKLIST"] },
    { icon: <CheckCircle size={22} />, title: "Complete Your Tasks", desc: "Finish your study missions and mark them as completed. Stay organized and keep your productivity on track.", tags: ["TARGET", "CHECKMARK"] },
    { icon: <Medal size={22} />, title: "Earn XP & Level Up", desc: "Gain experience points for every completed quest. Level up your account and unlock visual upgrades.", tags: ["XP BAR", "LEVEL UP"] },
    { icon: <BarChart2 size={22} />, title: "Track Your Progress", desc: "Monitor your productivity with clear analytics and streaks. See how your study habits improve over time.", tags: ["CHART", "PROGRESS BAR"] },
  ];

  const features = [
    {
      icon: <Map size={20} />,
      title: "Quest Board",
      desc: "Organize your assignments like quests with deadlines and difficulty levels.",
      tags: ["CELESTIAL", "200.000 XP"],
      tagStyle: "text-[#946C44] border border-[#E8D5C0] px-3 py-1 rounded-full text-[10px] font-bold",
      tagsBottom: true,
    },
    {
      icon: <Star size={20} />,
      title: "XP & Level System",
      desc: "Earn experience points for completing tasks. Level up your account and unlock visual upgrades.",
      extra: (
        <div className="mt-4">
          <div className="flex justify-between text-[10px] sm:text-xs text-gray-400 mb-1.5">
            <span>Level 5 — Newbie</span>
            <span>450 / 700 XP</span>
          </div>
          <div className="h-2 bg-[#EAE0D0] rounded-full overflow-hidden">
            <div className="h-full bg-[#946C44] w-1/2 rounded-full"></div>
          </div>
        </div>
      ),
    },
    {
      icon: <Flame size={20} />,
      title: "Daily Streak",
      desc: "Maintain your productivity streak and earn bonus XP for completing tasks consistently.",
      extra: (
        <div className="flex gap-1.5 sm:gap-2 mt-4">
          {["M","T","W","T","F"].map((d, i) => (
            <div key={i} className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold ${i < 4 ? 'bg-[#946C44] text-white' : 'bg-[#EAE0D0] text-gray-400'}`}>
              {d}
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: <LineChart size={20} />,
      title: "Learning Analytics",
      desc: "Track your study progress with clear, engaging charts and statistics.",
      extra: (
        <div className="flex items-end gap-1.5 sm:gap-2 mt-4 h-16">
          {[40, 65, 55, 80, 70, 90, 75].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-lg sm:rounded-t-xl" style={{ height: `${h}%`, backgroundColor: '#946C44', opacity: i === 5 ? 1 : 0.25 + i * 0.1 }}></div>
          ))}
        </div>
      ),
    },
  ];

  const [form, setForm] = React.useState({ name: '', email: '', message: '' });
  const [status, setStatus] = React.useState('');

  const handleSend = async () => {
    if (!form.name || !form.email || !form.message) {
      setStatus('empty');
      return;
    }
    setStatus('sending');
    try {
      await emailjs.send('service_hd0xg96', 'template_d4irq6j', { ...form, to_email: 'alsiobertiga@gmail.com' }, 'jNuNZGNNanx_VFP5v');
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <style>{fontStyle}</style>
      <div className="min-h-screen bg-[#F5F0E8] text-[#1A1310] overflow-x-hidden selection:bg-[#946C44] selection:text-white">

        {/* Hero Section */}
        <section id="home" className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 relative pt-20 md:pt-32">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 w-full">
            
            {/* Text Content */}
            <div className="flex-1 space-y-6 text-center lg:text-left order-2 lg:order-1 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight font-extrabold">
                Level Up Your <br className="hidden sm:block" /> <span className="text-[#946C44]">Grades</span>
              </h1>
              <p className="text-gray-600 text-sm sm:text-lg max-w-md mx-auto lg:mx-0 font-normal leading-relaxed">
                Turn your study tasks into exciting quests. Stay organized, earn XP, and watch your hero grow.
              </p>
              <div className="flex justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto bg-[#946C44] hover:bg-[#7A5836] text-white px-8 py-4 rounded-full transition shadow-lg shadow-[#946C44]/20 active:scale-95 font-bold text-sm"
                >
                  Start Your Quests →
                </button>
              </div>
            </div>

            {/* UI Preview Card */}
            <div className="flex-1 flex justify-center lg:justify-end items-center w-full order-1 lg:order-2 animate-in fade-in slide-in-from-top-8 lg:slide-in-from-right-8 duration-1000">
              <div className="bg-white/70 backdrop-blur-sm p-5 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-[#EAE0D0] w-full max-w-[380px] sm:max-w-md space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm font-black text-zinc-800">Welcome, <span className="text-[#946C44]">Hero</span></p>
                  <span className="text-[8px] sm:text-[10px] bg-amber-50 text-amber-600 px-3 py-1.5 rounded-2xl font-black uppercase tracking-tight">Explorer</span>
                </div>

                <div className="bg-zinc-50 rounded-2xl p-4">
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <p className="text-[8px] uppercase font-black text-zinc-400 tracking-widest">Power Level</p>
                      <p className="text-2xl sm:text-3xl font-black text-zinc-800 italic tracking-tighter">Level 8</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-black text-zinc-900">2.500</p>
                      <p className="text-[8px] sm:text-[9px] font-black text-zinc-300 uppercase">/ 3.500 XP</p>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-zinc-200 rounded-full overflow-hidden p-0.5">
                    <div className="h-full bg-gradient-to-r from-[#946C44] to-[#B8895A] rounded-full w-[68%]"></div>
                  </div>
                </div>

                <div className="bg-[#111] rounded-2xl px-4 py-3 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
                  <div>
                    <p className="text-[8px] uppercase font-black text-zinc-500 tracking-widest">Streak</p>
                    <p className="text-xl sm:text-2xl font-black text-white italic">5 <span className="text-xs text-zinc-500 font-normal">Days</span></p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {["M","T","W","T","F"].map((d, i) => (
                      <div key={i} className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center text-[8px] sm:text-[9px] font-black ${i < 4 ? 'bg-[#946C44] text-white' : 'bg-zinc-700 text-zinc-500'}`}>{d}</div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[8px] uppercase font-black text-zinc-400 tracking-widest px-1">Active Missions</p>
                  {[{title:"Math Chapter 5", date:"Today"}, {title:"Physics Lab Report", date:"Tomorrow"}].map((q, i) => (
                    <div key={i} className="flex items-center justify-between bg-zinc-50 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2 overflow-hidden pr-2">
                        <div className="w-1.5 h-1.5 shrink-0 rounded-full bg-[#946C44] animate-ping"></div>
                        <span className="text-[10px] sm:text-xs font-bold text-zinc-700 truncate">{q.title}</span>
                      </div>
                      <span className="text-[8px] sm:text-[9px] font-black text-zinc-300 uppercase shrink-0">{q.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section id="feature" className="py-16 sm:py-24 px-4 sm:px-6 border-t border-[#EAE0D0] scroll-mt-20">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold">How It Works?</h2>
              <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">Turn your study tasks into an exciting productivity adventure.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 text-left">
              {steps.map((step, i) => (
                <div key={i} className="relative flex flex-col items-center pt-8 group">
                  <div className="absolute top-0 z-10 w-14 h-14 bg-[#946C44] text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    {step.icon}
                  </div>
                  <div className="w-full bg-white rounded-3xl shadow-sm pt-10 pb-6 px-6 flex flex-col justify-between h-full text-center hover:shadow-md transition">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold mb-2">{step.title}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">{step.desc}</p>
                    </div>
                    <div className="flex gap-1.5 mt-auto flex-wrap justify-center">
                      {step.tags.map(tag => (
                        <span key={tag} className="text-[9px] text-gray-400 border border-gray-100 px-2 py-0.5 rounded font-bold uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 border-t border-[#EAE0D0] scroll-mt-20">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold">Powerful Features</h2>
              <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">Boost your productivity while having fun! Every task becomes a quest.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {features.map((feat, i) => (
                <div key={i} className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 flex flex-col hover:shadow-md transition group border border-transparent hover:border-[#EAE0D0]">
                  <div className="w-12 h-12 bg-[#FEF3E2] text-[#946C44] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition shrink-0">
                    {feat.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold mb-2">{feat.title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">{feat.desc}</p>
                  {feat.extra && feat.extra}
                  {feat.tags && (
                    <div className={`flex gap-2 flex-wrap ${feat.tagsBottom ? 'mt-auto pt-4' : 'mt-4'}`}>
                      {feat.tags.map(tag => (
                        <span key={tag} className={feat.tagStyle}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="max-w-6xl mx-auto py-16 sm:py-24 px-4 sm:px-6 flex flex-col md:flex-row items-center gap-10 md:gap-16 border-t border-[#EAE0D0] scroll-mt-20">
          <div className="w-full md:w-[40%] flex items-center justify-center">
            <img
              src="/Logo_Alsio.webp"
              alt="Alsio Logo"
              className="w-32 sm:w-48 md:w-full max-w-[200px] md:max-w-none h-auto object-contain drop-shadow-2xl"
            />
          </div>
          <div className="flex-1 space-y-5 text-center md:text-left">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#946C44] mb-2">About the Platform</p>
              <h2 className="text-3xl sm:text-4xl font-bold">About Alsio</h2>
            </div>
            <div className="space-y-4 text-gray-500 leading-relaxed text-sm sm:text-base font-normal">
              <p>ALSIO is a web-based platform that turns studying into a fun, game-like experience. Students can add assignments to a Quest Board, complete tasks to earn XP, and level up their account.</p>
              <p>With visual progress and rewarding milestones, ALSIO makes learning engaging and motivates consistent study habits by combining gamification with effective task management.</p>
            </div>
            <div className="flex gap-2 flex-wrap justify-center md:justify-start pt-2">
              {["Quest Board", "XP System", "Gamification"].map(tag => (
                <span key={tag} className="text-[10px] sm:text-[11px] font-bold bg-amber-50 text-[#946C44] border border-[#f0d9b8] px-4 py-1.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="max-w-3xl mx-auto py-16 sm:py-24 px-4 sm:px-6 border-t border-[#EAE0D0] scroll-mt-20">
          <h2 className="text-3xl sm:text-4xl text-center font-bold mb-10 sm:mb-12">Get In Touch</h2>
          <div className="bg-white p-6 sm:p-10 rounded-[2rem] shadow-sm border border-[#EAE0D0]/50 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 tracking-widest uppercase font-bold">Name</label>
                <input
                  type="text"
                  placeholder="Hero Name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#F2F2F2] border-none rounded-xl sm:rounded-2xl p-3.5 text-sm focus:outline-none focus:ring-1 ring-[#946C44] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 tracking-widest uppercase font-bold">Email</label>
                <input
                  type="email"
                  placeholder="hero@alsio.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-[#F2F2F2] border-none rounded-xl sm:rounded-2xl p-3.5 text-sm focus:outline-none focus:ring-1 ring-[#946C44] transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 tracking-widest uppercase font-bold">Message</label>
              <textarea
                rows={5}
                placeholder="What's on your mind?"
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full bg-[#F2F2F2] border-none rounded-xl sm:rounded-2xl p-3.5 text-sm focus:outline-none focus:ring-1 ring-[#946C44] resize-none transition-all"
              />
            </div>

            {status && (
              <div className={`p-4 rounded-xl text-xs text-center font-medium ${
                status === 'success' ? 'bg-green-50 text-green-600' : 
                status === 'empty' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-400'
              }`}>
                {status === 'success' ? 'Message sent successfully! ✓' : 
                 status === 'empty' ? 'Please fill in all fields.' : 'Failed to send. Please try again.'}
              </div>
            )}

            <button
              onClick={handleSend}
              disabled={status === 'sending'}
              className="w-full bg-[#946C44] hover:bg-[#7A5836] disabled:opacity-60 text-white py-4 rounded-xl sm:rounded-2xl transition active:scale-[0.98] font-bold text-sm shadow-lg shadow-[#946C44]/10"
            >
              {status === 'sending' ? 'Sending Message...' : 'Send Message →'}
            </button>
          </div>
        </section>

        {/* Simple Footer */}
        <footer className="py-10 text-center border-t border-[#EAE0D0]">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">&copy; 2026 ALSIO TEAM. ALL RIGHTS RESERVED.</p>
        </footer>
      </div>
    </>
  );
};

export default Homepage;