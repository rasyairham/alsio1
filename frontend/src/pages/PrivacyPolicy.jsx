import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
              Privacy Policy
            </h1>

            <p className="text-sm text-gray-400">
              Last updated: March 25, 2026
            </p>

            <div className="mt-6 h-px bg-[#EAE0D0]" />
          </div>

          <p className="text-gray-500 text-sm leading-relaxed mb-12">
            At ALSIO, we take your privacy seriously. This Privacy Policy explains how we collect,
            use, and protect your personal information when you use our platform. By using ALSIO,
            you agree to the practices described in this policy.
          </p>

          <div className="space-y-10">
            {sections.map((section, i) => (
              <div key={i}>
                <div className="flex items-start gap-4 mb-3">
                  <span className="text-xs text-[#946C44] mt-1 font-black" style={PJS}>
                    0{i + 1}
                  </span>

                  <h2 className="text-base text-[#1A1310]" style={{ ...PJS, fontWeight: 700 }}>
                    {section.title}
                  </h2>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed pl-8">
                  {section.content}
                </p>

                {i < sections.length - 1 && (
                  <div className="mt-10 h-px bg-[#EAE0D0]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;