// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Sidebar from './components/Sidebar';
import Dashboard from '../pages/Dashboard.jsx';
import FAQManager from '../pages/FAQManager.jsx';
import Activity from '../pages/Activity.jsx';
import Settings from '../pages/Settings.jsx';
import Suggested from '../pages/Suggested.jsx';

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/faq" element={<FAQManager />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/suggested" element={<Suggested />} />
            <Route path="*" element={<div>404 - Page not found</div>} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

