/**
 * Thin REST wrapper around the Google Ads API (https://developers.google.com/google-ads/api/rest).
 *
 * Design notes:
 * - We avoid the heavy `google-ads-api` npm package; this is intentionally minimal so the admin UI
 *   can perform CRUD and read metrics. Anything fancier (proto types, batch jobs) can be added later.
 * - When the developer token or refresh token isn't configured the client returns a clearly-flagged
 *   mock response so the UI is still navigable in local dev.
 * - All bid amounts are passed in MICROS (1 TRY = 1_000_000 micros) — see types.ts helpers.
 */

import type {
  Campaign,
  CampaignMetrics,
  CampaignStatus,
  KeywordIdea,
} from './types';

const API_BASE = 'https://googleads.googleapis.com';

interface RuntimeConfig {
  developerToken: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  customerId: string;
  loginCustomerId?: string;
  apiVersion: string;
}

export interface ClientStatus {
  configured: boolean;
  missing: string[];
  customerId?: string;
  loginCustomerId?: string;
  apiVersion: string;
}

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

function getConfig(): { ok: true; cfg: RuntimeConfig } | { ok: false; missing: string[] } {
  const cfg: Partial<RuntimeConfig> = {
    developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    clientId: process.env.GOOGLE_ADS_CLIENT_ID,
    clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN,
    customerId: process.env.GOOGLE_ADS_CUSTOMER_ID?.replace(/-/g, ''),
    loginCustomerId: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.replace(/-/g, '') || undefined,
    apiVersion: process.env.GOOGLE_ADS_API_VERSION || 'v18',
  };

  const required: (keyof RuntimeConfig)[] = [
    'developerToken',
    'clientId',
    'clientSecret',
    'refreshToken',
    'customerId',
  ];
  const missing = required.filter((k) => !cfg[k]);
  if (missing.length) return { ok: false, missing };
  return { ok: true, cfg: cfg as RuntimeConfig };
}

export function getClientStatus(): ClientStatus {
  const cfg = getConfig();
  if (!cfg.ok) {
    return {
      configured: false,
      missing: cfg.missing,
      apiVersion: process.env.GOOGLE_ADS_API_VERSION || 'v18',
    };
  }
  return {
    configured: true,
    missing: [],
    customerId: cfg.cfg.customerId,
    loginCustomerId: cfg.cfg.loginCustomerId,
    apiVersion: cfg.cfg.apiVersion,
  };
}

async function refreshAccessToken(cfg: RuntimeConfig): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedAccessToken && cachedAccessToken.expiresAt - 60 > now) {
    return cachedAccessToken.token;
  }

  const body = new URLSearchParams({
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
    refresh_token: cfg.refreshToken,
    grant_type: 'refresh_token',
  });

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google OAuth refresh failed: ${res.status} ${text}`);
  }
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedAccessToken = {
    token: data.access_token,
    expiresAt: now + (data.expires_in || 3600),
  };
  return data.access_token;
}

async function adsFetch<T>(
  cfg: RuntimeConfig,
  path: string,
  init: RequestInit & { json?: unknown } = {},
): Promise<T> {
  const token = await refreshAccessToken(cfg);

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    'developer-token': cfg.developerToken,
    'Content-Type': 'application/json',
  };
  if (cfg.loginCustomerId) headers['login-customer-id'] = cfg.loginCustomerId;
  Object.assign(headers, init.headers);

  const url = `${API_BASE}/${cfg.apiVersion}${path}`;
  const res = await fetch(url, {
    method: init.method || 'POST',
    headers,
    body: init.json !== undefined ? JSON.stringify(init.json) : init.body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google Ads API ${res.status} ${path}: ${text.slice(0, 500)}`);
  }
  return (await res.json()) as T;
}

// ─── Public surface ────────────────────────────────────────────────────────

