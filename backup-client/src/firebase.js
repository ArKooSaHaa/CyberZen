import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJNRcC1tZiqcrFx8D0mEaWhPnygLMWrsE",
  authDomain: "mern-chat-app-11282.firebaseapp.com",
  projectId: "mern-chat-app-11282",
  storageBucket: "mern-chat-app-11282.firebasestorage.app",
  messagingSenderId: "989061309534",
  appId: "1:989061309534:web:977c0440b0785a3463c0cf",
  measurementId: "G-EDFBRY8VVJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;

