import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import SplashScreen from './components/SplashScreen';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import SubmitReport from './pages/SubmitReport';
import TrackReport from './pages/TrackReport';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import HowItWorks from './pages/HowItWorks';
import ChangePassword from './pages/ChangePassword';
import DeleteAccount from './pages/DeleteAccount';
import TrackNumber from './pages/TrackNumber';
import ChatPage from './pages/ChatPage'; // New Chat Page for users
import AdminChatDashboard from './pages/AdminChatDashboard'; // New Admin Chat Dashboard

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/chat" element={<AdminChatDashboard />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/submit-report" element={<SubmitReport />} />
          <Route path="/track-report" element={<TrackReport />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/delete-account" element={<DeleteAccount />} />
          <Route path="/trackNumber" element={<TrackNumber />} />
          <Route path="/" element={<SplashScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
