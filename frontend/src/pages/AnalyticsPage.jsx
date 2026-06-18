import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import AnalyticsCharts from '../components/AnalyticsCharts';
import NotificationToast from '../components/NotificationToast';
import api from '../utils/api';
import { formatCurrency } from '../utils/currency';
import { Download, Printer, BarChart3, FileSpreadsheet, ShieldAlert } from 'lucide-react';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [anRes, subRes] = await Promise.all([
        api.get('/dashboard/analytics'),
        api.get('/subscriptions')
      ]);
      setAnalytics(anRes.data);
      setSubscriptions(subRes.data);
    } catch (err) {
      console.error('Failed to load analytics records:', err);
      setToast({ message: 'Error loading chart datasets.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  // Exporter 1: Export as CSV
  const handleExportCSV = () => {
    if (subscriptions.length === 0) {
      setToast({ message: 'No subscriptions available to export.', type: 'warning' });
      return;
    }

    const headers = [
      'Service Name', 'Category', 'Plan', 'Amount', 
      'Billing Cycle', 'Renewal Date', 'Payment Method', 'Auto Renew', 'Status'
    ];

    const rows = subscriptions.map(sub => [
      `"${sub.serviceName.replace(/"/g, '""')}"`,
      `"${sub.category}"`,
      `"${(sub.plan || '').replace(/"/g, '""')}"`,
      sub.amount,
      `"${sub.billingCycle}"`,
      `"${new Date(sub.renewalDate).toLocaleDateString()}"`,
      `"${(sub.paymentMethod || '').replace(/"/g, '""')}"`,
      sub.autoRenew ? 'TRUE' : 'FALSE',
      `"${sub.status}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Subscription_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast({ message: 'CSV spreadsheet downloaded successfully!', type: 'success' });
  };

  // Exporter 2: Print PDF Summary Report
  const handlePrintPDF = () => {
    if (subscriptions.length === 0) {
      setToast({ message: 'No subscriptions available to print.', type: 'warning' });
      return;
    }

    // Open a new print window with clean styled document
    const printWindow = window.open('', '_blank');
    const activeSubs = subscriptions.filter(s => s.status === 'active');
    const totalActive = activeSubs.reduce((acc, sub) => {
      const amt = Number(sub.amount) || 0;
      if (sub.billingCycle === 'weekly') return acc + amt * (52 / 12);
      if (sub.billingCycle === 'quarterly') return acc + amt / 3;
      if (sub.billingCycle === 'yearly') return acc + amt / 12;
      return acc + amt;
    }, 0);

    printWindow.document.write(`
      <html>
        <head>
          <title>SubTracker 3D - Financial Statement</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; padding: 40px; margin: 0; }
            h1 { font-size: 26px; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 5px; }
            p.meta { color: #64748b; font-size: 13px; margin-top: 0; margin-bottom: 30px; }
            .kpis { display: flex; gap: 20px; margin-bottom: 30px; }
            .kpi { flex: 1; padding: 15px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; }
            .kpi h3 { font-size: 11px; text-transform: uppercase; color: #64748b; margin: 0 0 5px 0; }
            .kpi p { font-size: 20px; font-weight: bold; margin: 0; }
            table { w-full; width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; padding: 10px; background: #f1f5f9; font-size: 12px; text-transform: uppercase; color: #475569; }
            td { padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
            tr:hover { background: #f8fafc; }
            .footer { margin-top: 50px; text-align: center; color: #94a3b8; font-size: 11px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
          </style>
        </head>
        <body>
          <h1>CYBERPAY FINANCIAL STATEMENT</h1>
          <p className="meta">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()} • Active profile analysis</p>
          
          <div className="kpis">
            <div className="kpi">
              <h3>Monthly Normalized Spend</h3>
              <p>${formatCurrency(totalActive)}</p>
            </div>
            <div className="kpi">
              <h3>Estimated Annual Spend</h3>
              <p>${formatCurrency(totalActive * 12)}</p>
            </div>
            <div className="kpi">
              <h3>Active Accounts</h3>
              <p>${activeSubs.length}</p>
            </div>
          </div>
          
          <h2>Subscription Details Index</h2>
          <table>
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Category</th>
                <th>Plan tier</th>
                <th>Cycles</th>
                <th>Monthly Equivalent</th>
                <th>Next renewal</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${subscriptions.map(s => {
                const amt = Number(s.amount) || 0;
                let monthly = amt;
                if (s.billingCycle === 'weekly') monthly = amt * (52 / 12);
                if (s.billingCycle === 'quarterly') monthly = amt / 3;
                if (s.billingCycle === 'yearly') monthly = amt / 12;

                return `
                  <tr>
                    <td><strong>${s.serviceName}</strong></td>
                    <td>${s.category}</td>
                    <td>${s.plan || 'N/A'}</td>
                    <td style="text-transform: capitalize;">${s.billingCycle}</td>
                    <td>${formatCurrency(monthly)}</td>
                    <td>${new Date(s.renewalDate).toLocaleDateString()}</td>
                    <td style="text-transform: uppercase; font-weight: bold; color: ${s.status === 'active' ? '#10b981' : '#f59e0b'}">${s.status}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          
          <div className="footer">
            Generated automatically by SubTracker 3D. Thank you for conserving recurring overhead.
          </div>
          
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
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
              <h2 className="text-2xl font-extrabold tracking-tight text-white">Expense Analytics</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-semibold">Granular metrics detailing fixed financial leakage</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 border border-white/5 hover:border-cyan-500 transition-colors cursor-pointer text-slate-200"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                Export CSV
              </button>
              <button
                onClick={handlePrintPDF}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 border border-white/5 hover:border-cyan-500 transition-colors cursor-pointer text-slate-200"
              >
                <Printer className="w-4 h-4 text-cyan-400" />
                Print PDF Report
              </button>
            </div>
          </div>

          {loading ? (
            <div className="h-[50vh] flex flex-col items-center justify-center gap-3">
              <span className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Syncing Chart Datasets...</p>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl border border-white/5 bg-slate-950/45 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center mx-auto text-slate-500">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">No datasets registered</h4>
              <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">Register subscriptions to populate expense allocation donut charts, line flows, and bar metrics.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <AnalyticsCharts 
                categoryData={analytics?.categoryDistribution || []}
                trendData={analytics?.spendingTrend || []}
                mostExpensive={analytics?.mostExpensive || []}
              />
            </div>
          )}
        </main>
      </div>

      <NotificationToast 
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}
