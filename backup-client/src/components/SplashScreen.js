import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [videoEnded, setVideoEnded] = useState(false);

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  const handleEnterClick = () => {
    navigate('/signin');
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        navigate('/signin');
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [videoEnded, navigate]); // Added navigate to dependencies

  return (
    <div className="splash-screen">
      <video
        autoPlay
        muted
        onEnded={handleVideoEnd}
        className="splash-video"
      >
        <source src="/splash.mp4" type="video/mp4" />
      </video>
      {videoEnded && (
        <button onClick={handleEnterClick} className="enter-button">
          Enter
        </button>
      )}
    </div>
  );
};

export default SplashScreen;