import type { LeadInput } from './types';

/**
 * Simple lead scoring rules - 0..100.
 * Mirrors the rubric in the strategy plan (Faz 4).
 */
export function scoreLead(lead: LeadInput, opts: { workingHours?: boolean } = {}): number {
  let score = 0;

  // +30: phone looks valid (10-15 digits)
  const digits = lead.phone.replace(/\D/g, '');
  if (digits.length >= 10 && digits.length <= 15) score += 30;

  // +20: marketing consent — high quality, agreeable lead
  if (lead.marketingConsent) score += 20;

  // +20: step-1 form data exists (real intent, not just generic inquiry)
  if (lead.step1 && Object.keys(lead.step1).length > 0) score += 20;

  // +15: within working hours
  if (opts.workingHours) score += 15;

  // +10: paid traffic with utm_source
  if (lead.utm?.source && /google|meta|facebook|instagram|tiktok/i.test(lead.utm.source)) score += 10;

  // +5: email also provided
  if (lead.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) score += 5;

  return Math.min(100, score);
}

export function isWorkingHours(d = new Date()): boolean {
  // TR working hours, naive (no holidays). 09-19 Mon-Fri, 09-17 Sat.
  const day = d.getDay();
  const hour = d.getHours();
  if (day === 0) return false; // Sunday
  if (day === 6) return hour >= 9 && hour < 17;
  return hour >= 9 && hour < 19;
}
