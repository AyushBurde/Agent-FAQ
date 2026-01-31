import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Users,
  MessageCircle,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`${API_URL}/api/analytics`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const chartData = stats?.chartData || [
    { name: 'Mon', queries: 0 },
    { name: 'Tue', queries: 0 },
    { name: 'Wed', queries: 0 },
    { name: 'Thu', queries: 0 },
    { name: 'Fri', queries: 0 },
    { name: 'Sat', queries: 0 },
    { name: 'Sun', queries: 0 },
  ];

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, colorClass }) => (
    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 shadow-lg backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colorClass} bg-opacity-20 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
        {trend && (
          <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
            }`}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        <p className="text-sm font-medium text-slate-400 mt-1">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Overview</h2>
          <p className="text-slate-400 mt-2">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-400 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50 shadow-sm">
          <Activity className="w-4 h-4 text-emerald-500" />
          <span>Live updates active</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Questions"
          value={stats?.totalQueries || '0'}
          icon={MessageCircle}
          trend="up"
          trendValue="Live"
          colorClass="bg-blue-500"
        />
        <StatCard
          title="Matched FAQs"
          value={stats?.matched || '0'}
          icon={CheckCircle2}
          trend="up"
          trendValue="Live"
          colorClass="bg-emerald-500"
        />
        <StatCard
          title="Unanswered"
          value={stats?.unmatched || '0'}
          icon={HelpCircle}
          trend="down"
          trendValue="Live"
          colorClass="bg-amber-500"
        />
        <StatCard
          title="Users Engaged"
          value={stats?.uniqueUsers || '0'}
          icon={Users}
          trend="up"
          trendValue="Live"
          colorClass="bg-violet-500"
        />
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 shadow-sm backdrop-blur-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-white">Activity Trends</h3>
              <p className="text-sm text-slate-400">Daily question volume</p>
            </div>
            <select className="bg-slate-900 border border-slate-700 text-sm text-slate-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-primary-500/50">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    border: '1px solid #334155',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
                    padding: '12px'
                  }}
                  itemStyle={{ color: '#f1f5f9', fontWeight: 600 }}
                />
                <Area
                  type="monotone"
                  dataKey="queries"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorQueries)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 shadow-sm flex flex-col backdrop-blur-sm">
          <h3 className="text-lg font-bold text-white mb-6">Recent Live Feed</h3>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="flex items-start space-x-4 group">
                <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center border border-slate-700 group-hover:border-primary-500/50 transition-colors">
                  <MessageCircle className="w-4 h-4 text-slate-400 group-hover:text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">How do I reset my password?</p>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="text-xs text-slate-500">2 mins ago</span>
                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                    <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Matched</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 text-sm font-medium text-slate-300 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-colors flex items-center justify-center border border-slate-700">
            View All History <ArrowUpRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