export async function searchStream<T = unknown>(query: string): Promise<T[]> {
  const cfg = getConfig();
  if (!cfg.ok) return [];

  type SearchResponse = { results?: T[]; nextPageToken?: string };
  const all: T[] = [];
  let pageToken: string | undefined;
  do {
    const data = await adsFetch<SearchResponse>(
      cfg.cfg,
      `/customers/${cfg.cfg.customerId}/googleAds:search`,
      {
        method: 'POST',
        json: { query, pageToken, pageSize: 1000 },
      },
    );
    if (data.results) all.push(...data.results);
    pageToken = data.nextPageToken;
  } while (pageToken);
  return all;
}

// Campaign + metrics list (last 30 days)
export async function listCampaigns(): Promise<Campaign[]> {
  const cfg = getConfig();
  if (!cfg.ok) return mockCampaigns();

  const query = `
    SELECT
      campaign.id,
      campaign.resource_name,
      campaign.name,
      campaign.status,
      campaign.advertising_channel_type,
      campaign_budget.amount_micros,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions,
      metrics.conversions_value,
      metrics.ctr,
      metrics.average_cpc,
      metrics.cost_per_conversion
    FROM campaign
    WHERE segments.date DURING LAST_30_DAYS
  `;

  type Row = {
    campaign: {
      id: string;
      resourceName: string;
      name: string;
      status: CampaignStatus;
      advertisingChannelType: Campaign['advertisingChannelType'];
    };
    campaignBudget?: { amountMicros?: string };
    metrics?: {
      impressions?: string;
      clicks?: string;
      costMicros?: string;
      conversions?: number;
      conversionsValue?: number;
      ctr?: number;
      averageCpc?: string;
      costPerConversion?: string;
    };
  };

  const rows = await searchStream<Row>(query);

  // The same campaign may appear multiple times if segments are added; aggregate metrics.
  const byId = new Map<string, Campaign>();
  for (const r of rows) {
    const id = r.campaign.id;
    const existing = byId.get(id);
    const m = r.metrics || {};
    const metrics: CampaignMetrics = {
      impressions: Number(m.impressions || 0) + (existing?.metrics?.impressions || 0),
      clicks: Number(m.clicks || 0) + (existing?.metrics?.clicks || 0),
      costMicros: Number(m.costMicros || 0) + (existing?.metrics?.costMicros || 0),
      conversions: Number(m.conversions || 0) + (existing?.metrics?.conversions || 0),
      conversionValue: Number(m.conversionsValue || 0) + (existing?.metrics?.conversionValue || 0),
      ctr: Number(m.ctr || 0),
      averageCpcMicros: Number(m.averageCpc || 0),
      costPerConversionMicros: Number(m.costPerConversion || 0),
    };

    byId.set(id, {
      id,
      resourceName: r.campaign.resourceName,
      name: r.campaign.name,
      status: r.campaign.status,
      advertisingChannelType: r.campaign.advertisingChannelType,
      budgetDailyTry: Number(r.campaignBudget?.amountMicros || 0) / 1_000_000,
      biddingStrategy: { type: 'MAXIMIZE_CONVERSIONS' },
      geoTargets: [],
      adGroups: [],
      metrics,
    });
  }

  return Array.from(byId.values()).sort((a, b) => (a.name > b.name ? 1 : -1));
}

// Single campaign with ad groups + ads + keywords
export async function getCampaignDetail(campaignId: string): Promise<Campaign | null> {
  const list = await listCampaigns();
  return list.find((c) => c.id === campaignId) || null;
}

// Pause / enable a campaign by resource name
export async function setCampaignStatus(
  resourceName: string,
  status: 'ENABLED' | 'PAUSED' | 'REMOVED',
): Promise<{ resourceName: string }> {
  const cfg = getConfig();
  if (!cfg.ok) {
    return { resourceName };
  }
  type Response = { results?: { resourceName: string }[] };
  const data = await adsFetch<Response>(cfg.cfg, `/customers/${cfg.cfg.customerId}/campaigns:mutate`, {
    method: 'POST',
    json: {
      operations: [
        {
          update: { resourceName, status },
          updateMask: 'status',
        },
      ],
    },
  });
  return data.results?.[0] || { resourceName };
}

