import React from 'react';
import 'remixicon/fonts/remixicon.css';

// Import Google Fonts
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
  const steps = [
    { icon: "ri-scroll-paper-line", title: "Create Your Quests", desc: "Add your assignments and study tasks to the Quest Board. Set deadlines and difficulty levels for each quest.", tags: ["SCROLL", "CHECKLIST"] },
    { icon: "ri-checkbox-circle-line", title: "Complete Your Tasks", desc: "Finish your study missions and mark them as completed. Stay organized and keep your productivity on track.", tags: ["TARGET", "CHECKMARK"] },
    { icon: "ri-medal-line", title: "Earn XP & Level Up", desc: "Gain experience points for every completed quest. Level up your character and unlock visual upgrades.", tags: ["XP BAR", "LEVEL UP"] },
    { icon: "ri-bar-chart-grouped-line", title: "Track Your Progress", desc: "Monitor your productivity with clear analytics and streaks. See how your study habits improve over time.", tags: ["CHART", "PROGRESS BAR"] },
  ];

  const features = [
    {
      icon: "ri-treasure-map-line",
      title: "Quest Board",
      desc: "Organize your assignments like quests with deadlines and difficulty levels.",
      tags: ["LEGENDARY", "500 XP"],
      tagStyle: "bg-[#FEF3E2] text-[#C17A3A]",
    },
    {
      icon: "ri-star-line",
      title: "XP & Level System",
      desc: "Earn experience points for completing tasks. Level up your character and unlock visual upgrades.",
      extra: (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <span>Level 5 — Newbie</span>
            <span>1500 / 3000 XP</span>
          </div>
          <div className="h-2 bg-[#EAE0D0] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#C17A3A] to-[#D4935A] w-1/2 rounded-full"></div>
          </div>
        </div>
      ),
    },
    {
      icon: "ri-fire-line",
      title: "Daily Streak",
      desc: "Maintain your productivity streak and earn bonus XP for completing tasks consistently.",
      extra: (
        <div className="flex gap-2 mt-3">
          {["M","T","W","T","F"].map((d, i) => (
            <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i < 4 ? 'bg-[#C17A3A] text-white' : 'bg-[#EAE0D0] text-gray-400'}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {d}
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: "ri-bar-chart-2-line",
      title: "Learning Analytics",
      desc: "Track your study progress with clear, engaging charts and statistics.",
      extra: (
        <div className="flex items-end gap-2 mt-3 h-12">
          {[40, 65, 55, 80, 70, 90, 75].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%`, backgroundColor: i === 5 ? '#C17A3A' : '#EAE0D0' }}></div>
          ))}
        </div>
      ),
    },
  ];

  const scrollLocal = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <style>{fontStyle}</style>
      <div className="min-h-screen bg-[#F5F0E8] text-[#1A1310] overflow-x-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>

        {/* 1. HERO SECTION */}
        <section id="home" className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 relative">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 w-full">
            <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <h1 className="text-5xl md:text-6xl leading-tight tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}>
                Level Up Your <br /> <span className="text-[#C17A3A]">Grades</span>
              </h1>
              <p className="text-gray-600 text-lg max-w-md" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>
                Turn your study tasks into exciting quests. Stay organized, earn XP, and watch your character grow.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-[#C17A3A] hover:bg-[#A66832] text-white px-8 py-3 rounded-full transition shadow-lg shadow-[#C17A3A]/20 active:scale-95" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
                  Start Your Quests →
                </button>
                <button
                  onClick={() => scrollLocal("feature")}
                  className="border-2 border-[#C8BAA8] px-6 py-3 rounded-full flex items-center gap-2 hover:bg-white/50 transition active:scale-95" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}
                >
                  <i className="ri-play-fill text-sm"></i> Watch Demo
                </button>
              </div>
            </div>

            {/* Hero Card Visual */}
            <div className="flex-1 flex justify-center w-full animate-in fade-in slide-in-from-right-8 duration-1000">
              <div className="bg-[#FDFAF5] p-8 rounded-3xl shadow-xl border border-[#EAE0D0] w-full max-w-sm space-y-4">
                <span className="bg-[#FEF3E2] text-[#C17A3A] text-xs px-4 py-1.5 rounded-full inline-block" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
                  ⚔️ Active Quest
                </span>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#C17A3A]"></div>
                    <span>Math Chapter 5 – Due Tomorrow</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm opacity-40 line-through" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                    <span>Read History Notes</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-xs text-gray-500 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <span>XP: 340 / 500</span>
                    <span>Level 8</span>
                  </div>
                  <div className="h-2.5 bg-[#EAE0D0] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#C17A3A] to-[#D4935A] w-[68%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Bottom padding only, no stats */}
          <div className="pb-12 w-full"></div>
        </section>

        {/* 2. HOW IT WORKS SECTION */}
        <section id="feature" className="bg-[#FDFAF5]/50 py-24 px-6 border-t border-[#EAE0D0]">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <div>
              <h2 className="text-4xl mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>How It Works?</h2>
              <p className="text-gray-500" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>Turn your study tasks into an exciting productivity adventure.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              {steps.map((step, i) => (
                <div key={i} className="bg-[#FDFAF5] p-6 rounded-2xl border border-[#EAE0D0] hover:shadow-md hover:-translate-y-1 transition group h-full flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 bg-[#C17A3A] text-white rounded-full flex items-center justify-center mb-6 text-xl group-hover:scale-110 transition">
                      <i className={step.icon}></i>
                    </div>
                    <h3 className="text-lg mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>{step.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>{step.desc}</p>
                  </div>
                  <div className="flex gap-2 mt-auto flex-wrap">
                    {step.tags.map(tag => (
                      <span key={tag} className="text-[10px] text-gray-400 border border-gray-200 px-2 py-1 rounded" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. POWERFUL FEATURES SECTION */}
        <section id="features" className="py-24 px-6 border-t border-[#EAE0D0]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center">
              <h2 className="text-4xl mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Powerful Features for Smarter Studying</h2>
              <p className="text-gray-500 max-w-xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>Boost your productivity while having fun! Every task becomes a quest, every achievement earns XP.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feat, i) => (
                <div key={i} className="bg-[#FDFAF5] p-6 rounded-2xl border border-[#EAE0D0] hover:shadow-md hover:-translate-y-1 transition group">
                  <div className="w-12 h-12 bg-[#FEF3E2] text-[#C17A3A] rounded-xl flex items-center justify-center mb-4 text-xl group-hover:scale-110 transition">
                    <i className={feat.icon}></i>
                  </div>
                  <h3 className="text-lg mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>{feat.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>{feat.desc}</p>
                  {feat.extra && feat.extra}
                  {feat.tags && (
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {feat.tags.map(tag => (
                        <span key={tag} className={`text-[10px] px-3 py-1 rounded-full font-bold ${feat.tagStyle || 'text-gray-400 border border-gray-200'}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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

        {/* 4. ABOUT SECTION */}
        <section id="about" className="max-w-6xl mx-auto py-24 px-6 flex flex-col md:flex-row items-center gap-16 border-t border-[#EAE0D0]">
          <div className="w-full md:w-80 h-64 bg-[#FDFAF5] rounded-3xl border border-[#EAE0D0] shadow-inner flex items-center justify-center text-[#C17A3A]/20">
            <i className="ri-shield-user-line text-9xl"></i>
          </div>
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>About Alsio</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-sm" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>
              <p>ALSIO is a web-based platform that turns studying into a fun RPG adventure. Students can add assignments to a Quest Board, complete tasks to earn XP, and level up their character.</p>
              <p>With evolving avatars and visual rewards, ALSIO makes learning engaging and motivates consistent study habits by combining gamification with effective task management.</p>
            </div>
          </div>
        </section>

        {/* 5. CONTACT SECTION */}
        <section id="contact" className="max-w-3xl mx-auto py-24 px-6 border-t border-[#EAE0D0]">
          <h2 className="text-4xl text-center mb-12" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Get In Touch</h2>
          <div className="bg-[#FDFAF5] p-8 rounded-3xl border border-[#EAE0D0] shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 tracking-widest uppercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Name</label>
                <input type="text" className="w-full bg-[#F5F0E8] border border-[#EAE0D0] rounded-xl p-3 focus:outline-none focus:ring-1 ring-[#C17A3A]" style={{ fontFamily: "'Poppins', sans-serif" }} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 tracking-widest uppercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Email</label>
                <input type="email" className="w-full bg-[#F5F0E8] border border-[#EAE0D0] rounded-xl p-3 focus:outline-none focus:ring-1 ring-[#C17A3A]" style={{ fontFamily: "'Poppins', sans-serif" }} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-gray-500 tracking-widest uppercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>Message</label>
              <textarea rows={4} className="w-full bg-[#F5F0E8] border border-[#EAE0D0] rounded-xl p-3 focus:outline-none focus:ring-1 ring-[#C17A3A] resize-none" style={{ fontFamily: "'Poppins', sans-serif" }} />
            </div>
            <button className="w-full bg-[#C17A3A] hover:bg-[#A66832] text-white py-4 rounded-xl transition active:scale-95" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
              Send Message →
            </button>
          </div>
        </section>

      </div>
    </>
  );
};

export default Homepage;