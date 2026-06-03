import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { History as HistoryIcon, ArrowUpRight, ArrowDownRight, Minus, RefreshCw, Clock } from 'lucide-react';
import { ClientProfile } from '@/lib/auditData';
import { AuditRunRecord } from '@/lib/db';
import { Card, SectionTitle, Badge, scoreColor } from '../ui';

interface Props {
  client: ClientProfile;
  history: AuditRunRecord[];
  loading: boolean;
  onReaudit: () => void;
}

const History: React.FC<Props> = ({ client, history, loading, onReaudit }) => {
  const chartData = history.map((h, i) => ({
    label: new Date(h.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    overall: h.overallScore,
    schema: h.schemaScore,
    run: i + 1
  }));

  const latest = history[history.length - 1];
  const first = history[0];
  const delta = latest && first ? latest.overallScore - first.overallScore : 0;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionTitle title="Audit History Timeline" subtitle={`Score evolution across re-audits for ${client.businessName}`} icon={<HistoryIcon className="w-5 h-5" />} />
          <button onClick={onReaudit} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-cyan-500 text-slate-900 hover:bg-cyan-400 disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Re-run Audit
          </button>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No audit history yet. Run an audit to start tracking score changes over time.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2 mb-6">
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                <p className="text-xs text-slate-400">Total Audits</p>
                <p className="text-2xl font-bold text-slate-100">{history.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                <p className="text-xs text-slate-400">Latest Score</p>
                <p className={`text-2xl font-bold ${scoreColor(latest.overallScore)}`}>{latest.overallScore}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                <p className="text-xs text-slate-400">Net Change</p>
                <p className={`text-2xl font-bold flex items-center gap-1 ${delta > 0 ? 'text-emerald-400' : delta < 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                  {delta > 0 ? <ArrowUpRight className="w-5 h-5" /> : delta < 0 ? <ArrowDownRight className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
                  {delta > 0 ? '+' : ''}{delta}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                <p className="text-xs text-slate-400">Last Audited</p>
                <p className="text-sm font-semibold text-slate-100 mt-1">{new Date(latest.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {chartData.length > 1 && (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }} />
                  <Line type="monotone" dataKey="overall" name="Overall Score" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="schema" name="Schema Score" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </>
        )}
      </Card>

      {history.length > 0 && (
        <Card className="p-6">
          <SectionTitle title="Run Log" subtitle="Chronological record of every audit" />
          <div className="space-y-3">
            {[...history].reverse().map((h, idx, arr) => {
              const prev = arr[idx + 1];
              const diff = prev ? h.overallScore - prev.overallScore : 0;
              return (
                <div key={h.id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                  <div className="w-9 h-9 rounded-full bg-cyan-500/15 flex items-center justify-center text-cyan-300 font-bold text-sm shrink-0">
                    {history.length - idx}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200">{new Date(h.createdAt).toLocaleString()}</p>
                    <p className="text-xs text-slate-500 truncate">{h.result?.target || client.url}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${scoreColor(h.overallScore)}`}>{h.overallScore}</p>
                    {prev && (
                      <Badge tone={diff > 0 ? 'green' : diff < 0 ? 'red' : 'slate'}>
                        {diff > 0 ? '+' : ''}{diff} vs prev
                      </Badge>
                    )}
                  </div>
                  <div className="hidden sm:block text-right w-20">
                    <p className="text-xs text-slate-500">Schema</p>
                    <p className="text-sm font-semibold text-amber-400">{h.schemaScore}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default History;