// Keyword Plan Ideas (a.k.a. "keyword research")
export interface KeywordIdeasInput {
  seedKeywords?: string[];
  url?: string;
  language?: string; // resource name e.g. "languageConstants/1037" (Turkish)
  geoTargetConstants?: string[]; // e.g. ["geoTargetConstants/2792"]
}

export async function generateKeywordIdeas(input: KeywordIdeasInput): Promise<KeywordIdea[]> {
  const cfg = getConfig();
  if (!cfg.ok) return mockKeywordIdeas(input.seedKeywords);

  const language = input.language || 'languageConstants/1037'; // Turkish
  const geoTargetConstants = (input.geoTargetConstants?.length
    ? input.geoTargetConstants
    : ['geoTargetConstants/2792']
  );

  const body: Record<string, unknown> = {
    language,
    geoTargetConstants,
    includeAdultKeywords: false,
    pageSize: 200,
    keywordPlanNetwork: 'GOOGLE_SEARCH',
  };

  if (input.url) {
    body.urlSeed = { url: input.url };
  } else if (input.seedKeywords?.length) {
    body.keywordSeed = { keywords: input.seedKeywords };
  } else {
    return [];
  }

  type Response = {
    results?: Array<{
      text: string;
      keywordIdeaMetrics?: {
        avgMonthlySearches?: string;
        competition?: KeywordIdea['competition'];
        competitionIndex?: string;
        lowTopOfPageBidMicros?: string;
        highTopOfPageBidMicros?: string;
      };
    }>;
  };

  const data = await adsFetch<Response>(
    cfg.cfg,
    `/customers/${cfg.cfg.customerId}:generateKeywordIdeas`,
    { method: 'POST', json: body },
  );

  return (data.results || []).map((r) => ({
    text: r.text,
    avgMonthlySearches: Number(r.keywordIdeaMetrics?.avgMonthlySearches || 0),
    competition: r.keywordIdeaMetrics?.competition || 'UNKNOWN',
    competitionIndex: r.keywordIdeaMetrics?.competitionIndex
      ? Number(r.keywordIdeaMetrics.competitionIndex)
      : undefined,
    lowTopOfPageBidMicros: r.keywordIdeaMetrics?.lowTopOfPageBidMicros
      ? Number(r.keywordIdeaMetrics.lowTopOfPageBidMicros)
      : undefined,
    highTopOfPageBidMicros: r.keywordIdeaMetrics?.highTopOfPageBidMicros
      ? Number(r.keywordIdeaMetrics.highTopOfPageBidMicros)
      : undefined,
  }));
}

// ─── Publish (create campaign + budget + ad group + RSA + keywords) ───────
// This is a "big bang" create that publishes a draft as PAUSED so the admin
// can do a final review inside the Google Ads UI before going live.

export interface PublishResult {
  campaignResourceName: string;
  budgetResourceName: string;
  adGroupResourceNames: string[];
  warnings: string[];
}

