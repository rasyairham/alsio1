import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Import Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Import Pages
import Homepage from "./pages/Homepage";
import Profilepage from "./pages/Profilepage";
import Dashboardpage from './pages/Dashboardpage';
import Loginpage from './pages/Loginpage';
import Registerpage from './pages/Registerpage';
import Questpage from './pages/Questpage';
import Analyticspage from './pages/Analyticspage';

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));
  const location = useLocation();

  useEffect(() => {
    setIsAuth(!!localStorage.getItem("token"));
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={isAuth ? <Navigate to="/dashboard" replace /> : <Homepage />} />
          <Route path="/login" element={isAuth ? <Navigate to="/dashboard" replace /> : <Loginpage />} />
          <Route path="/register" element={isAuth ? <Navigate to="/dashboard" replace /> : <Registerpage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={isAuth ? <Dashboardpage /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={isAuth ? <Profilepage /> : <Navigate to="/login" replace />} />
          <Route path="/quests" element={isAuth ? <Questpage /> : <Navigate to="/login" replace />} />
          <Route path="/analytics" element={isAuth ? <Analyticspage /> : <Navigate to="/login" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;