import React, { useState, useEffect } from 'react';
import { FaEye, FaImage, FaUser, FaCalendar, FaMapMarkerAlt, FaChevronDown, FaChevronUp, FaCheck, FaFileAlt } from 'react-icons/fa';
import ImageDisplay from '../ImageDisplay/ImageDisplay';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(new Set());

  useEffect(() => {
    fetchAllReports();
  }, []);

  const fetchAllReports = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/reports/admin/all-reports', {
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

  const viewReportDetail = async (reportId) => {
    try {
      console.log('Fetching report detail for ID:', reportId);
      const token = localStorage.getItem('authToken');
      
      // Gunakan endpoint admin yang benar
      const response = await fetch(`http://localhost:5000/api/admin/reports/${reportId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.success) {
        setSelectedReport(result.data);
      } else {
        console.error('API Error:', result.message);
        alert('Gagal memuat detail laporan: ' + result.message);
      }
    } catch (error) {
      console.error('Error fetching report details:', error);
      alert('Terjadi kesalahan saat memuat detail laporan');
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

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      setUpdatingStatus(prev => new Set([...prev, reportId]));
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/admin/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const result = await response.json();
      if (result.success) {
        // Update local state
        setReports(prevReports => 
          prevReports.map(report => 
            report._id === reportId 
              ? { ...report, status: newStatus }
              : report
          )
        );
      } else {
        alert('Gagal mengupdate status: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating report status:', error);
      alert('Terjadi kesalahan saat mengupdate status');
    } finally {
      setUpdatingStatus(prev => {
        const newSet = new Set(prev);
        newSet.delete(reportId);
        return newSet;
      });
    }
  };

  const handleStatusChange = (reportId, isChecked) => {
    const newStatus = isChecked ? 'resolved' : 'pending';
    updateReportStatus(reportId, newStatus);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Kelola semua laporan dan lihat detail laporan pengguna</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-blue-600">{reports.length}</div>
          <div className="text-gray-600">Total Laporan</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-600">
            {reports.filter(r => r.status === 'resolved').length}
          </div>
          <div className="text-gray-600">Selesai</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-yellow-600">
            {reports.filter(r => r.status === 'pending').length}
          </div>
          <div className="text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-purple-600">
            {reports.reduce((total, report) => total + report.imageCount, 0)}
          </div>
          <div className="text-gray-600">Total Gambar</div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Semua Laporan</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Laporan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detail Laporan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pengguna
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={report.status === 'resolved'}
                        onChange={(e) => handleStatusChange(report._id, e.target.checked)}
                        disabled={updatingStatus.has(report._id)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded disabled:opacity-50"
                      />
                      {updatingStatus.has(report._id) && (
                        <div className="ml-2 text-xs text-gray-500">Updating...</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{report.category}</div>
                      <div className="text-sm text-gray-500">Laporan {report.category}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => viewReportDetail(report._id)}
                      className="text-blue-600 hover:text-blue-900 flex items-center text-sm font-medium"
                    >
                      <FaEye className="mr-1" />
                      Lihat Detail
                    </button>
                    <div className="text-xs text-gray-500 mt-1">
                      {report.description?.length || 0} karakter • {report.imageCount} gambar
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaUser className="mr-2 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{report.user?.name}</div>
                        <div className="text-sm text-gray-500">{report.user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <FaCalendar className="mr-2" />
                      {new Date(report.createdAt).toLocaleDateString('id-ID')}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">Detail Laporan - {selectedReport.category}</h2>
                  <p className="text-gray-600">Informasi lengkap laporan ini</p>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Deskripsi</h3>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedReport.description}</p>
                    <div className="mt-3 text-sm text-gray-500">
                      {selectedReport.description?.length || 0} karakter
                    </div>
                  </div>
                  
                  <h3 className="font-semibold mb-2">Kategori</h3>
                  <p className="text-gray-700 mb-4">{selectedReport.category}</p>
                  
                  <h3 className="font-semibold mb-2">Lokasi</h3>
                  <div className="flex items-center text-gray-700 mb-4">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{selectedReport.location?.address}</span>
                  </div>
                  
                  <h3 className="font-semibold mb-2">Status</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}>
                    {selectedReport.status}
                  </span>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Gambar ({selectedReport.images?.length || 0})</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedReport.images?.map((image, index) => (
                      <ImageDisplay
                        key={index}
                        reportId={selectedReport._id}
                        imageIndex={index}
                        alt={`Report image ${index + 1}`}
                        className="w-full h-32 object-cover rounded border"
                      />
                    )) || <p className="text-gray-500">Tidak ada gambar</p>}
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

export default AdminDashboard;