export async function publishCampaignAsPaused(campaign: Campaign): Promise<PublishResult> {
  const cfg = getConfig();
  if (!cfg.ok) {
    const assetCount =
      (campaign.sitelinks?.length || 0) +
      (campaign.callouts?.length || 0) +
      (campaign.call ? 1 : 0);
    return {
      campaignResourceName: 'MOCK_RESOURCE/campaigns/123',
      budgetResourceName: 'MOCK_RESOURCE/campaignBudgets/456',
      adGroupResourceNames: campaign.adGroups.map((_, i) => `MOCK_RESOURCE/adGroups/${i}`),
      warnings: [
        `Google Ads API yapılandırılmamış — yayınlama simüle edildi (mock). ${assetCount} asset + ${
          campaign.adSchedule?.length || 0
        } schedule criterion eklenecekti.`,
      ],
    };
  }

  // Temp ID rezervasyonu (negatif sayılar, Google Ads bunları operasyon sırasında
  // gerçek resource name'lere maple
  const budgetTempId = -1;
  const campaignTempId = -2;
  const sitelinkAssetTempIds: number[] = [];
  const calloutAssetTempIds: number[] = [];
  let callAssetTempId: number | null = null;

  type MutateResponse = {
    mutateOperationResponses?: Array<Record<string, { resourceName: string }>>;
  };

  const customer = `customers/${cfg.cfg.customerId}`;

  // Build single mutate request creating budget → assets → campaign → criteria/links → ad groups → ads/keywords
  const operations: Record<string, unknown>[] = [];

  // 1) Asset oluşturmaları (campaign'den bağımsız resource'lar)
  (campaign.sitelinks || []).forEach((sl, idx) => {
    const tempId = -(1000 + idx);
    sitelinkAssetTempIds.push(tempId);
    operations.push({
      assetOperation: {
        create: {
          resourceName: `${customer}/assets/${tempId}`,
          sitelinkAsset: {
            linkText: sl.text,
            description1: sl.description1,
            description2: sl.description2,
          },
          finalUrls: [sl.finalUrl],
        },
      },
    });
  });

  (campaign.callouts || []).forEach((co, idx) => {
    const tempId = -(2000 + idx);
    calloutAssetTempIds.push(tempId);
    operations.push({
      assetOperation: {
        create: {
          resourceName: `${customer}/assets/${tempId}`,
          calloutAsset: {
            calloutText: co.text,
          },
        },
      },
    });
  });

  if (campaign.call) {
    callAssetTempId = -3000;
    operations.push({
      assetOperation: {
        create: {
          resourceName: `${customer}/assets/${callAssetTempId}`,
          callAsset: {
            phoneNumber: campaign.call.phoneNumber,
            countryCode: campaign.call.countryCode,
            callConversionReportingState: 'USE_ACCOUNT_LEVEL_CALL_CONVERSION_ACTION',
          },
        },
      },
    });
  }

  // 2) Bütçe
  operations.push({
    campaignBudgetOperation: {
      create: {
        resourceName: `${customer}/campaignBudgets/${budgetTempId}`,
        name: `${campaign.name} budget`,
        amountMicros: Math.round(campaign.budgetDailyTry * 1_000_000),
        deliveryMethod: 'STANDARD',
        explicitlyShared: false,
      },
    },
  });

  // Bidding strategy mapping
  const biddingFields: Record<string, unknown> = {};
  const bs = campaign.biddingStrategy;
  switch (bs.type) {
    case 'MAXIMIZE_CONVERSIONS':
      biddingFields.maximizeConversions = bs.targetCpaMicros
        ? { targetCpaMicros: String(bs.targetCpaMicros) }
        : {};
      break;
    case 'MAXIMIZE_CONVERSION_VALUE':
      biddingFields.maximizeConversionValue = bs.targetRoas
        ? { targetRoas: bs.targetRoas }
        : {};
      break;
    case 'TARGET_CPA':
      biddingFields.targetCpa = { targetCpaMicros: String(bs.targetCpaMicros) };
      break;
    case 'TARGET_ROAS':
      biddingFields.targetRoas = { targetRoas: bs.targetRoas };
      break;
    case 'MANUAL_CPC':
      biddingFields.manualCpc = { enhancedCpcEnabled: true };
      break;
  }

  operations.push({
    campaignOperation: {
      create: {
        resourceName: `${customer}/campaigns/${campaignTempId}`,
        name: campaign.name,
        status: 'PAUSED', // SAFETY: always create paused; admin will review and enable.
        advertisingChannelType: campaign.advertisingChannelType,
        campaignBudget: `${customer}/campaignBudgets/${budgetTempId}`,
        networkSettings: {
          targetGoogleSearch: true,
          targetSearchNetwork: true,
          targetContentNetwork: false,
          targetPartnerSearchNetwork: false,
        },
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        finalUrlSuffix: campaign.finalUrlSuffix,
        ...biddingFields,
      },
    },
  });

  // 3) Geo target criteria
  for (const geo of campaign.geoTargets) {
    operations.push({
      campaignCriterionOperation: {
        create: {
          campaign: `${customer}/campaigns/${campaignTempId}`,
          location: { geoTargetConstant: `geoTargetConstants/${geo.geoTargetConstant}` },
          negative: !!geo.negative,
        },
      },
    });
  }

  // 4) Language criterion (default Turkish — languageConstants/1037)
  const languageIds = campaign.languageConstants?.length
    ? campaign.languageConstants
    : ['1037'];
  for (const lang of languageIds) {
    operations.push({
      campaignCriterionOperation: {
        create: {
          campaign: `${customer}/campaigns/${campaignTempId}`,
          language: { languageConstant: `languageConstants/${lang}` },
        },
      },
    });
  }

  // 5a) Campaign-level negative keywords (tüm ad group'larda geçerli)
  for (const neg of campaign.negativeKeywords || []) {
    if (!neg.text.trim()) continue;
    operations.push({
      campaignCriterionOperation: {
        create: {
          campaign: `${customer}/campaigns/${campaignTempId}`,
          keyword: { text: neg.text, matchType: neg.matchType },
          negative: true,
        },
      },
    });
  }

  // 5) Ad schedule criteria
  for (const sched of campaign.adSchedule || []) {
    operations.push({
      campaignCriterionOperation: {
        create: {
          campaign: `${customer}/campaigns/${campaignTempId}`,
          adSchedule: {
            dayOfWeek: sched.dayOfWeek,
            startHour: sched.startHour,
            endHour: sched.endHour,
            startMinute: 'ZERO',
            endMinute: 'ZERO',
          },
          bidModifier: sched.bidModifier,
        },
      },
    });
  }

  // 6) Campaign-level asset linkleri (sitelink, callout, call)
  for (const sitelinkId of sitelinkAssetTempIds) {
    operations.push({
      campaignAssetOperation: {
        create: {
          campaign: `${customer}/campaigns/${campaignTempId}`,
          asset: `${customer}/assets/${sitelinkId}`,
          fieldType: 'SITELINK',
        },
      },
    });
  }
  for (const calloutId of calloutAssetTempIds) {
    operations.push({
      campaignAssetOperation: {
        create: {
          campaign: `${customer}/campaigns/${campaignTempId}`,
          asset: `${customer}/assets/${calloutId}`,
          fieldType: 'CALLOUT',
        },
      },
    });
  }
  if (callAssetTempId !== null) {
    operations.push({
      campaignAssetOperation: {
        create: {
          campaign: `${customer}/campaigns/${campaignTempId}`,
          asset: `${customer}/assets/${callAssetTempId}`,
          fieldType: 'CALL',
        },
      },
    });
  }

  // Ad groups + ads + keywords
  const adGroupTempIds: number[] = [];
  campaign.adGroups.forEach((ag, idx) => {
    const agTempId = -(100 + idx);
    adGroupTempIds.push(agTempId);
    operations.push({
      adGroupOperation: {
        create: {
          resourceName: `${customer}/adGroups/${agTempId}`,
          name: ag.name,
          campaign: `${customer}/campaigns/${campaignTempId}`,
          status: 'PAUSED',
          type: 'SEARCH_STANDARD',
          cpcBidMicros: ag.cpcBidMicros ? String(ag.cpcBidMicros) : undefined,
        },
      },
    });

    ag.ads.forEach((ad) => {
      operations.push({
        adGroupAdOperation: {
          create: {
            adGroup: `${customer}/adGroups/${agTempId}`,
            status: 'PAUSED',
            ad: {
              finalUrls: ad.finalUrls?.length ? ad.finalUrls : [ad.finalUrl],
              responsiveSearchAd: {
                headlines: ad.headlines.map((text) => ({ text })),
                descriptions: ad.descriptions.map((text) => ({ text })),
                path1: ad.path1,
                path2: ad.path2,
              },
            },
          },
        },
      });
    });

    ag.keywords.forEach((kw) => {
      operations.push({
        adGroupCriterionOperation: {
          create: {
            adGroup: `${customer}/adGroups/${agTempId}`,
            status: 'PAUSED',
            keyword: { text: kw.text, matchType: kw.matchType },
            negative: !!kw.negative,
            cpcBidMicros: kw.cpcBidMicros ? String(kw.cpcBidMicros) : undefined,
          },
        },
      });
    });
  });

  const data = await adsFetch<MutateResponse>(cfg.cfg, `/${customer}/googleAds:mutate`, {
    method: 'POST',
    json: { mutateOperations: operations },
  });

  const results = data.mutateOperationResponses || [];
  const findFirst = (key: string): string | undefined => {
    for (const r of results) {
      if (r[key]?.resourceName) return r[key]!.resourceName;
    }
    return undefined;
  };
  const findAll = (key: string): string[] =>
    results.map((r) => r[key]?.resourceName).filter((x): x is string => !!x);

  return {
    campaignResourceName: findFirst('campaignResult') || '',
    budgetResourceName: findFirst('campaignBudgetResult') || '',
    adGroupResourceNames: findAll('adGroupResult'),
    warnings: [],
  };
}

