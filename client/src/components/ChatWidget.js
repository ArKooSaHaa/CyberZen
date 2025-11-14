import React, { useState, useEffect, useRef } from 'react';
import '../styles/ChatWidget.css';
import { createOrEnsureChat, sendMessage, subscribeToMessages } from '../services/chatService';

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [chatId, setChatId] = useState(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    // create or reuse a chat id for the user
    let id = localStorage.getItem('chatUserId');
    if (!id) {
      id = `guest_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      localStorage.setItem('chatUserId', id);
    }
    setChatId(id);

    // ensure chat doc exists
    createOrEnsureChat(id, { createdAt: new Date().toISOString() }).catch(console.error);
  }, []);

  useEffect(() => {
    if (!chatId) return;
    const unsub = subscribeToMessages(chatId, setMessages);
    return () => unsub && unsub();
  }, [chatId]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, open]);

  const handleSend = async () => {
    const messageText = text.trim();
    if (!messageText || !chatId) return;
    
    // Clear input immediately for better UX
    setText('');
    
    try {
      await sendMessage(chatId, messageText, 'user');
    } catch (err) {
      console.error('Error sending message:', err);
      // Optionally restore the text if sending failed
      // setText(messageText);
    }
  };

  return (
    <div className={`chat-widget ${open ? 'open' : ''}`}>
      {!open && (
        <button className="chat-toggle" onClick={() => setOpen(true)} aria-label="Open chat">
          <span className="chat-icon-main">💬</span>
          <span className="chat-pulse"></span>
          <span className="chat-badge">New</span>
        </button>
      )}

      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-header-content">
              <div className="chat-status-indicator"></div>
              <div>
                <strong className="chat-title">Support Chat</strong>
                <div className="chat-sub">Messages to Admin</div>
              </div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">
              <span>×</span>
            </button>
          </div>

          <div className="chat-messages" ref={messagesRef}>
            {messages.length === 0 ? (
              <div className="chat-empty-state">
                <div className="empty-icon">💬</div>
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map(m => (
                <div key={m.id} className={`chat-message ${m.sender === 'admin' ? 'admin' : 'user'}`}>
                  <div className="message-avatar">{m.sender === 'admin' ? '👨‍💼' : '👤'}</div>
                  <div className="message-content">
                    <div className="message-text">{m.text}</div>
                    <div className="message-meta">
                      {m.createdAt && m.createdAt.toDate ? new Date(m.createdAt.toDate()).toLocaleTimeString() : ''}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { 
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button 
              onClick={handleSend} 
              className="chat-send-btn"
              disabled={!text.trim()}
            >
              <span>Send</span>
              <span className="send-icon">➤</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;