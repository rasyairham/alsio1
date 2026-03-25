import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&family=Poppins:wght@400;500;600&display=swap');
`;

const PJS = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const POP = { fontFamily: "'Poppins', sans-serif" };

const sections = [
  { title: "Acceptance of Terms", content: "By accessing or using ALSIO, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. We reserve the right to update these terms at any time, and your continued use of ALSIO constitutes acceptance of the revised terms." },
  { title: "User Accounts", content: "You must create an account to use ALSIO. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when creating your account and to update it as necessary." },
  { title: "Acceptable Use", content: "You agree to use ALSIO only for lawful purposes and in a manner consistent with these terms. You must not misuse the platform, attempt to gain unauthorized access to any part of ALSIO, or engage in any conduct that disrupts or interferes with the experience of other users." },
  { title: "XP, Levels & Virtual Rewards", content: "XP, levels, streaks, and other virtual rewards earned on ALSIO have no real-world monetary value and cannot be exchanged for cash or other goods. These are purely gamification elements designed to enhance your productivity experience on the platform." },
  { title: "Intellectual Property", content: "All content, design, and features of ALSIO — including but not limited to logos, graphics, and software — are the intellectual property of ALSIO and are protected by applicable copyright and trademark laws. You may not reproduce or distribute any part of the platform without prior written consent." },
  { title: "Termination", content: "We reserve the right to suspend or terminate your account at any time if you violate these Terms of Service. Upon termination, your access to ALSIO will be revoked and your data may be deleted in accordance with our data retention policy." },
  { title: "Limitation of Liability", content: "ALSIO is provided on an 'as is' basis without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability to you shall not exceed the amount you paid to use ALSIO in the past twelve months." },
  { title: "Contact", content: "For questions about these Terms of Service, please reach out to us at alsiobertiga@gmail.com. We will do our best to respond within a reasonable timeframe." }
];

const TermsOfService = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <style>{fontStyle}</style>

      <div className="min-h-screen bg-[#FAF7F4] antialiased" style={POP}>
        {/* Container Utama dengan Responsive Padding */}
        <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-20 md:pt-32 pb-20">

          {/* Back Button - Dibuat lebih mencolok di Mobile */}
          <button
            onClick={() => navigate('/')}
            className="mb-8 flex items-center gap-2 text-sm text-[#946C44] hover:text-[#7A5836] transition-all group"
            style={{ ...PJS, fontWeight: 700 }}
          >
            <div className="w-8 h-8 rounded-full bg-[#946C44]/5 flex items-center justify-center group-hover:bg-[#946C44]/10 transition-colors">
                <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Back to Home</span>
          </button>

          {/* Title Section */}
          <div className="mb-10 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-[#1A1310] mb-4 tracking-tight" style={{ ...PJS, fontWeight: 800 }}>
              Terms of Service
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <p className="text-[11px] sm:text-xs text-gray-400 uppercase tracking-widest font-bold">Last updated: March 25, 2026</p>
                <span className="hidden sm:block h-1 w-1 rounded-full bg-gray-300"></span>
                <p className="text-[11px] sm:text-xs text-[#946C44] font-bold uppercase tracking-widest">v1.0.4</p>
            </div>
            <div className="mt-8 h-[2px] w-20 bg-[#946C44]" />
          </div>

          {/* Intro Text */}
          <div className="relative mb-16 sm:mb-20">
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed relative z-10 italic border-l-4 border-[#946C44]/20 pl-6">
              Welcome to ALSIO. These Terms of Service govern your use of our platform and services. Please read them carefully. By using our platform, you acknowledge that you have read, understood, and agree to be bound by these terms.
            </p>
          </div>

          {/* Sections List */}
          <div className="space-y-12 sm:space-y-16">
            {sections.map((section, i) => (
              <div key={i} className="group transition-all">
                <div className="flex items-start gap-3 sm:gap-6 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white shadow-sm border border-[#EAE0D0] flex items-center justify-center text-[10px] sm:text-xs text-[#946C44] font-black" style={PJS}>
                    0{i + 1}
                  </div>
                  <h2 className="text-lg sm:text-xl text-[#1A1310] pt-1" style={{ ...PJS, fontWeight: 700 }}>
                    {section.title}
                  </h2>
                </div>
                
                {/* Text Content dengan margin yang menyesuaikan layar */}
                <div className="pl-11 sm:pl-16">
                  <p className="text-sm sm:text-[15px] text-gray-500 leading-relaxed max-w-2xl">
                    {section.content}
                  </p>
                  
                  {/* Decorative divider - disembunyikan di item terakhir */}
                  {i < sections.length - 1 && (
                    <div className="mt-12 sm:mt-16 h-px w-full bg-gradient-to-r from-[#EAE0D0] to-transparent"></div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-20 p-8 rounded-3xl bg-[#946C44]/5 border border-[#946C44]/10 text-center">
            <p className="text-xs text-gray-500 leading-relaxed" style={POP}>
                Thank you for being part of the **ALSIO** community. <br className="hidden sm:block" />
                Let's level up your intellectual journey together.
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default TermsOfService;