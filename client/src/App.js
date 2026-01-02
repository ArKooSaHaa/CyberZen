import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Intro from './components/Intro';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import AdminChatDashboard from './pages/AdminChatDashboard';
import SubmitReport from './pages/SubmitReport';
import TrackReport from './pages/TrackReport';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import HowItWorks from './pages/HowItWorks';
import ChangePassword from './pages/ChangePassword';
import DeleteAccount from './pages/DeleteAccount';
import TrackNumber from './pages/TrackNumber';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import HelpCenter from './pages/HelpCenter';
import FAQ from './pages/FAQ';
import TechnicalSupport from './pages/TechnicalSupport';
import SecurityPolicy from './pages/SecurityPolicy';
import Encryption from './pages/Encryption';
import Compliance from './pages/Compliance';
import ContactUs from './pages/ContactUs';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';

function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Verify API base URL is loaded
    console.log('🔍 API_BASE_URL from env:', process.env.REACT_APP_API_BASE_URL);
    const skipped = sessionStorage.getItem('introSkipped');
    if (skipped === 'true') setShowIntro(false);
  }, []);

  if (showIntro) {
    return (
      <Intro
        onFinish={() => {
          sessionStorage.setItem('introSkipped', 'true');
          setShowIntro(false);
        }}
      />
    );
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/chat" element={<AdminChatDashboard />} />
          <Route path="/submit-report" element={<SubmitReport />} />
          <Route path="/track-report" element={<TrackReport />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/delete-account" element={<DeleteAccount />} />
          <Route path="/trackNumber" element={<TrackNumber />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/support" element={<TechnicalSupport />} />
          <Route path="/security" element={<SecurityPolicy />} />
          <Route path="/encryption" element={<Encryption />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/" element={<Navigate to="/signin" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
