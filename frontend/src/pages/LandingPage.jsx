import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, CheckCircle2, ShieldCheck, Cpu, Database, 
  ChevronDown, HelpCircle, ArrowRight, Star, Globe2 
} from 'lucide-react';
import HeroCanvas from '../components/3D/HeroCanvas';
import DashboardCanvas from '../components/3D/DashboardCanvas';
import Navbar from '../components/Navbar';

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState(null);

  const features = [
    {
      icon: Globe2,
      title: 'Immersive 3D Globe',
      desc: 'Explore your active subscriptions mapped across a spinning holographic globe with nodes showing live renewals.'
    },
    {
      icon: Sparkles,
      title: 'AI Spending Insights',
      desc: 'Let our heuristic AI identify overlapping streaming plans, billing cycle optimizations, and suggest consolidation routes.'
    },
    {
      icon: Cpu,
      title: 'Automatic Reminders',
      desc: 'Receive alerts 7 days prior to any renewal date so you never pay for an unintended subscription cycle again.'
    },
    {
      icon: Database,
      title: 'Hybrid Database Sync',
      desc: 'Local file-based system syncs with MongoDB, ensuring your data is accessible offline or on cloud clusters.'
    },
    {
      icon: ShieldCheck,
      title: 'Bank-Grade Security',
      desc: 'Password hashing using bcrypt, rate-limiting, and strict JSON Web Token validation protects your assets.'
    },
    {
      icon: CheckCircle2,
      title: 'Smart Categorization',
      desc: 'Filter, sort, and organize expenses through dynamic categorizations: Entertainment, SaaS, Gaming, and Custom groups.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Product Lead, TechCorp',
      content: 'SubTracker 3D completely reorganized my software licenses. The AI insights identified $40/mo in overlapping SaaS seats within 5 minutes.',
      rating: 5
    },
    {
      name: 'Alex Rivera',
      role: 'Fintech Analyst',
      content: 'The 3D globe visualization is not just eye candy—it makes checking subscriptions feel like accessing a high-tech terminal. Stunning UI.',
      rating: 5
    },
    {
      name: 'Elena Rostova',
      role: 'Creative Director',
      content: 'The glassmorphic design and dark-theme aesthetics are top tier. Feels like a billion-dollar startup platform. Flawless interactions.',
      rating: 5
    }
  ];

  const faqs = [
    {
      q: 'How does the 3D globe track my subscriptions?',
      a: 'The 3D Globe dynamically plots subscription metrics as visual nodes. Each active service is represented by holographic categories orbiting the globe, illustrating budget sizes.'
    },
    {
      q: 'Is there a way to backup my subscription list?',
      a: 'Yes, the dashboard includes an Exporter that allows you to download your full list of subscriptions as clean CSV spreadsheets or formatted PDF financial summaries.'
    },
    {
      q: 'Does it support multiple currencies?',
      a: 'Absolutely. SubTracker 3D supports multi-currency inputs (USD, EUR, GBP, JPY, CAD, INR) and converts them into normalized base metrics on charts.'
    },
    {
      q: 'Can I run this application offline?',
      a: 'Yes. Thanks to our Hybrid Database design, if the cloud connection is unreachable, the system automatically saves to a local JSON file on your computer.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex flex-col justify-between">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Decorative background gradients */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] animate-pulse-slow pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-fuchsia-500/10 blur-[120px] animate-pulse-slow pointer-events-none" />

        <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-semibold text-cyan-400"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Empowering Personal Cash Flow
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
          >
            Consolidate your <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-500 bg-clip-text text-transparent">Subscriptions</span> in 3D Space.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed"
          >
            A futuristic fintech SaaS dashboard where you can monitor streaming platforms, cloud nodes, and memberships through immersive 3D graphics and auto-saving engines.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
          >
            <Link 
              to="/register" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-base font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-xl shadow-cyan-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a 
              href="#preview" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-base font-bold glass-card border border-white/10 hover:bg-white/5 transition-all text-slate-300 hover:text-white"
            >
              3D Sandbox Preview
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-6 z-10"
        >
          <HeroCanvas />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-white/5">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Engineered for Fintech Capital</h2>
          <p className="text-sm sm:text-base text-slate-400 font-medium">All the tools required to track recurring expenses, identify leakage, and optimize commitments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="glass-card p-6 rounded-2xl border border-white/5 bg-slate-950/45 flex flex-col items-start gap-4 hover:border-cyan-500/20"
              >
                <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-cyan-400">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white leading-snug">{feat.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">{feat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3D Dashboard Preview */}
      <section id="preview" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-950/40 border border-fuchsia-500/30 text-xs font-semibold text-fuchsia-400">
              Interactive 3D Preview
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">Visualizing Budget Densities</h2>
            <p className="text-sm sm:text-base text-slate-400 font-medium leading-relaxed">
              Hover over the floating category cubes to preview which platforms reside inside. Drag the 3D globe around to inspect connecting billing paths. The live dashboard synchronizes this environment with your personal records.
            </p>
            <div className="pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all"
              >
                Access Dashboard Console
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </Link>
            </div>
          </div>
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-white/5 bg-slate-950">
            <DashboardCanvas />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-white/5">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Approved by Capital Managers</h2>
          <p className="text-sm sm:text-base text-slate-400 font-medium">Hear how individuals and SaaS professionals optimize commitments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="glass-card p-6 rounded-2xl border border-white/5 bg-slate-950/45 flex flex-col justify-between h-64"
            >
              <div className="space-y-4">
                <div className="flex gap-1 text-yellow-500">
                  {[...Array(test.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-500" />)}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium italic">
                  "{test.content}"
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 flex flex-col">
                <span className="text-sm font-bold text-white">{test.name}</span>
                <span className="text-xs text-slate-500 font-semibold mt-0.5">{test.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-white/5">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Flexible Pricing for Everyone</h2>
          <p className="text-sm sm:text-base text-slate-400 font-medium">Start organizing your fixed commitments free, or unlock premium assets.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free plan */}
          <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-slate-950/45 flex flex-col justify-between h-[450px]">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Starter Sandbox</h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">Perfect for organizing primary streams</p>
              </div>
              <div className="flex items-baseline gap-1.5 text-white">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-sm text-slate-500 font-semibold">/ month</span>
              </div>
              <ul className="space-y-3.5 text-sm text-slate-300 font-semibold">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Up to 5 Active Subscriptions</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Local Database Fallback Storage</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Standard Sorting & Filters</li>
                <li className="flex items-center gap-2 text-slate-500"><XCircleStub /> 3D Globe Visualization</li>
                <li className="flex items-center gap-2 text-slate-500"><XCircleStub /> AI Budget Recommendations</li>
              </ul>
            </div>
            <Link 
              to="/register" 
              className="w-full text-center py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors"
            >
              Sign Up Free
            </Link>
          </div>

          {/* Pro plan */}
          <div className="glass-panel p-8 rounded-3xl border border-cyan-500/20 bg-slate-950/70 flex flex-col justify-between h-[450px] relative shadow-[0_0_30px_rgba(6,182,212,0.05)]">
            <span className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 rounded-full bg-cyan-950 text-xs font-bold text-cyan-400 border border-cyan-500/30">
              RECOMMENDED
            </span>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Pro Console</h3>
                <p className="text-xs text-cyan-400 mt-1 font-semibold">Unlimit recurring optimizations</p>
              </div>
              <div className="flex items-baseline gap-1.5 text-white">
                <span className="text-4xl font-extrabold">$9.99</span>
                <span className="text-sm text-slate-500 font-semibold">/ month</span>
              </div>
              <ul className="space-y-3.5 text-sm text-slate-300 font-semibold">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Unlimited Subscriptions</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Interactive 3D Globe & Cubes</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> AI Spending Insights & Alerts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> PDF/CSV Exporter Sync</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Multi-Currency Conversions</li>
              </ul>
            </div>
            <Link 
              to="/register" 
              className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
            >
              Get Pro Access
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full border-t border-white/5">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-400 font-medium">Clear answers to details about SubTracker 3D.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="glass-panel rounded-2xl border border-white/5 overflow-hidden transition-all bg-slate-950/45"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between font-bold text-left text-white outline-none cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  {faq.q}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed font-semibold">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-10 px-4 sm:px-6 lg:px-8 border-t border-white/5 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight">
              SubTracker<span className="text-cyan-400">3D</span>
            </span>
            <span className="text-xs text-slate-500 font-bold border border-white/10 px-2 py-0.5 rounded-full">v1.0</span>
          </div>
          <p className="text-xs text-slate-500 font-semibold">
            &copy; {new Date().getFullYear()} SubTracker 3D Inc. Built by Antigravity. Bank-grade mock authorization.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Simple placeholder delete indicator for pricing table
function XCircleStub() {
  return (
    <span className="w-4 h-4 rounded-full border border-slate-700 text-slate-600 flex items-center justify-center font-extrabold text-[10px]">
      ✕
    </span>
  );
}