// ─── Mock fallback data for dev without credentials ───────────────────────

function mockCampaigns(): Campaign[] {
  return [
    {
      id: 'mock-1',
      resourceName: 'customers/0000000000/campaigns/mock-1',
      name: '[ÖRNEK] Tamamlayıcı Sağlık - Beylikdüzü',
      status: 'PAUSED',
      advertisingChannelType: 'SEARCH',
      budgetDailyTry: 80,
      biddingStrategy: { type: 'MAXIMIZE_CONVERSIONS' },
      geoTargets: [{ geoTargetConstant: '2792', label: 'Türkiye' }],
      adGroups: [],
      insuranceProduct: 'tamamlayici-saglik',
      metrics: {
        impressions: 12500,
        clicks: 480,
        costMicros: 3_400_000_000,
        conversions: 14,
        conversionValue: 18000,
        ctr: 0.0384,
        averageCpcMicros: 7_083_333,
        costPerConversionMicros: 242_857_142,
      },
    },
    {
      id: 'mock-2',
      resourceName: 'customers/0000000000/campaigns/mock-2',
      name: '[ÖRNEK] Kasko 30sn - Beylikdüzü',
      status: 'ENABLED',
      advertisingChannelType: 'SEARCH',
      budgetDailyTry: 120,
      biddingStrategy: { type: 'TARGET_CPA', targetCpaMicros: 80_000_000 },
      geoTargets: [{ geoTargetConstant: '2792', label: 'Türkiye' }],
      adGroups: [],
      insuranceProduct: 'kasko',
      metrics: {
        impressions: 9200,
        clicks: 360,
        costMicros: 2_900_000_000,
        conversions: 21,
        conversionValue: 31500,
        ctr: 0.0391,
        averageCpcMicros: 8_055_555,
        costPerConversionMicros: 138_095_238,
      },
    },
  ];
}

