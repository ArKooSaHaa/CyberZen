import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/SubmitReport.css';
import NavigationBar from '../components/NavigationBar';
import Button from '../components/Button';
import backgroundImage from '../assets/background1101.JPG';
import { submitReport } from '../services/api';

const SubmitReport = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate('/signin');
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    incidentType: '',
    reportTitle: '',
    description: '',
    location: '',
    image: null,
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB');
        return;
      }
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    } else {
      alert('Please select a valid image file (JPG, PNG, GIF)');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB');
        return;
      }
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      incidentType: '',
      reportTitle: '',
      description: '',
      location: '',
      image: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.incidentType || !formData.reportTitle || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    const data = new FormData();
    data.append('incidentType', formData.incidentType);
    data.append('reportTitle', formData.reportTitle);
    data.append('description', formData.description);
    data.append('location', formData.location);
    if (formData.image) {
      data.append('image', formData.image);
    }

    setIsLoading(true);

    try {
      const response = await submitReport(data);
      if (response.data.trackNumber) {
        navigate('/trackNumber', { state: { trackNumber: response.data.trackNumber } });
        resetForm();
      } else {
        alert('Error: Track number not received. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Define the removeImage function
  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
  };

  return (
    <div className="submit-report-container">
      <div 
        className="background-image"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className="background-overlay"></div>

      <NavigationBar currentPage="submit-report" />

      <main className="main-content">
        <div className="content-wrapper">
          <div className="form-container">
            <div className="form-header">
              <h1 className="form-title">Submit Anonymous Report</h1>
              <p className="form-subtitle">Your safety is our priority. All submissions are encrypted and anonymized.</p>
            </div>

            <form className="report-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="incidentType" className="form-label">
                  Incident Type <span className="required">*</span>
                </label>
                <select
                  id="incidentType"
                  name="incidentType"
                  value={formData.incidentType}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select incident type</option>
                  <option value="phishing">Phishing</option>
                  <option value="malware">Malware</option>
                  <option value="data-breach">Data Breach</option>
                  <option value="ransomware">Ransomware</option>
                  <option value="social-engineering">Social Engineering</option>
                  <option value="others">Others</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Image Upload (Optional)</label>
                <div
                  className={`image-upload-area ${isDragOver ? 'drag-over' : ''} ${formData.image ? 'has-image' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="file-input"
                  />
                  {formData.image ? (
                    <div className="image-preview">
                      <img src={URL.createObjectURL(formData.image)} alt="Preview" className="preview-image" />
                      <button type="button" onClick={removeImage} className="remove-image-btn">×</button>
                    </div>
                  ) : (
                    <div className="upload-content">
                      <div className="upload-icon">📷</div>
                      <p className="upload-text">Drag and drop an image here or click to upload</p>
                      <p className="upload-hint">Supports: JPG, PNG, GIF (Max 5MB)</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="location" className="form-label">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter location or drop a pin on map"
                />
              </div>

              <div className="form-group">
                <label htmlFor="reportTitle" className="form-label">
                  Report Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="reportTitle"
                  name="reportTitle"
                  value={formData.reportTitle}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Brief title for your report"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description <span className="required">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Provide detailed description of the incident..."
                  rows="6"
                  required
                ></textarea>
              </div>

              <div className="form-actions">
                <Button
                  text={isLoading ? "Submitting..." : "Submit Report"}
                  type="submit"
                  className="submit-button"
                  disabled={isLoading}
                />
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubmitReport;
