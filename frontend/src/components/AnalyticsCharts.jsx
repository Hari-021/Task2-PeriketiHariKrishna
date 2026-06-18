import React from 'react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar
} from 'recharts';
import { formatCurrency } from '../utils/currency';

const NEON_COLORS = ['#06b6d4', '#d946ef', '#10b981', '#6366f1', '#f43f5e', '#f59e0b', '#8b5cf6', '#ec4899'];

// Custom glowing tooltip for Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel px-4 py-2.5 rounded-xl border border-white/10 text-xs shadow-xl bg-slate-950/90">
        {label && <p className="font-bold text-white mb-1">{label}</p>}
        {payload.map((entry, index) => (
          <p key={index} className="font-semibold" style={{ color: entry.color || entry.payload.fill || '#06b6d4' }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsCharts({ categoryData = [], trendData = [], mostExpensive = [] }) {
  
  // Format data labels for donut chart
  const pieData = categoryData.length > 0 ? categoryData : [
    { category: 'No Data', amount: 0 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Spending Trend Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-950/45 flex flex-col justify-between h-[350px]">
        <div>
          <h4 className="text-base font-bold text-white">Monthly Expense Trend</h4>
          <p className="text-xs text-slate-400 mt-1 font-medium">Visual cash flow tracking over the last 6 months</p>
        </div>
        <div className="w-full h-56 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="trendGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="amount" 
                name="Monthly Cost" 
                stroke="#06b6d4" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#trendGlow)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Category Distribution Donut */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-950/45 flex flex-col justify-between h-[350px]">
        <div>
          <h4 className="text-base font-bold text-white">Category Expense Breakdown</h4>
          <p className="text-xs text-slate-400 mt-1 font-medium">Distribution of monthly budget allocations</p>
        </div>
        <div className="w-full h-56 mt-4 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={4}
                dataKey="amount"
                nameKey="category"
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={NEON_COLORS[index % NEON_COLORS.length]} 
                    stroke="rgba(2, 6, 23, 0.6)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-[11px] font-semibold text-slate-300 capitalize">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Top Expensive Bar Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-950/45 flex flex-col justify-between h-[320px] lg:col-span-2">
        <div>
          <h4 className="text-base font-bold text-white">Most Expensive Subscriptions</h4>
          <p className="text-xs text-slate-400 mt-1 font-medium">Top active subscriptions sorted by equivalent monthly rate</p>
        </div>
        <div className="w-full h-48 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mostExpensive} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="barGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                  <stop offset="100%" stopColor="#d946ef" stopOpacity={0.9}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} horizontal={false} />
              <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <YAxis type="category" dataKey="serviceName" stroke="#64748b" fontSize={11} tickLine={false} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="monthlyEquivalent" 
                name="Monthly Cost" 
                fill="url(#barGlow)" 
                radius={[0, 8, 8, 0]} 
                maxBarSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
