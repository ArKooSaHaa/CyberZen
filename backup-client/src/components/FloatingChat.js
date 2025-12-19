import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';
import { 
  getCurrentUserId, 
  getChatMessages, 
  addChatMessage,
  hasUnreadAdminMessages
} from '../utils/chatStorage';
import './FloatingChat.css';

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Get current user ID
  const userId = getCurrentUserId();

  useEffect(() => {
    loadMessages();
    checkForNewMessages();
    
    // Check for new messages every 3 seconds
    const interval = setInterval(checkForNewMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = () => {
    const storedMessages = getChatMessages(userId);
    setMessages(storedMessages);
  };

  const checkForNewMessages = () => {
    if (hasUnreadAdminMessages(userId) && !isOpen) {
      setHasNewMessage(true);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        sender: 'user',
        message: newMessage.trim()
      };

      const updatedMessages = addChatMessage(userId, message);
      setMessages(updatedMessages);
      setNewMessage('');

      // Simulate admin response after 2 seconds
      setTimeout(() => {
        const adminResponse = {
          sender: 'admin',
          message: getRandomAdminResponse()
        };

        const finalMessages = addChatMessage(userId, adminResponse);
        setMessages(finalMessages);
      }, 2000);
    }
  };

  const getRandomAdminResponse = () => {
    const responses = [
      "Thank you for your message! How can I assist you today?",
      "I'm here to help! What specific information do you need?",
      "Thanks for reaching out. Let me know if you have any questions.",
      "I'll get back to you shortly with more details.",
      "Is there anything specific you'd like to know about our services?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setHasNewMessage(false);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  return (
    <div className="floating-chat-container">
      {/* Floating Chat Button */}
      <div 
        className={`floating-chat-button ${hasNewMessage ? 'has-new-message' : ''}`}
        onClick={toggleChat}
      >
        <span className="chat-icon">💬</span>
        {hasNewMessage && <span className="new-message-badge">🔴</span>}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-title">
              <span className="chat-icon-small">💬</span>
              Chat with Admin
            </div>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          {/* Messages Area */}
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="no-messages">
                <p>Start a conversation with our admin!</p>
                <small>Ask any questions about our services.</small>
              </div>
            ) : (
              messages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  message={msg.message}
                  sender={msg.sender}
                  timestamp={msg.timestamp}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-container">
            <div className="input-wrapper">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="chat-input"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="send-button"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingChat;