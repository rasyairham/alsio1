import React from 'react';
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
          <div className="flex justify-between text-xs text-gray-400 mb-1.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
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
        <div className="flex gap-2 mt-4">
          {["M","T","W","T","F"].map((d, i) => (
            <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i < 4 ? 'bg-[#946C44] text-white' : 'bg-[#EAE0D0] text-gray-400'}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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
        <div className="flex items-end gap-2 mt-4 h-16">
          {[40, 65, 55, 80, 70, 90, 75].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-xl" style={{ height: `${h}%`, backgroundColor: '#946C44', opacity: i === 5 ? 1 : 0.25 + i * 0.1 }}></div>
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
      await emailjs.send(
        'service_hd0xg96',
        'template_d4irq6j',
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          to_email: 'alsiobertiga@gmail.com',
        },
        'jNuNZGNNanx_VFP5v'
      );
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <style>{fontStyle}</style>
      <div className="min-h-screen bg-[#F5F0E8] text-[#1A1310] overflow-x-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>

        <section id="home" className="min-h-screen flex flex-col items-center justify-center px-6 relative pt-32">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 w-full">

            <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 pl-8">
              <h1 className="text-5xl md:text-6xl leading-tight tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}>
                Level Up Your <br /> <span className="text-[#946C44]">Grades</span>
              </h1>
              <p className="text-gray-600 text-lg max-w-md" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>
                Turn your study tasks into exciting quests. Stay organized, earn XP, and watch your account grow.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="bg-[#946C44] hover:bg-[#7A5836] text-white px-8 py-3 rounded-full transition shadow-lg shadow-[#946C44]/20 active:scale-95"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
                >
                  Start Your Quests →
                </button>
              </div>
            </div>

            <div className="flex-1 flex justify-end items-center w-full animate-in fade-in slide-in-from-right-8 duration-1000">
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-[2.5rem] shadow-xl border border-[#EAE0D0] w-full max-w-md space-y-5">
                <div className="flex items-center justify-between">
                  <div>                  
                    <p className="text-sm font-black text-zinc-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Welcome, <span className="text-[#946C44]">Hero</span></p>
                  </div>
                  <span className="text-[10px] bg-amber-50 text-amber-600 px-3 py-1.5 rounded-2xl font-black uppercase tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Explorer</span>
                </div>

                <div className="bg-zinc-50 rounded-2xl p-4">
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <p className="text-[9px] uppercase font-black text-zinc-400 tracking-widest" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Power Level</p>
                      <p className="text-3xl font-black text-zinc-800 italic tracking-tighter" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Level 8</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-zinc-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>2.500</p>
                      <p className="text-[9px] font-black text-zinc-300 uppercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>/ 3.500 XP</p>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-zinc-200 rounded-full overflow-hidden p-0.5">
                    <div className="h-full bg-gradient-to-r from-[#946C44] to-[#B8895A] rounded-full w-[68%]"></div>
                  </div>
                </div>

                <div className="bg-[#111] rounded-2xl px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] uppercase font-black text-zinc-500 tracking-widest" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Active Streak</p>
                    <p className="text-2xl font-black text-white italic" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>5 <span className="text-sm text-zinc-500">Days</span></p>
                  </div>
                  <div className="flex gap-1">
                    {["M","T","W","T","F"].map((d, i) => (
                      <div key={i} className={`w-7 h-7 rounded-md flex items-center justify-center text-[9px] font-black ${i < 4 ? 'bg-[#946C44] text-white' : 'bg-zinc-700 text-zinc-500'}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{d}</div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[9px] uppercase font-black text-zinc-400 tracking-widest px-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Active Missions</p>
                  {[{title:"Math Chapter 5", date:"Today"}, {title:"Physics Lab Report", date:"Tomorrow"}].map((q, i) => (
                    <div key={i} className="flex items-center justify-between bg-zinc-50 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#946C44] animate-ping"></div>
                        <span className="text-xs font-bold text-zinc-700" style={{ fontFamily: "'Poppins', sans-serif" }}>{q.title}</span>
                      </div>
                      <span className="text-[9px] font-black text-zinc-300 uppercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{q.date}</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
          <div className="pb-12 w-full"></div>
        </section>

        <section id="feature" className="py-24 px-6 border-t border-[#EAE0D0] mt-16 scroll-mt-24">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <div>
              <h2 className="text-4xl mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>How It Works?</h2>
              <p className="text-gray-500" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>Turn your study tasks into an exciting productivity adventure.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              {steps.map((step, i) => (
                <div key={i} className="relative flex flex-col items-center pt-10 group">
                  <div className="absolute top-0 z-10 w-16 h-16 bg-[#946C44] text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    {step.icon}
                  </div>
                  <div className="w-full bg-white rounded-3xl shadow-md pt-12 pb-6 px-6 flex flex-col justify-between h-full text-center">
                    <div>
                      <h3 className="text-base mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>{step.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>{step.desc}</p>
                    </div>
                    <div className="flex gap-2 mt-auto flex-wrap justify-center">
                      {step.tags.map(tag => (
                        <span key={tag} className="text-[10px] text-gray-400 border border-gray-200 px-2 py-1 rounded" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
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

        <section id="features" className="py-24 px-6 border-t border-[#EAE0D0] scroll-mt-24">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center">
              <h2 className="text-4xl mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Powerful Features for Smarter Studying</h2>
              <p className="text-gray-500 max-w-xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>Boost your productivity while having fun! Every task becomes a quest, every achievement earns XP.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feat, i) => (
                <div key={i} className="bg-white rounded-3xl shadow-sm p-6 flex flex-col hover:shadow-md hover:-translate-y-1 transition group">
                  <div className="w-12 h-12 bg-[#FEF3E2] text-[#946C44] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                    {feat.icon}
                  </div>
                  <h3 className="text-base mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>{feat.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>{feat.desc}</p>
                  {feat.extra && feat.extra}
                  {feat.tags && (
                    <div className={`flex gap-2 flex-wrap ${feat.tagsBottom ? 'mt-auto pt-4' : 'mt-4'}`}>
                      {feat.tags.map(tag => (
                        <span key={tag} className={feat.tagStyle} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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

        <section id="about" className="max-w-6xl mx-auto py-24 px-6 flex flex-col md:flex-row items-center gap-16 border-t border-[#EAE0D0] mt-16 scroll-mt-24">
          <div className="w-full md:w-96 h-80 flex items-center justify-center">
            <img
              src="/Logo_Alsio.webp"
              alt="Alsio Logo"
              className="w-full h-full object-contain drop-shadow-xl"
            />
          </div>
          <div className="flex-1 space-y-5">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#946C44] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                About the Platform
              </p>
              <h2 className="text-4xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>About Alsio</h2>
            </div>
            <div className="space-y-4 text-gray-500 leading-relaxed text-sm" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>
              <p>ALSIO is a web-based platform that turns studying into a fun, game-like experience. Students can add assignments to a Quest Board, complete tasks to earn XP, and level up their account.</p>
              <p>With visual progress and rewarding milestones, ALSIO makes learning engaging and motivates consistent study habits by combining gamification with effective task management.</p>
            </div>
            <div className="flex gap-2 flex-wrap pt-1">
              {["Quest Board", "XP System", "Gamification"].map(tag => (
                <span key={tag} className="text-[11px] font-bold bg-amber-50 text-[#946C44] border border-[#f0d9b8] px-4 py-1.5 rounded-full" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="max-w-3xl mx-auto py-24 px-6 border-t border-[#EAE0D0] scroll-mt-24">
          <h2 className="text-4xl text-center mb-12" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Get In Touch</h2>
          <div className="bg-white p-8 rounded-3xl shadow-md space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 tracking-widest uppercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#F2F2F2] border-none rounded-2xl p-3 focus:outline-none focus:ring-1 ring-[#946C44]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 tracking-widest uppercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-[#F2F2F2] border-none rounded-2xl p-3 focus:outline-none focus:ring-1 ring-[#946C44]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 tracking-widest uppercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Message</label>
              <textarea
                rows={5}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                className="w-full bg-[#F2F2F2] border-none rounded-2xl p-3 focus:outline-none focus:ring-1 ring-[#946C44] resize-none"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              />
            </div>

            {status === 'empty' && (
              <p className="text-red-400 text-sm text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>Please fill in all fields.</p>
            )}
            {status === 'success' && (
              <p className="text-green-500 text-sm text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>Message sent successfully! ✓</p>
            )}
            {status === 'error' && (
              <p className="text-red-400 text-sm text-center" style={{ fontFamily: "'Poppins', sans-serif" }}>Failed to send. Please try again.</p>
            )}

            <button
              onClick={handleSend}
              disabled={status === 'sending'}
              className="w-full bg-[#946C44] hover:bg-[#7A5836] disabled:opacity-60 text-white py-4 rounded-2xl transition active:scale-95"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
            >
              {status === 'sending' ? 'Sending...' : 'Send Message →'}
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Homepage;