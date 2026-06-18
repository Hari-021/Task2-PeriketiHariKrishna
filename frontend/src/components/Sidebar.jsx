import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Receipt, BarChart3, LogOut, User as UserIcon } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Console', icon: LayoutDashboard },
    { to: '/subscriptions', label: 'Subscriptions', icon: Receipt },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <aside className="w-full md:w-64 glass-panel border-r border-white/5 md:h-screen flex flex-col justify-between p-4 sticky top-[72px] md:top-0 z-40 bg-slate-950/70 md:pt-24 pb-8">
      {/* Upper Navigation Links */}
      <div className="space-y-6">
        <div className="hidden md:block px-3 py-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Navigation</p>
        </div>
        <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap md:whitespace-normal ${
                  isActive 
                    ? 'bg-gradient-to-r from-cyan-950/45 to-slate-900 border border-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.08)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile Details */}
      <div className="mt-8 pt-4 border-t border-white/5 space-y-4">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-cyan-500/10">
              {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
            </div>
            <div className="truncate hidden md:block">
              <p className="text-sm font-semibold text-white truncate">{user.name || 'Premium User'}</p>
              <p className="text-xs text-slate-400 truncate">{user.email || 'user@subtracker.3d'}</p>
            </div>
          </div>
        )}
        
        <button
          onClick={handleLogout}
          className="hidden md:flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-950/20 hover:text-red-300 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
