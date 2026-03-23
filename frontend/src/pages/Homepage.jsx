import React from 'react';
import 'remixicon/fonts/remixicon.css';

const Homepage = () => {
  const steps = [
    { icon: "ri-scroll-paper-line", title: "Create Your Quests", desc: "Add your assignments and study tasks to the Quest Board.", tags: ["SCROLL", "CHECKLIST"] },
    { icon: "ri-checkbox-circle-line", title: "Complete Tasks", desc: "Finish your study missions and stay organized.", tags: ["TARGET", "CHECKMARK"] },
    { icon: "ri-medal-line", title: "Earn XP & Level Up", desc: "Gain experience points and unlock visual upgrades.", tags: ["XP BAR", "LEVEL UP"] },
    { icon: "ri-bar-chart-grouped-line", title: "Track Progress", desc: "Monitor your productivity with clear analytics.", tags: ["CHART", "PROGRESS"] },
  ];

  // Fungsi internal untuk button lokal di homepage
  const scrollLocal = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#1A1310] font-sans overflow-x-hidden">
      
      {/* 1. HERO SECTION (ID: home) */}
      <section id="home" className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 relative">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 w-full">
          <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Level Up Your <br /> <span className="text-[#C17A3A]">Grades</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-md">
              Turn your study tasks into exciting quests. Stay organized, earn XP, and watch your character grow.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#C17A3A] hover:bg-[#A66832] text-white px-8 py-3 rounded-full font-bold transition shadow-lg shadow-[#C17A3A]/20 active:scale-95">
                Start Your Quests →
              </button>
              <button 
                onClick={() => scrollLocal("feature")}
                className="border-2 border-[#C8BAA8] px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-white/50 transition active:scale-95"
              >
                <i className="ri-play-fill text-sm"></i> Watch Demo
              </button>
            </div>
          </div>

          {/* Hero Card Visual */}
          <div className="flex-1 flex justify-center w-full animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="bg-[#FDFAF5] p-8 rounded-3xl shadow-xl border border-[#EAE0D0] w-full max-w-sm space-y-4">
              <span className="bg-[#FEF3E2] text-[#C17A3A] text-xs font-bold px-4 py-1.5 rounded-full inline-block">
                ⚔️ Active Quest
              </span>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#C17A3A]"></div>
                  <span>Math Chapter 5 – Due Tomorrow</span>
                </div>
                <div className="flex items-center gap-3 text-sm opacity-40 line-through">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                  <span>Read History Notes</span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-20 border-t border-[#EAE0D0] pt-10 w-full max-w-4xl mx-auto text-center pb-12">
          <div>
            <p className="text-3xl font-black text-[#C17A3A]">100%</p>
            <p className="text-gray-500 text-xs uppercase font-bold tracking-widest mt-1">Gamified</p>
          </div>
          <div>
            <p className="text-3xl font-black text-[#C17A3A]">XP Bar</p>
            <p className="text-gray-500 text-xs uppercase font-bold tracking-widest mt-1">Visual Progression</p>
          </div>
          <div className="hidden md:block">
            <p className="text-3xl font-black text-[#C17A3A]">Tailwind</p>
            <p className="text-gray-500 text-xs uppercase font-bold tracking-widest mt-1">Sleek UI</p>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION (ID: about) */}
      <footer id="about" className="max-w-6xl mx-auto py-24 px-6 flex flex-col md:flex-row items-center gap-16 border-t border-[#EAE0D0]">
        <div className="w-full md:w-80 h-64 bg-[#FDFAF5] rounded-3xl border border-[#EAE0D0] shadow-inner flex items-center justify-center text-[#C17A3A]/20">
          <i className="ri-shield-user-line text-9xl"></i>
        </div>
        <div className="flex-1 space-y-6">
          <h2 className="text-4xl font-bold">About Alsio</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed text-sm">
            <p>ALSIO is a web-based platform that turns studying into a fun RPG adventure. Students can add assignments to a Quest Board, complete tasks to earn XP, and level up their character.</p>
            <p>With evolving avatars and visual rewards, ALSIO makes learning engaging and motivates consistent study habits by combining gamification with effective task management.</p>
          </div>
        </div>
      </footer>

      {/* 3. FEATURE SECTION (ID: feature) */}
      <section id="feature" className="bg-[#FDFAF5]/50 py-24 px-6 border-t border-[#EAE0D0]">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <div>
            <h2 className="text-4xl font-bold mb-4">How It Works?</h2>
            <p className="text-gray-500">Turn your study tasks into an exciting productivity adventure.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {steps.map((step, i) => (
              <div key={i} className="bg-[#FDFAF5] p-6 rounded-2xl border border-[#EAE0D0] hover:shadow-md hover:-translate-y-1 transition group h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-[#C17A3A] text-white rounded-full flex items-center justify-center mb-6 text-xl group-hover:scale-110 transition">
                    <i className={step.icon}></i>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{step.desc}</p>
                </div>
                <div className="flex gap-2 mt-auto">
                  {step.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold text-gray-400 border border-gray-200 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CONTACT SECTION (ID: contact) */}
      <section id="contact" className="max-w-3xl mx-auto py-24 px-6 border-t border-[#EAE0D0]">
        <h2 className="text-4xl font-bold text-center mb-12">Get In Touch</h2>
        <div className="bg-[#FDFAF5] p-8 rounded-3xl border border-[#EAE0D0] shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Name</label>
              <input type="text" className="w-full bg-[#F5F0E8] border border-[#EAE0D0] rounded-xl p-3 focus:outline-none focus:ring-1 ring-[#C17A3A]" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Email</label>
              <input type="email" className="w-full bg-[#F5F0E8] border border-[#EAE0D0] rounded-xl p-3 focus:outline-none focus:ring-1 ring-[#C17A3A]" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Message</label>
            <textarea rows={4} className="w-full bg-[#F5F0E8] border border-[#EAE0D0] rounded-xl p-3 focus:outline-none focus:ring-1 ring-[#C17A3A] resize-none" />
          </div>
          <button className="w-full bg-[#C17A3A] hover:bg-[#A66832] text-white py-4 rounded-xl font-bold transition active:scale-95">
            Send Message →
          </button>
        </div>
      </section>

    </div>
  );
};

export default Homepage;