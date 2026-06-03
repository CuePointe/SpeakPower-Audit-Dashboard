// Types & seed data for SpeakPower Audit Dashboard

export interface ClientProfile {
  id: string;
  businessName: string;
  url: string;
  location: string;
  demographic: string;
  industry: string;
  catalog: string;
  valueProp: string;
  createdAt: string;
}

export interface AuditResult {
  target: string;
  reachable: boolean;
  status: number;
  fetchError?: string;
  latency: number;
  sizeKb: number;
  wordCount: number;
  title: string;
  metaDesc: string;
  h1Count: number;
  schema: { found: string[]; missing: string[]; score: number; all: string[] };
  vitals: { fcp: number; lcp: number; ttfb: number };
  ai: AiAnalysis | null;
  analyzedAt: string;
}

export interface AiAnalysis {
  entities?: { name: string; type: string }[];
  keywordCoverage?: number;
  topicalDepth?: number;
  aiReadability?: number;
  buyingIntentScore?: number;
  summary?: string;
  recommendations?: { title: string; impact: 'High' | 'Medium' | 'Low'; detail: string }[];
  questionClusters?: { question: string; covered: boolean }[];
  error?: string;
}

export const INDUSTRIES = [
  'Hospitality & Tourism',
  'Retail & E-commerce',
  'Professional Services',
  'Healthcare',
  'Real Estate',
  'Local Brick-and-Mortar',
  'Environment/Conservation',
  'Entertainment',
  'Sports'
];

export const INDUSTRY_FIELDS: Record<string, { catalog: string; valueProp: string }> = {
  'Hospitality & Tourism': { catalog: 'Tours, packages & amenities offered', valueProp: 'What makes your guest experience unique?' },
  'Retail & E-commerce': { catalog: 'Top product categories & SKUs', valueProp: 'Your brand differentiators & USP' },
  'Professional Services': { catalog: 'Practice areas & service lines', valueProp: 'Your expertise & credentials' },
  'Healthcare': { catalog: 'Treatments, specialties & procedures', valueProp: 'Patient outcomes & care philosophy' },
  'Real Estate': { catalog: 'Property types & markets served', valueProp: 'Your local advantage & track record' },
  'Local Brick-and-Mortar': { catalog: 'Products & in-store services', valueProp: 'Why locals choose you' },
  'Environment/Conservation': { catalog: 'Programs, projects & initiatives', valueProp: 'Your impact & mission' },
  'Entertainment': { catalog: 'Events, shows & offerings', valueProp: 'Your audience & signature experiences' },
  'Sports': { catalog: 'Teams, programs & facilities', valueProp: 'Your competitive edge & community' }
};

export const AI_ENGINES = ['ChatGPT', 'Gemini', 'Perplexity', 'Claude'];
export const VISUAL_PLATFORMS = ['Pinterest', 'Instagram', 'TikTok', 'YouTube', 'Facebook', 'Reddit', 'X'];

