import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Activity,
  Lightbulb,
  Zap,
  ChevronRight
} from 'lucide-react';

const NavItem = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group ${active
        ? 'bg-primary-600/10 text-primary-600 font-medium'
        : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-200'
      }`}
  >
    <div className="flex items-center space-x-3">
      <Icon className={`w-5 h-5 transition-colors ${active ? 'text-primary-500' : 'text-slate-500 group-hover:text-slate-300'}`} />
      <span>{label}</span>
    </div>
    {active && <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-lg shadow-primary-500/50"></div>}
  </Link>
);

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed inset-y-0 left-0 w-72 bg-[#0F172A] border-r border-slate-800/50 flex flex-col z-50">
      {/* Header */}
      <div className="p-6 pb-2">
        <div className="flex items-center space-x-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-violet-600 flex items-center justify-center shadow-lg shadow-primary-500/20 ring-1 ring-white/10">
            <Zap className="w-6 h-6 text-white" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Agent FAQ
            </h1>
            <p className="text-xs text-slate-400 font-medium">AI Knowledge Base</p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="px-4 py-2 text-xs font-bold text-slate-600 uppercase tracking-widest">Platform</p>
          <NavItem
            to="/dashboard"
            active={isActive('/dashboard')}
            label="Overview"
            icon={LayoutDashboard}
          />
          <NavItem
            to="/activity"
            active={isActive('/activity')}
            label="Activity Feed"
            icon={Activity}
          />
        </div>

        <div className="space-y-1 mt-8">
          <p className="px-4 py-2 text-xs font-bold text-slate-600 uppercase tracking-widest">Knowledge</p>
          <NavItem
            to="/faq"
            active={isActive('/faq')}
            label="Database"
            icon={MessageSquare}
          />
          <NavItem
            to="/suggested"
            active={isActive('/suggested')}
            label="Insights"
            icon={Lightbulb}
          />
          <NavItem
            to="/settings"
            active={isActive('/settings')}
            label="Configuration"
            icon={Settings}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto p-6 border-t border-slate-800/50">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-slate-700 to-slate-600 flex items-center justify-center text-sm font-bold text-white border-2 border-slate-700 group-hover:border-primary-500/50 transition-colors">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">Admin User</p>
            <p className="text-xs text-slate-500 truncate">Pro Plan</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
