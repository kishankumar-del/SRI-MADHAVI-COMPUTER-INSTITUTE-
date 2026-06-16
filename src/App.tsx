import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import Admission from './pages/Admission';
import Status from './pages/Status';
import VerifyCertificate from './pages/VerifyCertificate';
import Contact from './pages/Contact';
import AdminPortal from './pages/AdminPortal';

function AppLayout() {
  const location = useLocation();
  
  // Strict check to completely sever any layout links or headers 
  // between the public workspace and the security administrative workspace.
  const isAdmin = location.pathname.startsWith('/admin-portal');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      {!isAdmin && <Header />}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/status" element={<Status />} />
          <Route path="/verify-certificate" element={<VerifyCertificate />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin-portal" element={<AdminPortal />} />
          {/* Default fallback route redirects to landing page */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {!isAdmin && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
