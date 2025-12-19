/**
 * Test utility to manually create a chat in Firestore
 * Run this in browser console to test if Firestore is working
 */

import { db } from '../firebase';
import { collection, doc, setDoc, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';

export const createTestChat = async () => {
  try {
    console.log('🧪 Creating test chat...');
    
    const testChatId = 'test-user-123_admin';
    const testUserId = 'test-user-123';
    
    // Create chat document
    const chatRef = doc(db, "chats", testChatId);
    await setDoc(chatRef, {
      userId: testUserId,
      createdAt: serverTimestamp(),
      lastMessage: 'Test message',
      lastMessageTime: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Chat document created:', testChatId);
    
    // Add a test message
    const messagesRef = collection(db, "chats", testChatId, "messages");
    await addDoc(messagesRef, {
      senderId: testUserId,
      text: 'This is a test message',
      timestamp: serverTimestamp(),
      read: false
    });
    
    console.log('✅ Test message added');
    console.log('✅ Test chat created successfully!');
    console.log('💡 Refresh the admin dashboard to see the chat');
    
    return { success: true, chatId: testChatId };
  } catch (error) {
    console.error('❌ Error creating test chat:', error);
    if (error.code === 'permission-denied') {
      console.error('🔒 PERMISSION DENIED! Firestore rules are blocking.');
    }
    return { success: false, error };
  }
};

// Make it available globally
if (typeof window !== 'undefined') {
  window.createTestChat = createTestChat;
  console.log('💡 Test function available: Run window.createTestChat() in console');
}

