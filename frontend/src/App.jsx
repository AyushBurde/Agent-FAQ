import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout';
// Import from LOCAL src/pages now
import Dashboard from './pages/Dashboard.jsx';
import FAQManager from './pages/FAQManager.jsx';
import Activity from './pages/Activity.jsx';
import Settings from './pages/Settings.jsx';
import Suggested from './pages/Suggested.jsx';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/faq" element={<FAQManager />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/suggested" element={<Suggested />} />
          <Route path="*" element={<div className="text-center py-20 text-slate-500">404 - Page not found</div>} />
        </Routes>
      </Layout>
      <Toaster position="bottom-right" toastOptions={{
        className: 'bg-slate-800 text-white border border-slate-700',
        style: { background: '#1e293b', color: '#fff' }
      }} />
    </Router>
  );
}
