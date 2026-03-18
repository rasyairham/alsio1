import { Routes, Route } from 'react-router-dom';

// Sesuaikan dengan nama file di folder (Case Sensitive)
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Homepage from "./pages/Homepage";
import Profilepage from "./pages/Profilepage";
import Dashboardpage from './pages/Dashboardpage';
import Loginpage from './pages/Loginpage';
import Registerpage from './pages/Registerpage';
import Questpage from './pages/Questpage';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/profile" element={<Profilepage />} />
          <Route path="/dashboard" element={<Dashboardpage />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/register" element={<Registerpage />} />
          <Route path="/quests" element={<Questpage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;