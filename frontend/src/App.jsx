import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages - Pastikan nama file di folder "pages" juga sama persis (Besar Kecilnya)
import Homepage from "./pages/Homepage";
import ProfilePage from "./pages/Profilepage"; // Sesuaikan jika filenya Profilepage.jsx
import DashboardPage from './pages/Dashboardpage'; 
import LoginPage from './pages/Loginpage';
import RegisterPage from './pages/Registerpage';
import QuestPage from './pages/Questpage';
import AnalyticsPage from './pages/Analyticspage';
import ForgotPassword from './pages/ForgotPassword';
import NotificationPage from './pages/Notificationpage';

// Legal & Info Pages
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import FAQ from "./pages/FAQ";

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));
  const location = useLocation();

  // Memastikan status auth terupdate saat navigasi
  useEffect(() => {
    setIsAuth(!!localStorage.getItem("token"));
  }, [location.pathname]);

  const hideNavbar = [
    '/login', 
    '/register', 
    '/forgot-password', 
    '/privacy-policy', 
    '/terms-of-service', 
    '/faq'
  ].includes(location.pathname);

  const hideFooter = [
    '/login', 
    '/register', 
    '/forgot-password'
  ].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <main className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={isAuth ? <Navigate to="/dashboard" replace /> : <Homepage />} />
          <Route path="/login" element={isAuth ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
          <Route path="/register" element={isAuth ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
          <Route path="/forgot-password" element={isAuth ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} />

          {/* Legal & Info Pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={isAuth ? <DashboardPage /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={isAuth ? <ProfilePage /> : <Navigate to="/login" replace />} />
          <Route path="/quests" element={isAuth ? <QuestPage /> : <Navigate to="/login" replace />} />
          <Route path="/analytics" element={isAuth ? <AnalyticsPage /> : <Navigate to="/login" replace />} />
          <Route path="/notifications" element={isAuth ? <NotificationPage /> : <Navigate to="/login" replace />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!hideFooter && <Footer />}
    </>
  );
}

export default App;