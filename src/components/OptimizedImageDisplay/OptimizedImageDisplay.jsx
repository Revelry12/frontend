import React, { useState, useEffect, useRef } from 'react';

// Simple in-memory cache
const imageCache = new Map();

const OptimizedImageDisplay = ({ reportId, imageIndex, alt, className }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const cacheKey = `${reportId}-${imageIndex}`;
    
    // Check cache first
    if (imageCache.has(cacheKey)) {
      setImageUrl(imageCache.get(cacheKey));
      setLoading(false);
      return;
    }

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

        if (!mountedRef.current) return;

        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          
          // Cache the URL
          imageCache.set(cacheKey, url);
          
          setImageUrl(url);
        } else {
          setError('Gagal memuat gambar');
        }
      } catch (err) {
        if (mountedRef.current) {
          setError('Terjadi kesalahan saat memuat gambar');
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    if (reportId && imageIndex !== undefined) {
      fetchImage();
    }
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

// Cleanup function to clear cache when needed
export const clearImageCache = () => {
  imageCache.forEach((url) => {
    URL.revokeObjectURL(url);
  });
  imageCache.clear();
};

export default OptimizedImageDisplay;