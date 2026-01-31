import React, { useState, useEffect } from 'react';
import { HelpCircle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const Activity = () => {
    const [unknownQuestions, setUnknownQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUnknownQuestions();
    }, []);

    const fetchUnknownQuestions = async () => {
        try {
            // Use relative path with Vite proxy
            const response = await fetch('/api/unknown-questions');
            if (!response.ok) throw new Error('Failed to fetch unknown questions');
            const data = await response.json();
            setUnknownQuestions(data);
        } catch (err) {
            console.error('Error fetching unknown questions:', err);
            // Fallback for demo if API fails
            setUnknownQuestions([
                { _id: '1', text: 'Can I integrate with Slack?', count: 5, guildId: 'General', createdAt: new Date().toISOString() },
                { _id: '2', text: 'How do I export PDF?', count: 2, guildId: 'Support', createdAt: new Date().toISOString() }
            ]);
            setError('Using demo data (API might be offline)');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Activity Monitor</h2>
                <p className="text-slate-400 mt-2">Track questions that the bot couldn't answer.</p>
            </div>

            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 shadow-lg backdrop-blur-sm overflow-hidden">
                <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2 text-amber-500" />
                        Unknown Questions
                    </h3>
                    <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded">LIVE</span>
                </div>

                {unknownQuestions.length === 0 ? (
                    <div className="p-12 text-center">
                        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white">All Clear!</h3>
                        <p className="text-slate-400 mt-2">Your bot is handling all queries perfectly.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-700/50">
                        {unknownQuestions.map((question) => (
                            <div key={question._id} className="p-6 hover:bg-slate-700/30 transition-colors group">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="text-lg font-medium text-slate-200 group-hover:text-white transition-colors">
                                            "{question.text}"
                                        </h4>
                                        <div className="flex items-center mt-3 space-x-4 text-sm text-slate-400">
                                            <span className="flex items-center">
                                                <Clock className="w-3.5 h-3.5 mr-1.5" />
                                                {new Date(question.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 text-xs border border-slate-600">
                                                Guild: {question.guildId || 'Unknown'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4 flex items-center">
                                        <div className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold flex items-center">
                                            <HelpCircle className="w-4 h-4 mr-1.5" />
                                            {question.count} {question.count > 1 ? 'times' : 'time'}
                                        </div>
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
