// // frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Sidebar from './components/Sidebar';
import FAQTable from './components/faqTable';
import PrivateRoute from './components/PrivateRoute';

import Dashboard from './pages/Dashboard';
import FAQManager from './pages/FAQManager';
import Activity from './pages/Activity';
import Settings from './pages/Settings';
import Suggested from './pages/Suggested';
import AcceptInvite from './pages/AcceptInvite';
import Login from './pages/Login';

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/accept-invite" element={<AcceptInvite />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/faq" element={<FAQManager />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/suggested" element={<Suggested />} />
            </Route>
            <Route path="*" element={<div>404 - Page not found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
