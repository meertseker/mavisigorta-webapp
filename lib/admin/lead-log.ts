import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type { LeadInput, LeadStatus } from '@/lib/types';

/**
 * DEV-ONLY file-based lead log.
 *
 * Production durability requirements (Supabase / Vercel KV) intentionally
 * deferred. In dev this writes a JSONL file under data/leads.jsonl so the
 * admin UI has something to render. On Vercel serverless the FS write will
 * fall back to /tmp (ephemeral); the lead also goes via Resend email which is
 * the canonical channel until Supabase is wired.
 */

export interface StoredLead extends LeadInput {
  id: string;
  createdAt: string;
  score: number;
  status: LeadStatus;
  notes?: string;
}

function dataDir(): string {
  const fromEnv = process.env.LEAD_LOG_DIR;
  if (fromEnv) return fromEnv;
  // /tmp is writable on Vercel; data/ is writable in local dev.
  if (process.env.VERCEL) return '/tmp';
  return path.join(process.cwd(), 'data');
}

function leadFile(): string {
  return path.join(dataDir(), 'leads.jsonl');
}

function ensureDir() {
  const dir = dataDir();
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function appendLead(lead: LeadInput & { score: number }): StoredLead {
  const stored: StoredLead = {
    ...lead,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    score: lead.score,
    status: 'new',
  };

  try {
    ensureDir();
    fs.appendFileSync(leadFile(), JSON.stringify(stored) + '\n', 'utf8');
  } catch (err) {
    console.warn('[lead-log] write failed (non-fatal):', err);
  }
  return stored;
}

export function listLeads(limit = 200): StoredLead[] {
  try {
    const file = leadFile();
    if (!fs.existsSync(file)) return [];
    const raw = fs.readFileSync(file, 'utf8');
    const lines = raw.split('\n').filter(Boolean);
    const parsed: StoredLead[] = [];
    for (let i = lines.length - 1; i >= 0 && parsed.length < limit; i--) {
      try {
        parsed.push(JSON.parse(lines[i]) as StoredLead);
      } catch {
        /* skip malformed line */
      }
    }
    return parsed;
  } catch (err) {
    console.warn('[lead-log] read failed:', err);
    return [];
  }
}

export function getLeadById(id: string): StoredLead | null {
  return listLeads(10_000).find((l) => l.id === id) || null;
}

export function updateLead(
  id: string,
  patch: Partial<Pick<StoredLead, 'status' | 'notes'>>,
): StoredLead | null {
  try {
    const file = leadFile();
    if (!fs.existsSync(file)) return null;
    const raw = fs.readFileSync(file, 'utf8');
    const lines = raw.split('\n').filter(Boolean);
    let updated: StoredLead | null = null;
    const next = lines.map((line) => {
      try {
        const lead = JSON.parse(line) as StoredLead;
        if (lead.id === id) {
          const merged = { ...lead, ...patch };
          updated = merged;
          return JSON.stringify(merged);
        }
        return line;
      } catch {
        return line;
      }
    });
    fs.writeFileSync(file, next.join('\n') + '\n', 'utf8');
    return updated;
  } catch (err) {
    console.warn('[lead-log] update failed:', err);
    return null;
  }
}

export interface LeadStats {
  total: number;
  newCount: number;
  byProduct: Record<string, number>;
  bySource: Record<string, number>;
  last7d: number;
  avgScore: number;
}

export function leadStats(): LeadStats {
  const leads = listLeads(10_000);
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const byProduct: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  let scoreSum = 0;
  let last7d = 0;

  for (const l of leads) {
    byProduct[l.product] = (byProduct[l.product] || 0) + 1;
    const src = l.source || 'unknown';
    bySource[src] = (bySource[src] || 0) + 1;
    scoreSum += l.score;
    if (new Date(l.createdAt).getTime() > sevenDaysAgo) last7d++;
  }

  return {
    total: leads.length,
    newCount: leads.filter((l) => l.status === 'new').length,
    byProduct,
    bySource,
    last7d,
    avgScore: leads.length ? Math.round(scoreSum / leads.length) : 0,
  };
}
