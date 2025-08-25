import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import SubmitReport from './pages/SubmitReport';
import TrackReport from './pages/TrackReport';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import HowItWorks from './pages/HowItWorks';
import ChangePassword from './pages/ChangePassword';
import TrackNumber from './pages/TrackNumber';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/submit-report" element={<SubmitReport />} />
          <Route path="/track-report" element={<TrackReport />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/trackNumber" element={<TrackNumber />} />
          <Route path="/" element={<Navigate to="/signin" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
