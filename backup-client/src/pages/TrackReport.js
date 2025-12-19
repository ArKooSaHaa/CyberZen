// frontend/TrackReport.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/TrackReport.css';
import NavigationBar from '../components/NavigationBar';
import Button from '../components/Button';
import backgroundImage from '../assets/background1101.JPG';

const TrackReport = () => {
  const [trackNumber, setTrackNumber] = useState('');
  const [reportStatus, setReportStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle input change
  const handleInputChange = (e) => {
    setTrackNumber(e.target.value);
    setError('');
    setReportStatus(null);
  };

  // Simulate fetching report status from the backend
const handleTrackReport = async () => {
  if (!trackNumber.trim()) {
    setError('Please enter a tracking number');
    return;
  }

  if (trackNumber.length !== 7 || isNaN(trackNumber)) {
    setError('Please enter a valid 7-digit tracking number');
    return;
  }

  setIsLoading(true);
  setError('');

  try {
    const response = await axios.get(`http://localhost:5000/api/reports/${trackNumber}`);
    console.log('API Response:', response.data);  // Log the response data for debugging
    setReportStatus(response.data.status);  // Assuming 'status' is returned from the server
  } catch (error) {
    console.error('Error fetching report:', error);  // Log error for debugging
    setError('Report not found or invalid tracking number');
  } finally {
    setIsLoading(false);
  }
};


  // Navigate back to the Submit Report page
  const handleSubmitNewReport = () => {
    navigate('/submit-report');
  };

  // Generate progress steps based on the report status
  const getProgressSteps = (status) => {
    const steps = [
      { id: 'received', label: 'Received Your Report', completed: false },
      { id: 'processing', label: 'Under Processing', completed: false },
      { id: 'completed', label: 'Completed', completed: false }
    ];

    if (status === 'received') {
      steps[0].completed = true;
    } else if (status === 'processing') {
      steps[0].completed = true;
      steps[1].completed = true;
    } else if (status === 'completed') {
      steps[0].completed = true;
      steps[1].completed = true;
      steps[2].completed = true;
    }

    return steps;
  };

  return (
    <div className="track-report-container">
      {/* Background Image */}
      <div 
        className="background-image"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className="background-overlay"></div>

      {/* Navigation Bar */}
      <NavigationBar currentPage="track-report" />

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          <div className="track-container">
            <div className="track-header">
              <h1 className="track-title">Track Your Report</h1>
              <p className="track-subtitle">
                Enter your tracking number to check the status of your anonymous report.
              </p>
            </div>

            <div className="track-form">
              <div className="form-group">
                <label htmlFor="trackingNumber" className="form-label">
                  Tracking Number <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="trackingNumber"
                  className="form-input"
                  placeholder="Enter your 7-digit tracking number"
                  value={trackNumber}
                  onChange={handleInputChange}
                  maxLength="7"
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button 
                className="track-button"
                onClick={handleTrackReport}
                disabled={isLoading}
              >
                {isLoading ? 'Tracking...' : 'Track Report'}
              </button>
            </div>

            {/* Report Progress Section */}
            {reportStatus && (
              <div className="report-progress-section">
                <h2 className="progress-title">Report Update</h2>
                
                <div className="progress-timeline">
                  {getProgressSteps(reportStatus).map((step, index) => (
                    <div key={step.id} className={`progress-step ${step.completed ? 'completed' : ''}`}>
                      <div className="step-indicator">
                        <div className="step-circle">
                          {step.completed ? '✓' : (index + 1)}
                        </div>
                        <div className="step-line"></div>
                      </div>
                      <div className="step-content">
                        <h3 className="step-label">{step.label}</h3>
                        <p className="step-description">
                          {step.completed 
                            ? 'This step has been completed successfully'
                            : 'This step is pending or in progress'
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit New Report Button */}
                <div className="submit-new-report">
                  <Button
                    text="Submit New Report"
                    onClick={handleSubmitNewReport}
                    className="submit-new-button"
                  />
                </div>
              </div>
            )}

            {/* Info Section - Only show when no report status */}
            {!reportStatus && (
              <div className="track-info">
                <h3>How to Track Your Report</h3>
                <ul>
                  <li>After submitting a report, you'll receive a unique tracking number</li>
                  <li>Use this number to check the status of your report</li>
                  <li>Your identity remains completely anonymous throughout the process</li>
                  <li>Reports are typically processed within 24-48 hours</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrackReport;
