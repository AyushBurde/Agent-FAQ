import React, { useState, useEffect } from 'react';
import FAQForm from '../components/faqForm.jsx';
import FAQTable from '../components/faqTable.jsx';
import toast from 'react-hot-toast';

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
      const response = await fetch('https://agent-faq.onrender.com/api/faqs');
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
              const response = await fetch('https://agent-faq.onrender.com/api/faqs', {
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
              const response = await fetch(`https://agent-faq.onrender.com/api/faqs/${id}`, {
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
      <div>
        <h2 className="text-2xl font-bold mb-4">Manage FAQs</h2>
        <div className="animate-pulse">
          <div className="bg-gray-200 h-32 rounded mb-4"></div>
          <div className="bg-gray-200 h-64 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Manage FAQs</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-600 font-semibold">Error Loading FAQs</div>
          <div className="text-red-500 text-sm mt-1">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage FAQs</h2>
      <FAQForm onAdd={handleAdd} />
      <div className="mt-8">
        <FAQTable faqs={faqs} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default FAQManager;

