import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

      <div className="min-h-screen bg-[#FAF7F4]" style={POP}>
        <div className="max-w-3xl mx-auto px-6 pt-36 pb-16">

          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="mb-6 flex items-center gap-2 text-sm text-[#946C44] hover:text-[#7A5836] transition-colors"
            style={{ ...PJS, fontWeight: 700 }}
          >
            <i className="ri-arrow-left-line text-lg"></i> Back to Home
          </button>

          {/* Title */}
          <div className="mb-12">
            <h1 className="text-4xl text-[#1A1310] mb-4" style={{ ...PJS, fontWeight: 800 }}>
              Terms of Service
            </h1>
            <p className="text-sm text-gray-400">Last updated: March 25, 2026</p>
            <div className="mt-6 h-px bg-[#EAE0D0]" />
          </div>

          {/* Intro */}
          <p className="text-gray-500 text-sm leading-relaxed mb-12">
            Welcome to ALSIO. These Terms of Service govern your use of our platform and services. Please read them carefully before using ALSIO. By using our platform, you acknowledge that you have read, understood, and agree to be bound by these terms.
          </p>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section, i) => (
              <div key={i}>
                <div className="flex items-start gap-4 mb-3">
                  <span className="text-xs text-[#946C44] mt-1 font-black" style={PJS}>0{i + 1}</span>
                  <h2 className="text-base text-[#1A1310]" style={{ ...PJS, fontWeight: 700 }}>{section.title}</h2>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed pl-8">{section.content}</p>
                {i < sections.length - 1 && <div className="mt-10 h-px bg-[#EAE0D0]"></div>}
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default TermsOfService;