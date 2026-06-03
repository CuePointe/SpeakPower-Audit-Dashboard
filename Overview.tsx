import React from 'react';
import { Globe, MapPin, Users, Sparkles, AlertTriangle } from 'lucide-react';
import { ClientProfile, AuditResult, genPlatformVisibility, genEngineVisibility } from '@/lib/auditData';
import { Card, SectionTitle, Stat, Badge, scoreColor } from '../ui';

const Overview: React.FC<{ client: ClientProfile; audit: AuditResult | null; loading: boolean }> = ({ client, audit, loading }) => {
  const platforms = genPlatformVisibility(client.id);
  const engines = genEngineVisibility(client.id);
  const overall = audit
    ? Math.round((audit.schema.score + (audit.ai?.aiReadability ?? 60) + (audit.ai?.topicalDepth ?? 55)) / 3)
    : 0;

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">{client.businessName}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-400">
              <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-cyan-400" /> {client.url}</span>
              {client.location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-cyan-400" /> {client.location}</span>}
              {client.demographic && <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-cyan-400" /> {client.demographic}</span>}
            </div>
            <div className="mt-3"><Badge tone="cyan">{client.industry}</Badge></div>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-slate-400">Overall AI Visibility</p>
            {loading ? (
              <div className="text-3xl font-bold text-slate-500 animate-pulse mt-1">···</div>
            ) : (
              <p className={`text-5xl font-bold tabular-nums mt-1 ${scoreColor(overall)}`}>{overall}</p>
            )}
            <p className="text-xs text-slate-500">out of 100</p>
          </div>
        </div>
      </Card>

      {loading && (
        <Card className="p-6 flex items-center gap-3 text-cyan-300">
          <Sparkles className="w-5 h-5 animate-spin" /> Running live audit — scraping target, parsing schema & invoking AI analysis...
        </Card>
      )}

      {audit && !audit.reachable && (
        <Card className="p-4 flex items-center gap-2 text-amber-300 border-amber-500/40">
          <AlertTriangle className="w-5 h-5" /> Target URL could not be reached (status {audit.status}). Displaying schema/AI results where available. Try a fully-qualified public URL.
        </Card>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Schema Score" value={audit ? `${audit.schema.score}%` : '—'} sub={`${audit?.schema.found.length ?? 0}/6 types`} />
        <Stat label="Page Words" value={audit?.wordCount ?? '—'} sub="indexed content" accent="text-amber-400" />
        <Stat label="LCP" value={audit ? `${audit.vitals.lcp}s` : '—'} sub="largest paint" accent="text-violet-400" />
        <Stat label="Entities" value={audit?.ai?.entities?.length ?? '—'} sub="NER detected" accent="text-emerald-400" />
      </div>

      {audit?.ai?.summary && (
        <Card className="p-6">
          <SectionTitle title="AI Auditor Summary" subtitle="Generated from live page analysis" icon={<Sparkles className="w-5 h-5" />} />
          <p className="text-sm text-slate-300 leading-relaxed">{audit.ai.summary}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <SectionTitle title="AI Search Engine Visibility" subtitle="Presence in generative answers" />
          <div className="space-y-3">
            {engines.map((e) => (
              <div key={e.engine}>
                <div className="flex justify-between text-xs mb-1"><span className="text-slate-300">{e.engine}</span><span className={`font-bold ${scoreColor(e.visibility)}`}>{e.visibility}%</span></div>
                <div className="h-2 rounded-full bg-slate-700 overflow-hidden"><div className="h-full bg-cyan-500 rounded-full" style={{ width: `${e.visibility}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <SectionTitle title="Visual Discovery Platforms" subtitle="Pinterest · Instagram · TikTok · YouTube · Facebook · Reddit · X" />
          <div className="grid grid-cols-2 gap-3">
            {platforms.map((p) => (
              <div key={p.platform} className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50 flex items-center justify-between">
                <span className="text-sm text-slate-300">{p.platform}</span>
                <span className={`font-bold text-sm ${scoreColor(p.score)}`}>{p.score}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {audit?.ai?.recommendations && audit.ai.recommendations.length > 0 && (
        <Card className="p-6">
          <SectionTitle title="Prioritized Recommendations" subtitle="Data-backed actions from the audit engine" />
          <div className="space-y-3">
            {audit.ai.recommendations.map((r, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50">
                <Badge tone={r.impact === 'High' ? 'red' : r.impact === 'Medium' ? 'amber' : 'slate'}>{r.impact}</Badge>
                <div>
                  <p className="text-sm font-semibold text-slate-200">{r.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{r.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Overview;
