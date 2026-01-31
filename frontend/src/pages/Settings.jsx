import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Save, RefreshCw, Bell, Sliders, Globe } from 'lucide-react';

const Settings = () => {
    const [settings, setSettings] = useState({
        similarityThreshold: 0.85,
        adminNotifications: true,
        theme: 'dark'
    });

    const handleSave = () => {
        // Just mock save for now since auth is disabled
        toast.success("Settings saved successfully");
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Settings</h2>
                    <p className="text-slate-400 mt-2">Configure behavior and preferences.</p>
                </div>
                <button onClick={handleSave} className="btn-primary">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </button>
            </div>

            {/* AI Settings */}
            <div className="card-dark p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Sliders className="w-5 h-5 mr-3 text-primary-500" />
                    AI Configuration
                </h3>

                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-slate-300">Similarity Threshold</label>
                            <span className="text-primary-400 font-mono text-sm">{settings.similarityThreshold}</span>
                        </div>
                        <input
                            type="range"
                            min="0.5" max="1.0" step="0.05"
                            value={settings.similarityThreshold}
                            onChange={e => setSettings({ ...settings, similarityThreshold: parseFloat(e.target.value) })}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                        />
                        <p className="text-xs text-slate-500 mt-2">Higher values require more precise matches. Lower values are more generous.</p>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="card-dark p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Bell className="w-5 h-5 mr-3 text-amber-500" />
                    Notifications
                </h3>

                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-slate-200 font-medium">Admin Alerts</div>
                        <div className="text-slate-500 text-sm">Receive Discord DMs for repeated unknown questions.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={settings.adminNotifications} className="sr-only peer" onChange={() => { }} />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Settings;