export const SEED_CLIENTS: ClientProfile[] = [
  { id: 'c1', businessName: 'Savanna Trails Safari Co.', url: 'https://www.intrepidtravel.com', location: 'Nairobi, Kenya', demographic: 'Affluent adventure travelers 35-60', industry: 'Hospitality & Tourism', catalog: 'Big Five safaris, balloon tours, luxury tented camps', valueProp: 'Conservation-first private guiding', createdAt: '2026-05-01' },
  { id: 'c2', businessName: 'The Meridian Grand Hotel', url: 'https://www.marriott.com', location: 'New York, NY', demographic: 'Business & luxury leisure travelers', industry: 'Hospitality & Tourism', catalog: 'Penthouse suites, rooftop dining, spa', valueProp: 'Five-star metropolitan luxury', createdAt: '2026-05-03' },
  { id: 'c3', businessName: 'Harbor & Vance Law Group', url: 'https://stripe.com', location: 'Boston, MA', demographic: 'SMB owners & high-net-worth clients', industry: 'Professional Services', catalog: 'Corporate law, M&A, IP litigation', valueProp: 'Boutique attention, big-firm results', createdAt: '2026-05-05' },
  { id: 'c4', businessName: 'Lumen Apparel', url: 'https://www.allbirds.com', location: 'Los Angeles, CA', demographic: 'Eco-conscious millennials & Gen Z', industry: 'Retail & E-commerce', catalog: 'Sustainable basics, outerwear, accessories', valueProp: 'Carbon-neutral fashion', createdAt: '2026-05-08' },
  { id: 'c5', businessName: 'BrightSmile Dental Studio', url: 'https://www.aspendental.com', location: 'Austin, TX', demographic: 'Families & young professionals', industry: 'Healthcare', catalog: 'Cosmetic dentistry, Invisalign, implants', valueProp: 'Pain-free modern dentistry', createdAt: '2026-05-10' },
  { id: 'c6', businessName: 'Coastal Crest Realty', url: 'https://www.zillow.com', location: 'San Diego, CA', demographic: 'Luxury home buyers & investors', industry: 'Real Estate', catalog: 'Oceanfront estates, condos, commercial', valueProp: 'Coastal market specialists', createdAt: '2026-05-12' }
];

// Deterministic pseudo-random based on string seed
function seedRand(seed: string, i: number) {
  let h = 0;
  for (let c = 0; c < seed.length; c++) h = (h * 31 + seed.charCodeAt(c) + i * 7) % 9973;
  return (h % 1000) / 1000;
}

export function genTimeSeries(seed: string) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  return months.map((m, i) => ({
    month: m,
    traditional: Math.round(20 + seedRand(seed, i) * 30 + i * 2),
    geo: Math.round(8 + seedRand(seed, i + 20) * 18 + i * 4.5),
    citations: Math.round(5 + seedRand(seed, i + 40) * 12 + i * 3)
  }));
}

export function genShareOfVoice(seed: string, businessName: string) {
  return [
    { name: businessName.split(' ')[0], value: Math.round(22 + seedRand(seed, 1) * 18) },
    { name: 'Competitor A', value: Math.round(18 + seedRand(seed, 2) * 14) },
    { name: 'Competitor B', value: Math.round(14 + seedRand(seed, 3) * 12) },
    { name: 'Competitor C', value: Math.round(10 + seedRand(seed, 4) * 10) },
    { name: 'Others', value: Math.round(8 + seedRand(seed, 5) * 8) }
  ];
}

export function genLeadScores(seed: string, industry: string) {
  const segs = ['High-intent buyers', 'Comparison shoppers', 'Brand researchers', 'Local searchers', 'Referral traffic', 'Cold discovery'];
  return segs.map((s, i) => ({
    segment: s,
    score: Math.round(40 + seedRand(seed + industry, i) * 58),
    volume: Math.round(120 + seedRand(seed, i + 9) * 900),
    trend: seedRand(seed, i + 30) > 0.5 ? 'up' : 'down'
  })).sort((a, b) => b.score - a.score);
}

export function genFunnel(seed: string) {
  const imp = Math.round(40000 + seedRand(seed, 1) * 60000);
  const cite = Math.round(imp * (0.18 + seedRand(seed, 2) * 0.1));
  const clicks = Math.round(cite * (0.28 + seedRand(seed, 3) * 0.12));
  const leads = Math.round(clicks * (0.12 + seedRand(seed, 4) * 0.1));
  return [
    { stage: 'Brand Impressions', value: imp },
    { stage: 'AI Search Citations', value: cite },
    { stage: 'Website Clicks', value: clicks },
    { stage: 'Intent Leads', value: leads }
  ];
}

export function genEngineVisibility(seed: string) {
  return AI_ENGINES.map((e, i) => ({ engine: e, visibility: Math.round(25 + seedRand(seed, i + 60) * 60) }));
}

export function genPlatformVisibility(seed: string) {
  return VISUAL_PLATFORMS.map((p, i) => ({ platform: p, score: Math.round(15 + seedRand(seed, i + 80) * 75) }));
}
