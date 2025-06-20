import React, { useState, useEffect } from 'react';
import { FaEye, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/reports/my-reports', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      if (result.success) {
        setReports(result.data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewReport = async (reportId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      if (result.success) {
        setSelectedReport(result.data);
      }
    } catch (error) {
      console.error('Error fetching report details:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Laporan Saya</h1>
      
      <div className="grid gap-4">
        {reports.map((report) => (
          <div key={report._id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{report.title}</h3>
                <p className="text-gray-600 text-sm">{report.category}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                {report.status}
              </span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <FaMapMarkerAlt className="mr-2" />
              <span>{report.location.address}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <FaCalendar className="mr-2" />
              <span>{new Date(report.createdAt).toLocaleDateString('id-ID')}</span>
            </div>
            
            <button
              onClick={() => viewReport(report._id)}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <FaEye className="mr-2" />
              Lihat Detail
            </button>
          </div>
        ))}
      </div>

      {/* Modal for viewing report details */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{selectedReport.title}</h2>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Deskripsi</h3>
                  <p className="text-gray-700 mb-4">{selectedReport.description}</p>
                  
                  <h3 className="font-semibold mb-2">Kategori</h3>
                  <p className="text-gray-700 mb-4">{selectedReport.category}</p>
                  
                  <h3 className="font-semibold mb-2">Lokasi</h3>
                  <p className="text-gray-700">{selectedReport.location.address}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Gambar</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedReport.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.data}
                        alt={`Report image ${index + 1}`}
                        className="w-full h-32 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReports;