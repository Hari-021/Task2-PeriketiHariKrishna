import React from 'react';
import { Edit2, Trash2, Calendar, CreditCard, Play, Pause, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { Film, Music, Cpu, Cloud, Gamepad2, Bookmark, GraduationCap, Heart, ShoppingBag, Banknote, HelpCircle } from 'lucide-react';

export default function SubscriptionCard({ sub, onEdit, onDelete, onTogglePause }) {
  // Compute remaining days until renewal
  const calculateRenewalStatus = () => {
    const now = new Date();
    const renewal = new Date(sub.renewalDate);
    const diffTime = renewal.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let cycleDays = 30;
    if (sub.billingCycle === 'weekly') cycleDays = 7;
    if (sub.billingCycle === 'quarterly') cycleDays = 90;
    if (sub.billingCycle === 'yearly') cycleDays = 365;

    const percent = Math.max(0, Math.min(100, (diffDays / cycleDays) * 100));
    return {
      days: Math.max(0, diffDays),
      percent: percent,
      isExpired: diffDays < 0
    };
  };

  const { days, percent, isExpired } = calculateRenewalStatus();

  // Get matching category icon
  const getCategoryIcon = (cat) => {
    const c = cat ? cat.toLowerCase() : '';
    if (c.includes('video') || c.includes('streaming') || c.includes('entertainment')) return Film;
    if (c.includes('music')) return Music;
    if (c.includes('gaming')) return Gamepad2;

    if (c.includes('cloud') || c.includes('storage')) return Cloud;
    if (c.includes('ai') || c.includes('tool') || c.includes('tech') || c.includes('software')) return Cpu;
    if (c.includes('education')) return GraduationCap;
    if (c.includes('health') || c.includes('gym')) return Heart;
    if (c.includes('shop')) return ShoppingBag;
    if (c.includes('finance')) return Banknote;
    return Bookmark;
  };

  const IconComponent = getCategoryIcon(sub.category);

  // Category specific neon colors
  const categoryBadgeColors = (cat) => {
    const c = cat ? cat.toLowerCase() : '';
    if (c.includes('video') || c.includes('entertainment')) return 'bg-red-950/35 text-red-400 border-red-500/20';
    if (c.includes('music')) return 'bg-emerald-950/35 text-emerald-400 border-emerald-500/20';
    if (c.includes('ai') || c.includes('tech')) return 'bg-cyan-950/35 text-cyan-400 border-cyan-500/20';
    if (c.includes('gaming')) return 'bg-fuchsia-950/35 text-fuchsia-400 border-fuchsia-500/20';
    if (c.includes('cloud') || c.includes('storage')) return 'bg-indigo-950/35 text-indigo-400 border-indigo-500/20';
    return 'bg-slate-900 text-slate-300 border-white/5';
  };

  return (
    <div className={`glass-card p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden bg-slate-950/35 flex flex-col justify-between h-56 ${
      sub.status === 'paused' 
        ? 'opacity-60 border-white/5' 
        : isExpired 
          ? 'border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.03)]' 
          : 'border-white/5 hover:border-cyan-500/30'
    }`}>
      {/* Decorative colored glow dot based on status */}
      <span className={`absolute top-0 right-0 w-2 h-2 rounded-full m-3 ${
        sub.status === 'active' 
          ? isExpired 
            ? 'bg-rose-500 animate-ping' 
            : 'bg-emerald-400' 
          : 'bg-slate-500'
      }`} />

      {/* Header (Service Name + Category Badge) */}
      <div>
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-300">
            <IconComponent className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex-1 truncate">
            <h4 className="text-base font-bold text-white truncate leading-snug">{sub.serviceName}</h4>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${categoryBadgeColors(sub.category)}`}>
                {sub.category}
              </span>
              {sub.plan && (
                <span className="text-[10px] text-slate-400 font-semibold max-w-[80px] truncate bg-white/5 px-2 py-0.5 rounded-full">
                  {sub.plan}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Cost & Cycle */}
        <div className="mt-4 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-white">
            {formatCurrency(sub.amount)}
          </span>
          <span className="text-xs text-slate-400 font-medium lowercase">
            / {sub.billingCycle}
          </span>
        </div>
      </div>

      {/* Renewal Progress bar */}
      <div className="mt-4 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-cyan-500" />
            {isExpired ? 'Expired' : `Renews in ${days}d`}
          </span>
          <span>{new Date(sub.renewalDate).toLocaleDateString('default', { month: 'short', day: 'numeric' })}</span>
        </div>
        
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              isExpired 
                ? 'bg-rose-500' 
                : days <= 3 
                  ? 'bg-amber-500' 
                  : 'bg-gradient-to-r from-cyan-500 to-indigo-500'
            }`} 
            style={{ width: `${isExpired ? 100 : percent}%` }}
          />
        </div>
      </div>

      {/* Footer (Quick Actions) */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        {/* Toggle Pause Switch */}
        <button
          onClick={() => onTogglePause(sub)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            sub.status === 'paused'
              ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/20 hover:bg-emerald-950/40'
              : 'bg-slate-900 text-slate-400 border-white/5 hover:text-white hover:bg-white/5'
          }`}
        >
          {sub.status === 'paused' ? (
            <>
              <Play className="w-3 h-3" />
              Resume
            </>
          ) : (
            <>
              <Pause className="w-3 h-3" />
              Pause
            </>
          )}
        </button>

        {/* Edit and Delete */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(sub)}
            className="p-1.5 rounded-lg border border-transparent hover:border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Edit Subscription"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(sub.id || sub._id)}
            className="p-1.5 rounded-lg border border-transparent hover:border-red-500/20 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
