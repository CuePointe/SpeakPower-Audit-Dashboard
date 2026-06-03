import React, { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { ClientProfile, AuditResult } from '@/lib/auditData';
import {
  seedClientsIfEmpty,
  insertClient,
  insertAuditRun,
  fetchHistory,
  fetchLatestAudit,
  computeOverall,
  AuditRunRecord
} from '@/lib/db';
import TopNav, { ViewKey } from './audit/TopNav';
import Onboarding from './audit/Onboarding';
import Overview from './audit/views/Overview';
import IntentGap from './audit/views/IntentGap';
import AiSeo from './audit/views/AiSeo';
import LeadScoring from './audit/views/LeadScoring';
import TechSandbox from './audit/views/TechSandbox';
import HistoryView from './audit/views/History';
import { generateProposal } from './audit/exportReport';
import { Loader2 } from 'lucide-react';

const AppLayout: React.FC = () => {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [view, setView] = useState<ViewKey>('overview');
  const [onboarding, setOnboarding] = useState(false);
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [history, setHistory] = useState<AuditRunRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const runningRef = useRef(false);

  const active = clients.find((c) => c.id === activeId) || null;

  const runAudit = useCallback(async (client: ClientProfile) => {
    if (runningRef.current) return;
    runningRef.current = true;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('audit-site', {
        body: { url: client.url, businessName: client.businessName, industry: client.industry }
      });
      if (!error && data) {
        const result: AuditResult = (data.data ?? data) as AuditResult;
        const overall = computeOverall(result);
        setAudit(result);
        try {
          await insertAuditRun(client.id, result, overall);
          const h = await fetchHistory(client.id);
          setHistory(h);
        } catch (e) {
          /* persistence best-effort */
        }
      }
    } catch (e) {
      /* noop */
    } finally {
      setLoading(false);
      runningRef.current = false;
    }
  }, []);

  // Load a client's persisted audit + history; auto-run if none exists
  const loadClient = useCallback(async (client: ClientProfile) => {
    setAudit(null);
    setHistory([]);
    let h: AuditRunRecord[] = [];
    try {
      h = await fetchHistory(client.id);
      setHistory(h);
    } catch (e) { /* noop */ }
    if (h.length > 0) {
      setAudit(h[h.length - 1].result);
    } else {
      const latest = await fetchLatestAudit(client.id);
      if (latest) setAudit(latest);
      else runAudit(client);
    }
  }, [runAudit]);

  // Boot: seed + load clients
  useEffect(() => {
    (async () => {
      try {
        const list = await seedClientsIfEmpty();
        setClients(list);
        if (list.length > 0) {
          setActiveId(list[0].id);
          await loadClient(list[0]);
        }
      } catch (e) {
        /* noop */
      } finally {
        setBooting(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchClient = (id: string) => {
    setActiveId(id);
    setView('overview');
    const c = clients.find((x) => x.id === id);
    if (c) loadClient(c);
  };

  const handleComplete = async (c: ClientProfile) => {
    setOnboarding(false);
    setView('overview');
    try {
      const saved = await insertClient(c);
      setClients((p) => [...p, saved]);
      setActiveId(saved.id);
      setAudit(null);
      setHistory([]);
      runAudit(saved);
    } catch (e) {
      // fallback to in-memory if DB write fails
      setClients((p) => [...p, c]);
      setActiveId(c.id);
      runAudit(c);
    }
  };

  if (booting) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mb-3" />
        <p className="text-sm">Loading tenant workspaces…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100" style={{ backgroundImage: 'radial-gradient(circle at 20% 0%, rgba(6,182,212,0.08), transparent 40%), radial-gradient(circle at 80% 0%, rgba(245,158,11,0.06), transparent 40%)' }}>
      <TopNav
        view={view}
        setView={setView}
        clients={clients}
        activeId={activeId}
        setActiveId={switchClient}
        onNew={() => setOnboarding(true)}
        onExport={() => active && generateProposal(active, audit)}
      />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        {onboarding ? (
          <div className="py-6">
            <Onboarding onComplete={handleComplete} onCancel={() => setOnboarding(false)} />
          </div>
        ) : active ? (
          <>
            {view === 'overview' && <Overview client={active} audit={audit} loading={loading} />}
            {view === 'intent' && <IntentGap client={active} audit={audit} />}
            {view === 'aiseo' && <AiSeo client={active} audit={audit} />}
            {view === 'leads' && <LeadScoring client={active} audit={audit} />}
            {view === 'tech' && <TechSandbox client={active} audit={audit} />}
            {view === 'history' && (
              <HistoryView client={active} history={history} loading={loading} onReaudit={() => runAudit(active)} />
            )}
          </>
        ) : (
          <div className="text-center py-20 text-slate-400">No clients yet. Create your first audit.</div>
        )}
      </main>

      <footer className="border-t border-slate-800 mt-10">
        <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <span>SpeakPower Audit Dashboard · Multi-tenant B2B GEO intelligence · Persisted to Supabase</span>
          <span className="text-cyan-400/70 italic">Articulate is Key</span>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
