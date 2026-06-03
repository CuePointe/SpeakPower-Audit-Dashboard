import { supabase } from '@/lib/supabase';
import { ClientProfile, AuditResult, SEED_CLIENTS } from '@/lib/auditData';

function rowToClient(r: any): ClientProfile {
  return {
    id: r.id,
    businessName: r.business_name,
    url: r.url,
    location: r.location || '',
    demographic: r.demographic || '',
    industry: r.industry || '',
    catalog: r.catalog || '',
    valueProp: r.value_prop || '',
    createdAt: (r.created_at || '').slice(0, 10)
  };
}

export interface AuditRunRecord {
  id: string;
  clientId: string;
  overallScore: number;
  schemaScore: number;
  result: AuditResult;
  createdAt: string;
}

export async function fetchClients(): Promise<ClientProfile[]> {
  const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []).map(rowToClient);
}

export async function seedClientsIfEmpty(): Promise<ClientProfile[]> {
  const existing = await fetchClients();
  if (existing.length > 0) return existing;
  const rows = SEED_CLIENTS.map((c) => ({
    business_name: c.businessName,
    url: c.url,
    location: c.location,
    demographic: c.demographic,
    industry: c.industry,
    catalog: c.catalog,
    value_prop: c.valueProp
  }));
  const { error } = await supabase.from('clients').insert(rows);
  if (error) throw error;
  return fetchClients();
}

export async function insertClient(c: Omit<ClientProfile, 'id' | 'createdAt'>): Promise<ClientProfile> {
  const { data, error } = await supabase
    .from('clients')
    .insert({
      business_name: c.businessName,
      url: c.url,
      location: c.location,
      demographic: c.demographic,
      industry: c.industry,
      catalog: c.catalog,
      value_prop: c.valueProp
    })
    .select()
    .single();
  if (error) throw error;
  return rowToClient(data);
}

export async function insertAuditRun(clientId: string, result: AuditResult, overallScore: number): Promise<void> {
  const { error } = await supabase.from('audit_runs').insert({
    client_id: clientId,
    overall_score: overallScore,
    schema_score: result.schema?.score ?? 0,
    result
  });
  if (error) throw error;
}

export async function fetchHistory(clientId: string): Promise<AuditRunRecord[]> {
  const { data, error } = await supabase
    .from('audit_runs')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []).map((r: any) => ({
    id: r.id,
    clientId: r.client_id,
    overallScore: r.overall_score,
    schemaScore: r.schema_score,
    result: r.result,
    createdAt: r.created_at
  }));
}

export async function fetchLatestAudit(clientId: string): Promise<AuditResult | null> {
  const { data, error } = await supabase
    .from('audit_runs')
    .select('result')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) return null;
  return (data?.result as AuditResult) || null;
}

export function computeOverall(result: AuditResult | null): number {
  if (!result) return 0;
  return Math.round(((result.schema?.score ?? 0) + (result.ai?.aiReadability ?? 60) + (result.ai?.topicalDepth ?? 55)) / 3);
}
