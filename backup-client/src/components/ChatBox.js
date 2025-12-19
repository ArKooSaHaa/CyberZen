import React, { useState, useEffect, useRef } from 'react';
import { sendMessage, listenToMessages, markMessagesAsRead } from '../services/chatService';
import { getMe } from '../services/api';
import './ChatBox.css';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const messagesEndRef = useRef(null);
  
  // Chat ID format: userId_admin
  const chatId = userId ? `${userId}_admin` : null;

  // Fetch user info from API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoadingUser(true);
        const response = await getMe();
        const user = response.data;
        // Support both _id (MongoDB) and id fields
        const userID = user?._id || user?.id;
        setUserId(userID);
        console.log('ChatBox: User ID:', userID, 'Chat ID:', userID ? `${userID}_admin` : null);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user information. Please log in again.');
        setUserId(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!chatId || !userId) return;

    // Listen to messages in real-time
    const unsubscribe = listenToMessages(chatId, (msgs) => {
      setMessages(msgs);
      // Mark messages as read when they're loaded
      markMessagesAsRead(chatId, userId);
    });

    // Mark messages as read when component mounts
    markMessagesAsRead(chatId, userId);

    return () => {
      unsubscribe();
    };
  }, [chatId, userId]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !chatId || !userId) {
      console.error('Cannot send message:', { input: input.trim(), chatId, userId });
      setError('Missing required information. Please refresh the page.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('📤 Attempting to send message...', { chatId, userId, text: input.trim() });
      await sendMessage(chatId, userId, input.trim());
      console.log('✅ Message sent successfully!');
      setInput('');
    } catch (err) {
      console.error('❌ Error sending message:', err);
      console.error('Error details:', {
        code: err.code,
        message: err.message,
        chatId,
        userId
      });
      
      if (err.code === 'permission-denied') {
        setError('Permission denied. Check Firestore security rules.');
      } else {
        setError('Failed to send message: ' + (err.message || 'Unknown error'));
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="chatbox-container">
        <div className="chatbox-error">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="chatbox-container">
        <div className="chatbox-error">
          <p>Please log in to chat with admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chatbox-container">
      <div className="chatbox-header">
        <h2>Chat with Admin</h2>
      </div>
      <div className="chatbox-messages">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isSent = msg.senderId === userId;
            const timestamp = msg.timestamp instanceof Date 
              ? msg.timestamp 
              : msg.timestamp?.toDate?.() || new Date(msg.timestamp) || new Date();
            
            return (
              <div key={msg.id} className={`message ${isSent ? 'sent' : 'received'}`}>
                <p>{msg.text}</p>
                <span className="message-time">
                  {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      {error && <div className="chatbox-error">{error}</div>}
      <form className="chatbox-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
