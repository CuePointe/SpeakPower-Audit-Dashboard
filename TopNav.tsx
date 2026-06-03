import React, { useState } from 'react';
import { ChevronDown, LayoutDashboard, Target, TrendingUp, Filter, Cpu, FileDown, Plus, Users, History } from 'lucide-react';
import { ClientProfile } from '@/lib/auditData';

export type ViewKey = 'overview' | 'intent' | 'aiseo' | 'leads' | 'tech' | 'history';

const TOOLS: { key: ViewKey; label: string; desc: string; icon: React.ReactNode }[] = [
  { key: 'intent', label: 'Intent & Content Gap', desc: 'Share of Voice + question clusters', icon: <Target className="w-4 h-4" /> },
  { key: 'aiseo', label: 'AI SEO & GEO Dashboard', desc: 'Rankings vs. citations + ROI', icon: <TrendingUp className="w-4 h-4" /> },
  { key: 'leads', label: 'Predictive Lead Scoring', desc: 'Intent scores + conversion funnel', icon: <Filter className="w-4 h-4" /> },
  { key: 'tech', label: 'Technical Data Sandbox', desc: 'Schema, vitals, live profiling', icon: <Cpu className="w-4 h-4" /> },
  { key: 'history', label: 'Audit History Timeline', desc: 'Score changes across re-audits', icon: <History className="w-4 h-4" /> }
];

interface Props {
  view: ViewKey;
  setView: (v: ViewKey) => void;
  clients: ClientProfile[];
  activeId: string;
  setActiveId: (id: string) => void;
  onNew: () => void;
  onExport: () => void;
}

const TopNav: React.FC<Props> = ({ view, setView, clients, activeId, setActiveId, onNew, onExport }) => {
  const [open, setOpen] = useState(false);
  const [cOpen, setCOpen] = useState(false);
  const active = clients.find((c) => c.id === activeId);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-700/60 bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center gap-2 h-16">
        <div className="flex items-center gap-2.5 mr-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-amber-400 flex items-center justify-center font-black text-slate-900 text-lg">S</div>
          <div className="hidden sm:block leading-tight">
            <p className="font-bold text-slate-100 text-sm">SpeakPower</p>
            <p className="text-[10px] uppercase tracking-widest text-cyan-400">Audit Dashboard</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 ml-2">
          <button onClick={() => setView('overview')} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${view === 'overview' ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'}`}>
            <LayoutDashboard className="w-4 h-4" /> <span className="hidden md:inline">Overview</span>
          </button>

          <div className="relative" onMouseLeave={() => setOpen(false)}>
            <button onClick={() => setOpen((o) => !o)} onMouseEnter={() => setOpen(true)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${['intent', 'aiseo', 'leads', 'tech', 'history'].includes(view) ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'}`}>
              Tools & Deep Dives <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
              <div className="absolute left-0 top-full pt-2 w-72">
                <div className="rounded-xl border border-slate-700 bg-slate-800 shadow-2xl p-2">
                  {TOOLS.map((t) => (
                    <button key={t.key} onClick={() => { setView(t.key); setOpen(false); }} className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-colors ${view === t.key ? 'bg-cyan-500/15' : 'hover:bg-slate-700/60'}`}>
                      <span className="mt-0.5 text-cyan-400">{t.icon}</span>
                      <span>
                        <span className="block text-sm font-medium text-slate-100">{t.label}</span>
                        <span className="block text-xs text-slate-400">{t.desc}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Client switcher */}
          <div className="relative" onMouseLeave={() => setCOpen(false)}>
            <button onClick={() => setCOpen((o) => !o)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 max-w-[180px]">
              <Users className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="truncate">{active?.businessName || 'Select client'}</span>
              <ChevronDown className="w-4 h-4 shrink-0" />
            </button>
            {cOpen && (
              <div className="absolute right-0 top-full pt-2 w-64 z-50">
                <div className="rounded-xl border border-slate-700 bg-slate-800 shadow-2xl p-2 max-h-80 overflow-y-auto">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 px-2 py-1">Tenant Workspaces</p>
                  {clients.map((c) => (
                    <button key={c.id} onClick={() => { setActiveId(c.id); setCOpen(false); }} className={`w-full text-left p-2 rounded-lg transition-colors ${c.id === activeId ? 'bg-cyan-500/15' : 'hover:bg-slate-700/60'}`}>
                      <span className="block text-sm text-slate-100">{c.businessName}</span>
                      <span className="block text-xs text-slate-500">{c.industry}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button onClick={onNew} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700">
            <Plus className="w-4 h-4" /> <span className="hidden lg:inline">New Audit</span>
          </button>
          <button onClick={onExport} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-cyan-500 to-amber-400 text-slate-900 hover:opacity-90">
            <FileDown className="w-4 h-4" /> <span className="hidden lg:inline">Proposal</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
