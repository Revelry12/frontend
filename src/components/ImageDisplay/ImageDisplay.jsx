import React, { useState, useEffect } from 'react';

const ImageDisplay = ({ reportId, imageIndex, alt, className }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(
          `http://localhost:5000/api/reports/${reportId}/images/${imageIndex}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
        } else {
          setError('Gagal memuat gambar');
        }
      } catch (err) {
        setError('Terjadi kesalahan saat memuat gambar');
      } finally {
        setLoading(false);
      }
    };

    if (reportId && imageIndex !== undefined) {
      fetchImage();
    }

    // Cleanup function to revoke object URL
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [reportId, imageIndex]);

  if (loading) {
    return (
      <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>
        <span className="text-gray-500 text-sm">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <span className="text-red-500 text-sm">{error}</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={() => setError('Gagal memuat gambar')}
    />
  );
};

export default ImageDisplay;