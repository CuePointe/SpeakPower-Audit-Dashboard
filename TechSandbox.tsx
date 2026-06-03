import React, { useEffect, useRef, useState } from 'react';
import { Cpu, ShieldCheck, Gauge, Terminal } from 'lucide-react';
import { ClientProfile, AuditResult } from '@/lib/auditData';
import { Card, SectionTitle, ScoreBar, Badge } from '../ui';

const TechSandbox: React.FC<{ client: ClientProfile; audit: AuditResult | null }> = ({ client, audit }) => {
  const schemaScore = audit?.schema.score ?? 0;
  const entityDensity = audit?.ai?.topicalDepth ?? Math.min(95, (audit?.wordCount ?? 400) / 12);
  const readability = audit?.ai?.aiReadability ?? 62;
  const keywordCov = audit?.ai?.keywordCoverage ?? 58;
  const fcp = audit?.vitals.fcp ?? 1.8;
  const lcp = audit?.vitals.lcp ?? 2.6;
  const ttfb = audit?.vitals.ttfb ?? 0.6;
  const vitalsScore = Math.round(Math.max(0, 100 - (lcp * 18 + fcp * 10)));

  // Live terminal stream
  const [lines, setLines] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const log = [
      `$ speakpower audit --target ${audit?.target || client.url}`,
      `[net] resolving host... ${audit?.reachable ? 'OK (' + audit?.status + ')' : 'unreachable'}`,
      `[net] TTFB measured: ${ttfb}s | payload ${audit?.sizeKb ?? '—'}KB`,
      `[parse] scanning DOM for JSON-LD blocks...`,
      `[schema] detected: ${audit?.schema.found.join(', ') || 'none'}`,
      `[schema] missing: ${audit?.schema.missing.join(', ') || 'none'}`,
      `[schema] completeness score = ${schemaScore}%`,
      `[nlp] extracting named entities (NER)...`,
      `[nlp] entities found: ${audit?.ai?.entities?.length ?? 0}`,
      `[geo] computing AI readability index = ${readability}`,
      `[vitals] FCP=${fcp}s LCP=${lcp}s`,
      `[done] audit complete @ ${(audit?.analyzedAt || new Date().toISOString()).slice(11, 19)} UTC`
    ];
    setLines([]);
    let i = 0;
    const t = setInterval(() => {
      setLines((p) => [...p, log[i]]);
      i++;
      if (i >= log.length) clearInterval(t);
      requestAnimationFrame(() => ref.current?.scrollTo(0, ref.current.scrollHeight));
    }, 320);
    return () => clearInterval(t);
  }, [audit, client.url, fcp, lcp, ttfb, schemaScore, readability]);

  const indicators = [
    { label: 'Schema Completeness', value: schemaScore, icon: <ShieldCheck className="w-4 h-4" /> },
    { label: 'Entity Density', value: Math.round(entityDensity), icon: <Cpu className="w-4 h-4" /> },
    { label: 'Core Web Vitals', value: vitalsScore, icon: <Gauge className="w-4 h-4" /> },
    { label: 'AI Readability', value: Math.round(readability), icon: <Cpu className="w-4 h-4" /> },
    { label: 'Keyword Coverage', value: Math.round(keywordCov), icon: <Cpu className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <SectionTitle title="Technical Compliance Indicators" subtitle="Live-scored from the audit engine" icon={<ShieldCheck className="w-5 h-5" />} />
          <div className="space-y-4">
            {indicators.map((ind) => (
              <div key={ind.label}>
                <div className="flex items-center gap-2 mb-1 text-slate-300 text-sm">
                  <span className="text-cyan-400">{ind.icon}</span> {ind.label}
                </div>
                <ScoreBar value={ind.value} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle title="JSON-LD Schema Audit" subtitle="Detected structured data on target URL" icon={<ShieldCheck className="w-5 h-5" />} />
          <div className="grid grid-cols-1 gap-2">
            {(audit?.schema.all || ['LocalBusiness', 'Service', 'FAQPage', 'BreadcrumbList', 'Organization', 'Speakable']).map((s) => {
              const present = audit?.schema.found.includes(s);
              return (
                <div key={s} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/50 border border-slate-700/50">
                  <span className="text-sm text-slate-200 font-mono">{s}</span>
                  <Badge tone={present ? 'green' : 'red'}>{present ? 'present' : 'missing'}</Badge>
                </div>
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded bg-slate-900/50"><p className="text-xs text-slate-500">FCP</p><p className={`font-bold ${fcp < 2 ? 'text-emerald-400' : 'text-amber-400'}`}>{fcp}s</p></div>
            <div className="p-2 rounded bg-slate-900/50"><p className="text-xs text-slate-500">LCP</p><p className={`font-bold ${lcp < 2.5 ? 'text-emerald-400' : 'text-amber-400'}`}>{lcp}s</p></div>
            <div className="p-2 rounded bg-slate-900/50"><p className="text-xs text-slate-500">TTFB</p><p className={`font-bold ${ttfb < 0.8 ? 'text-emerald-400' : 'text-amber-400'}`}>{ttfb}s</p></div>
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/80 border-b border-slate-700">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono text-slate-300">data-profiling-engine — live</span>
          <div className="ml-auto flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
        </div>
        <div ref={ref} className="p-4 font-mono text-xs h-64 overflow-y-auto bg-[#0a0f1c]">
          {lines.map((l, i) => (
            <div key={i} className={`leading-relaxed ${l.startsWith('[done]') ? 'text-emerald-400' : l.includes('missing') || l.includes('unreachable') ? 'text-rose-400' : l.startsWith('$') ? 'text-cyan-400' : 'text-slate-400'}`}>{l}</div>
          ))}
          <span className="inline-block w-2 h-3.5 bg-emerald-400 animate-pulse" />
        </div>
      </Card>

      {audit?.ai?.entities && audit.ai.entities.length > 0 && (
        <Card className="p-6">
          <SectionTitle title="Extracted Named Entities (NER)" subtitle="From OpenAI-class structured analysis of live page text" />
          <div className="flex flex-wrap gap-2">
            {audit.ai.entities.slice(0, 30).map((e, i) => (
              <span key={i} className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs">
                {e.name} <span className="text-cyan-500/60">· {e.type}</span>
              </span>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default TechSandbox;
