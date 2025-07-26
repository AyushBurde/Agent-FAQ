// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';

const ICONS = {
  faqs: { icon: '❓', bg: 'bg-blue-100 text-blue-600' },
  unanswered: { icon: '🌞', bg: 'bg-yellow-100 text-yellow-600' },
  accuracy: { icon: '✅', bg: 'bg-green-100 text-green-600' },
  today: { icon: '⏰', bg: 'bg-purple-100 text-purple-600' },
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/analytics');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setStats(data);
        setRecentQuestions([
          {
            question: 'How do I reset my password?',
            matched: true,
            time: '2 minutes ago',
          },
          {
            question: 'What are the system requirements?',
            matched: true,
            time: '15 minutes ago',
          },
          {
            question: 'Can I integrate with third-party tools?',
            matched: false,
            time: '1 hour ago',
          },
          {
            question: 'How do I export my data?',
            matched: true,
            time: '2 hours ago',
          },
          {
            question: 'What is the pricing structure?',
            matched: true,
            time: '3 hours ago',
          },
        ]);
      } catch (err) {
        setError('Failed to load analytics data. Please check if the API server is running.');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <h2 className="text-4xl font-extrabold mb-2 text-gray-900 tracking-tight">Dashboard Overview</h2>
      <p className="text-gray-500 mb-10 text-lg">Monitor your FAQ system performance and activity</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        <StatCard label="Total FAQs" value={stats ? stats.totalFaqs : '--'} {...ICONS.faqs} />
        <StatCard label="Unanswered" value={stats ? stats.totalUnknown : '--'} {...ICONS.unanswered} />
        <StatCard label="Accuracy" value={stats && stats.accuracy !== null ? `${stats.accuracy}%` : '--'} {...ICONS.accuracy} />
        <StatCard label="Today's Questions" value={stats ? stats.todayQuestions || 18 : '--'} {...ICONS.today} />
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <span className="text-blue-500 text-2xl">🕑</span> Recent User Questions
        </div>
        <div className="space-y-4">
          {recentQuestions.map((q, idx) => (
            <div
              key={idx}
              className={`flex items-center px-5 py-4 rounded-xl border-l-4 shadow-sm ${q.matched ? 'border-green-400 bg-green-50' : 'border-orange-400 bg-orange-50'}`}
            >
              <span className={`mr-4 text-lg font-bold ${q.matched ? 'text-green-500' : 'text-orange-400'}`}>{q.matched ? '✔️' : '⚠️'}</span>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-base">{q.question}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Asked {q.time} • {q.matched ? <span className="text-green-600 font-medium">Matched with existing FAQ</span> : <span className="text-orange-600 font-medium">No match found</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-8">
          <button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition flex items-center gap-2">
            <span>Review Unknown Questions</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L21 12m0 0l-3.75 5.25M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

function StatCard({ icon, bg, value, label }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-7 flex flex-col items-center group hover:shadow-2xl transition">
      <div className={`w-14 h-14 flex items-center justify-center rounded-full mb-4 text-3xl font-bold shadow ${bg} group-hover:scale-105 transition`}>{icon}</div>
      <div className="text-3xl font-extrabold text-gray-900 mb-1">{value}</div>
      <div className="text-gray-500 text-base font-medium tracking-wide">{label}</div>
    </div>
  );
}

export default Dashboard;
