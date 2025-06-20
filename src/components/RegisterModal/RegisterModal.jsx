import { useState } from 'react';
import ReactDOM from 'react-dom';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Jika modal tidak terbuka, jangan render apapun
  if (!isOpen) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama lengkap harus diisi';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nama minimal 2 karakter';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Kata sandi harus diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Kata sandi minimal 6 karakter';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi kata sandi harus diisi';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Kata sandi tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Akun berhasil dibuat! Silakan login.');
        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        // Switch to login after 2 seconds
        setTimeout(() => {
          onSwitchToLogin();
        }, 2000);
      } else {
        setMessage(data.message || 'Terjadi kesalahan saat mendaftar');
      }
    } catch (error) {
      console.error('Register error:', error);
      setMessage('Terjadi kesalahan koneksi. Pastikan server backend berjalan.');
    } finally {
      setIsLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
    >
      {/* Kontainer Modal (kotak register) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-amber-600 w-full max-w-md p-8 sm:p-10 rounded-3xl shadow-2xl text-white relative"
      >
        <h2 className="text-3xl sm:text-2xl font-bold text-center mb-8">
          Daftar di Lapor-in
          <p className="text-xs mt-3 sm:text-1xl font-semibold text-center mb-2">
            Buat akun baru untuk mulai membuat laporan
          </p>
        </h2>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-center text-sm ${
            message.includes('berhasil') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Nama Lengkap */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-200 text-gray-800 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Masukkan nama lengkap"
            />
            {errors.name && (
              <p className="text-red-200 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-200 text-gray-800 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="contoh@email.com"
            />
            {errors.email && (
              <p className="text-red-200 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Kata Sandi */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Kata Sandi
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-200 text-gray-800 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-200 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Konfirmasi Kata Sandi */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Konfirmasi Kata Sandi
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-200 text-gray-800 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-red-200 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Tombol Daftar */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-800 hover:bg-slate-700 disabled:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
          >
            {isLoading ? 'Mendaftar...' : 'Daftar'}
          </button>
        </form>

        {/* Link Login - Dipindah ke dalam modal */}
        <p className="text-center text-sm text-white/90 mt-6">
          Sudah punya akun?{' '}
          <button 
            onClick={onSwitchToLogin}
            className="font-bold hover:underline cursor-pointer"
          >
            Masuk
          </button>
        </p>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default RegisterModal;