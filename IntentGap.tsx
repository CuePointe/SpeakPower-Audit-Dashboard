import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Target, CheckCircle2, XCircle } from 'lucide-react';
import { ClientProfile, AuditResult, genShareOfVoice } from '@/lib/auditData';
import { Card, SectionTitle, Badge } from '../ui';

const COLORS = ['#06b6d4', '#f59e0b', '#8b5cf6', '#10b981', '#64748b'];

const IntentGap: React.FC<{ client: ClientProfile; audit: AuditResult | null }> = ({ client, audit }) => {
  const sov = genShareOfVoice(client.id, client.businessName);
  const clusters = audit?.ai?.questionClusters?.length
    ? audit.ai.questionClusters
    : [
        { question: `Best ${client.industry.toLowerCase()} near ${client.location || 'me'}`, covered: true },
        { question: `How much does ${client.businessName} cost?`, covered: false },
        { question: `${client.businessName} reviews and ratings`, covered: false },
        { question: `Is ${client.businessName} worth it?`, covered: true },
        { question: `${client.businessName} vs competitors`, covered: false },
        { question: `What does ${client.businessName} offer?`, covered: true }
      ];
  const gapCount = clusters.filter((c) => !c.covered).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <SectionTitle title="Share of Voice" subtitle="Your brand vs. the competitive set across AI answers" icon={<Target className="w-5 h-5" />} />
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={sov} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3}>
                {sov.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <SectionTitle title="Competitive Visibility Index" subtitle="Relative presence weighting" icon={<Target className="w-5 h-5" />} />
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={sov} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} width={90} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {sov.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <SectionTitle title="High-Intent Question Clusters" subtitle="What consumers ask AI engines vs. your content coverage" />
          <Badge tone={gapCount > 2 ? 'red' : 'amber'}>{gapCount} content gaps</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-700">
                <th className="py-2 font-medium">Question Cluster</th>
                <th className="py-2 font-medium">Coverage Status</th>
                <th className="py-2 font-medium">Priority</th>
              </tr>
            </thead>
            <tbody>
              {clusters.map((c, i) => (
                <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/40">
                  <td className="py-3 text-slate-200">{c.question}</td>
                  <td className="py-3">
                    {c.covered ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-400"><CheckCircle2 className="w-4 h-4" /> Covered</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-rose-400"><XCircle className="w-4 h-4" /> Gap</span>
                    )}
                  </td>
                  <td className="py-3"><Badge tone={c.covered ? 'slate' : 'red'}>{c.covered ? 'Maintain' : 'High'}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default IntentGap;
