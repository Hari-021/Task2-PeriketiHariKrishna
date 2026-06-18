import React, { useMemo } from 'react';
import { Sparkles, TrendingDown, HelpCircle, ShieldCheck, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

export default function AISpendingInsights({ subscriptions = [] }) {
  
  const insights = useMemo(() => {
    const activeSubs = subscriptions.filter(s => s.status === 'active');
    if (activeSubs.length === 0) {
      return [
        {
          type: 'success',
          title: 'Zero Active Subscriptions',
          description: 'Great job! You do not have any active subscriptions consuming cash flow right now.',
          savings: 0
        }
      ];
    }

    const list = [];
    
    // Helper to normalize monthly cost
    const getMonthlyCost = (s) => {
      const amt = Number(s.amount) || 0;
      if (s.billingCycle === 'weekly') return amt * (52 / 12);
      if (s.billingCycle === 'quarterly') return amt / 3;
      if (s.billingCycle === 'yearly') return amt / 12;
      return amt;
    };

    const totalMonthly = activeSubs.reduce((acc, s) => acc + getMonthlyCost(s), 0);

    // Rule 1: Overlapping Video Streaming / Media Services
    const videoSubs = activeSubs.filter(s => {
      const cat = (s.category || '').toLowerCase();
      const name = (s.serviceName || '').toLowerCase();
      return cat.includes('video') || cat.includes('stream') || cat.includes('entertainment') || 
             name.includes('netflix') || name.includes('hulu') || name.includes('disney') || 
             name.includes('hbo') || name.includes('prime video');
    });

    if (videoSubs.length > 1) {
      const videoCost = videoSubs.reduce((acc, s) => acc + getMonthlyCost(s), 0);
      list.push({
        type: 'warning',
        title: 'Overlapping Video Streams',
        description: `You have ${videoSubs.length} active video streaming subscriptions (${videoSubs.map(s => s.serviceName).join(', ')}) totaling ${formatCurrency(videoCost)}/mo. Consolidating or rotating these services could save you money.`,
        savings: Math.round((videoCost / 2) * 100) / 100
      });
    }

    // Rule 2: Monthly billing optimization (switching to yearly for 15% discount)
    const monthlyBillingSubs = activeSubs.filter(s => s.billingCycle === 'monthly');
    if (monthlyBillingSubs.length > 2) {
      const targetCost = monthlyBillingSubs.reduce((acc, s) => acc + getMonthlyCost(s), 0);
      // Simulate 15% discount
      const potentialSavings = targetCost * 0.15;
      list.push({
        type: 'info',
        title: 'Billing Cycle Optimization',
        description: `You have ${monthlyBillingSubs.length} subscriptions billed monthly. Converting high-priority services (like Cloud Storage or SaaS tools) to annual cycles typically yields a 15-20% discount.`,
        savings: Math.round(potentialSavings * 100) / 100
      });
    }

    // Rule 3: Category skew check (>50% of budget in one category)
    const categoryTotals = {};
    activeSubs.forEach(s => {
      const c = s.category || 'Other';
      categoryTotals[c] = (categoryTotals[c] || 0) + getMonthlyCost(s);
    });

    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      if (amt > totalMonthly * 0.5 && totalMonthly > 40) {
        list.push({
          type: 'info',
          title: `Budget Concentrated in ${cat}`,
          description: `More than 50% of your total budget (${formatCurrency(amt)}/mo) is focused in "${cat}". Perform a audit to ensure you are getting maximum utility from these platforms.`,
          savings: 0
        });
      }
    });

    // Rule 4: Total budget threshold check
    if (totalMonthly > 120) {
      list.push({
        type: 'danger',
        title: 'High Cumulative Overhead',
        description: `Your monthly subscription commitment is ${formatCurrency(totalMonthly)} (${formatCurrency(totalMonthly * 12)}/year). We recommend reviewing notes or canceling unused items to reduce fixed overhead.`,
        savings: Math.round((totalMonthly * 0.25) * 100) / 100 // estimate 25% savings target
      });
    }

    // Fallback if no issues found
    if (list.length === 0) {
      list.push({
        type: 'success',
        title: 'Healthy Budget Allocation',
        description: 'Your subscriptions are lean, well-distributed across categories, and optimized for minimal overhead. Keep it up!',
        savings: 0
      });
    }

    return list;
  }, [subscriptions]);

  const alertStyles = {
    success: 'bg-emerald-950/20 border-emerald-500/20 text-emerald-400',
    info: 'bg-cyan-950/20 border-cyan-500/20 text-cyan-400',
    warning: 'bg-amber-950/20 border-amber-500/20 text-amber-400',
    danger: 'bg-rose-950/20 border-rose-500/20 text-rose-400'
  };

  const alertIcons = {
    success: CheckCircle,
    info: Sparkles,
    warning: TrendingDown,
    danger: HelpCircle
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-950/45 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center">
          <Sparkles className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <h4 className="text-base font-bold text-white">AI Spending Insights</h4>
          <p className="text-[11px] text-slate-400">Automated budget recommendations powered by local heuristics</p>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight, idx) => {
          const Icon = alertIcons[insight.type] || Sparkles;
          return (
            <div 
              key={idx} 
              className={`p-4 rounded-xl border text-sm flex gap-3.5 transition-all hover:scale-[1.01] ${alertStyles[insight.type]}`}
            >
              <div className="mt-0.5">
                <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-bold text-white leading-none">{insight.title}</span>
                  {insight.savings > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Est. Savings: {formatCurrency(insight.savings)}/mo
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {insight.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
