import React, { useRef, useEffect } from 'react';
import '../styles/Intro.css';

const Intro = ({ onFinish }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      const p = videoRef.current.play();
      if (p && p.catch) p.catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (onFinish) onFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onFinish]);

  const handleEnded = () => {
    if (onFinish) onFinish();
  };

  return (
    <div className="intro-overlay">
      <video
        ref={videoRef}
        className="intro-video"
        playsInline
        muted
        autoPlay
        onEnded={handleEnded}
      >
        <source src="/intro.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Intro;
