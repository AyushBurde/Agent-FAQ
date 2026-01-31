import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Search, Trash2, Edit3, Save, X } from 'lucide-react';

const FAQManager = () => {
    const [faqs, setFaqs] = useState(([{ _id: '1', question: 'Loading...', answer: 'Fetching data...', guildId: 'default' }]));
    const [loading, setLoading] = useState(true);

    // New FAQ State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            const response = await fetch('/api/faqs');
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setFaqs(data);
        } catch (err) {
            console.error(err);
            // Keep demo data if fail
            setFaqs([
                { _id: '1', question: 'What is the wifi password?', answer: 'The password is SecureWait123', guildId: 'General' },
                { _id: '2', question: 'How do I reset my password?', answer: 'Go to Settings > Account > Reset Password', guildId: 'General' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newQuestion.trim() || !newAnswer.trim()) return toast.error("Please fill all fields");

        try {
            const res = await fetch('/api/faqs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: newQuestion, answer: newAnswer, guildId: 'default' })
            });
            if (!res.ok) throw new Error("Failed");
            const added = await res.json();
            setFaqs([added, ...faqs]);
            setIsModalOpen(false);
            setNewQuestion('');
            setNewAnswer('');
            toast.success("FAQ Added");
        } catch (e) {
            toast.error("Failed to add FAQ");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
            setFaqs(faqs.filter(f => f._id !== id));
            toast.success("Deleted");
        } catch (e) { toast.error("Failed to delete"); }
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Knowledge Base</h2>
                    <p className="text-slate-400 mt-2">Manage the answers your bot provides.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New FAQ
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search FAQs..."
                    className="input-premium pl-12 bg-slate-800/50 border-slate-700/50 focus:bg-slate-800"
                />
            </div>

            {/* FAQ List */}
            <div className="grid grid-cols-1 gap-4">
                {faqs.map((faq) => (
                    <div key={faq._id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800 hover:border-slate-600 transition-all group">
                        <div className="flex justify-between items-start">
                            <div className="flex-1 pr-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20">
                                        {faq.guildId}
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-200 mb-2">{faq.question}</h3>
                                <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
                            </div>
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                                    <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(faq._id)}
                                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Add New FAQ</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Question</label>
                                <input
                                    value={newQuestion}
                                    onChange={e => setNewQuestion(e.target.value)}
                                    className="input-premium"
                                    placeholder="e.g. What are the store hours?"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Answer</label>
                                <textarea
                                    value={newAnswer}
                                    onChange={e => setNewAnswer(e.target.value)}
                                    className="input-premium h-32 resize-none"
                                    placeholder="e.g. We are open 9am - 5pm..."
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAdd}
                                className="btn-primary"
                            >
                                Save FAQ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FAQManager;
