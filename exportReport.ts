import { ClientProfile, AuditResult, genLeadScores, genShareOfVoice, genEngineVisibility, genFunnel } from '@/lib/auditData';

export function generateProposal(client: ClientProfile, audit: AuditResult | null) {
  const sov = genShareOfVoice(client.id, client.businessName);
  const engines = genEngineVisibility(client.id);
  const leads = genLeadScores(client.id, client.industry).slice(0, 4);
  const funnel = genFunnel(client.id);
  const overall = audit ? Math.round((audit.schema.score + (audit.ai?.aiReadability ?? 60) + (audit.ai?.topicalDepth ?? 55)) / 3) : 0;
  const recs = audit?.ai?.recommendations || [
    { title: 'Implement LocalBusiness & FAQPage schema', impact: 'High', detail: 'Add structured data to surface in AI answers and rich results.' },
    { title: 'Build comparison & pricing content', impact: 'High', detail: 'Capture high-intent question clusters competitors currently own.' },
    { title: 'Improve Core Web Vitals', impact: 'Medium', detail: 'Reduce LCP for better crawl & UX signals.' }
  ];

  const row = (a: string, b: string) => `<tr><td>${a}</td><td style="text-align:right;font-weight:700;color:#0891b2">${b}</td></tr>`;

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>SpeakPower Proposal — ${client.businessName}</title>
  <style>
    *{box-sizing:border-box;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif}
    body{margin:0;color:#0f172a}
    .page{max-width:820px;margin:0 auto;padding:48px}
    .hero{background:linear-gradient(135deg,#0f172a,#155e75);color:#fff;padding:40px;border-radius:16px}
    .badge{display:inline-block;background:#06b6d4;color:#0f172a;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:1px}
    h1{font-size:30px;margin:14px 0 6px}
    h2{font-size:18px;border-bottom:2px solid #e2e8f0;padding-bottom:6px;margin-top:34px;color:#155e75}
    table{width:100%;border-collapse:collapse;margin-top:10px}
    td,th{padding:9px 10px;border-bottom:1px solid #e2e8f0;font-size:13px}
    th{text-align:left;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:.5px}
    .score{font-size:54px;font-weight:800;color:#06b6d4}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px}
    .card{border:1px solid #e2e8f0;border-radius:12px;padding:16px}
    .rec{border-left:4px solid #06b6d4;padding:10px 14px;margin:8px 0;background:#f8fafc;border-radius:0 8px 8px 0}
    .imp{font-size:11px;font-weight:700;padding:2px 8px;border-radius:6px;background:#fee2e2;color:#b91c1c}
    .footer{margin-top:40px;text-align:center;color:#94a3b8;font-size:12px}
    @media print{.noprint{display:none}}
  </style></head><body><div class="page">
  <div class="hero">
    <span class="badge">AI VISIBILITY AUDIT PROPOSAL</span>
    <h1>${client.businessName}</h1>
    <p style="opacity:.85;margin:0">${client.url} &nbsp;·&nbsp; ${client.location || ''} &nbsp;·&nbsp; ${client.industry}</p>
    <p style="margin:18px 0 0;font-size:13px;opacity:.8">Overall AI Visibility Score</p>
    <div class="score" style="color:#67e8f9">${overall}<span style="font-size:20px;opacity:.6">/100</span></div>
  </div>

  ${audit?.ai?.summary ? `<h2>Executive Summary</h2><p style="font-size:14px;line-height:1.6">${audit.ai.summary}</p>` : ''}

  <h2>Technical Audit Snapshot</h2>
  <div class="grid">
    <div class="card"><table>
      ${row('Schema Completeness', (audit?.schema.score ?? 0) + '%')}
      ${row('Schemas Found', (audit?.schema.found.join(', ') || 'None'))}
      ${row('Missing Schemas', (audit?.schema.missing.join(', ') || 'None'))}
      ${row('Page Word Count', String(audit?.wordCount ?? '—'))}
    </table></div>
    <div class="card"><table>
      ${row('First Contentful Paint', (audit?.vitals.fcp ?? '—') + 's')}
      ${row('Largest Contentful Paint', (audit?.vitals.lcp ?? '—') + 's')}
      ${row('Time To First Byte', (audit?.vitals.ttfb ?? '—') + 's')}
      ${row('AI Readability', (audit?.ai?.aiReadability ?? '—') + '')}
    </table></div>
  </div>

  <h2>Share of Voice</h2>
  <table><tr><th>Brand</th><th style="text-align:right">Visibility</th></tr>
    ${sov.map((s) => row(s.name, s.value + '%')).join('')}</table>

  <h2>AI Engine Visibility</h2>
  <table><tr><th>Engine</th><th style="text-align:right">Score</th></tr>
    ${engines.map((e) => row(e.engine, e.visibility + '%')).join('')}</table>

  <h2>Predictive Buying-Intent Segments</h2>
  <table><tr><th>Segment</th><th style="text-align:right">Intent Score</th></tr>
    ${leads.map((l) => row(l.segment, String(l.score))).join('')}</table>

  <h2>Conversion Funnel</h2>
  <table><tr><th>Stage</th><th style="text-align:right">Volume</th></tr>
    ${funnel.map((f) => row(f.stage, f.value.toLocaleString())).join('')}</table>

  <h2>Prioritized Action Items</h2>
  ${recs.map((r) => `<div class="rec"><span class="imp">${r.impact}</span> <b>${r.title}</b><br><span style="font-size:13px;color:#475569">${r.detail}</span></div>`).join('')}

  <div class="footer">Generated by SpeakPower Audit Dashboard · ${new Date().toLocaleDateString()} · Articulate is Key</div>
  <div class="noprint" style="text-align:center;margin-top:24px"><button onclick="window.print()" style="background:#06b6d4;color:#0f172a;border:0;padding:12px 28px;border-radius:10px;font-weight:700;cursor:pointer;font-size:14px">Save / Print as PDF</button></div>
  </div></body></html>`;

  const w = window.open('', '_blank');
  if (w) {
    w.document.write(html);
    w.document.close();
  }
}
