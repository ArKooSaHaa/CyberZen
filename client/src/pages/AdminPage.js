import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [lastReportCount, setLastReportCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportDetails, setShowReportDetails] = useState(false);
  const reportsPerPage = 10;

  // Fetch reports from backend
  const fetchReports = async () => {
    try {
      setError(null);
      const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
      const response = await axios.get(`${API_BASE_URL}/reports/all`);
      const newReports = response.data;
      
      // Check for new reports
      if (lastReportCount > 0 && newReports.length > lastReportCount) {
        const newCount = newReports.length - lastReportCount;
        // Show notification
        if (Notification.permission === 'granted') {
          const notification = new Notification('New Report Received', {
            body: `${newCount} new report${newCount > 1 ? 's' : ''} received`,
            icon: '/favicon.ico'
          });
        }
      }
      
      setLastReportCount(newReports.length);
      setReports(newReports);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to fetch reports. Please ensure the server is running.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    fetchReports();
    const intervalId = setInterval(fetchReports, 5000); // Refresh every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  // Filter and search reports
  // Effect #1: Update filteredReports when reports or filters change
useEffect(() => {
  let filtered = reports.filter(report => {
    const matchesSearch =
      (report.trackNumber && report.trackNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (report.incidentType && report.incidentType.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesType = typeFilter === 'all' || report.incidentType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  setFilteredReports(filtered);
}, [reports, searchTerm, statusFilter, typeFilter]);

// Effect #2: Reset to page 1 only when search or filters change
useEffect(() => {
  setCurrentPage(1);
}, [searchTerm, statusFilter, typeFilter]);


  // Pagination
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const handleStatusUpdate = async (trackNumber, newStatus) => {
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
      await axios.put(`${API_BASE_URL}/reports/${trackNumber}/status`, { status: newStatus });
      fetchReports(); // Refetch reports to get the updated data
    } catch (error) {
      console.error('Error updating report status:', error);
    }
  };

  const handleLogout = () => {
    navigate('/signin');
  };

  const handleReportClick = (report) => {
    setSelectedReport(report);
    setShowReportDetails(true);
  };

  const closeReportDetails = () => {
    setShowReportDetails(false);
    setSelectedReport(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'received': return '#00ffff';
      case 'processing': return '#ff6b35';
      case 'completed': return '#00ff88';
      default: return '#ffffff';
    }
  };

  return (
    <div className="admin-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading reports...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchReports}>Retry</button>
        </div>
      )}

      {/* Header */}
      <div className="admin-header">
        <div className="header-content">
          <h1 className="admin-title">CYBERZEN ADMIN DASHBOARD</h1>
          <div className="admin-controls">
            <button className="chat-btn" onClick={() => navigate('/admin/chat')}>
              <span className="chat-icon">💬</span>
              CHAT
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              <span className="logout-icon">🚪</span>
              LOGOUT
            </button>
          </div>
        </div>
        <div className="header-glow"></div>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by Track Number or Incident Type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="filter-controls">
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="received">Received</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
          </select>
          
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="Phishing">Phishing</option>
            <option value="Malware">Malware</option>
            <option value="Data Breach">Data Breach</option>
            <option value="Ransomware">Ransomware</option>
            <option value="Social Engineering">Social Engineering</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="reports-section">
        <div className="reports-header">
          <h2 className="section-title">INCIDENT REPORTS</h2>
          <span className="report-count">Total: {filteredReports.length}</span>
        </div>
        
        <div className="reports-table-container">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Track Number</th>
                <th>Incident Type</th>
                <th>Status</th>
                <th>Date Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReports.map((report) => (
                <tr key={report.trackNumber} className="report-row" onClick={() => handleReportClick(report)}>
                  <td className="report-id">{report.trackNumber}</td>
                  <td className="incident-type">{report.incidentType}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(report.status) }}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="date-submitted">{new Date(report.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <select
                      value={report.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(report.trackNumber, e.target.value);
                      }}
                      className="status-select"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="received">Received</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="page-btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            
            <button 
              className="page-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Report Details Modal */}
      {showReportDetails && selectedReport && (
        <div className="modal-overlay" onClick={closeReportDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Report Details - {selectedReport.trackNumber}</h3>
              <button className="close-btn" onClick={closeReportDetails}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Incident Type:</span>
                <span className="detail-value">{selectedReport.incidentType}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span 
                  className="detail-value status-badge"
                  style={{ backgroundColor: getStatusColor(selectedReport.status) }}
                >
                  {selectedReport.status}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date Submitted:</span>
                <span className="detail-value">{new Date(selectedReport.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Location:</span>
                <span className="detail-value">{selectedReport.location}</span>
              </div>
              <div className="detail-row full-width">
                <span className="detail-label">Description:</span>
                <p className="detail-description">{selectedReport.description}</p>
              </div>
              {selectedReport.image && (
                <div className="detail-row full-width">
                  <span className="detail-label">Image:</span>
                  <img src={selectedReport.image.url} alt="Incident" className="detail-image" />
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="close-modal-btn" onClick={closeReportDetails}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
