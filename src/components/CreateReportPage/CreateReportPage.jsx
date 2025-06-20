import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaCamera, FaImage, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CreateReportPage = () => {
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [userLocation, setUserLocation] = useState(null);
  const [reportData, setReportData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    coordinates: null
  });

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
  }, [navigate]);

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
  // Renamed to handleSubmitReport to avoid duplicate declaration
  const handleSubmitReport = async () => {
    if (selectedImages.length === 0 || !reportData.title || !reportData.description) {
      alert('Harap lengkapi semua field dan tambahkan minimal 1 gambar.');
      return;
    }
  
    try {
      // Prepare images data for submission
      const imagesData = selectedImages.map(img => img.base64Data);
      
      // Prepare final report data
      const finalReportData = {
        title: reportData.title,
        description: reportData.description,
        category: reportData.category,
        location: reportData.location,
        coordinates: userLocation,
        images: imagesData
      };
  
      // Get auth token (assuming you have auth context)
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finalReportData)
      });
  
      const result = await response.json();
  
      if (result.success) {
        alert('Laporan berhasil dibuat!');
        // Clear location data from localStorage
        localStorage.removeItem('userLocation');
        navigate('/');
      } else {
        alert(result.message || 'Gagal membuat laporan.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Terjadi kesalahan saat mengirim laporan.');
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

  const handleSubmit = () => {
    // Include coordinates in the report data
    const finalReportData = {
      ...reportData,
      coordinates: userLocation,
      images: selectedImages
    };
    
    // Handle form submission
    console.log('Report submitted:', finalReportData);
    alert('Laporan berhasil dibuat!');
    
    // Clear location data from localStorage
    localStorage.removeItem('userLocation');
    
    navigate('/');
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
            <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4 lg:mb-6">
                Detail Laporan
              </h3>
              
              <div className="space-y-4 lg:space-y-6">
                <div>
                  <label className="block text-sm lg:text-base font-medium text-gray-700 mb-2">
                    Judul Laporan
                  </label>
                  <input
                    type="text"
                    value={reportData.title}
                    onChange={(e) => setReportData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 lg:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    placeholder="Masukkan judul laporan"
                  />
                </div>
                
                <div>
                  <label className="block text-sm lg:text-base font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    value={reportData.category}
                    onChange={(e) => setReportData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-3 lg:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  >
                    <option value="">Pilih kategori</option>
                    <option value="infrastruktur">Infrastruktur</option>
                    <option value="kebersihan">Kebersihan</option>
                    <option value="keamanan">Keamanan</option>
                    <option value="pelayanan">Pelayanan Publik</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>
                
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
                
                <div>
                  <label className="block text-sm lg:text-base font-medium text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={reportData.description}
                    onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
                    rows={6}
                    className="w-full p-3 lg:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base resize-none"
                    placeholder="Jelaskan detail masalah yang ingin dilaporkan"
                  />
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
              <button
                onClick={handleSubmit}
                disabled={selectedImages.length === 0 || !reportData.title || !reportData.description}
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