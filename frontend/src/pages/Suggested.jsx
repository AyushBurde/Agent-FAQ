import React, { useState, useEffect } from 'react';
import { Lightbulb, ThumbsUp, Plus } from 'lucide-react';

const Suggested = () => {
    // Mock data
    const suggestions = [
        { id: 1, question: "What is your return policy?", confidence: 0.92, category: "Sales" },
        { id: 2, question: "Do you offer enterprise plans?", confidence: 0.88, category: "Pricing" },
    ];

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">AI Suggestions</h2>
                <p className="text-slate-400 mt-2">Questions the AI thinks you should add.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suggestions.map(s => (
                    <div key={s.id} className="card-dark p-6 hover:border-primary-500/50 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                                <Lightbulb className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                                {Math.round(s.confidence * 100)}% Confidence
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">
                            "{s.question}"
                        </h3>
                        <p className="text-slate-400 text-sm mb-6">Suggested based on 12 recent similar queries.</p>

                        <button className="w-full btn-secondary group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all">
                            <Plus className="w-4 h-4 mr-2" />
                            Accept Suggestion
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default Suggested;
