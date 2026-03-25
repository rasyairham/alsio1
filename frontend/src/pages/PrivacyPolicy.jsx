import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // Menggunakan Lucide agar konsisten dengan komponen sebelumnya

const fontStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&family=Poppins:wght@400;500;600&display=swap');
`;

const PJS = { fontFamily: "'Plus Jakarta Sans', sans-serif" };
const POP = { fontFamily: "'Poppins', sans-serif" };

const sections = [
  { title: "Information We Collect", content: "We collect information you provide directly to us when you create an account, such as your name, email address, and password. We also collect data about your activity on ALSIO, including completed quests, XP earned, and streak history to provide you with a personalized experience." },
  { title: "How We Use Your Information", content: "We use the information we collect to operate and improve ALSIO, personalize your experience, track your progress and achievements, send you important updates about the platform, and respond to your comments and questions." },
  { title: "Data Storage & Security", content: "Your data is stored securely on our servers. We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or destruction. Your password is encrypted and never stored in plain text." },
  { title: "Cookies", content: "ALSIO uses cookies and similar tracking technologies to maintain your session and remember your preferences. You can control cookie settings through your browser, but disabling cookies may affect some features of the platform." },
  { title: "Third-Party Services", content: "We may use third-party services such as analytics providers to help us understand how users interact with ALSIO. These services may collect information sent by your browser as part of their standard operation." },
  { title: "Changes to This Policy", content: "We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated date. Continued use of ALSIO after changes constitutes acceptance of the updated policy." },
  { title: "Contact Us", content: "If you have any questions about this Privacy Policy, please contact us at alsiobertiga@gmail.com. We are happy to address any concerns you may have about your data and privacy." }
];

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <style>{fontStyle}</style>

      <div className="min-h-screen bg-[#FAF7F4] selection:bg-[#946C44]/20" style={POP}>
        {/* Navbar-like space or extra top padding for mobile */}
        <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-24 sm:pt-36 pb-16"> 

          {/* Back Button - Fixed position or relative */}
          <button
            onClick={() => navigate('/')}
            className="mb-8 flex items-center gap-2 text-xs sm:text-sm text-[#946C44] hover:text-[#7A5836] transition-all group"
            style={{ ...PJS, fontWeight: 700 }}
          >
            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:shadow-md transition-all">
               <ArrowLeft size={16} />
            </div>
            Back to Home
          </button>

          {/* Title Section */}
          <div className="mb-10 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-[#1A1310] mb-4 leading-tight" style={{ ...PJS, fontWeight: 800 }}>
              Privacy <span className="text-[#946C44]">Policy</span>
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-bold" style={PJS}>
                Last updated: March 25, 2026
              </p>
              <div className="hidden sm:block flex-1 mx-4 h-px bg-[#EAE0D0]" />
            </div>
          </div>

          {/* Introduction */}
          <div className="bg-white/50 border border-white p-6 rounded-3xl mb-12">
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              At ALSIO, we take your privacy seriously. This Privacy Policy explains how we collect,
              use, and protect your personal information when you use our platform. By using ALSIO,
              you agree to the practices described in this policy.
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-12 sm:space-y-16">
            {sections.map((section, i) => (
              <div key={i} className="relative">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] sm:text-xs text-[#946C44] font-black py-1 px-2 bg-[#946C44]/10 rounded-lg" style={PJS}>
                      0{i + 1}
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl text-[#1A1310] tracking-tight" style={{ ...PJS, fontWeight: 700 }}>
                    {section.title}
                  </h2>
                </div>

                <div className="pl-0 sm:pl-12">
                  <p className="text-sm sm:text-[15px] text-gray-500 leading-relaxed">
                    {section.content}
                  </p>
                </div>

                {i < sections.length - 1 && (
                  <div className="mt-12 sm:mt-16 h-px bg-gradient-to-r from-transparent via-[#EAE0D0] to-transparent" />
                )}
              </div>
            ))}
          </div>

          {/* Footer Branding */}
          <div className="mt-20 pt-10 border-t border-[#EAE0D0] text-center">
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]" style={PJS}>
               ALSIO Ambisi Leveling Siswa Intelektual Optimal
             </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;