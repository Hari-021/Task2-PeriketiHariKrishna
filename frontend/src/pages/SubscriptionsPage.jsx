import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import SubscriptionCard from '../components/SubscriptionCard';
import SubscriptionModal from '../components/SubscriptionModal';
import NotificationToast from '../components/NotificationToast';
import api from '../utils/api';
import { Search, Plus, Filter, SortAsc, SortDesc, SlidersHorizontal, RefreshCw } from 'lucide-react';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [billingCycle, setBillingCycle] = useState('All');
  const [status, setStatus] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('renewalDate'); // 'cost', 'renewalDate', 'serviceName'
  const [order, setOrder] = useState('asc'); // 'asc' or 'desc'

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSub, setActiveSub] = useState(null); // Sub details for editing
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const categories = [
    'All', 'Entertainment', 'Music', 'Video Streaming', 'Gaming', 'Cloud Storage', 
    'Productivity', 'AI Tools', 'Education', 'Health', 'Shopping', 
    'Finance', 'Utilities', 'Other'
  ];

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      // Construct query parameters
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category && category !== 'All') params.append('category', category);
      if (billingCycle && billingCycle !== 'All') params.append('billingCycle', billingCycle);
      if (status && status !== 'All') params.append('status', status);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      params.append('sortBy', sortBy);
      params.append('order', order);

      const res = await api.get(`/subscriptions?${params.toString()}`);
      setSubscriptions(res.data);
    } catch (err) {
      console.error('Failed to load subscriptions list:', err);
      setToast({ message: 'Error retrieving subscriptions ledger.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search input for performance
    const delayDebounce = setTimeout(() => {
      fetchSubscriptions();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, category, billingCycle, status, minPrice, maxPrice, sortBy, order]);

  const handleSaveSubscription = async (formData) => {
    try {
      if (formData.id || formData._id) {
        const id = formData.id || formData._id;
        await api.put(`/subscriptions/${id}`, formData);
        setToast({ message: `Successfully updated "${formData.serviceName}" record.`, type: 'success' });
      } else {
        await api.post('/subscriptions', formData);
        setToast({ message: `Successfully added "${formData.serviceName}" subscription.`, type: 'success' });
      }
      fetchSubscriptions();
    } catch (err) {
      setToast({ message: 'Error updating subscription records.', type: 'error' });
      throw err;
    }
  };

  const handleDeleteSubscription = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) return;
    try {
      await api.delete(`/subscriptions/${id}`);
      setToast({ message: 'Subscription removed successfully.', type: 'success' });
      fetchSubscriptions();
    } catch (err) {
      setToast({ message: 'Failed to delete subscription record.', type: 'error' });
    }
  };

  const handleTogglePauseSubscription = async (sub) => {
    try {
      const updatedStatus = sub.status === 'paused' ? 'active' : 'paused';
      await api.put(`/subscriptions/${sub.id || sub._id}`, {
        ...sub,
        status: updatedStatus
      });
      setToast({ 
        message: `Subscription "${sub.serviceName}" is now ${updatedStatus}.`, 
        type: 'success' 
      });
      fetchSubscriptions();
    } catch (err) {
      setToast({ message: 'Failed to update subscription status.', type: 'error' });
    }
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setBillingCycle('All');
    setStatus('All');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('renewalDate');
    setOrder('asc');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row pt-[72px]">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 overflow-hidden md:pl-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">Subscription Management</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-semibold">Track and configure recurring financial commitments</p>
            </div>
            
            <button
              onClick={() => {
                setActiveSub(null);
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/15 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus className="w-4.5 h-4.5" />
              Add Subscription
            </button>
          </div>

          {/* Filtering Console */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-slate-950/45 space-y-4">
            {/* Upper Search Bar & Filters Trigger */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-500" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search subscription by service name..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/5 focus:border-cyan-500 text-white placeholder-slate-500 outline-none text-sm transition-all"
                />
              </div>

              {/* Sorting options */}
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/5 focus:border-cyan-500 text-white text-sm outline-none cursor-pointer"
                >
                  <option value="renewalDate">Renewal Date</option>
                  <option value="cost">Cost amount</option>
                  <option value="serviceName">Alphabetical</option>
                </select>

                <button
                  onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                  className="p-2.5 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-white hover:border-cyan-500 transition-all cursor-pointer"
                  title={order === 'asc' ? 'Ascending Order' : 'Descending Order'}
                >
                  {order === 'asc' ? <SortAsc className="w-4.5 h-4.5" /> : <SortDesc className="w-4.5 h-4.5" />}
                </button>

                <button
                  onClick={resetFilters}
                  className="px-3 py-2.5 rounded-xl bg-slate-900 border border-white/5 text-slate-400 hover:text-white hover:border-cyan-500 transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            </div>

            {/* Grid for Filter Attributes */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t border-white/5">
              {/* Category */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-white/5 text-white text-xs outline-none cursor-pointer"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Billing Cycle */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Billing Cycle</label>
                <select
                  value={billingCycle}
                  onChange={(e) => setBillingCycle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-white/5 text-white text-xs outline-none capitalize cursor-pointer"
                >
                  <option value="All">All Cycles</option>
                  <option value="weekly">weekly</option>
                  <option value="monthly">monthly</option>
                  <option value="quarterly">quarterly</option>
                  <option value="yearly">yearly</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900/60 border border-white/5 text-white text-xs outline-none capitalize cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="active">active</option>
                  <option value="paused">paused</option>
                  <option value="expired">expired</option>
                  <option value="archived">archived</option>
                </select>
              </div>

              {/* Min Price */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Min Price</label>
                <input 
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900/60 border border-white/5 text-white text-xs outline-none placeholder-slate-600"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Max Price</label>
                <input 
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900/60 border border-white/5 text-white text-xs outline-none placeholder-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Subscriptions Grid Deck */}
          {loading ? (
            <div className="h-[40vh] flex flex-col items-center justify-center gap-3">
              <span className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Syncing ledger card index...</p>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl border border-white/5 bg-slate-950/45 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center mx-auto text-slate-500">
                <Filter className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">No matches found</h4>
                <p className="text-xs text-slate-500 font-medium">Try broadening your keyword parameters or reset search filters</p>
              </div>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions.map((sub) => (
                <SubscriptionCard 
                  key={sub.id || sub._id}
                  sub={sub}
                  onEdit={(selected) => {
                    setActiveSub(selected);
                    setIsModalOpen(true);
                  }}
                  onDelete={handleDeleteSubscription}
                  onTogglePause={handleTogglePauseSubscription}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Subscription Editor Modal */}
      <SubscriptionModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setActiveSub(null);
        }}
        onSave={handleSaveSubscription}
        subscription={activeSub}
      />

      {/* Global Notifications */}
      <NotificationToast 
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}
