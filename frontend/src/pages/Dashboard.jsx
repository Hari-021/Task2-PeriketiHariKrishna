import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import KPICard from '../components/KPICard';
import DashboardCanvas from '../components/3D/DashboardCanvas';
import AISpendingInsights from '../components/AISpendingInsights';
import SubscriptionModal from '../components/SubscriptionModal';
import NotificationToast from '../components/NotificationToast';
import api from '../utils/api';
import { formatCurrency } from '../utils/currency';
import { 
  DollarSign, Calendar, Eye, ShieldAlert, AlertTriangle, 
  ArrowRight, Sparkles, PlusCircle, CheckCircle, PauseCircle, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [sumRes, remRes, subRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/reminders/upcoming'),
        api.get('/subscriptions')
      ]);
      setSummary(sumRes.data);
      setReminders(remRes.data);
      setSubscriptions(subRes.data);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
      setToast({ message: 'Failed to synchronize live financial metrics.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddSubscription = async (newSub) => {
    try {
      await api.post('/subscriptions', newSub);
      setToast({ message: `Successfully registered "${newSub.serviceName}" subscription!`, type: 'success' });
      fetchDashboardData();
    } catch (err) {
      setToast({ message: 'Failed to create subscription record.', type: 'error' });
      throw err;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'paused': return <PauseCircle className="w-4 h-4 text-amber-400" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      {/* Main Layout Container */}
      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row pt-[72px]">
        <Sidebar />

        {/* Console Workspace */}
        <main className="flex-1 p-6 space-y-6 overflow-hidden md:pl-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">Dashboard Console</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-semibold">Live diagnostics of your recurring capital</p>
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/15 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <PlusCircle className="w-4.5 h-4.5" />
              Add Subscription
            </button>
          </div>

          {loading ? (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
              <span className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
              <p className="text-xs text-slate-400 font-bold tracking-wider uppercase">Syncing Cloud Ledgers...</p>
            </div>
          ) : (
            <>
              {/* KPIs Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard 
                  title="Monthly Spending" 
                  value={formatCurrency(summary?.kpis?.monthlySpending || 0)} 
                  icon={DollarSign} 
                  description="Normalized monthly burn"
                  color="cyan"
                />
                <KPICard 
                  title="Yearly Spending" 
                  value={formatCurrency(summary?.kpis?.yearlySpending || 0)} 
                  icon={DollarSign} 
                  description="Estimated annual cost"
                  color="purple"
                />
                <KPICard 
                  title="Active Subscriptions" 
                  value={summary?.kpis?.activeSubscriptions || 0} 
                  icon={CheckCircle} 
                  description="Services currently active"
                  color="emerald"
                />
                <KPICard 
                  title="Upcoming Renewals" 
                  value={summary?.kpis?.upcomingRenewals || 0} 
                  icon={Calendar} 
                  description="Billing within next 7 days"
                  color={summary?.kpis?.upcomingRenewals > 0 ? 'rose' : 'indigo'}
                />
              </div>

              {/* 3D Visualizer Canvas container */}
              <div className="glass-panel rounded-3xl overflow-hidden border border-white/5 bg-slate-950">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">3D Financial Sandbox</h3>
                    <p className="text-[10px] text-slate-500 font-bold">Interactive mesh layout showing active subscription clusters</p>
                  </div>
                </div>
                <DashboardCanvas />
              </div>

              {/* Grid section for alerts, AI, and recent activities */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Upcoming Renewals list & recent activities */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Renewal alerts */}
                  {reminders.length > 0 && (
                    <div className="glass-panel p-5 rounded-2xl border border-rose-500/20 bg-rose-950/5 space-y-3">
                      <div className="flex items-center gap-2 text-rose-400">
                        <AlertTriangle className="w-5 h-5" />
                        <h4 className="text-sm font-bold">Urgent renewal notices!</h4>
                      </div>
                      
                      <div className="divide-y divide-white/5">
                        {reminders.map((rem) => (
                          <div key={rem.id} className="py-2.5 flex items-center justify-between text-xs sm:text-sm first:pt-0 last:pb-0">
                            <div>
                              <p className="font-bold text-white">{rem.serviceName}</p>
                              <p className="text-[10px] text-slate-500 font-semibold">{rem.plan || 'Standard Plan'} • {formatCurrency(rem.amount)}/{rem.billingCycle}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                Renews in {rem.daysRemaining} days
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Activity list */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-950/45">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">Recent Ledger Activity</h4>
                      <Link to="/subscriptions" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                        View All
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    {subscriptions.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-6">No recent updates detected. Create a subscription to begin.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-white/5 text-slate-400 font-bold uppercase">
                              <th className="pb-3">Service</th>
                              <th className="pb-3">Category</th>
                              <th className="pb-3">Cost</th>
                              <th className="pb-3 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {subscriptions.slice(0, 4).map((sub) => (
                              <tr key={sub.id || sub._id} className="text-slate-300 hover:bg-white/5">
                                <td className="py-3 font-bold text-white">{sub.serviceName}</td>
                                <td className="py-3 text-slate-400 capitalize">{sub.category}</td>
                                <td className="py-3 font-bold">{formatCurrency(sub.amount)}/{sub.billingCycle}</td>
                                <td className="py-3 text-right">
                                  <div className="inline-flex items-center gap-1.5 capitalize text-[10px] font-bold bg-slate-900 border border-white/5 px-2 py-0.5 rounded-full">
                                    {getStatusIcon(sub.status)}
                                    {sub.status}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side AI insights column */}
                <div className="lg:col-span-1">
                  <AISpendingInsights subscriptions={subscriptions} />
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Subscription Creator Modal */}
      <SubscriptionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddSubscription}
      />

      {/* Global Toast */}
      <NotificationToast 
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}
