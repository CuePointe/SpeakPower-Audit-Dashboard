import React from 'react';
import { TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { ClientProfile, AuditResult, genLeadScores, genFunnel } from '@/lib/auditData';
import { Card, SectionTitle, scoreColor, ScoreBar } from '../ui';

const LeadScoring: React.FC<{ client: ClientProfile; audit: AuditResult | null }> = ({ client }) => {
  const segments = genLeadScores(client.id, client.industry);
  const funnel = genFunnel(client.id);
  const max = funnel[0].value;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <SectionTitle title="Predictive Buying-Intent Scoring" subtitle="Market segments ranked by consumer intent vectors" icon={<Filter className="w-5 h-5" />} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-700">
                <th className="py-2 font-medium">Market Segment</th>
                <th className="py-2 font-medium w-48">Buying Intent Score</th>
                <th className="py-2 font-medium">Est. Volume</th>
                <th className="py-2 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {segments.map((s) => (
                <tr key={s.segment} className="border-b border-slate-800 hover:bg-slate-800/40">
                  <td className="py-3 text-slate-200">{s.segment}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <span className={`font-bold tabular-nums w-8 ${scoreColor(s.score)}`}>{s.score}</span>
                      <div className="flex-1"><ScoreBar value={s.score} /></div>
                    </div>
                  </td>
                  <td className="py-3 text-slate-300 tabular-nums">{s.volume.toLocaleString()}/mo</td>
                  <td className="py-3">
                    {s.trend === 'up' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400"><TrendingUp className="w-4 h-4" /> Rising</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-400"><TrendingDown className="w-4 h-4" /> Cooling</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <SectionTitle title="Conversion Funnel" subtitle="Brand Impressions → AI Citations → Clicks → Intent Leads" />
        <div className="space-y-3 mt-2">
          {funnel.map((f, i) => {
            const pct = Math.round((f.value / max) * 100);
            const colors = ['from-cyan-500 to-cyan-600', 'from-violet-500 to-violet-600', 'from-amber-500 to-amber-600', 'from-emerald-500 to-emerald-600'];
            const conv = i > 0 ? Math.round((f.value / funnel[i - 1].value) * 100) : 100;
            return (
              <div key={f.stage}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">{f.stage}</span>
                  <span className="text-slate-400 tabular-nums">{f.value.toLocaleString()} {i > 0 && <span className="text-slate-500">({conv}% step CVR)</span>}</span>
                </div>
                <div className="h-9 rounded-lg bg-slate-900/50 overflow-hidden">
                  <div className={`h-full rounded-lg bg-gradient-to-r ${colors[i]} flex items-center px-3 text-xs font-bold text-slate-900 transition-all duration-700`} style={{ width: `${Math.max(pct, 12)}%` }}>
                    {pct}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-200">
          Overall pipeline conversion: <span className="font-bold">{((funnel[3].value / funnel[0].value) * 100).toFixed(2)}%</span> of impressions become qualified intent leads.
        </div>
      </Card>
    </div>
  );
};

export default LeadScoring;
