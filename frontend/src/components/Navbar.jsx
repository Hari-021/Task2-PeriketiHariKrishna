import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Landmark, LayoutDashboard, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const isDashboardPage = location.pathname.startsWith('/dashboard') || 
                          location.pathname.startsWith('/subscriptions') ||
                          location.pathname.startsWith('/analytics');

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled || isDashboardPage 
        ? 'py-4 bg-slate-950/80 backdrop-blur-md border-b border-white/5' 
        : 'py-6 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              SubTracker<span className="text-cyan-400 font-extrabold text-2xl leading-none">3D</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {!isDashboardPage ? (
              <>
                <a href="#features" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">Features</a>
                <a href="#preview" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">3D Preview</a>
                <a href="#pricing" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">Pricing</a>
                <a href="#faq" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">FAQ</a>
              </>
            ) : (
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-cyan-950/30 text-cyan-400 border border-cyan-500/20 uppercase tracking-widest animate-pulse">
                Pro Account Active
              </span>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold glass-card border border-white/10 hover:bg-white/5 transition-all text-white"
                >
                  <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                  Console
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-red-950/20 border border-red-500/30 hover:bg-red-950/40 text-red-400 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-white focus:outline-none cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 px-4 pt-2 pb-6 space-y-4">
          {!isDashboardPage && (
            <div className="flex flex-col gap-3">
              <a href="#features" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-cyan-400 transition-colors py-2 border-b border-white/5">Features</a>
              <a href="#preview" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-cyan-400 transition-colors py-2 border-b border-white/5">3D Preview</a>
              <a href="#pricing" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-cyan-400 transition-colors py-2 border-b border-white/5">Pricing</a>
              <a href="#faq" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-cyan-400 transition-colors py-2 border-b border-white/5">FAQ</a>
            </div>
          )}
          
          <div className="flex flex-col gap-3 pt-2">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold"
                >
                  <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 font-bold cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 rounded-xl border border-white/10 text-slate-300 font-bold hover:text-white"
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold shadow-lg shadow-cyan-500/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
