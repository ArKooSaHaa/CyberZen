/**
 * Debug utility to check Firestore connection and permissions
 * Run this in browser console to diagnose issues
 */

import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export const debugFirestore = async () => {
  console.log('🔍 Starting Firestore Debug...');
  console.log('Firebase DB instance:', db);
  
  try {
    // Try to read chats collection
    console.log('📖 Attempting to read chats collection...');
    const chatsRef = collection(db, "chats");
    const snapshot = await getDocs(chatsRef);
    
    console.log('✅ Successfully read chats collection');
    console.log('📊 Chats count:', snapshot.docs.length);
    
    if (snapshot.docs.length > 0) {
      console.log('📋 Chats found:');
      snapshot.docs.forEach((doc) => {
        console.log(`  - ${doc.id}:`, doc.data());
      });
    } else {
      console.warn('⚠️ No chats found in Firestore');
      console.warn('This could mean:');
      console.warn('1. No messages have been sent yet');
      console.warn('2. Firestore security rules are blocking read access');
    }
    
    return {
      success: true,
      chatsCount: snapshot.docs.length,
      chats: snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
    };
  } catch (error) {
    console.error('❌ Error reading Firestore:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'permission-denied') {
      console.error('🔒 PERMISSION DENIED!');
      console.error('Your Firestore security rules are blocking access.');
      console.error('Go to Firebase Console → Firestore Database → Rules');
      console.error('And set up the rules from FIRESTORE_SECURITY_RULES.md');
    }
    
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message
      }
    };
  }
};

// Make it available globally for console debugging
if (typeof window !== 'undefined') {
  window.debugFirestore = debugFirestore;
  console.log('💡 Debug function available: Run window.debugFirestore() in console');
}

