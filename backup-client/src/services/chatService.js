import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  limit,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";

/**
 * Send a message to a chat
 * @param {string} chatId - The chat ID (format: userId_admin)
 * @param {string} senderId - The ID of the sender
 * @param {string} text - The message text
 * @returns {Promise<string>} - The message document ID
 */
export const sendMessage = async (chatId, senderId, text) => {
  if (!chatId || !senderId || !text || !text.trim()) {
    throw new Error("chatId, senderId, and text are required");
  }

  console.log('📤 sendMessage called:', { chatId, senderId, text: text.substring(0, 50) });

  try {
    // Ensure the chat document exists
    const chatRef = doc(db, "chats", chatId);
    console.log('📄 Checking if chat document exists:', chatId);
    const chatDoc = await getDoc(chatRef);
    
    if (!chatDoc.exists()) {
      console.log('✨ Creating new chat document:', chatId);
      // Create the chat document if it doesn't exist
      const chatData = {
        userId: chatId.replace("_admin", ""),
        createdAt: serverTimestamp(),
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      console.log('📝 Chat data to create:', chatData);
      
      await setDoc(chatRef, chatData);
      console.log('✅ Chat document created successfully');
      
      // Verify it was created
      const verifyDoc = await getDoc(chatRef);
      if (verifyDoc.exists()) {
        console.log('✅ Verified: Chat document exists after creation');
      } else {
        console.error('❌ ERROR: Chat document was not created!');
      }
    } else {
      console.log('📝 Updating existing chat document:', chatId);
      // Update the chat document with last message info
      await setDoc(chatRef, {
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      console.log('✅ Chat document updated successfully');
    }

    // Add the message to the messages subcollection
    const messagesRef = collection(db, "chats", chatId, "messages");
    console.log('💬 Adding message to subcollection...');
    const messageData = {
      senderId,
      text: text.trim(),
      timestamp: serverTimestamp(),
      read: false
    };
    console.log('📝 Message data:', messageData);
    
    const docRef = await addDoc(messagesRef, messageData);

    console.log('✅ Message sent successfully, ID:', docRef.id);
    console.log('✅ Full chat path: chats/' + chatId + '/messages/' + docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error sending message:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    
    if (error.code === 'permission-denied') {
      console.error('🔒 PERMISSION DENIED: Firestore security rules are blocking write access!');
      console.error('Please check your Firestore security rules in Firebase Console.');
      console.error('See FIRESTORE_SECURITY_RULES.md for the correct rules.');
    }
    
    throw error;
  }
};

/**
 * Listen to messages in real-time for a specific chat
 * @param {string} chatId - The chat ID
 * @param {Function} callback - Callback function that receives messages array
 * @returns {Function} - Unsubscribe function
 */
export const listenToMessages = (chatId, callback) => {
  if (!chatId) {
    console.warn("listenToMessages: chatId is required");
    return () => {};
  }

  try {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Convert Firestore timestamp to Date if needed
          timestamp: doc.data().timestamp?.toDate?.() || doc.data().timestamp || new Date(),
        }));
        callback(messages);
      },
      (error) => {
        console.error("Error listening to messages:", error);
        callback([]);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up message listener:", error);
    return () => {};
  }
};

/**
 * Get all active chats (for admin dashboard)
 * @param {Function} callback - Callback function that receives chats array
 * @returns {Function} - Unsubscribe function
 */
export const listenToAllChats = (callback) => {
  try {
    console.log('listenToAllChats: Setting up listener...');
    const chatsRef = collection(db, "chats");
    
    const unsubscribe = onSnapshot(
      chatsRef,
      (snapshot) => {
        console.log('listenToAllChats: Snapshot received, docs count:', snapshot.docs.length);
        console.log('listenToAllChats: Snapshot metadata:', {
          fromCache: snapshot.metadata.fromCache,
          hasPendingWrites: snapshot.metadata.hasPendingWrites
        });
        
        if (snapshot.docs.length === 0) {
          console.warn('listenToAllChats: No chats found. This could mean:');
          console.warn('1. No messages have been sent yet');
          console.warn('2. Firestore security rules are blocking access');
          console.warn('3. Chat documents are not being created');
        }
        
        const chats = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log(`listenToAllChats: Processing chat ${doc.id}:`, data);
          return {
            id: doc.id,
            userId: doc.id.replace("_admin", ""),
            ...data,
            lastMessageTime: data.lastMessageTime?.toDate?.() || data.lastMessageTime || null,
            createdAt: data.createdAt?.toDate?.() || data.createdAt || null,
          };
        });
        
        console.log('listenToAllChats: Processed chats:', chats);
        
        // Sort by last message time (most recent first)
        chats.sort((a, b) => {
          const timeA = a.lastMessageTime?.getTime?.() || 0;
          const timeB = b.lastMessageTime?.getTime?.() || 0;
          return timeB - timeA;
        });
        
        console.log('listenToAllChats: Sorted chats:', chats);
        callback(chats);
      },
      (error) => {
        console.error("❌ Error listening to chats:", error);
        console.error("Error details:", {
          code: error.code,
          message: error.message,
          stack: error.stack
        });
        
        if (error.code === 'permission-denied') {
          console.error('🔒 PERMISSION DENIED: Firestore security rules are blocking access!');
          console.error('Please check your Firestore security rules in Firebase Console.');
          console.error('See FIRESTORE_SECURITY_RULES.md for the correct rules.');
        }
        
        callback([]);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up chats listener:", error);
    return () => {};
  }
};

/**
 * Mark messages as read
 * @param {string} chatId - The chat ID
 * @param {string} userId - The user ID who is reading (to mark messages not from them as read)
 */
export const markMessagesAsRead = async (chatId, userId) => {
  if (!chatId || !userId) return;

  try {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(
      messagesRef,
      where("senderId", "!=", userId),
      where("read", "==", false)
    );

    const snapshot = await getDocs(q);
    const updatePromises = snapshot.docs.map((doc) =>
      setDoc(doc.ref, { read: true }, { merge: true })
    );

    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
};

/**
 * Get unread message count for a chat
 * @param {string} chatId - The chat ID
 * @param {string} userId - The user ID
 * @param {Function} callback - Callback function that receives the count
 * @returns {Function} - Unsubscribe function
 */
export const listenToUnreadCount = (chatId, userId, callback) => {
  if (!chatId || !userId) {
    return () => {};
  }

  try {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(
      messagesRef,
      where("senderId", "!=", userId),
      where("read", "==", false)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        callback(snapshot.size);
      },
      (error) => {
        console.error("Error listening to unread count:", error);
        callback(0);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up unread count listener:", error);
    return () => {};
  }
};

