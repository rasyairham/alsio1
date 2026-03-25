import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&family=Poppins:wght@400;500;600&display=swap');
`;

const PJS = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const POP = { fontFamily: "'Poppins', sans-serif" };

const faqs = [
  {
    category: "Getting Started",
    items: [
      { q: "What is ALSIO?", a: "ALSIO is a gamified productivity platform designed for students. It turns your study tasks and assignments into quests, rewards you with XP for completing them, and lets you level up your character as you progress." },
      { q: "How do I create an account?", a: "Click the Sign Up button on the homepage or login page. Fill in your name, email, and password, then confirm your account. Once registered, you can start adding quests and earning XP right away." },
      { q: "Is ALSIO free to use?", a: "Yes, ALSIO is free to use. You can access all core features including the Quest Board, XP system, streaks, and analytics without any cost." },
    ]
  },
  {
    category: "Quests & XP",
    items: [
      { q: "How do I add a quest?", a: "Go to the Quest Board, click 'Add Quest', fill in task details, and save. Your quest appears ready to complete." },
      { q: "How is XP calculated?", a: "XP is based on quest difficulty. Harder quests give more XP. Completing on time may give bonus XP. Streaks multiply XP for daily activity." },
      { q: "What happens when I level up?", a: "Accumulating enough XP levels up your character, unlocking visual upgrades and new titles." },
    ]
  },
  {
    category: "Account & Privacy",
    items: [
      { q: "How do I change my password?", a: "Go to Profile settings, select 'Change Password', enter current and new password twice." },
      { q: "How do I delete my account?", a: "Contact alsiobertiga@gmail.com with your email. Account and data will be deleted within 7 business days." },
      { q: "Is my data safe with ALSIO?", a: "Yes. Passwords are encrypted, data is secure, and never sold. See Privacy Policy for details." },
    ]
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);
  const toggle = (key) => setOpenIndex(openIndex === key ? null : key);

  return (
    <>
      <style>{fontStyle}</style>
      <div className="min-h-screen bg-[#FAF7F4]" style={POP}>
        <div className="max-w-3xl mx-auto px-6 pt-36 pb-16">
          <button
            onClick={() => navigate('/')}
            className="mb-6 flex items-center gap-2 text-sm text-[#946C44] hover:text-[#7A5836] transition-colors"
            style={{ ...PJS, fontWeight: 700 }}
          >
            <i className="ri-arrow-left-line text-lg"></i> Back to Home
          </button>

          <div className="mb-12">
            <h1 className="text-4xl text-[#1A1310] mb-4" style={{ ...PJS, fontWeight: 800 }}>Frequently Asked Questions</h1>
            <p className="text-sm text-gray-400" style={{ ...POP, fontWeight: 400 }}>Everything you need to know about ALSIO.</p>
            <div className="mt-6 h-px bg-[#EAE0D0]"></div>
          </div>

          <div className="space-y-12">
            {faqs.map((group, gi) => (
              <div key={gi}>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4" style={{ ...PJS, fontWeight: 700 }}>{group.category}</p>
                <div className="space-y-2">
                  {group.items.map((item, ii) => {
                    const key = `${gi}-${ii}`;
                    const isOpen = openIndex === key;
                    return (
                      <div key={key} className="bg-white rounded-2xl border border-[#EAE0D0] overflow-hidden transition-all">
                        <button
                          onClick={() => toggle(key)}
                          className="w-full flex justify-between items-center px-6 py-4 text-left"
                        >
                          <span className="text-sm text-[#1A1310] pr-4" style={{ ...PJS, fontWeight: 700 }}>{item.q}</span>
                          <span className={`text-[#946C44] transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-45' : ''}`}>
                            <i className="ri-add-line text-lg"></i>
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-5 border-t border-[#EAE0D0]">
                            <p className="text-sm text-gray-500 leading-relaxed pt-4" style={{ ...POP, fontWeight: 400 }}>{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;