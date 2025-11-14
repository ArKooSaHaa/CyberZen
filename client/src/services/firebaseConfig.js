// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBJNRcC1tZiqcrFx8D0mEaWhPnygLMWrsE",
  authDomain: "mern-chat-app-11282.firebaseapp.com",
  projectId: "mern-chat-app-11282",
  storageBucket: "mern-chat-app-11282.firebasestorage.app",
  messagingSenderId: "989061309534",
  appId: "1:989061309534:web:977c0440b0785a3463c0cf",
  measurementId: "G-EDFBRY8VVJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;