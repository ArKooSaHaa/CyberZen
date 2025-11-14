import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminChatDashboard.css';
import { subscribeToChats, subscribeToMessages, createOrEnsureChat, sendMessage } from '../services/chatService';

const AdminChatDashboard = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messagesRef = useRef(null);

  useEffect(() => {
    const unsub = subscribeToChats(setChats);
    return () => unsub && unsub();
  }, []);

  useEffect(() => {
    if (!selectedChat) return;
    const unsub = subscribeToMessages(selectedChat.id, setMessages);
    return () => unsub && unsub();
  }, [selectedChat]);

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  const openChat = async (chat) => {
    setSelectedChat(chat);
    await createOrEnsureChat(chat.id, { openedByAdminAt: new Date().toISOString() });
  };

  const handleSend = async () => {
    const messageText = text.trim();
    if (!messageText || !selectedChat) return;
    
    // Clear input immediately for better UX
    setText('');
    
    try {
      await sendMessage(selectedChat.id, messageText, 'admin');
    } catch (err) {
      console.error('Error sending message:', err);
      // Optionally restore the text if sending failed
      // setText(messageText);
    }
  };

  return (
    <div className="admin-chat-wrap">
      <div className="admin-chat-header">
        <button className="back-btn" onClick={() => navigate('/admin')}>
          <span className="back-icon">←</span>
          <span>Back to Admin</span>
        </button>
        <div className="header-title-section">
          <h2 className="admin-chat-title">
            <span className="title-icon">💬</span>
            Admin Chat Dashboard
          </h2>
          <div className="header-glow-line"></div>
        </div>
        <div className="chat-count-badge">
          <span className="badge-number">{chats.length}</span>
          <span className="badge-label">Chats</span>
        </div>
      </div>
      <div className="admin-chat-body">
        <div className="chat-list">
          <div className="chat-list-header">
            <h3 className="inbox-title">
              <span className="inbox-icon">📥</span>
              Inbox
            </h3>
            <div className="inbox-count">{chats.length} {chats.length === 1 ? 'chat' : 'chats'}</div>
          </div>
          <div className="chat-items">
            {chats.map(chat => (
              <div 
                key={chat.id} 
                className={`chat-item ${selectedChat && selectedChat.id === chat.id ? 'active' : ''}`} 
                onClick={() => openChat(chat)}
              >
                <div className="chat-item-content">
                  <div className="chat-avatar">👤</div>
                  <div className="chat-info">
                    <div className="chat-id">{chat.id}</div>
                    <div className="chat-meta">
                      {chat.updatedAt ? new Date(chat.updatedAt.seconds * 1000).toLocaleString() : 'No messages'}
                    </div>
                  </div>
                </div>
                {selectedChat && selectedChat.id === chat.id && (
                  <div className="active-indicator"></div>
                )}
              </div>
            ))}
            {chats.length === 0 && (
              <div className="empty">
                <div className="empty-icon">💬</div>
                <p>No chats yet</p>
                <span className="empty-sub">Waiting for user messages...</span>
              </div>
            )}
          </div>
        </div>

        <div className="chat-pane">
          {!selectedChat && (
            <div className="no-select">
              <div className="no-select-icon">💬</div>
              <h3>Select a Chat</h3>
              <p>Choose a conversation from the inbox to start messaging</p>
            </div>
          )}

          {selectedChat && (
            <>
              <div className="chat-pane-header">
                <div className="pane-header-content">
                  <div className="pane-avatar">👤</div>
                  <div className="pane-header-info">
                    <div className="pane-title">Chat with: <strong>{selectedChat.id}</strong></div>
                    <div className="pane-subtitle">Active conversation</div>
                  </div>
                </div>
                <div className="status-dot"></div>
              </div>
              <div className="chat-pane-messages" ref={messagesRef}>
                {messages.length === 0 ? (
                  <div className="messages-empty">
                    <div className="messages-empty-icon">💬</div>
                    <p>No messages in this chat yet</p>
                  </div>
                ) : (
                  messages.map(m => (
                    <div key={m.id} className={`pane-message ${m.sender === 'admin' ? 'admin' : 'user'}`}>
                      <div className="message-avatar-pane">{m.sender === 'admin' ? '👨‍💼' : '👤'}</div>
                      <div className="message-wrapper">
                        <div className="pane-text">{m.text}</div>
                        <div className="pane-meta">
                          {m.createdAt && m.createdAt.toDate ? new Date(m.createdAt.toDate()).toLocaleString() : ''}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="chat-pane-input">
                <input 
                  value={text} 
                  onChange={(e)=>setText(e.target.value)} 
                  onKeyDown={(e)=>{ 
                    if(e.key==='Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }} 
                  placeholder="Type message as admin..." 
                />
                <button 
                  onClick={handleSend}
                  className="send-btn"
                  disabled={!text.trim()}
                >
                  <span>Send</span>
                  <span className="send-arrow">➤</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatDashboard;