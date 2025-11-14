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

export async function listChats() {
  const chatsRef = collection(db, 'chats');
  const snap = await getDocs(chatsRef);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}