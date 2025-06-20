import { FaTimes, FaCheck, FaMapMarkerAlt, FaLock, FaUsers, FaLocationArrow } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ReportModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState({
    tindakLanjut: false,
    lokasiOtomatis: false,
    laporanPrivat: false,
    laporanPublik: false
  });
  const [agreement, setAgreement] = useState(false);
  const [locationStatus, setLocationStatus] = useState({
    isChecking: false,
    isEnabled: false,
    error: null,
    coordinates: null
  });

  const handleOptionChange = (option) => {
    setSelectedOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const checkLocationPermission = async () => {
    setLocationStatus(prev => ({ ...prev, isChecking: true, error: null }));

    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        throw new Error('Geolocation tidak didukung oleh browser Anda');
      }

      // Request location permission
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 menit
          }
        );
      });

      const coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      setLocationStatus({
        isChecking: false,
        isEnabled: true,
        error: null,
        coordinates
      });

      // Store coordinates in localStorage for use in CreateReportPage
      localStorage.setItem('userLocation', JSON.stringify(coordinates));

      return true;
    } catch (error) {
      let errorMessage = 'Gagal mengakses lokasi';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Akses lokasi ditolak. Silakan aktifkan lokasi di pengaturan browser.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Informasi lokasi tidak tersedia.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Waktu permintaan lokasi habis. Silakan coba lagi.';
          break;
        default:
          errorMessage = error.message || 'Terjadi kesalahan saat mengakses lokasi.';
      }

      setLocationStatus({
        isChecking: false,
        isEnabled: false,
        error: errorMessage,
        coordinates: null
      });

      return false;
    }
  };

  const handleSubmit = async () => {
    if (!agreement) {
      alert('Anda harus menyetujui syarat dan ketentuan');
      return;
    }

    // Check if location is already enabled
    if (!locationStatus.isEnabled) {
      const locationEnabled = await checkLocationPermission();
      if (!locationEnabled) {
        return; // Don't proceed if location is not enabled
      }
    }

    // Close modal and navigate to create report page
    onClose();
    navigate('/create-report');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header dengan gradient yang konsisten */}
        <div className="bg-gradient-to-r from-[#1F2F49ff] via-[#CB7007ff] to-[#FCBD69ff] p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-2xl font-bold text-white">
              Ingin Membuat Laporan?
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/10 rounded-full"
            >
              <FaTimes className="text-lg sm:text-xl" />
            </button>
          </div>
          <p className="text-white/90 text-sm sm:text-base mt-2">
            Baca panduan berikut sebelum membuat laporan Anda
          </p>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8">
          {/* Location Permission Section */}
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-yellow-50 rounded-lg sm:rounded-xl border border-yellow-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-yellow-500 p-2 rounded-lg">
                <FaLocationArrow className="text-white text-sm sm:text-lg" />
              </div>
              <h3 className="font-bold text-slate-800 text-base sm:text-lg">
                Akses Lokasi Diperlukan
              </h3>
            </div>
            
            {!locationStatus.isEnabled && (
              <p className="text-slate-600 mb-4 text-sm sm:text-base">
                Untuk melanjutkan pembuatan laporan, Anda perlu mengaktifkan akses lokasi.
              </p>
            )}

            {locationStatus.isEnabled && (
              <div className="flex items-center space-x-2 mb-2">
                <FaCheck className="text-green-500" />
                <span className="text-green-700 font-medium text-sm sm:text-base">
                  Lokasi berhasil diakses
                </span>
              </div>
            )}

            {locationStatus.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-700 text-sm sm:text-base">
                  {locationStatus.error}
                </p>
              </div>
            )}

            {!locationStatus.isEnabled && (
              <button
                onClick={checkLocationPermission}
                disabled={locationStatus.isChecking}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
              >
                {locationStatus.isChecking ? 'Mengakses Lokasi...' : 'Aktifkan Lokasi'}
              </button>
            )}
          </div>

          {/* Options dalam grid responsive - 1 kolom di mobile, 2 kolom di desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Tindak Lanjut Laporan */}
            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-blue-100 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <FaCheck className="text-white text-sm sm:text-lg" />
                </div>
                <h3 className="font-bold text-slate-800 text-base sm:text-lg">
                  Tindak Lanjut Laporan
                </h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Hanya laporan terkait <strong>permasalahan di Kota Batam</strong> saja yang akan ditindaklanjuti oleh pemerintah daerah.
              </p>
            </div>

            {/* Lokasi Laporan */}
            <div className="bg-orange-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-orange-100 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                <div className="bg-orange-500 p-2 rounded-lg">
                  <FaMapMarkerAlt className="text-white text-sm sm:text-lg" />
                </div>
                <h3 className="font-bold text-slate-800 text-base sm:text-lg">
                  Lokasi Laporan Otomatis
                </h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Lokasi laporan Anda akan <strong>diambil secara otomatis</strong> berdasarkan data GPS yang tersimpan saat pengambilan foto.
              </p>
            </div>

            {/* Laporan Privat/Rahasia */}
            <div className="bg-red-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-red-100 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                <div className="bg-red-500 p-2 rounded-lg">
                  <FaLock className="text-white text-sm sm:text-lg" />
                </div>
                <h3 className="font-bold text-slate-800 text-base sm:text-lg">
                  Laporan Privat/Rahasia
                </h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Laporan Anda akan otomatis bersifat privat/rahasia. Pilih jenis ini jika Anda ingin laporan hanya terlihat oleh Anda dan petugas yang berwenang.
              </p>
            </div>

            {/* Laporan Publik */}
            <div className="bg-green-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-green-100 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                <div className="bg-green-500 p-2 rounded-lg">
                  <FaUsers className="text-white text-sm sm:text-lg" />
                </div>
                <h3 className="font-bold text-slate-800 text-base sm:text-lg">
                  Laporan Publik
                </h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Ubah jenis laporan menjadi <strong>Publik</strong> pada halaman <strong>Tinjau Laporan</strong> jika Anda ingin laporan terlihat oleh pengguna Lapor-in lainnya.
              </p>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start space-x-3 sm:space-x-4 mt-6 sm:mt-8 p-4 sm:p-6 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-100">
            <input
              type="checkbox"
              id="agreement"
              checked={agreement}
              onChange={(e) => setAgreement(e.target.checked)}
              className="mt-1 h-4 w-4 sm:h-5 sm:w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="agreement" className="text-slate-700 font-medium leading-relaxed text-sm sm:text-base">
              Saya memahami dan menyetujui ketentuan di atas.
            </label>
          </div>

          {/* Submit Button dengan style yang konsisten */}
          <button
            onClick={handleSubmit}
            disabled={!agreement || (!locationStatus.isEnabled && !locationStatus.isChecking)}
            className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-[#1F2F49ff] via-[#CB7007ff] to-[#FCBD69ff] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg text-base sm:text-lg"
          >
            {locationStatus.isChecking ? 'Mengakses Lokasi...' : 'Lanjut ke Pembuatan Laporan'}
          </button>
          
          {/* Info tambahan */}
          <p className="text-slate-500 text-center mt-4 sm:mt-6 text-xs sm:text-sm">
            Dengan membuat laporan, Anda membantu mewujudkan Kota Batam yang lebih baik
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;