import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import LoginModal from './components/LoginModal/LoginModal';
import RegisterModal from './components/RegisterModal/RegisterModal';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import AdminRoute from './components/AdminRoute/AdminRoute';

// Komponen utama website
import Header from './components/Header/Header';
import NewHeroSection from './components/NewHeroSection/NewHeroSection';
import AboutSection from './components/AboutSection/AboutSection';
import ProblemExamplesSection from './components/ProblemExamplesSection/ProblemExamplesSection';
import TestimonialsSection from './components/TestimonialsSection/TestimonialsSection';
import Footer from './components/Footer/Footer';
import CreateReportPage from './components/CreateReportPage/CreateReportPage';
import MyReports from './components/MyReports/MyReports';

// Home Page Component
const HomePage = ({ openModal, handleLaporInClick }) => (
  <>
    <NewHeroSection onLaporInClick={handleLaporInClick} />
    <ProblemExamplesSection />
    <TestimonialsSection />
    <AboutSection />
    <Footer />
  </>
);

function App() {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // Fungsi untuk tombol Lapor-in - cek apakah user sudah login
  const handleLaporInClick = () => {
    setActiveModal('login');
  };

  return (
    <UserProvider>
      <Router>
        <div className="App">
          {/* Header dengan tombol login */}
          <Header onOpenLogin={() => openModal('login')} />
          
          {/* Routes */}
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  openModal={openModal} 
                  handleLaporInClick={handleLaporInClick} 
                />
              } 
            />
            <Route path="/create-report" element={<CreateReportPage />} />
            <Route path="/my-reports" element={<MyReports />} />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
          </Routes>

          {/* All Modals */}
          <LoginModal 
            isOpen={activeModal === 'login'}
            onClose={closeModal}
            onSwitchToRegister={() => setActiveModal('register')}
            onSwitchToForgotPassword={() => setActiveModal('forgotPassword')}
          />
          
          <RegisterModal 
            isOpen={activeModal === 'register'}
            onClose={closeModal}
            onSwitchToLogin={() => setActiveModal('login')}
          />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;