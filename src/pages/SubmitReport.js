import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/SubmitReport.css';
import NavigationBar from '../components/NavigationBar';
import Button from '../components/Button';
import backgroundImage from '../assets/background1101.JPG';

const SubmitReport = () => {
  const [formData, setFormData] = useState({
    incidentType: '',
    reportTitle: '',
    description: '',
    location: '',
    image: null
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
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
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.incidentType || !formData.reportTitle || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    // Simulate form submission
    console.log('Submitting report:', formData);
    
    // Redirect to Track Number page
    navigate('/trackNumber');
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };



  return (
    <div className="submit-report-container">
      {/* Background Image */}
      <div 
        className="background-image"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className="background-overlay"></div>

      {/* Emergency Contact */}
      <div className="emergency-contact">
        <span className="emergency-text">Emergency: 999</span>
      </div>

      {/* Navigation Bar */}
      <NavigationBar currentPage="submit-report" />

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          <div className="form-container">
            {/* Header */}
            <div className="form-header">
              <h1 className="form-title">Submit Anonymous Report</h1>
              <p className="form-subtitle">
                Your safety is our priority. All submissions are encrypted and anonymized.
              </p>
            </div>

            {/* Form */}
            <form className="report-form" onSubmit={handleSubmit}>
              {/* Incident Type */}
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
                  <option value="emergency">Emergency</option>
                  <option value="non-emergency">Non-Emergency</option>
                </select>
              </div>

              {/* Image Upload */}
              <div className="form-group">
                <label className="form-label">Image Upload (Optional)</label>
                <div
                  className={`image-upload-area ${isDragOver ? 'drag-over' : ''} ${formData.image ? 'has-image' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
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
                      <img 
                        src={URL.createObjectURL(formData.image)} 
                        alt="Preview" 
                        className="preview-image"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                        className="remove-image-btn"
                      >
                        ×
                      </button>
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

              {/* Location */}
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

              {/* Report Title */}
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

              {/* Description */}
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

              {/* Submit Button */}
              <div className="form-actions">
                <Button
                  text="Submit Report"
                  type="submit"
                  className="submit-button"
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
