// ... existing code ...
const logout = () => {
  setUser(null);
  localStorage.removeItem('authToken'); // Ubah dari 'token' ke 'authToken'
};

// Di useEffect untuk check auth status
useEffect(() => {
  const token = localStorage.getItem('authToken'); // Ubah dari 'token' ke 'authToken'
  if (token) {
    // ... existing code ...
  }
  setIsLoading(false);
}, []);
// ... existing code ...