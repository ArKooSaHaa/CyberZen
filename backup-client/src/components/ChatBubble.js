import React from 'react';
import './ChatBubble.css';

const ChatBubble = ({ message, sender, timestamp, isAdmin = false }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`chat-bubble ${sender === 'admin' ? 'admin-bubble' : 'user-bubble'}`}>
      <div className="bubble-content">
        <div className="message-text">{message}</div>
        <div className="message-time">{formatTime(timestamp)}</div>
      </div>
    </div>
  );
};

export default ChatBubble;