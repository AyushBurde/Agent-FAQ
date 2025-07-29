// frontend/src/pages/Suggested.jsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const Suggested = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://agent-faq.onrender.com/api/suggestions', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setStats(data.stats);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setError('Failed to load suggestions. Please check if the API server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuggestion = async (suggestion) => {
    setSelectedSuggestion(suggestion);
    setShowAddModal(true);
  };

  const handleSaveFAQ = async (question, answer) => {
    try {
              const res = await fetch('https://agent-faq.onrender.com/api/faqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question,
          answer: answer,
          guildId: 'default'
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save FAQ');
      }

      toast.success('FAQ added successfully!');
      setShowAddModal(false);
      setSelectedSuggestion(null);
      fetchSuggestions(); // Refresh suggestions
    } catch (err) {
      console.error('Error saving FAQ:', err);
      toast.error('Failed to save FAQ');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Refreshments': return 'bg-orange-100 text-orange-800';
      case 'Schedule': return 'bg-blue-100 text-blue-800';
      case 'Technical': return 'bg-purple-100 text-purple-800';
      case 'Logistics': return 'bg-green-100 text-green-800';
      case 'Goodies': return 'bg-pink-100 text-pink-800';
      case 'AI Generated': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">AI Suggestions</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-24 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">AI Suggestions</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-600 font-semibold">Error Loading Suggestions</div>
          <div className="text-red-500 text-sm mt-1">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">AI Suggestions</h2>
      
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
            <div className="text-sm text-gray-600">High Priority</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.mediumPriority}</div>
            <div className="text-sm text-gray-600">Medium Priority</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-green-600">{stats.lowPriority}</div>
            <div className="text-sm text-gray-600">Low Priority</div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        {suggestions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Suggestions Yet</h3>
            <p className="text-gray-500">
              AI will analyze user questions and suggest new FAQ entries as they accumulate.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(suggestion.priority)}`}>
                        {suggestion.priority.toUpperCase()}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(suggestion.category)}`}>
                        {suggestion.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {suggestion.timesAsked} time{suggestion.timesAsked > 1 ? 's' : ''} asked
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{suggestion.question}</h3>
                    <p className="text-sm text-gray-600 mb-3">{suggestion.suggestedAnswer}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Confidence:</span> {(suggestion.confidence * 100).toFixed(0)}% | 
                        <span className="font-medium ml-2">Reason:</span> {suggestion.reason}
                      </div>
                      <button
                        onClick={() => handleAddSuggestion(suggestion)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Add as FAQ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add FAQ Modal */}
      {showAddModal && selectedSuggestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Add Suggested FAQ</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                <input
                  type="text"
                  defaultValue={selectedSuggestion.question}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="suggestion-question"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                <textarea
                  defaultValue={selectedSuggestion.suggestedAnswer}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="suggestion-answer"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const question = document.getElementById('suggestion-question').value;
                    const answer = document.getElementById('suggestion-answer').value;
                    if (question.trim() && answer.trim()) {
                      handleSaveFAQ(question.trim(), answer.trim());
                    } else {
                      toast.error('Please fill in both question and answer');
                    }
                  }}
                  className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Save FAQ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suggested;
