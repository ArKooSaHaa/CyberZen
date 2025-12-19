import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminChatDashboard.css';
import { subscribeToChats, subscribeToMessages, createOrEnsureChat, sendMessage, getLastMessageTime } from '../services/chatService';

const AdminChatDashboard = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [unreadMap, setUnreadMap] = useState({});
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messagesRef = useRef(null);

  // -----------------------------
  // SORTED CHATS EFFECT
  // -----------------------------
  useEffect(() => {
    const unsub = subscribeToChats(async (rawChats) => {
      try {

        // 1️⃣ Sort chats by updatedAt DESC (latest first)
        const sortedChats = [...rawChats].sort((a, b) => {
          const timeA = a.updatedAt?.seconds
            ? a.updatedAt.seconds * 1000
            : a.updatedAt ? new Date(a.updatedAt).getTime() : 0;

          const timeB = b.updatedAt?.seconds
            ? b.updatedAt.seconds * 1000
            : b.updatedAt ? new Date(b.updatedAt).getTime() : 0;

          return timeB - timeA; // newest at top
        });

        // 2️⃣ Compute unread status
        const lastTimes = await Promise.all(sortedChats.map(c => getLastMessageTime(c.id)));
        const newUnread = {};

        sortedChats.forEach((c, idx) => {
          const lastAt = lastTimes[idx];
          const openedAt = c.openedByAdminAt ? new Date(c.openedByAdminAt) : null;
          newUnread[c.id] = lastAt && (!openedAt || openedAt < lastAt);
        });

        setChats(sortedChats);
        setUnreadMap(prev => ({ ...prev, ...newUnread }));

      } catch (err) {
        console.error('Error computing unread statuses', err);
        setChats(rawChats);
      }
    });

    return () => unsub && unsub();
  }, []);

  // Subscribe to selected chat messages
  useEffect(() => {
    if (!selectedChat) return;

    const unsub = subscribeToMessages(selectedChat.id, (msgs) => {
      setMessages(msgs);
      setUnreadMap(prev => ({ ...prev, [selectedChat.id]: false }));
    });

    return () => unsub && unsub();
  }, [selectedChat]);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Open chat
  const openChat = async (chat) => {
    setSelectedChat(chat);
    await createOrEnsureChat(chat.id, { openedByAdminAt: new Date().toISOString() });
    setUnreadMap(prev => ({ ...prev, [chat.id]: false }));
  };

  // Send admin message
  const handleSend = async () => {
    const messageText = text.trim();
    if (!messageText || !selectedChat) return;

    setText('');

    try {
      await sendMessage(selectedChat.id, messageText, 'admin');

      // Update chat updatedAt so it jumps to top
      await createOrEnsureChat(selectedChat.id, { updatedAt: new Date().toISOString() });

    } catch (err) {
      console.error('Error sending message:', err);
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
        {/* ---------------- Chat List ---------------- */}
        <div className="chat-list">
          <div className="chat-list-header">
            <h3 className="inbox-title">
              <span className="inbox-icon">📥</span> Inbox
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
                    <div className="chat-id">
                      {chat.displayName || chat.name || chat.userName || chat.id}
                    </div>

                    <div className="chat-meta">
                      {chat.updatedAt
                        ? (chat.updatedAt.seconds
                          ? new Date(chat.updatedAt.seconds * 1000).toLocaleString()
                          : new Date(chat.updatedAt).toLocaleString())
                        : 'No messages'}
                    </div>
                  </div>
                </div>

                {unreadMap[chat.id] && !(selectedChat && selectedChat.id === chat.id) && (
                  <div className="unread-dot" title="New messages"></div>
                )}

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

        {/* ---------------- Chat Pane ---------------- */}
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
                    <div className="pane-title">
                      Chat with: <strong>{selectedChat.displayName || selectedChat.name || selectedChat.userName || selectedChat.id}</strong>
                    </div>
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
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
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
