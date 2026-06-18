import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationToast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  const styles = {
    success: 'bg-emerald-950/90 border-emerald-500/35 text-emerald-400 shadow-[0_10px_30px_rgba(16,185,129,0.06)]',
    error: 'bg-rose-950/90 border-rose-500/35 text-rose-400 shadow-[0_10px_30px_rgba(244,63,94,0.06)]',
    warning: 'bg-amber-950/90 border-amber-500/35 text-amber-400 shadow-[0_10px_30px_rgba(245,158,11,0.06)]'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />,
    error: <XCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />,
    warning: <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400" />
  };

  return (
    <AnimatePresence>
      {message && (
        <div className="fixed bottom-5 right-5 z-[100] max-w-sm w-[90vw] sm:w-auto">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className={`flex items-center gap-3.5 p-4 rounded-2xl border backdrop-blur-md shadow-2xl ${styles[type]}`}
          >
            <div>{icons[type]}</div>
            <p className="flex-1 text-xs font-semibold leading-relaxed text-slate-100 pr-2">
              {message}
            </p>
            <button 
              onClick={onClose} 
              className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
