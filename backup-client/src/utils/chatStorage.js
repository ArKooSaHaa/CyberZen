// Chat storage utilities for managing chat messages in localStorage

export const CHAT_STORAGE_KEY = 'cyberzens_chat_messages';
export const USER_ID_KEY = 'chatUserId';

// Generate a unique user ID
export const generateUserId = () => {
  return `User_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get current user ID or create a new one
export const getCurrentUserId = () => {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
};

// Get all chat messages for all users
export const getAllChatMessages = () => {
  try {
    const messages = localStorage.getItem(CHAT_STORAGE_KEY);
    return messages ? JSON.parse(messages) : {};
  } catch (error) {
    console.error('Error loading chat messages:', error);
    return {};
  }
};

// Get chat messages for a specific user
export const getChatMessages = (userId) => {
  const allMessages = getAllChatMessages();
  return allMessages[userId] || [];
};

// Save chat messages for a specific user
export const saveChatMessages = (userId, messages) => {
  try {
    const allMessages = getAllChatMessages();
    allMessages[userId] = messages;
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(allMessages));
  } catch (error) {
    console.error('Error saving chat messages:', error);
  }
};

// Add a new message to a user's chat
export const addChatMessage = (userId, message) => {
  const messages = getChatMessages(userId);
  const newMessage = {
    id: Date.now() + Math.random(),
    ...message,
    timestamp: new Date().toISOString()
  };
  
  const updatedMessages = [...messages, newMessage];
  saveChatMessages(userId, updatedMessages);
  return updatedMessages;
};

// Get all users who have sent messages
export const getAllUsers = () => {
  const allMessages = getAllChatMessages();
  return Object.keys(allMessages).filter(userId => 
    allMessages[userId] && allMessages[userId].length > 0
  );
};

// Get the last message from a user
export const getLastMessage = (userId) => {
  const messages = getChatMessages(userId);
  return messages.length > 0 ? messages[messages.length - 1] : null;
};

// Get user display name
export const getUserDisplayName = (userId) => {
  // Extract user number from the generated ID
  const match = userId.match(/User_(\d+)/);
  if (match) {
    const timestamp = parseInt(match[1]);
    const userNumber = Math.floor((timestamp % 10000) / 100) + 1;
    return `User ${userNumber}`;
  }
  return userId;
};

// Clear all chat data (for testing)
export const clearAllChatData = () => {
  localStorage.removeItem(CHAT_STORAGE_KEY);
  localStorage.removeItem(USER_ID_KEY);
};

// Get message count for a user
export const getMessageCount = (userId) => {
  const messages = getChatMessages(userId);
  return messages.length;
};

// Check if user has unread admin messages
export const hasUnreadAdminMessages = (userId) => {
  const messages = getChatMessages(userId);
  if (messages.length === 0) return false;
  
  const lastMessage = messages[messages.length - 1];
  return lastMessage.sender === 'admin';
};

// Mark messages as read (could be extended for read receipts)
export const markMessagesAsRead = (userId) => {
  const messages = getChatMessages(userId);
  const updatedMessages = messages.map(msg => ({
    ...msg,
    read: true
  }));
  saveChatMessages(userId, updatedMessages);
};