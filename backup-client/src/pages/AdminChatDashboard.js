import React, { useState, useEffect, useRef } from 'react';
import { 
  sendMessage, 
  listenToMessages, 
  listenToAllChats,
  markMessagesAsRead,
  listenToUnreadCount 
} from '../services/chatService';
import { debugFirestore } from '../utils/firestoreDebug';
import { createTestChat } from '../utils/testChat';
import { getUsers } from '../services/api';
import './AdminChatDashboard.css';

const AdminChatDashboard = () => {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unreadCounts, setUnreadCounts] = useState({});
  const [usersMap, setUsersMap] = useState({}); // Map userId -> user info
  const messagesEndRef = useRef(null);

  const adminId = 'admin';

  // Fetch all users to get usernames
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        const users = response.data || [];
        
        // Create a map: userId -> user info
        const map = {};
        users.forEach(user => {
          const userId = user._id || user.id;
          if (userId) {
            map[userId] = {
              username: user.username || 'Unknown',
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              email: user.email || ''
            };
          }
        });
        
        setUsersMap(map);
        console.log('✅ Users loaded:', map);
      } catch (err) {
        console.error('Error fetching users:', err);
        // Continue without user info - will show user IDs instead
      }
    };

    fetchUsers();
  }, []);

  // Helper to get display name for a user
  const getUserDisplayName = (userId) => {
    const user = usersMap[userId];
    if (user) {
      if (user.firstName && user.lastName) {
        return `${user.firstName} ${user.lastName}`;
      }
      return user.username || userId;
    }
    return userId; // Fallback to user ID if user not found
  };

  // Listen to all chats
  useEffect(() => {
    console.log('AdminChatDashboard: Setting up chat listener...');
    
    // Run debug check on mount
    debugFirestore().then(result => {
      if (!result.success) {
        console.error('❌ Firestore debug check failed:', result.error);
        setError(`Firestore Error: ${result.error.message}. Check console for details.`);
      } else {
        console.log('✅ Firestore connection OK. Chats found:', result.chatsCount);
      }
    });
    
    const unsubscribe = listenToAllChats((chatsList) => {
      console.log('AdminChatDashboard: Received chats:', chatsList);
      console.log('AdminChatDashboard: Number of chats:', chatsList.length);
      setChats(chatsList);
      
      if (chatsList.length === 0) {
        console.warn('⚠️ No chats received. Possible issues:');
        console.warn('1. No users have sent messages yet');
        console.warn('2. Firestore security rules are blocking read access');
        console.warn('3. Chat documents are not being created');
        console.warn('💡 Run window.debugFirestore() in console to diagnose');
        console.warn('💡 Run window.createTestChat() to create a test chat');
        console.warn('💡 Check Firebase Console → Firestore Database to see if chats exist');
      } else {
        console.log('✅ Chats loaded successfully:', chatsList.map(c => ({ id: c.id, userId: c.userId })));
      }
      
      // Auto-select first chat if none selected
      if (chatsList.length > 0 && !selectedChatId) {
        const firstChat = chatsList[0];
        console.log('AdminChatDashboard: Auto-selecting first chat:', firstChat);
        setSelectedChatId(firstChat.id);
        setSelectedUserId(firstChat.userId);
      }
    });

    return () => {
      console.log('AdminChatDashboard: Cleaning up chat listener');
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen to messages for selected chat
  useEffect(() => {
    if (!selectedChatId) {
      setMessages([]);
      return;
    }

    const unsubscribe = listenToMessages(selectedChatId, (msgs) => {
      setMessages(msgs);
      // Mark messages as read when admin views them
      markMessagesAsRead(selectedChatId, adminId);
    });

    // Mark messages as read when chat is selected
    markMessagesAsRead(selectedChatId, adminId);

    return () => unsubscribe();
  }, [selectedChatId]);

  // Listen to unread counts for all chats
  useEffect(() => {
    const unsubscribes = chats.map(chat => {
      return listenToUnreadCount(chat.id, adminId, (count) => {
        setUnreadCounts(prev => ({ ...prev, [chat.id]: count }));
      });
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [chats]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectChat = (chatId, userId) => {
    setSelectedChatId(chatId);
    setSelectedUserId(userId);
    setMessages([]); // Clear messages while loading new ones
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedChatId) return;

    setLoading(true);
    setError('');

    try {
      await sendMessage(selectedChatId, adminId, input.trim());
      setInput('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp instanceof Date 
      ? timestamp 
      : timestamp?.toDate?.() || new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp instanceof Date 
      ? timestamp 
      : timestamp?.toDate?.() || new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleTestChat = async () => {
    try {
      setLoading(true);
      const result = await createTestChat();
      if (result.success) {
        alert('✅ Test chat created! Refresh the page to see it.');
        // Refresh chats after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        alert('❌ Error: ' + (result.error?.message || 'Unknown error'));
        if (result.error?.code === 'permission-denied') {
          alert('🔒 Permission denied! Check Firestore security rules.');
        }
      }
    } catch (error) {
      console.error('❌ Error creating test chat:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-chat-container">
      <div className="user-list">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3>Active Chats {chats.length > 0 && `(${chats.length})`}</h3>
          {chats.length === 0 && (
            <button 
              onClick={handleTestChat}
              style={{
                padding: '5px 10px',
                fontSize: '12px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              title="Create a test chat to verify Firestore is working"
            >
              Test
            </button>
          )}
        </div>
        <ul>
          {chats.length === 0 ? (
            <li className="no-chats">
              <div>No active chats yet</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
                <p>To test:</p>
                <ol style={{ textAlign: 'left', paddingLeft: '20px' }}>
                  <li>Log in as a user</li>
                  <li>Go to /chat</li>
                  <li>Send a message</li>
                  <li>Return here to see the chat</li>
                </ol>
                <p style={{ marginTop: '10px' }}>
                  Or click "Test" button above to create a test chat.
                </p>
              </div>
            </li>
          ) : (
            chats.map((chat) => {
              const isSelected = selectedChatId === chat.id;
              const unread = unreadCounts[chat.id] || 0;
              
              return (
                <li 
                  key={chat.id} 
                  onClick={() => selectChat(chat.id, chat.userId)} 
                  className={isSelected ? 'selected' : ''}
                >
                  <div className="chat-item-header">
                    <span className="chat-user-id">{getUserDisplayName(chat.userId)}</span>
                    {unread > 0 && <span className="unread-badge">{unread}</span>}
                  </div>
                  {chat.lastMessage && (
                    <div className="chat-item-preview">
                      <span className="last-message">{chat.lastMessage}</span>
                      <span className="last-message-time">
                        {formatLastMessageTime(chat.lastMessageTime)}
                      </span>
                    </div>
                  )}
                </li>
              );
            })
          )}
        </ul>
      </div>
      <div className="chat-area">
        {selectedChatId && selectedUserId ? (
          <>
            <div className="chat-header">
              <h3>Chat with {getUserDisplayName(selectedUserId)}</h3>
            </div>
            <div className="messages">
              {messages.length === 0 ? (
                <div className="no-messages">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isSent = msg.senderId === adminId;
                  const timestamp = msg.timestamp instanceof Date 
                    ? msg.timestamp 
                    : msg.timestamp?.toDate?.() || new Date(msg.timestamp) || new Date();
                  
                  return (
                    <div key={msg.id} className={`message ${isSent ? 'sent' : 'received'}`}>
                      <p>{msg.text}</p>
                      <span className="message-time">{formatTime(timestamp)}</span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
            {error && <div className="chat-error">{error}</div>}
            <form className="chat-form" onSubmit={handleSubmit}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a reply..."
                disabled={loading}
              />
              <button type="submit" disabled={loading || !input.trim()}>
                {loading ? 'Sending...' : 'Send'}
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Select a chat to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatDashboard;
