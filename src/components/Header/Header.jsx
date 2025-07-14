import React, { useState } from 'react';
import { FaUser, FaBars, FaTimes, FaCog } from 'react-icons/fa'; // Tambahkan FaCog
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const Header = ({ onOpenLogin }) => {
  const { user, isAuthenticated, isAdmin, logout } = useUser(); // Tambahkan isAdmin
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
    } else {
      onOpenLogin();
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToAbout = () => {
    const aboutSection = document.querySelector('#about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  // Tambahkan fungsi untuk navigasi ke MyReports
  const handleMyReportsClick = () => {
    if (isAuthenticated) {
      navigate('/my-reports');
    } else {
      onOpenLogin(); // Jika belum login, buka modal login
    }
    setIsMobileMenuOpen(false);
  };

  // Tambahkan fungsi untuk navigasi ke Admin Dashboard
  const handleAdminDashboardClick = () => {
    navigate('/admin');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="w-full flex justify-between items-center px-4 sm:px-8 py-4 
    bg-gradient-to-r from-[#1F2F49ff] via-[#CB7007ff] to-[#FCBD69ff] shadow-md fixed top-0 left-0 right-0 z-50">
      {/* Logo */}
      <button 
        onClick={handleLogoClick}
        className="text-xl sm:text-2xl font-bold text-white tracking-wide hover:opacity-80 transition-opacity duration-200 cursor-pointer"
      >
        Lapor-in
      </button>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4">
        <button 
          type="button"
          onClick={scrollToAbout}
          className="text-white font-semibold rounded-md 
          hover:bg-gray-800 hover:text-white transition-all duration-300 px-4 py-2">
          Tentang Lapor-in
        </button>
        <button
          type="button"
          onClick={handleMyReportsClick}
          className="text-white font-semibold rounded-md px-4 py-2 
          hover:bg-gray-700 hover:text-white transition-all duration-150"
        >
          Laporan
        </button>
        <button
          type="button"
          className="text-white font-semibold rounded-md px-4 py-2 
          hover:bg-gray-700 hover:text-white transition-all duration-150"
        >
          Peta
        </button>
        
        {/* Admin Dashboard Button - hanya tampil untuk admin */}
        {isAuthenticated && isAdmin() && (
          <button
            type="button"
            onClick={handleAdminDashboardClick}
            className="bg-red-600 text-white font-semibold rounded-md px-4 py-2 
            hover:bg-red-700 transition-all duration-150 flex items-center space-x-2"
            title="Admin Dashboard"
          >
            <FaCog className="text-sm" />
            <span>Dashboard</span>
          </button>
        )}
        
        {/* Tampilkan nama user jika sudah login */}
        {isAuthenticated && user && (
          <span className="text-white font-medium">
            Halo, {user.name} {isAdmin() && <span className="text-yellow-300">(Admin)</span>}
          </span>
        )}
        
        {/* Login Button or User Icon */}
        {isAuthenticated ? (
          <button
            type="button"
            onClick={handleAuthClick}
            className="bg-white text-[#1F2F49ff] font-semibold rounded-md px-4 py-2 
            hover:bg-gray-100 transition-all duration-150 mr-6 flex items-center justify-center"
            title="Logout"
          >
            <FaUser className="text-xl" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAuthClick}
            className="bg-white text-[#1F2F49ff] font-semibold rounded-md px-6 py-2 
            hover:bg-gray-100 transition-all duration-150 mr-6"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden text-white text-xl p-2 hover:bg-white/10 rounded-md transition-all duration-300 transform hover:scale-105"
      >
        <div className="relative w-6 h-6">
          <FaBars className={`absolute inset-0 transition-all duration-300 transform ${
            isMobileMenuOpen ? 'opacity-0 rotate-180 scale-75' : 'opacity-100 rotate-0 scale-100'
          }`} />
          <FaTimes className={`absolute inset-0 transition-all duration-300 transform ${
            isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-75'
          }`} />
        </div>
      </button>

      {/* Mobile Navigation Menu with smooth transition */}
      <div className={`absolute top-full left-0 right-0 bg-gradient-to-r from-[#1F2F49ff] via-[#CB7007ff] to-[#FCBD69ff] shadow-lg md:hidden overflow-hidden transition-all duration-500 ease-in-out transform ${
        isMobileMenuOpen 
          ? 'max-h-96 opacity-100 translate-y-0' 
          : 'max-h-0 opacity-0 -translate-y-4'
      }`}>
        <div className={`flex flex-col space-y-2 p-4 transition-all duration-300 delay-100 ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}>
          <button 
            type="button"
            onClick={scrollToAbout}
            className="text-white font-semibold rounded-md 
            hover:bg-white/10 transition-all duration-300 px-4 py-3 text-left transform hover:translate-x-2">
            Tentang Lapor-in
          </button>
          <button
            type="button"
            onClick={handleMyReportsClick}
            className="text-white font-semibold rounded-md px-4 py-3 
            hover:bg-white/10 transition-all duration-300 text-left transform hover:translate-x-2"
          >
            Laporan
          </button>
          <button
            type="button"
            className="text-white font-semibold rounded-md px-4 py-3 
            hover:bg-white/10 transition-all duration-300 text-left transform hover:translate-x-2"
          >
            Peta
          </button>
          
          {/* Admin Dashboard Button untuk mobile */}
          {isAuthenticated && isAdmin() && (
            <button
              type="button"
              onClick={handleAdminDashboardClick}
              className="bg-red-600 text-white font-semibold rounded-md px-4 py-3 
              hover:bg-red-700 transition-all duration-300 text-left transform hover:translate-x-2 flex items-center space-x-2"
            >
              <FaCog className="text-sm" />
              <span>Admin Dashboard</span>
            </button>
          )}
          
          {/* User info dan login button untuk mobile */}
          <div className="border-t border-white/20 pt-3 mt-3">
            {isAuthenticated && user && (
              <div className="text-white font-medium px-4 py-2">
                Halo, {user.name} {isAdmin() && <span className="text-yellow-300">(Admin)</span>}
              </div>
            )}
            
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleAuthClick}
                className="bg-white text-[#1F2F49ff] font-semibold rounded-md px-4 py-3 
                hover:bg-gray-100 transition-all duration-300 w-full flex items-center justify-center transform hover:scale-105"
                title="Logout"
              >
                <FaUser className="text-lg mr-2" />
                Logout
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAuthClick}
                className="bg-white text-[#1F2F49ff] font-semibold rounded-md px-4 py-3 
                hover:bg-gray-100 transition-all duration-300 w-full transform hover:scale-105"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;