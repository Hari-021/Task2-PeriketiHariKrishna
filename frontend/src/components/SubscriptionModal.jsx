import React, { useState, useEffect } from 'react';
import { X, Save, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubscriptionModal({ isOpen, onClose, onSave, subscription = null }) {
  const categories = [
    'Entertainment', 'Music', 'Video Streaming', 'Gaming', 'Cloud Storage', 
    'Productivity', 'AI Tools', 'Education', 'Health', 'Shopping', 
    'Finance', 'Utilities', 'Other'
  ];

  const cycles = ['weekly', 'monthly', 'quarterly', 'yearly'];
  const statuses = ['active', 'paused', 'expired', 'archived'];

  const initialFormState = {
    serviceName: '',
    category: 'Entertainment',
    plan: '',
    amount: '',
    billingCycle: 'monthly',
    renewalDate: '',
    paymentMethod: '',
    autoRenew: true,
    status: 'active',
    notes: ''
  };

  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subscription) {
      // Format date to YYYY-MM-DD for date input
      const formattedDate = subscription.renewalDate 
        ? new Date(subscription.renewalDate).toISOString().substring(0, 10) 
        : '';
      setForm({
        ...subscription,
        renewalDate: formattedDate
      });
    } else {
      setForm(initialFormState);
    }
    setError('');
  }, [subscription, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.serviceName.trim()) {
      setError('Service Name is required');
      return;
    }
    if (!form.amount || Number(form.amount) < 0) {
      setError('Please enter a valid positive cost');
      return;
    }
    if (!form.renewalDate) {
      setError('Renewal Date is required');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        ...form,
        amount: Number(form.amount)
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to save subscription details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop blur overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-lg glass-panel rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden bg-slate-950/95 max-h-[90vh] flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              {subscription ? 'Edit Subscription' : 'Add Subscription'}
            </h3>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
            {error && (
              <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Service Name */}
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Service Name</label>
                <input 
                  type="text" 
                  name="serviceName"
                  value={form.serviceName}
                  onChange={handleChange}
                  placeholder="e.g. Netflix, Spotify, AWS"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/5 focus:border-cyan-500 text-white placeholder-slate-500 outline-none text-sm transition-colors"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/5 focus:border-cyan-500 text-white outline-none text-sm transition-colors cursor-pointer"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Plan Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Plan</label>
                <input 
                  type="text" 
                  name="plan"
                  value={form.plan}
                  onChange={handleChange}
                  placeholder="e.g. Family, Pro, Starter"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/5 focus:border-cyan-500 text-white placeholder-slate-500 outline-none text-sm transition-colors"
                />
              </div>

              {/* Cost amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Cost</label>
                <input 
                  type="number" 
                  step="0.01"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/5 focus:border-cyan-500 text-white placeholder-slate-500 outline-none text-sm transition-colors"
                />
              </div>

              {/* Billing Cycle */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Billing Cycle</label>
                <select
                  name="billingCycle"
                  value={form.billingCycle}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/5 focus:border-cyan-500 text-white outline-none text-sm transition-colors capitalize cursor-pointer"
                >
                  {cycles.map(cy => <option key={cy} value={cy}>{cy}</option>)}
                </select>
              </div>

              {/* Renewal Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Next Renewal</label>
                <input 
                  type="date" 
                  name="renewalDate"
                  value={form.renewalDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/5 focus:border-cyan-500 text-white outline-none text-sm transition-colors cursor-pointer"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Payment Method</label>
                <input 
                  type="text" 
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                  placeholder="e.g. Visa 1122, PayPal"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/5 focus:border-cyan-500 text-white placeholder-slate-500 outline-none text-sm transition-colors"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/5 focus:border-cyan-500 text-white outline-none text-sm transition-colors capitalize cursor-pointer"
                >
                  {statuses.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>

              {/* Auto Renew */}
              <div className="flex items-center gap-2 mt-4 select-none">
                <input 
                  type="checkbox" 
                  name="autoRenew"
                  id="autoRenew"
                  checked={form.autoRenew}
                  onChange={handleChange}
                  className="w-4 h-4 rounded bg-slate-900 border border-white/5 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="autoRenew" className="text-sm text-slate-300 font-semibold cursor-pointer">
                  Auto Renewing Subscription
                </label>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Notes</label>
              <textarea 
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Add notes, details, codes..."
                rows="3"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/5 focus:border-cyan-500 text-white placeholder-slate-500 outline-none text-sm transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/15 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save Sub'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
