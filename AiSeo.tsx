import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, DollarSign } from 'lucide-react';
import { ClientProfile, AuditResult, genTimeSeries, genEngineVisibility } from '@/lib/auditData';
import { Card, SectionTitle, Stat } from '../ui';

const AiSeo: React.FC<{ client: ClientProfile; audit: AuditResult | null }> = ({ client, audit }) => {
  const series = genTimeSeries(client.id);
  const engines = genEngineVisibility(client.id);
  const avgVis = Math.round(engines.reduce((a, b) => a + b.visibility, 0) / engines.length);
  const trafficValue = Math.round(avgVis * 142 + 1800);
  const roi = Math.round((trafficValue * 3.4) / 1000);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Avg AI Visibility" value={`${avgVis}%`} sub="across 4 engines" />
        <Stat label="GEO Citations" value={series[series.length - 1].citations} sub="this month" accent="text-amber-400" />
        <Stat label="Est. Traffic Value" value={`$${trafficValue.toLocaleString()}`} sub="monthly" accent="text-emerald-400" />
        <Stat label="Projected ROI" value={`${roi}x`} sub="on optimization spend" accent="text-violet-400" />
      </div>

      <Card className="p-6">
        <SectionTitle title="Traditional Rankings vs. GEO Citations" subtitle="Generative Engine Optimization growth over time" icon={<TrendingUp className="w-5 h-5" />} />
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={series}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="traditional" name="Traditional Search" stroke="#64748b" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="geo" name="GEO Citations" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="citations" name="AI Mentions" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <SectionTitle title="Visibility by AI Engine" subtitle="ChatGPT · Gemini · Perplexity · Claude" icon={<DollarSign className="w-5 h-5" />} />
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={engines}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="engine" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }} />
              <Bar dataKey="visibility" radius={[4, 4, 0, 0]}>
                {engines.map((_, i) => <Cell key={i} fill={['#10a37f', '#4285f4', '#20808d', '#cc785c'][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <SectionTitle title="Traffic Value Breakdown" subtitle="Estimated monetary impact" />
          <div className="space-y-4 mt-2">
            {[
              { label: 'Organic search equivalent', val: Math.round(trafficValue * 0.5) },
              { label: 'AI answer citations', val: Math.round(trafficValue * 0.32) },
              { label: 'Visual discovery referrals', val: Math.round(trafficValue * 0.18) }
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                <span className="text-sm text-slate-300">{r.label}</span>
                <span className="text-sm font-bold text-emerald-400 tabular-nums">${r.val.toLocaleString()}/mo</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AiSeo;
