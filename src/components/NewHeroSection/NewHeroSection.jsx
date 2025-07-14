import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import ReportModal from '../ReportModal/ReportModal';
// Import gambar jembatan
import bridgeImage from '../../assets/barelang.jpg'; // Sesuaikan nama file gambar

const NewHeroSection = ({ onLaporInClick }) => {
  const { user, isAuthenticated, isLoading } = useUser();
  const [showReportModal, setShowReportModal] = useState(false);

  const handleLaporInClick = () => {
    // Tambahkan debug info sementara
    console.log('User authenticated:', isAuthenticated);
    console.log('User data:', user);
    
    if (isAuthenticated) {
      // User sudah login, tampilkan modal laporan
      setShowReportModal(true);
    } else {
      // User belum login, buka modal login
      onLaporInClick();
    }
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
  };

  if (isLoading) {
    return (
      <section className="relative py-16 md:py-24 text-center overflow-hidden">
        {/* Background Image dengan Blur */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${bridgeImage})`,
            filter: 'blur(1px)',
            transform: 'scale(1.1)'
          }}
        />
        {/* Overlay dengan warna sesuai palette */}
        <div className="absolute inset-0 bg-gray-30/80" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-lg text-gray-800">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative py-16 md:py-24 text-center overflow-hidden">
        {/* Background Image dengan Blur */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${bridgeImage})`,
            filter: 'blur(3px)',
            transform: 'scale(1.1)'
          }}
        />
        
        {/* Overlay dengan gradient sesuai color palette */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/85 via-gray-50/80 to-gray-50/85" />
        
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-montserrat mt-6 mb-6 leading-tight text-gray-800 drop-shadow-sm">
            Selamat Datang di Kanal Laporan <br className="hidden md:inline" />
            Masyarakat Kota Batam
          </h1>
          
          {/* Tampilkan pesan khusus jika user sudah login */}
          {isAuthenticated && user && (
            <p className="text-xl text-green-600 font-semibold mb-4 drop-shadow-sm">
              Halo, {user.name}! 👋
            </p>
          )}
          
          <p className="text-lg sm:text-xl text-montserrat mb-8 text-gray-700 drop-shadow-sm">
            Ayo Jadikan Batam Kota Responsif, Mulai dari Laporanmu!
          </p>
          
          <div className="flex justify-center space-x-4 mb-8">
            <button
              type="button"
              onClick={handleLaporInClick}
              className="px-8 py-3 border border-slate-600 text-futura font-semibold rounded-md hover:bg-[#FCBD69ff] hover:border-slate-700 transition-colors duration-150 ease-in-out bg-white/90 backdrop-blur-sm shadow-lg"
            >
              {isAuthenticated ? 'Buat Laporan' : 'Lapor-in'}
            </button>
            <button
              type="button"
              className="px-8 py-3 border border-slate-600 text-futura font-semibold rounded-md hover:bg-[#FCBD69ff] hover:border-slate-700 transition-colors duration-150 ease-in-out bg-white/90 backdrop-blur-sm shadow-lg"
            >
              Panduan
            </button>
          </div>
          
          <p className="text-md text-montserrat max-w-2xl mx-auto leading-relaxed text-gray-700 drop-shadow-sm">
            <b>Lapor-in</b> hadir sebagai jembatan komunikasi yang efektif, memastikan
            setiap suara warga didengar dan menjadi dasar untuk solusi nyata demi
            kemajuan Batam.
          </p>
        </div>
      </section>

      {/* Report Modal */}
      <ReportModal 
        isOpen={showReportModal} 
        onClose={handleCloseReportModal} 
      />
    </>
  );
};

export default NewHeroSection;