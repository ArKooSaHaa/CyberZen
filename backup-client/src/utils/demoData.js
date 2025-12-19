// Demo data utilities for testing the chat system

import { 
  addChatMessage, 
  generateUserId,
  CHAT_STORAGE_KEY 
} from './chatStorage';

// Create demo users with sample conversations
export const createDemoData = () => {
  const users = [
    {
      id: generateUserId(),
      name: 'Demo User 1'
    },
    {
      id: generateUserId(),
      name: 'Demo User 2'
    },
    {
      id: generateUserId(),
      name: 'Demo User 3'
    }
  ];

  // Sample conversations
  const conversations = [
    {
      userId: users[0].id,
      messages: [
        { sender: 'user', message: 'Hi, I need help with my report submission.' },
        { sender: 'admin', message: 'Hello! I\'d be happy to help you with your report submission. What specific issue are you experiencing?' },
        { sender: 'user', message: 'I\'m not sure how to upload the evidence files.' },
        { sender: 'admin', message: 'To upload evidence files, click on the "Choose Files" button in the evidence section. You can upload images, documents, or screenshots.' }
      ]
    },
    {
      userId: users[1].id,
      messages: [
        { sender: 'user', message: 'How long does it take to process a report?' },
        { sender: 'admin', message: 'Typically, reports are processed within 24-48 hours. You can track your report status using the tracking number provided after submission.' },
        { sender: 'user', message: 'Great, thank you!' }
      ]
    },
    {
      userId: users[2].id,
      messages: [
        { sender: 'user', message: 'I forgot my tracking number. Can you help me recover it?' },
        { sender: 'admin', message: 'I can help you recover your tracking number. Please provide your email address or any details about your report, and I\'ll look it up for you.' },
        { sender: 'user', message: 'My email is user@example.com' },
        { sender: 'admin', message: 'I found your report. Your tracking number is #TRK123456. You can use this to track your report status.' }
      ]
    }
  ];

  // Clear existing data
  localStorage.removeItem(CHAT_STORAGE_KEY);

  // Add demo conversations
  conversations.forEach(conversation => {
    conversation.messages.forEach((msg, index) => {
      // Add timestamp to simulate real conversations
      const timestamp = new Date(Date.now() - (conversation.messages.length - index) * 60000).toISOString();
      addChatMessage(conversation.userId, {
        ...msg,
        timestamp
      });
    });
  });

  console.log('Demo data created successfully!');
  return users;
};

// Clear all demo data
export const clearDemoData = () => {
  localStorage.removeItem(CHAT_STORAGE_KEY);
  console.log('Demo data cleared!');
};

// Check if demo data exists
export const hasDemoData = () => {
  const messages = localStorage.getItem(CHAT_STORAGE_KEY);
  return messages && Object.keys(JSON.parse(messages)).length > 0;
};