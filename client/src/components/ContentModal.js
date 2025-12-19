import React, { useState } from 'react';
import '../styles/ContentModal.css';

const ContentModal = ({ title, content, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        <div className="modal-content">
          {content}
        </div>
        <div className="modal-footer">
          <button className="modal-button" onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ContentModal;