function mockKeywordIdeas(seeds?: string[]): KeywordIdea[] {
  const base = seeds && seeds.length ? seeds[0] : 'tamamlayıcı sağlık sigortası';
  const ideas: KeywordIdea[] = [
    { text: `${base} 2026`, avgMonthlySearches: 2400, competition: 'HIGH', competitionIndex: 78 },
    { text: `${base} fiyat`, avgMonthlySearches: 1800, competition: 'HIGH', competitionIndex: 72 },
    { text: `${base} beylikdüzü`, avgMonthlySearches: 320, competition: 'MEDIUM', competitionIndex: 55 },
    { text: `${base} allianz`, avgMonthlySearches: 1100, competition: 'MEDIUM', competitionIndex: 60 },
    { text: `${base} ne kadar`, avgMonthlySearches: 2900, competition: 'MEDIUM', competitionIndex: 58 },
    { text: `${base} hangi hastane`, avgMonthlySearches: 880, competition: 'LOW', competitionIndex: 25 },
    { text: `ucuz ${base}`, avgMonthlySearches: 480, competition: 'HIGH', competitionIndex: 80 },
    { text: `${base} karşılaştır`, avgMonthlySearches: 210, competition: 'LOW', competitionIndex: 30 },
  ];
  return ideas;
}
