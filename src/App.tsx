import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PersonalManagementPage from './page/PersonalManagementPage';
import Login from './page/Login';
import Register from './page/Register';
import ForgotPassword from './page/ForgotPassword';
import UserProfile from './page/UserProfile';

import TestPage from './page/TestPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/personal-management" element={<PersonalManagementPage />} />
        <Route path="/profile" element={<UserProfile />} />
    
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App; 