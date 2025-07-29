// frontend/src/pages/Activity.jsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const Activity = () => {
  const [unknownQuestions, setUnknownQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUnknownQuestions();
  }, []);

  const fetchUnknownQuestions = async () => {
    try {
      const response = await fetch('https://agent-faq.onrender.com/api/unknown-questions');
      if (!response.ok) {
        throw new Error('Failed to fetch unknown questions');
      }
      const data = await response.json();
      setUnknownQuestions(data);
    } catch (err) {
      console.error('Error fetching unknown questions:', err);
      setError('Failed to load activity data. Please check if the API server is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Activity</h2>
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
        <h2 className="text-2xl font-bold mb-4">Activity</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-600 font-semibold">Error Loading Activity</div>
          <div className="text-red-500 text-sm mt-1">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Activity</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Unknown Questions</h3>
          <p className="text-gray-600">Questions that users asked but the bot couldn't answer.</p>
        </div>
        
        {unknownQuestions.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-green-800 font-semibold">Great Job! 🎉</div>
            <div className="text-green-600 text-sm mt-1">No unknown questions found. Your bot is handling all queries well!</div>
          </div>
        ) : (
          <div className="space-y-4">
            {unknownQuestions.map((question) => (
              <div key={question._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">{question.text}</div>
                    <div className="text-sm text-gray-500">
                      Asked {question.count} time{question.count > 1 ? 's' : ''} • 
                      Guild: {question.guildId || 'Unknown'}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      First asked: {new Date(question.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                      {question.count} time{question.count > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;
