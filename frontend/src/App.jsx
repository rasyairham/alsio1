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

  // Logika untuk menyembunyikan Navbar & Footer
  const hideLayout = ['/login', '/register'].includes(location.pathname);

  useEffect(() => {
    // Memastikan status auth selalu update setiap pindah halaman
    setIsAuth(!!localStorage.getItem("token"));
  }, [location.pathname]);

  return (
    <>
      {/* Navbar hanya muncul jika TIDAK di path login/register */}
      {!hideLayout && <Navbar />}

      <main className={hideLayout ? "" : "min-h-screen pt-20 md:pt-24"}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={isAuth ? <Navigate to="/dashboard" replace /> : <Homepage />} />
          <Route path="/login" element={isAuth ? <Navigate to="/dashboard" replace /> : <Loginpage />} />
          <Route path="/register" element={isAuth ? <Navigate to="/dashboard" replace /> : <Registerpage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={isAuth ? <Dashboardpage /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={isAuth ? <Profilepage /> : <Navigate to="/login" replace />} />
          <Route path="/quests" element={isAuth ? <Questpage /> : <Navigate to="/login" replace />} />
          <Route path="/analytics" element={isAuth ? <Analyticspage /> : <Navigate to="/login" replace />} />

          {/* Catch-all: Redirect ke home jika route tidak ada */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer hanya muncul jika TIDAK di path login/register */}
      {!hideLayout && <Footer />}
    </>
  );
}

export default App;