// Tambahkan import UserContext
import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaCamera, FaImage, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const CreateReportPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [userLocation, setUserLocation] = useState(null);
  const [reportData, setReportData] = useState({
    description: '',
    category: '',
    location: '',
    coordinates: null
  });
  
  // Add the missing hooks HERE
  const [searchCategory, setSearchCategory] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  // Tambahkan state untuk error handling
  const [descriptionError, setDescriptionError] = useState('');
  
  // Add the categories array inside the component
  const allCategories = [
    { value: 'pohon', label: 'Pohon' },
    { value: 'jalan', label: 'Jalan' },
    { value: 'parkir-liar', label: 'Parkir Liar' },
    { value: 'sampah', label: 'Sampah' },
    { value: 'administrasi-terkait-penanggulangan-kebakaran-dan-penyelamatan', label: 'Administrasi Terkait Penanggulangan Kebakaran dan Penyelamatan' },
    { value: 'ambulans-gawat-darurat', label: 'Ambulans Gawat Darurat' },
    { value: 'arus-lalu-lintas', label: 'Arus Lalu Lintas' },
    { value: 'bahan-bakar-gas', label: 'Bahan Bakar Gas' },
    { value: 'bahan-bakar-minyak', label: 'Bahan Bakar Minyak' },
    { value: 'banjir', label: 'Banjir' },
    { value: 'bantuan-pendidikan', label: 'Bantuan Pendidikan' },
    { value: 'bantuan-sosial', label: 'Bantuan Sosial' },
    { value: 'batas-wilayah', label: 'Batas Wilayah' },
    { value: 'bpjs', label: 'BPJS' },
    { value: 'demam-berdarah-dengue', label: 'Demam Berdarah Dengue' },
    { value: 'fasilitas-kerjasama-kolaborasi-pemda-dki', label: 'Fasilitas Kerjasama/Kolaborasi Pemda DKI' },
    { value: 'fasilitas-kesehatan-milik-pusat-swasta', label: 'Fasilitas Kesehatan Milik Pusat/Swasta' },
    { value: 'fasilitas-olahraga', label: 'Fasilitas Olahraga' },
    { value: 'fasilitas-pendidikan-milik-pemerintah-pusat-swasta', label: 'Fasilitas Pendidikan Milik Pemerintah Pusat/Swasta' },
    { value: 'fasilitas-sosial-fasilitas-umum', label: 'Fasilitas Sosial/Fasilitas Umum' },
    { value: 'gangguan-ketenteraman-dan-ketertiban', label: 'Gangguan Ketenteraman dan Ketertiban' },
    { value: 'gedung-sekolah', label: 'Gedung Sekolah' },
    { value: 'hubungan-pekerja-pengusaha', label: 'Hubungan Pekerja-Pengusaha' },
    { value: 'imunisasi', label: 'Imunisasi' },
    { value: 'industri-kecil-dan-menengah', label: 'Industri Kecil dan Menengah' },
    { value: 'internal-dinas-pariwisata-dan-kebudayaan', label: 'Internal Dinas Pariwisata dan Kebudayaan' },
    { value: 'jak-wifi', label: 'Jak Wifi' },
    { value: 'jaringan-air-bersih', label: 'Jaringan Air Bersih' },
    { value: 'jaringan-komunikasi', label: 'Jaringan Komunikasi' },
    { value: 'jaringan-listrik-1', label: 'Jaringan Listrik 1' },
    { value: 'jembatan-penyeberangan-orang-jpo-dan-atau-halte', label: 'Jembatan Penyeberangan Orang (JPO) dan/atau Halte' },
    { value: 'kartu-jakarta-pintar', label: 'Kartu Jakarta Pintar' },
    { value: 'kartu-jakarta-sehat-kjs', label: 'Kartu Jakarta Sehat (KJS)' },
    { value: 'kartu-keluarga', label: 'Kartu Keluarga' },
    { value: 'kdm-dan-iklan-rokok', label: 'KDM dan Iklan Rokok' },
    { value: 'kearsipan', label: 'Kearsipan' },
    { value: 'kegiatan-seni-dan-budaya', label: 'Kegiatan Seni dan Budaya' },
    { value: 'keluarga-berencana', label: 'Keluarga Berencana' },
    { value: 'keluhan-galian-sisa-proyek', label: 'Keluhan Galian/Sisa Proyek' },
    { value: 'kepemudaan', label: 'Kepemudaan' },
    { value: 'komunikasi-pemerintah', label: 'Komunikasi Pemerintah' },
    { value: 'konflik-sosial', label: 'Konflik Sosial' },
    { value: 'koperasi', label: 'Koperasi' },
    { value: 'ktp-elektronik-ktp-el', label: 'KTP Elektronik (KTP-El)' },
    { value: 'kurikulum-dan-kegiatan-sekolah', label: 'Kurikulum dan Kegiatan Sekolah' },
    { value: 'layanan-administrasi-kependudukan-orang-asing', label: 'Layanan Administrasi Kependudukan Orang Asing' },
    { value: 'lembaga-kemasyarakatan', label: 'Lembaga Kemasyarakatan' },
    { value: 'lokasi-binaan-dan-lokasi-sementara', label: 'Lokasi Binaan dan Lokasi Sementara' },
    { value: 'minimarket', label: 'Minimarket' },
    { value: 'orang-hilang', label: 'Orang Hilang' },
    { value: 'pajak-bumi-dan-bangunan', label: 'Pajak Bumi dan Bangunan' },
    { value: 'pekerja-penanganan-prasarana-dan-sarana-umum-kelurahan', label: 'Pekerja Penanganan Prasarana dan Sarana Umum Kelurahan' },
    { value: 'pelatihan-kerja-dan-produktivitas-tenaga-kerja', label: 'Pelatihan Kerja dan Produktivitas Tenaga Kerja' },
    { value: 'pelayanan-perhubungan', label: 'Pelayanan Perhubungan' },
    { value: 'pembebasan-lahan', label: 'Pembebasan Lahan' },
    { value: 'pemberdayaan-perempuan', label: 'Pemberdayaan Perempuan' },
    { value: 'penanganan-kebakaran', label: 'Penanganan Kebakaran' },
    { value: 'penataan-dan-pengembangan-wilayah', label: 'Penataan dan Pengembangan Wilayah' },
    { value: 'penataan-permukiman-kampung-deret-bedah-rumah-dll', label: 'Penataan Permukiman (Kampung Deret, Bedah Rumah, DLL)' },
    { value: 'pencemaran-lingkungan', label: 'Pencemaran Lingkungan' },
    { value: 'pendidikan-anak-usia-dini', label: 'Pendidikan Anak Usia Dini' },
    { value: 'pengolahan-ikan', label: 'Pengolahan Ikan' },
    { value: 'penyakit-masyarakat', label: 'Penyakit Masyarakat' },
    { value: 'penyandang-masalah-kesejahteraan-sosial-pmks', label: 'Penyandang Masalah Kesejahteraan Sosial (PMKS)' },
    { value: 'penyelamatan', label: 'Penyelamatan' },
    { value: 'perdagangan', label: 'Perdagangan' },
    { value: 'perizinan-ketenagakerjaan-dan-olahraga', label: 'Perizinan Ketenagakerjaan dan Olahraga' },
    { value: 'perpustakaan', label: 'Perpustakaan' },
    { value: 'pkl-liar', label: 'PKL Liar' },
    { value: 'posyandu', label: 'Posyandu' },
    { value: 'ppdb', label: 'PPDB' },
    { value: 'prasarana-dan-sarana-penanggulangan-kebakaran', label: 'Prasarana dan Sarana Penanggulangan Kebakaran' },
    { value: 'pungutan-liar', label: 'Pungutan Liar' },
    { value: 'puskesmas', label: 'Puskesmas' },
    { value: 'reklame', label: 'Reklame' },
    { value: 'rsud', label: 'RSUD' },
    { value: 'ruang-publik-terpadu-ramah-anak-rptra', label: 'Ruang Publik Terpadu Ramah Anak (RPTRA)' },
    { value: 'rumah-potong-hewan', label: 'Rumah Potong Hewan' },
    { value: 'rumah-susun-hunian-vertikal', label: 'Rumah Susun / Hunian Vertikal' },
    { value: 'rupabumi', label: 'Rupabumi' },
    { value: 'saluran-air-kali-sungai', label: 'Saluran Air, Kali/Sungai' },
    { value: 'sanitasi-dan-keamanan-pangan', label: 'Sanitasi dan Keamanan Pangan' },
    { value: 'satwa-liar', label: 'Satwa Liar' },
    { value: 'sembilan-bahan-pokok', label: 'Sembilan Bahan Pokok' },
    { value: 'sertifikasi-guru', label: 'Sertifikasi Guru' },
    { value: 'sertifikat-atau-dokumen-kepemilikan', label: 'Sertifikat atau Dokumen Kepemilikan' },
    { value: 'sertifikat-laik-fungsi', label: 'Sertifikat Laik Fungsi' },
    { value: 'statistik-daerah', label: 'Statistik Daerah' },
    { value: 'sumur-resapan', label: 'Sumur Resapan' },
    { value: 'taman', label: 'Taman' },
    { value: 'taman-pemakaman-umum', label: 'Taman Pemakaman Umum' },
    { value: 'tata-ruang-dan-bangunan', label: 'Tata Ruang dan Bangunan' },
    { value: 'tempat-hiburan', label: 'Tempat Hiburan' },
    { value: 'tempat-pelelangan-ikan', label: 'Tempat Pelelangan Ikan' },
    { value: 'tempat-wisata', label: 'Tempat Wisata' },
    { value: 'tenaga-kependidikan', label: 'Tenaga Kependidikan' },
    { value: 'tindakan-asusila', label: 'Tindakan Asusila' },
    { value: 'transmigrasi', label: 'Transmigrasi' },
    { value: 'transportasi-publik', label: 'Transportasi Publik' },
    { value: 'trotoar', label: 'Trotoar' },
    { value: 'tutup-saluran', label: 'Tutup Saluran' },
    { value: 'umkm', label: 'UMKM' }
  ];
  
  // Add the filtered categories computation
  const filteredCategories = allCategories.filter(category =>
    category.label.toLowerCase().includes(searchCategory.toLowerCase())
  );
  
  // Add the category selection handler
  const handleCategorySelect = (categoryValue, categoryLabel) => {
    setReportData(prev => ({ ...prev, category: categoryValue }));
    setSearchCategory(categoryLabel);
    setShowCategoryDropdown(false);
  };

  useEffect(() => {
    // Get user location from localStorage
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      const coordinates = JSON.parse(savedLocation);
      setUserLocation(coordinates);
      setReportData(prev => ({
        ...prev,
        coordinates
      }));
      
      // Optionally, get address from coordinates using reverse geocoding
      reverseGeocode(coordinates.latitude, coordinates.longitude);
    } else {
      // If no location found, redirect back to home
      alert('Lokasi tidak ditemukan. Silakan aktifkan lokasi terlebih dahulu.');
      navigate('/');
    }
  }, [navigate, isAuthenticated]);

  const reverseGeocode = async (lat, lng) => {
    try {
      // Using a free geocoding service (you can replace with your preferred service)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`
      );
      const data = await response.json();
      
      if (data.locality || data.city) {
        const address = `${data.locality || data.city}, ${data.principalSubdivision || ''}, ${data.countryName || ''}`;
        setReportData(prev => ({
          ...prev,
          location: address
        }));
      }
    } catch (error) {
      console.error('Error getting address:', error);
      // Set default location if reverse geocoding fails
      setReportData(prev => ({
        ...prev,
        location: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`
      }));
    }
  };

  // Local validation constants
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_IMAGES = 3;

  // Enhanced local validation
  const validateImageLocally = (file) => {
    const errors = [];

    // File type check
    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push('Format tidak didukung. Gunakan JPG, PNG, atau WebP.');
    }

    // Size check
    if (file.size > MAX_SIZE) {
      errors.push('File terlalu besar. Maksimal 5MB.');
    }

    // Name validation - mengizinkan spasi
    if (!/^[a-zA-Z0-9._\s-]+\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
      errors.push('Nama file tidak valid.');
    }

    return errors;
  };

  // Local image content validation
  const validateImageContent = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        // Basic dimension checks
        if (img.width < 50 || img.height < 50) {
          resolve(false);
          return;
        }
        
        if (img.width > 4000 || img.height > 4000) {
          resolve(false);
          return;
        }

        resolve(true);
      };
      
      img.onerror = () => resolve(false);
      img.src = URL.createObjectURL(file);
    });
  };

  // Updated upload handler
  // Add function to convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };
  
  // Update handleImageUpload function
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    if (selectedImages.length + files.length > MAX_IMAGES) {
      alert(`Maksimal ${MAX_IMAGES} gambar.`);
      return;
    }
  
    const validImages = [];
    const errors = [];
  
    for (const file of files) {
      // Basic validation
      const validationErrors = validateImageLocally(file);
      if (validationErrors.length > 0) {
        errors.push(`${file.name}: ${validationErrors.join(', ')}`);
        continue;
      }
  
      // Content validation
      const isValid = await validateImageContent(file);
      if (!isValid) {
        errors.push(`${file.name}: Gambar tidak valid.`);
        continue;
      }
  
      try {
        // Convert to base64
        const base64 = await convertToBase64(file);
        
        validImages.push({
          file,
          preview: URL.createObjectURL(file),
          id: Date.now() + Math.random(),
          // Store base64 data for submission
          base64Data: {
            data: base64,
            contentType: file.type,
            filename: file.name,
            size: file.size
          }
        });
      } catch (error) {
        errors.push(`${file.name}: Gagal memproses gambar.`);
      }
    }
  
    if (errors.length > 0) {
      alert('File yang tidak valid:\n' + errors.join('\n'));
    }
  
    if (validImages.length > 0) {
      setSelectedImages(prev => [...prev, ...validImages]);
    }
  
    event.target.value = '';
  };
  
  // Update handleSubmit function
  const handleSubmitReport = async () => {
    // Validasi minimal 50 karakter untuk deskripsi
    if (reportData.description.length < 50) {
      setDescriptionError('Deskripsi minimal harus 50 karakter');
      alert('Deskripsi minimal harus 50 karakter.');
      return;
    }
    
    if (selectedImages.length === 0 || !reportData.category || !reportData.description) {
      alert('Harap lengkapi semua field dan tambahkan minimal 1 gambar.');
      return;
    }
    
    // Clear error jika validasi berhasil
    setDescriptionError('');
  
    try {
      console.log('🔄 Starting report submission...');
      
      // Cek autentikasi terlebih dahulu
      if (!isAuthenticated) {
        alert('Anda harus login terlebih dahulu.');
        navigate('/');
        return;
      }
  
      // Prepare images data for submission
      const imagesData = selectedImages.map(img => img.base64Data);
      
      // Prepare final report data
      const finalReportData = {
        description: reportData.description,
        category: reportData.category,
        location: reportData.location,
        coordinates: userLocation,
        images: imagesData
      };
  
      console.log('📊 Report data:', {
        description: reportData.description.substring(0, 50) + '...',
        category: reportData.category,
        location: reportData.location.substring(0, 50) + '...',
        coordinates: userLocation,
        imageCount: imagesData.length
      });
  
      // Get auth token 
      const authToken = localStorage.getItem('authToken');
      console.log('🔑 Auth token present:', !!authToken);
      console.log('📍 Endpoint:', 'http://localhost:5000/api/reports');
      
      // PERBAIKAN: Gunakan port 5000 untuk backend
      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(finalReportData)
      });
  
      console.log('📊 Response status:', response.status);
      console.log('📊 Response ok:', response.ok);
  
      if (response.status === 401) {
        alert('Sesi login telah berakhir. Silakan login kembali.');
        localStorage.removeItem('authToken');
        navigate('/');
        return;
      }
  
      const result = await response.json();
      console.log('📊 Response data:', result);
  
      if (result.success) {
        console.log('✅ Report submitted successfully');
        alert('Laporan berhasil dibuat!');
        // Clear location data from localStorage
        localStorage.removeItem('userLocation');
        navigate('/');
      } else {
        console.error('❌ Server error:', result);
        alert(result.message || 'Gagal membuat laporan.');
      }
    } catch (error) {
      console.error('❌ Network/Fetch error:', error);
      alert('Terjadi kesalahan saat mengirim laporan: ' + error.message);
    }
  };

  const removeImage = (imageId) => {
    setSelectedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleCameraCapture = () => {
    // Trigger camera input
    document.getElementById('camera-input').click();
  };

  const handleGallerySelect = () => {
    // Trigger file input
    document.getElementById('gallery-input').click();
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4 lg:px-8">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaArrowLeft className="text-gray-600 text-lg" />
            </button>
            <h1 className="text-lg lg:text-2xl font-semibold text-gray-800">
              Buat Laporan Baru
            </h1>
          </div>
          <span className="text-sm lg:text-base text-gray-500">
            Langkah {currentStep}/5
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column - Image Upload Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4 lg:mb-6">
                Tambahkan Foto Laporan
              </h2>
              
              {/* Selected Images Preview */}
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-4 lg:mb-6">
                  {selectedImages.map((image) => (
                    <div key={image.id} className="relative">
                      <img
                        src={image.preview}
                        alt="Preview"
                        className="w-full h-32 lg:h-40 object-cover rounded-lg border hover:shadow-md transition-shadow"
                      />
                      <button
                        onClick={() => removeImage(image.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 lg:p-2 hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <FaTimes className="text-xs lg:text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Options */}
              <div className="space-y-3 lg:space-y-4">
                <button
                  onClick={handleCameraCapture}
                  className="w-full flex items-center justify-center space-x-3 p-4 lg:p-6 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <FaCamera className="text-blue-500 text-xl lg:text-2xl" />
                  <span className="text-blue-600 font-medium text-base lg:text-lg">Ambil Foto</span>
                </button>
                
                <button
                  onClick={handleGallerySelect}
                  className="w-full flex items-center justify-center space-x-3 p-4 lg:p-6 border-2 border-dashed border-green-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
                >
                  <FaImage className="text-green-500 text-xl lg:text-2xl" />
                  <span className="text-green-600 font-medium text-base lg:text-lg">Pilih dari Galeri</span>
                </button>
              </div>

              {/* Hidden Inputs */}
              <input
                id="camera-input"
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <input
                id="gallery-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Location Info */}
            {userLocation && (
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-green-500 p-2 rounded-lg">
                    <FaMapMarkerAlt className="text-white text-lg" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-800">Lokasi Terdeteksi</h3>
                </div>
                <p className="text-green-700 text-sm">
                  Lat: {userLocation.latitude.toFixed(6)}, Lng: {userLocation.longitude.toFixed(6)}
                </p>
                <p className="text-green-600 text-xs mt-1">
                  Akurasi: ±{Math.round(userLocation.accuracy)} meter
                </p>
              </div>
            )}

            {/* Tips Section for Desktop */}
            <div className="hidden lg:block bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Tips Foto yang Baik</h3>
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Pastikan foto jelas dan tidak buram</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Ambil foto dari berbagai sudut</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Sertakan konteks lokasi sekitar</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Hindari foto yang mengandung informasi pribadi</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Report Form */}
          <div className="space-y-6">
            {/* Detail Laporan Form - BAGIAN YANG HILANG */}
            <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4 lg:mb-6">
                Detail Laporan
              </h3>
              
              <div className="space-y-4 lg:space-y-6">
                {/* Kategori */}
                <div>
                  <label className="block text-sm lg:text-base font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <div className="relative">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchCategory}
                        onChange={(e) => {
                          setSearchCategory(e.target.value);
                          setShowCategoryDropdown(true);
                        }}
                        onFocus={() => setShowCategoryDropdown(true)}
                        className="w-full p-4 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                        placeholder="Cari kategori laporan..."
                      />
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Dropdown kategori */}
                    {showCategoryDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredCategories.length > 0 ? (
                          filteredCategories.map((category) => (
                            <div
                              key={category.value}
                              onClick={() => handleCategorySelect(category.value, category.label)}
                              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <span className="text-gray-800">{category.label}</span>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-gray-500 text-center">
                            Kategori tidak ditemukan
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Tutup dropdown ketika klik di luar */}
                  {showCategoryDropdown && (
                    <div 
                      className="fixed inset-0 z-5" 
                      onClick={() => setShowCategoryDropdown(false)}
                    ></div>
                  )}
                </div>
                
                {/* Lokasi */}
                <div>
                  <label className="block text-sm lg:text-base font-medium text-gray-700 mb-2">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    value={reportData.location}
                    onChange={(e) => setReportData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full p-3 lg:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    placeholder="Lokasi akan terisi otomatis berdasarkan GPS"
                  />
                </div>
                
                {/* Deskripsi dengan Character Counter */}
                <div>
                  <label className="block text-sm lg:text-base font-medium text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <div className="relative">
                    <textarea
                      value={reportData.description}
                      onChange={(e) => {
                        setReportData(prev => ({ ...prev, description: e.target.value }));
                      }}
                      rows={6}
                      className="w-full p-3 lg:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base resize-none"
                      placeholder="Jelaskan detail masalah yang ingin dilaporkan (minimal 50 karakter)"
                    />
                    
                    {/* Character Counter */}
                    <div className="flex justify-between items-center mt-2">
                      <div className={`text-sm ${
                        reportData.description.length < 50 ? 'text-red-500' : 'text-green-600'
                      }`}>
                        {reportData.description.length < 50 && (
                          <span>Minimal 50 karakter diperlukan</span>
                        )}
                        {reportData.description.length >= 50 && (
                          <span>✓ Deskripsi memenuhi syarat</span>
                        )}
                      </div>
                      <div className={`text-sm font-medium ${
                        reportData.description.length < 50 ? 'text-red-500' : 'text-gray-600'
                      }`}>
                        {reportData.description.length}/50
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
              <button
                onClick={handleSubmitReport}
                disabled={selectedImages.length === 0 || !reportData.description || !reportData.category || reportData.description.length < 50}
                className="w-full bg-gradient-to-r from-[#1F2F49ff] via-[#CB7007ff] to-[#FCBD69ff] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 lg:py-5 px-6 rounded-lg transition-all duration-200 shadow-lg text-base lg:text-lg"
              >
                Kirim Laporan
              </button>
              
              <p className="text-xs lg:text-sm text-gray-500 text-center mt-4">
                Pastikan foto dan informasi yang Anda berikan akurat dan jelas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReportPage;
