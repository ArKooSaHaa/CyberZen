import db from './firebaseConfig';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore';

// Ensure a chat document exists for a given chatId (we'll use userId as chatId)
export async function createOrEnsureChat(chatId, meta = {}) {
  try {
    const ref = doc(db, 'chats', chatId);
    await setDoc(ref, { ...meta, updatedAt: serverTimestamp() }, { merge: true });
    return ref;
  } catch (err) {
    console.error('createOrEnsureChat error', err);
    throw err;
  }
}

export async function sendMessage(chatId, text, sender = 'user') {
  try {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesRef, {
      text,
      sender,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    console.error('sendMessage error', err);
    throw err;
  }
}

export function subscribeToMessages(chatId, onUpdate) {
  try {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt'));
    return onSnapshot(q, snapshot => {
      const messages = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      onUpdate(messages);
    });
  } catch (err) {
    console.error('subscribeToMessages error', err);
    throw err;
  }
}

export function subscribeToChats(onUpdate) {
  try {
    const chatsRef = collection(db, 'chats');
    return onSnapshot(chatsRef, snapshot => {
      const chats = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      onUpdate(chats);
    });
  } catch (err) {
    console.error('subscribeToChats error', err);
    throw err;
  }
}

// Get the most recent message's createdAt for a chat (returns Date or null)
export async function getLastMessageTime(chatId) {
  try {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0].data();
    const ts = d.createdAt;
    if (!ts) return null;
    // Firestore Timestamp has toDate() method; if it's already a Date, return it
    if (typeof ts.toDate === 'function') return ts.toDate();
    return new Date(ts);
  } catch (err) {
    console.error('getLastMessageTime error', err);
    return null;
  }
}

export async function listChats() {
  const chatsRef = collection(db, 'chats');
  const snap = await getDocs(chatsRef);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}