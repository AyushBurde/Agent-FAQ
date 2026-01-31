import React, { useState, useEffect } from 'react';
import FAQForm from '../components/faqForm.jsx';
import FAQTable from '../components/faqTable.jsx';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const FAQManager = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch FAQs from API
  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/faqs`);
      if (!response.ok) {
        throw new Error('Failed to fetch FAQs');
      }
      const data = await response.json();
      setFaqs(data);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setError('Failed to load FAQs. Please check if the API server is running.');
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (faq) => {
    try {
      const response = await fetch(`${API_URL}/api/faqs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(faq),
      });

      if (!response.ok) {
        throw new Error('Failed to add FAQ');
      }

      const newFaq = await response.json();
      setFaqs(prev => [newFaq, ...prev]);
      toast.success('FAQ added successfully!');
    } catch (err) {
      console.error('Error adding FAQ:', err);
      toast.error('Failed to add FAQ. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/faqs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete FAQ');
      }

      setFaqs(prev => prev.filter(faq => faq._id !== id));
      toast.success('FAQ deleted successfully!');
    } catch (err) {
      console.error('Error deleting FAQ:', err);
      toast.error('Failed to delete FAQ. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <h2 className="text-3xl font-bold text-slate-800">Manage FAQs</h2>
        <div className="bg-slate-200 h-40 rounded-2xl"></div>
        <div className="bg-slate-200 h-96 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Knowledge Base</h2>
        <p className="text-slate-500 mt-1">Create and manage your FAQ content</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3 text-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Add New Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Add New Question</h3>
        <FAQForm onAdd={handleAdd} />
      </div>

      {/* List Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800">Existing FAQs</h3>
        </div>
        <div className="p-6">
          <FAQTable faqs={faqs} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
};

export default FAQManager;
