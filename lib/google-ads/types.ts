/**
 * Lightweight, plain-TS representations of Google Ads resources.
 *
 * These intentionally avoid the proto/REST verbosity from
 * googleads.googleapis.com so the admin UI can render simple shapes.
 * The REST client maps between these and the API payload at the seam.
 */

import type { InsuranceSlug } from '@/lib/types';

export type CampaignStatus = 'ENABLED' | 'PAUSED' | 'REMOVED' | 'UNSPECIFIED';

export type AdvertisingChannelType =
  | 'SEARCH'
  | 'DISPLAY'
  | 'SHOPPING'
  | 'VIDEO'
  | 'PERFORMANCE_MAX';

export type BiddingStrategy =
  | { type: 'MAXIMIZE_CONVERSIONS'; targetCpaMicros?: number }
  | { type: 'MAXIMIZE_CONVERSION_VALUE'; targetRoas?: number }
  | { type: 'MANUAL_CPC' }
  | { type: 'TARGET_CPA'; targetCpaMicros: number }
  | { type: 'TARGET_ROAS'; targetRoas: number };

export interface GeoTarget {
  /** Google Ads geoTargetConstant resource ID (e.g. "2792" = Türkiye). */
  geoTargetConstant: string;
  label: string;
  negative?: boolean;
}

export interface KeywordItem {
  text: string;
  matchType: 'EXACT' | 'PHRASE' | 'BROAD';
  negative?: boolean;
  cpcBidMicros?: number;
}

export interface ResponsiveSearchAd {
  /** Optional Google Ads ad resource name; absent for drafts. */
  resourceName?: string;
  headlines: string[]; // up to 15, ≤30 chars
  descriptions: string[]; // up to 4, ≤90 chars
  finalUrl: string;
  finalUrls?: string[];
  path1?: string; // display path segment 1 (≤15 chars)
  path2?: string;
}

export interface AdGroup {
  id?: string;
  name: string;
  status: CampaignStatus;
  cpcBidMicros?: number;
  keywords: KeywordItem[];
  ads: ResponsiveSearchAd[];
}

// ─── Assets (extensions) ──────────────────────────────────────────────────

export interface SitelinkAsset {
  text: string; // ≤25 chars
  description1?: string; // ≤35 chars
  description2?: string; // ≤35 chars
  finalUrl: string;
}

export interface CalloutAsset {
  text: string; // ≤25 chars
}

export interface CallAsset {
  phoneNumber: string; // E.164 ideal, ör: +905324807617
  countryCode: string; // "TR"
}

export interface StructuredSnippetAsset {
  header: string; // "Services", "Insurance coverage", etc.
  values: string[]; // 3–10 values
}

// Day-of-week: MONDAY..SUNDAY. Times are HH:MM (15-minute increments).
export interface AdScheduleEntry {
  dayOfWeek:
    | 'MONDAY'
    | 'TUESDAY'
    | 'WEDNESDAY'
    | 'THURSDAY'
    | 'FRIDAY'
    | 'SATURDAY'
    | 'SUNDAY';
  startHour: number; // 0–23
  endHour: number; // 1–24
  /** Optional bid modifier, e.g. 1.1 = +10%, 0.7 = -30%. */
  bidModifier?: number;
}

export interface AudienceSignals {
  ageRanges?: ('18_24' | '25_34' | '35_44' | '45_54' | '55_64' | '65_UP')[];
  genders?: ('MALE' | 'FEMALE' | 'UNDETERMINED')[];
  /** "in_market/insurance" gibi Google taksonomi etiketleri (placeholder). */
  inMarketSegments?: string[];
}

export interface Campaign {
  id?: string;
  resourceName?: string;
  name: string;
  status: CampaignStatus;
  advertisingChannelType: AdvertisingChannelType;
  /** Daily budget in TRY (the UI shows TL; we convert to micros at the seam). */
  budgetDailyTry: number;
  biddingStrategy: BiddingStrategy;
  geoTargets: GeoTarget[];
  languageConstants?: string[];
  startDate?: string;
  endDate?: string;
  /** Optional convenience field linking the campaign to a Mavi product. */
  insuranceProduct?: InsuranceSlug;
  adGroups: AdGroup[];
  /**
   * Kampanya seviyesinde negatif anahtar kelimeler. Tüm ad group'lara otomatik
   * uygulanır; ad-group içine tekrar tekrar yapıştırmaya gerek kalmaz.
   * REST'e `campaignCriterion` (negative keyword) olarak gönderilir.
   */
  negativeKeywords?: KeywordItem[];
  // Assets (campaign-level extensions)
  sitelinks?: SitelinkAsset[];
  callouts?: CalloutAsset[];
  call?: CallAsset;
  structuredSnippets?: StructuredSnippetAsset[];
  adSchedule?: AdScheduleEntry[];
  audienceSignals?: AudienceSignals;
  /** Final URL suffix or tracking template — applied to all ads in campaign. */
  finalUrlSuffix?: string;
  // Read-only performance snapshot (last 30 days) hydrated from API.
  metrics?: CampaignMetrics;
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  costMicros: number;
  conversions: number;
  conversionValue: number;
  ctr: number;
  averageCpcMicros: number;
  costPerConversionMicros: number;
}

export interface KeywordIdea {
  text: string;
  avgMonthlySearches: number;
  competition: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';
  competitionIndex?: number;
  lowTopOfPageBidMicros?: number;
  highTopOfPageBidMicros?: number;
}

export interface ApiError {
  message: string;
  details?: unknown;
}

export const TURKEY_GEO_TARGET = '2792';
// Common İstanbul districts as Google geo-target constants (verify in production).
export const ISTANBUL_DISTRICTS: GeoTarget[] = [
  { geoTargetConstant: '2792', label: 'Türkiye' },
  // NOTE: District-level IDs need verification per account; placeholders below.
];

export function microsToTry(micros: number | undefined | null): number {
  if (!micros) return 0;
  return micros / 1_000_000;
}

export function tryToMicros(amount: number): number {
  return Math.round(amount * 1_000_000);
}
