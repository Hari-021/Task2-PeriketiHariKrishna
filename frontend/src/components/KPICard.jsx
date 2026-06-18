import React from 'react';
import { motion } from 'framer-motion';

export default function KPICard({ title, value, icon: Icon, description, color = 'cyan' }) {
  const glowColors = {
    cyan: 'border-cyan-500/20 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.12)] text-cyan-400',
    purple: 'border-fuchsia-500/20 hover:border-fuchsia-500/50 hover:shadow-[0_0_25px_rgba(217,70,239,0.12)] text-fuchsia-400',
    emerald: 'border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.12)] text-emerald-400',
    indigo: 'border-indigo-500/20 hover:border-indigo-500/50 hover:shadow-[0_0_25px_rgba(99,102,241,0.12)] text-indigo-400',
    rose: 'border-rose-500/20 hover:border-rose-500/50 hover:shadow-[0_0_25px_rgba(244,63,94,0.12)] text-rose-400',
    amber: 'border-amber-500/20 hover:border-amber-500/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.12)] text-amber-400'
  };

  const textColors = {
    cyan: 'text-cyan-400',
    purple: 'text-fuchsia-400',
    emerald: 'text-emerald-400',
    indigo: 'text-indigo-400',
    rose: 'text-rose-400',
    amber: 'text-amber-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass-panel p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-36 bg-slate-950/45 ${glowColors[color]}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-400">{title}</span>
        <div className={`p-2 rounded-xl bg-slate-950/60 border border-white/5 ${textColors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-3xl font-bold tracking-tight text-white">{value}</h3>
        {description && (
          <p className="text-xs text-slate-400 mt-1 font-medium truncate">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
