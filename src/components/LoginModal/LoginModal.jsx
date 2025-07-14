import { useState } from 'react';
import ReactDOM from 'react-dom';
import { useUser } from '../../context/UserContext';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister, onSwitchToForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    if (!formData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Kata sandi harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Di dalam komponen LoginModal
  const { login } = useUser();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
  
      const data = await response.json();
  
      if (data.success) {
        setMessage('Login berhasil!');
        
        // Pastikan data user lengkap dengan role
        console.log('User data:', data.user); // Debug: cek apakah role ada
        
        // Use the UserContext login function
        const loginResult = await login(data.user);
        
        if (loginResult.success) {
          // Store token dengan key yang konsisten
          localStorage.setItem('authToken', data.token); // Ubah dari 'token' ke 'authToken'
          login(data.user);
          onClose();
          navigate('/create-report');
        }
        
        // Reset form
        setFormData({ email: '', password: '' });
        
        // Close modal
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setMessage(data.message || 'Terjadi kesalahan saat login');
      }
    } catch (error) {
      console.error('Login error:', error);
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
      {/* Kontainer Modal (kotak login) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-amber-600 w-full max-w-md p-8 sm:p-10 rounded-3xl shadow-2xl text-white"
      >
        <h2 className="text-3xl sm:text-2xl font-bold text-center mb-8">
          Masuk ke Lapor-in
          <p className="text-xs mt-3 sm:text-1xl font-semibold text-center mb-2">
            Selamat datang kembali! Silakan masuk ke akun Anda
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

          {/* Lupa Kata Sandi - DIPERBAIKI */}
          <div className="text-right mb-6">
            <button 
              type="button"
              onClick={onSwitchToForgotPassword}
              className="text-sm text-white/90 hover:underline cursor-pointer bg-transparent border-none"
            >
              Lupa Kata sandi
            </button>
          </div>

          {/* Tombol Masuk */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-800 hover:bg-slate-700 disabled:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
          >
            {isLoading ? 'Masuk...' : 'Masuk'}
          </button>
        </form>

        {/* Link Buat Akun */}
        <p className="text-center text-sm text-white/90 mt-8">
          Belum punya akun?{' '}
          <button 
            onClick={onSwitchToRegister}
            className="font-bold hover:underline cursor-pointer"
          >
            Buat akun
          </button>
        </p>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default LoginModal;
