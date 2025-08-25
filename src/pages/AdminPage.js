import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportDetails, setShowReportDetails] = useState(false);
  const reportsPerPage = 10;

  // Mock data for demonstration
  useEffect(() => {
    const mockReports = [
      {
        id: 'RPT001',
        incidentType: 'Phishing',
        status: 'Received',
        submittedBy: 'User123',
        dateSubmitted: '2024-01-15',
        description: 'Received suspicious email asking for personal information',
        location: 'New York, NY',
        images: ['phishing_email.png']
      },
      {
        id: 'RPT002',
        incidentType: 'Malware',
        status: 'Under Processing',
        submittedBy: 'User456',
        dateSubmitted: '2024-01-14',
        description: 'Computer showing unusual behavior, possible malware infection',
        location: 'Los Angeles, CA',
        images: ['malware_screenshot.png']
      },
      {
        id: 'RPT003',
        incidentType: 'Data Breach',
        status: 'Completed',
        submittedBy: 'User789',
        dateSubmitted: '2024-01-13',
        description: 'Suspected unauthorized access to company database',
        location: 'Chicago, IL',
        images: ['breach_logs.png']
      },
      {
        id: 'RPT004',
        incidentType: 'Ransomware',
        status: 'Received',
        submittedBy: 'User101',
        dateSubmitted: '2024-01-12',
        description: 'Files encrypted with ransom demand',
        location: 'Miami, FL',
        images: ['ransomware_screen.png']
      },
      {
        id: 'RPT005',
        incidentType: 'Social Engineering',
        status: 'Under Processing',
        submittedBy: 'User202',
        dateSubmitted: '2024-01-11',
        description: 'Received phone call from someone claiming to be IT support',
        location: 'Seattle, WA',
        images: ['call_log.png']
      }
    ];
    setReports(mockReports);
    setFilteredReports(mockReports);
  }, []);

  // Filter and search reports
  useEffect(() => {
    let filtered = reports.filter(report => {
      const matchesSearch = 
        report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.incidentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
      const matchesType = typeFilter === 'all' || report.incidentType === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
    
    setFilteredReports(filtered);
    setCurrentPage(1);
  }, [reports, searchTerm, statusFilter, typeFilter]);

  // Pagination
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const handleStatusUpdate = (reportId, newStatus) => {
    setReports(prevReports => 
      prevReports.map(report => 
        report.id === reportId 
          ? { ...report, status: newStatus }
          : report
      )
    );
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
      case 'Received': return '#00ffff';
      case 'Under Processing': return '#ff6b35';
      case 'Completed': return '#00ff88';
      default: return '#ffffff';
    }
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div className="header-content">
          <h1 className="admin-title">CYBERZEN ADMIN DASHBOARD</h1>
          <div className="admin-controls">
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
            placeholder="Search by Track Number, Incident Type, or User ID..."
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
            <option value="Received">Received</option>
            <option value="Under Processing">Under Processing</option>
            <option value="Completed">Completed</option>
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
                <th>Report ID</th>
                <th>Incident Type</th>
                <th>Status</th>
                <th>Submitted By</th>
                <th>Date Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReports.map((report) => (
                <tr key={report.id} className="report-row" onClick={() => handleReportClick(report)}>
                  <td className="report-id">{report.id}</td>
                  <td className="incident-type">{report.incidentType}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(report.status) }}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="submitted-by">{report.submittedBy}</td>
                  <td className="date-submitted">{report.dateSubmitted}</td>
                  <td className="actions">
                    <select
                      value={report.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(report.id, e.target.value);
                      }}
                      className="status-select"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="Received">Received</option>
                      <option value="Under Processing">Under Processing</option>
                      <option value="Completed">Completed</option>
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
              <h3>Report Details - {selectedReport.id}</h3>
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
                <span className="detail-label">Submitted By:</span>
                <span className="detail-value">{selectedReport.submittedBy}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Date Submitted:</span>
                <span className="detail-value">{selectedReport.dateSubmitted}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Location:</span>
                <span className="detail-value">{selectedReport.location}</span>
              </div>
              
              <div className="detail-row full-width">
                <span className="detail-label">Description:</span>
                <p className="detail-description">{selectedReport.description}</p>
              </div>
              
              {selectedReport.images && selectedReport.images.length > 0 && (
                <div className="detail-row full-width">
                  <span className="detail-label">Attachments:</span>
                  <div className="image-attachments">
                    {selectedReport.images.map((image, index) => (
                      <div key={index} className="image-preview">
                        <span className="image-name">{image}</span>
                      </div>
                    ))}
                  </div>
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
