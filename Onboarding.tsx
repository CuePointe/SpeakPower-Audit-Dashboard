import React, { useState } from 'react';
import { Building2, Globe, MapPin, Users, ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { INDUSTRIES, INDUSTRY_FIELDS, ClientProfile } from '@/lib/auditData';
import { Card } from './ui';

interface Props {
  onComplete: (c: ClientProfile) => void;
  onCancel?: () => void;
}

const Onboarding: React.FC<Props> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [f, setF] = useState({ businessName: '', url: '', location: '', demographic: '', industry: '', catalog: '', valueProp: '', email: '' });
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  const canNext = step === 1 ? f.businessName && f.url : step === 2 ? !!f.industry : true;
  const fields = f.industry ? INDUSTRY_FIELDS[f.industry] : null;

  const submit = async () => {
    if (f.email) {
      try {
        await fetch('https://famous.ai/api/crm/6a1fe5de5f143249b222a8ed/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: f.email, name: f.businessName, source: 'onboarding', tags: ['audit-client', f.industry] })
        });
      } catch (e) { /* noop */ }
    }
    onComplete({
      id: 'c' + Date.now(),
      businessName: f.businessName,
      url: f.url,
      location: f.location,
      demographic: f.demographic,
      industry: f.industry || 'Professional Services',
      catalog: f.catalog,
      valueProp: f.valueProp,
      createdAt: new Date().toISOString().slice(0, 10)
    });
  };

  const inputCls = 'w-full rounded-lg bg-slate-900/60 border border-slate-700 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" /> New Tenant Onboarding
        </div>
        <h1 className="text-2xl font-bold text-slate-100">Launch an AI Visibility Audit</h1>
        <p className="text-slate-400 text-sm mt-1">Three quick steps to provision a new client workspace.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div className={`flex items-center justify-center w-9 h-9 rounded-full border-2 text-sm font-bold transition-colors ${step >= s ? 'bg-cyan-500 border-cyan-500 text-slate-900' : 'border-slate-600 text-slate-500'}`}>
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-cyan-500' : 'bg-slate-700'}`} />}
          </React.Fragment>
        ))}
      </div>

      <Card className="p-6">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-200 mb-1">Operational Metadata</h3>
            <div>
              <label className="text-xs text-slate-400 flex items-center gap-1.5 mb-1"><Building2 className="w-3.5 h-3.5" /> Business Name</label>
              <input className={inputCls} value={f.businessName} onChange={(e) => set('businessName', e.target.value)} placeholder="Acme Corporation" />
            </div>
            <div>
              <label className="text-xs text-slate-400 flex items-center gap-1.5 mb-1"><Globe className="w-3.5 h-3.5" /> Target URL</label>
              <input className={inputCls} value={f.url} onChange={(e) => set('url', e.target.value)} placeholder="acme.com" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 flex items-center gap-1.5 mb-1"><MapPin className="w-3.5 h-3.5" /> Target Location</label>
                <input className={inputCls} value={f.location} onChange={(e) => set('location', e.target.value)} placeholder="San Francisco, CA" />
              </div>
              <div>
                <label className="text-xs text-slate-400 flex items-center gap-1.5 mb-1"><Users className="w-3.5 h-3.5" /> Core Demographic</label>
                <input className={inputCls} value={f.demographic} onChange={(e) => set('demographic', e.target.value)} placeholder="B2B decision makers" />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Contact Email (for report delivery)</label>
              <input className={inputCls} type="email" value={f.email} onChange={(e) => set('email', e.target.value)} placeholder="you@agency.com" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="font-semibold text-slate-200 mb-3">Select Industry Vertical</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {INDUSTRIES.map((ind) => (
                <button key={ind} onClick={() => set('industry', ind)} className={`text-left p-3 rounded-lg border text-sm transition-all ${f.industry === ind ? 'border-cyan-500 bg-cyan-500/10 text-cyan-200' : 'border-slate-700 bg-slate-900/40 text-slate-300 hover:border-slate-500'}`}>
                  {ind}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && fields && (
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-200 mb-1">{f.industry} Details</h3>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">{fields.catalog}</label>
              <textarea className={inputCls + ' min-h-[90px]'} value={f.catalog} onChange={(e) => set('catalog', e.target.value)} placeholder="List your products / services..." />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">{fields.valueProp}</label>
              <textarea className={inputCls + ' min-h-[90px]'} value={f.valueProp} onChange={(e) => set('valueProp', e.target.value)} placeholder="Describe your key value propositions..." />
            </div>
          </div>
        )}

        <div className="flex justify-between mt-7 pt-5 border-t border-slate-700/60">
          <button
            onClick={() => (step === 1 ? onCancel?.() : setStep(step - 1))}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> {step === 1 ? 'Cancel' : 'Back'}
          </button>
          {step < 3 ? (
            <button disabled={!canNext} onClick={() => setStep(step + 1)} className="inline-flex items-center gap-1 px-5 py-2 rounded-lg text-sm font-semibold bg-cyan-500 text-slate-900 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={submit} className="inline-flex items-center gap-1 px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-cyan-500 to-amber-400 text-slate-900 hover:opacity-90 transition-opacity">
              <Sparkles className="w-4 h-4" /> Run Audit
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Onboarding;
