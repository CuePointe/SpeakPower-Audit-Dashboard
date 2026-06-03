import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-xl border border-slate-700/60 bg-slate-800/40 backdrop-blur-sm shadow-lg ${className}`}>{children}</div>
);

export const SectionTitle: React.FC<{ title: string; subtitle?: string; icon?: React.ReactNode }> = ({ title, subtitle, icon }) => (
  <div className="flex items-start gap-3 mb-5">
    {icon && <div className="mt-0.5 text-cyan-400">{icon}</div>}
    <div>
      <h2 className="text-lg font-bold text-slate-100 tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

export const Stat: React.FC<{ label: string; value: React.ReactNode; sub?: string; accent?: string }> = ({ label, value, sub, accent = 'text-cyan-400' }) => (
  <Card className="p-5">
    <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">{label}</p>
    <p className={`text-3xl font-bold mt-2 tabular-nums ${accent}`}>{value}</p>
    {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
  </Card>
);

export function scoreColor(n: number) {
  if (n >= 75) return 'text-emerald-400';
  if (n >= 50) return 'text-amber-400';
  return 'text-rose-400';
}

export function scoreBg(n: number) {
  if (n >= 75) return 'bg-emerald-500';
  if (n >= 50) return 'bg-amber-500';
  return 'bg-rose-500';
}

export const ScoreBar: React.FC<{ value: number; label?: string }> = ({ value, label }) => (
  <div>
    {label && (
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-300">{label}</span>
        <span className={`font-bold tabular-nums ${scoreColor(value)}`}>{value}</span>
      </div>
    )}
    <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
      <div className={`h-full rounded-full ${scoreBg(value)} transition-all duration-700`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; tone?: 'green' | 'red' | 'amber' | 'cyan' | 'slate' }> = ({ children, tone = 'slate' }) => {
  const map: Record<string, string> = {
    green: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    red: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    slate: 'bg-slate-600/20 text-slate-300 border-slate-500/30'
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${map[tone]}`}>{children}</span>;
};
