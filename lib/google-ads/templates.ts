/**
 * Mavi Sigorta'ya özel kampanya şablonları.
 *
 * Tasarım kararları (2026 revizyonu):
 * - Tek vaat tonu: "5 dakikada poliçeniz" — 60sn form + 30dk geri dönüş = ~5 dk.
 * - RSA başlıkları ≤30 char, açıklamalar ≤90 char (Google sınırları).
 * - Negatif anahtar kelimeler artık **campaign-level** tutulur (her ad group'a
 *   tekrar tekrar yapıştırmak yerine `Campaign.negativeKeywords`).
 * - Bidding default'u `MAXIMIZE_CONVERSIONS`. Hesap 30+ dönüşüm topladığında
 *   UI'dan TARGET_CPA'ya geçilir. Önerilen CPA hedefleri her ürünün
 *   `defaultTargetCpaTry`'sinde tutuluyor (UI'da gösterim için).
 * - Match type karışımı: anchor kavramlar BROAD, marka/spesifik aramalar EXACT,
 *   geri kalanı PHRASE.
 * - Title-case AI-tell olarak görülmesin diye başlıklar farklılaştırıldı;
 *   tekrar oranı kontrol altında. PreflightChecklist tekrarları işaretler.
 *
 * Detaylı karar gerekçeleri ve operatörün UI'da yapması gerekenler için
 * bkz: `docs/GOOGLE_ADS_AUDIT.md`.
 */

import type { InsuranceSlug } from '@/lib/types';
import type {
  Campaign,
  KeywordItem,
  SitelinkAsset,
  CalloutAsset,
  CallAsset,
  AdScheduleEntry,
} from './types';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamamlayicisaglikbeylikduzu.com';
const PHONE = process.env.NEXT_PUBLIC_AGENT_PHONE || '+905324807617';
const WA_NUMBER = (process.env.NEXT_PUBLIC_WA_NUMBER || '905324807617').replace(/\D/g, '');

// ─── Yardımcılar ──────────────────────────────────────────────────────────

function kw(text: string, matchType: KeywordItem['matchType'] = 'PHRASE'): KeywordItem {
  return { text, matchType };
}

function neg(text: string, matchType: KeywordItem['matchType'] = 'PHRASE'): KeywordItem {
  return { text, matchType, negative: true };
}

function waUrl(message: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

// ─── Ortak callout setleri ────────────────────────────────────────────────
// Hepsi ≤25 char. Spesifik vaat, tekrar yok.
const SHARED_CALLOUTS: CalloutAsset[] = [
  { text: '5 Dakikada Online Teklif' },
  { text: 'Allianz Aracılık Hizmeti' },
  { text: '8 Şirket Yan Yana Fiyat' },
  { text: 'WhatsApp Hattı, Hemen Yaz' },
  { text: 'Numaranı Paylaşmıyoruz' },
  { text: 'Beylikdüzü Yerel Acente' },
  { text: 'Hasarda Bizzat Yanında' },
  { text: 'Anlaşmalı 200+ Hastane' },
];

const SHARED_CALL: CallAsset = {
  phoneNumber: PHONE,
  countryCode: 'TR',
};

// ─── Schedule ─────────────────────────────────────────────────────────────
// Eski versiyonda Pazar 0.7 + akşam 18-22 0.9 idi. Sigorta = impulse arama
// sektörü; weekend ve akşamlarda niyet düşmüyor. Bid modifier'lar artırıldı.
const WORKING_HOURS_SCHEDULE: AdScheduleEntry[] = [
  ...(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'] as const).flatMap(
    (day): AdScheduleEntry[] => [
      { dayOfWeek: day, startHour: 8, endHour: 12, bidModifier: 1.1 },
      { dayOfWeek: day, startHour: 12, endHour: 18, bidModifier: 1.0 },
      { dayOfWeek: day, startHour: 18, endHour: 22, bidModifier: 1.0 },
    ],
  ),
  { dayOfWeek: 'SATURDAY', startHour: 9, endHour: 20, bidModifier: 1.0 },
  { dayOfWeek: 'SUNDAY', startHour: 10, endHour: 20, bidModifier: 0.9 },
];

// ─── Ortak negatif anahtar listesi (campaign-level) ───────────────────────
// "iptal" ve "şikayet" çıkarıldı (yeni müşteri 'iptal koşulları' arayabilir).
// "ücretsiz" çıkarıldı ('ücretsiz danışmanlık' değerli arama).
// "nedir", "wikipedia", "video", "pdf", "blog" eklendi: bilgi araması.
// "iş ilanı", "staj", "kariyer", "maaş" iş arayanları eler.
// Aggregator rakipler (koalay, sigortam.net vb.) eklendi.
const SHARED_NEGATIVES: KeywordItem[] = [
  neg('iş ilanı', 'BROAD'),
  neg('iş başvurusu', 'BROAD'),
  neg('staj', 'BROAD'),
  neg('eğitim', 'BROAD'),
  neg('kariyer', 'BROAD'),
  neg('maaş', 'BROAD'),
  neg('hile', 'BROAD'),
  neg('forum', 'BROAD'),
  neg('nedir', 'BROAD'),
  neg('nasıl çalışır', 'BROAD'),
  neg('wikipedia', 'BROAD'),
  neg('vikipedi', 'BROAD'),
  neg('video', 'BROAD'),
  neg('pdf', 'BROAD'),
  neg('örnek poliçe', 'BROAD'),
  neg('şartname', 'BROAD'),
  neg('genel şartlar', 'BROAD'),
  neg('blog', 'BROAD'),
  neg('bedava', 'BROAD'),
  // Aggregator rakipleri — kendi marka kampanyamız yokken kapatıyoruz.
  // Eğer ileride brand kampanyası açılırsa o kampanyada bu negative'leri kaldır.
  neg('koalay', 'PHRASE'),
  neg('sigortam.net', 'PHRASE'),
  neg('hesapkurdu', 'PHRASE'),
  neg('sigortayeri', 'PHRASE'),
  neg('sigortadukkanim', 'PHRASE'),
];

// İstanbul'da yoğun çalıştığımız ilçeler — keyword varyasyonu için.
const ISTANBUL_LOCATIONS = [
  'beylikdüzü',
  'esenyurt',
  'avcılar',
  'büyükçekmece',
  'küçükçekmece',
  'bahçeşehir',
  'istanbul',
];

// ─── Sitelink builder (dönüşüm odaklı) ────────────────────────────────────
// Eski sitelink seti tamamı bilgi sayfalarına (hakkımızda/sss/iletişim)
// gidiyordu. Yeni set 4 farklı dönüşüm kanalına dağıtıyor: WhatsApp,
// ürün-spesifik action sayfası, ürün detay sayfası, SSS.

interface ProductCopy {
  label: string;
  /** Sitelink #1 — Action: ürüne özel hızlı vaat (≤25). */
  actionTitle: string;
  actionDesc1: string;
  actionDesc2: string;
  actionPath?: string; // varsayılan: /teklif/{slug}
  /** WhatsApp prefill mesajı. */
  waMessage: string;
}

const PRODUCT_COPY: Record<InsuranceSlug, ProductCopy> = {
  'tamamlayici-saglik': {
    label: 'Tamamlayıcı Sağlık',
    actionTitle: 'Anlaşmalı Hastaneyi Sor',
    actionDesc1: 'Sana özel hastane listesi',
    actionDesc2: 'Allianz dahil 8 şirket fiyatı',
    waMessage: 'Merhaba, tamamlayıcı sağlık sigortası için teklif istiyorum.',
  },
  'moduler-saglik': {
    label: 'Modüler Sağlık',
    actionTitle: 'SGK\'sız Sağlık Teklifi',
    actionDesc1: 'Tüm özel hastanelerde geçerli',
    actionDesc2: 'Doğum, çocuk, yurt dışı dahil',
    waMessage: 'Merhaba, modüler/özel sağlık sigortası için teklif istiyorum.',
  },
  kasko: {
    label: 'Kasko',
    actionTitle: 'Plakayla Hızlı Teklif',
    actionDesc1: 'Tek plakayla 5 dakikada',
    actionDesc2: '8 şirket yan yana fiyat',
    waMessage: 'Merhaba, kasko teklifi almak istiyorum. Plakam: ',
  },
  trafik: {
    label: 'Trafik Sigortası',
    actionTitle: 'Plakayla 5 Dakika',
    actionDesc1: 'Zorunlu trafik anında',
    actionDesc2: 'Dijital poliçe mailine',
    waMessage: 'Merhaba, trafik sigortası teklifi almak istiyorum. Plakam: ',
  },
  konut: {
    label: 'Konut Sigortası',
    actionTitle: 'Adresle Konut Teklifi',
    actionDesc1: 'Yangın, su, hırsızlık, deprem',
    actionDesc2: '8 şirket yan yana fiyat',
    waMessage: 'Merhaba, konut sigortası için teklif istiyorum.',
  },
  isyeri: {
    label: 'İşyeri Sigortası',
    actionTitle: 'KOBİ Risk Analizi',
    actionDesc1: 'Bina, demirbaş, stok, çalışan',
    actionDesc2: 'Sektöre özel teminat seti',
    waMessage: 'Merhaba, işyeri sigortası için teklif istiyorum.',
  },
  dask: {
    label: 'DASK',
    actionTitle: 'DASK Yenileme',
    actionDesc1: 'Süre dolduysa anında',
    actionDesc2: 'AKDM onaylı poliçe',
    waMessage: 'Merhaba, DASK teklifi/yenilemesi istiyorum. Adresim: ',
  },
  'seyahat-saglik': {
    label: 'Seyahat Sağlık',
    actionTitle: 'Schengen Vize Sigortası',
    actionDesc1: 'Konsolosluk onaylı paket',
    actionDesc2: 'Anlık e-poliçe',
    waMessage: 'Merhaba, Schengen seyahat sağlık sigortası istiyorum.',
  },
};

function buildSharedSitelinks(slug: InsuranceSlug): SitelinkAsset[] {
  const p = PRODUCT_COPY[slug];
  const actionPath = p.actionPath || `/teklif/${slug}`;
  return [
    {
      text: p.actionTitle,
      description1: p.actionDesc1,
      description2: p.actionDesc2,
      finalUrl: new URL(actionPath, SITE).toString(),
    },
    {
      text: 'WhatsApp\'tan Yaz',
      description1: 'Sabit hat, hemen cevap',
      description2: 'Soner Bey ya da ekip yanıtlar',
      finalUrl: waUrl(p.waMessage),
    },
    {
      text: `${p.label} Detay`,
      description1: 'Kapsam, fiyat, teminat',
      description2: 'Anlaşmalı şirketler, SSS',
      finalUrl: new URL(`/sigortalar/${slug}`, SITE).toString(),
    },
    {
      text: 'Sıkça Sorulanlar',
      description1: 'Sigorta hakkında merak edilenler',
      description2: 'Örnek senaryolar, hızlı cevaplar',
      finalUrl: new URL('/sss', SITE).toString(),
    },
  ];
}

function buildLandingUrl(product: InsuranceSlug, campaignSlug: string): string {
  const url = new URL(`/teklif/${product}`, SITE);
  url.searchParams.set('utm_source', 'google');
  url.searchParams.set('utm_medium', 'cpc');
  url.searchParams.set('utm_campaign', campaignSlug);
  return url.toString();
}

export interface CampaignTemplate {
  product: InsuranceSlug;
  label: string;
  defaultBudgetTry: number;
  /**
   * Hesap 30+ dönüşüm topladıktan sonra TARGET_CPA'ya geçildiğinde
   * önerilen hedef CPA. Default bidding `MAXIMIZE_CONVERSIONS`.
   */
  defaultTargetCpaTry?: number;
  build: () => Omit<Campaign, 'id' | 'resourceName' | 'metrics'>;
}

// ─── 1) Tamamlayıcı Sağlık Sigortası ──────────────────────────────────────
const tamamlayiciSaglik: CampaignTemplate = {
  product: 'tamamlayici-saglik',
  label: 'Tamamlayıcı Sağlık - Yüksek Niyet',
  defaultBudgetTry: 80,
  defaultTargetCpaTry: 220,
  build: () => {
    const slug = 'tss-yuksek-niyet';
    const url = buildLandingUrl('tamamlayici-saglik', slug);

    return {
      name: 'Tamamlayıcı Sağlık - Yüksek Niyet [Beylikdüzü]',
      status: 'PAUSED',
      advertisingChannelType: 'SEARCH',
      budgetDailyTry: 80,
      // İlk 30 günde Google'a öğrenme alanı tanı; sonra TARGET_CPA (~220 TL).
      biddingStrategy: { type: 'MAXIMIZE_CONVERSIONS' },
      geoTargets: [{ geoTargetConstant: '2792', label: 'Türkiye' }],
      insuranceProduct: 'tamamlayici-saglik',
      adGroups: [
        {
          name: 'TSS - Genel Niyet',
          status: 'PAUSED',
          keywords: [
            // BROAD anchor (Smart Bidding'in genişlemesi için 1-2 broad)
            kw('tamamlayıcı sağlık sigortası', 'BROAD'),
            kw('tss teklif', 'BROAD'),
            // EXACT yüksek-niyet aramaları
            kw('tss', 'EXACT'),
            kw('tamamlayıcı sağlık sigortası teklif', 'EXACT'),
            // PHRASE long-tail
            kw('tamamlayıcı sağlık sigortası fiyat', 'PHRASE'),
            kw('tamamlayıcı sağlık sigortası 2026', 'PHRASE'),
            kw('tamamlayıcı sağlık sigortası ne kadar', 'PHRASE'),
            kw('tamamlayıcı sağlık sigortası hangi hastane', 'PHRASE'),
            kw('ssk fark ödeme', 'PHRASE'),
            kw('özel hastanede fark ödememe', 'PHRASE'),
            kw('allianz tamamlayıcı sağlık', 'PHRASE'),
          ],
          ads: [
            {
              finalUrl: url,
              path1: 'tamamlayici-saglik',
              path2: 'teklif',
              headlines: [
                'TSS Teklifin 5 Dakikada',
                'Özel Hastanede Fark Sıfır',
                'SGK Üstüne TSS Tam Kapsam',
                'Hangi Hastane Anlaşmalı?',
                '8 Şirket Yan Yana Fiyat',
                'Allianz TSS Yetkili Aracı',
                'Beylikdüzü\'nden Tek Tıkla',
                '30 Dakikada Geri Dönüyoruz',
                'TSS\'i Telefonsuz Karşılaştır',
                'Numaranı Paylaşmıyoruz',
                'SGK\'lıysan TSS Avantajlı',
                'Bir Formla Fiyatın Önünde',
                'Faturayı Hastane Çeker',
                'Mavi Sigorta 25 Yıl Beylikdüzü',
                'TSS Yenilemen de Bizden',
              ],
              descriptions: [
                '60 saniyede formu doldur, Allianz dahil 8 şirketten karşılaştırmalı TSS teklifini gör.',
                'SGK anlaşmalı özel hastanede fark ödemiyorsun. Faturayı hastane direkt sigortaya çıkarır.',
                'Hangi hastane anlaşmalı, hangisi değil. Sana özel listeyi 30 dakikada gönderiyoruz.',
                'Beylikdüzü ofisten 25 yıldır TSS yazıyoruz. Numaranı üçüncü taraflarla paylaşmıyoruz.',
              ],
            },
          ],
        },
        {
          name: 'TSS - Lokasyon (Beylikdüzü+çevre)',
          status: 'PAUSED',
          keywords: [
            kw('beylikdüzü sigorta acentesi', 'BROAD'),
            kw('beylikdüzü tamamlayıcı sağlık', 'EXACT'),
            ...ISTANBUL_LOCATIONS.map((loc) => kw(`tamamlayıcı sağlık sigortası ${loc}`, 'PHRASE')),
            ...ISTANBUL_LOCATIONS.map((loc) => kw(`${loc} tamamlayıcı sağlık`, 'PHRASE')),
            kw('esenyurt sağlık sigortası', 'PHRASE'),
          ],
          ads: [
            {
              finalUrl: url,
              path1: 'beylikduzu',
              path2: 'tss',
              headlines: [
                'Beylikdüzü TSS Acentesi',
                'Esenyurt TSS Teklif',
                'Avcılar Tamamlayıcı Sağlık',
                'Büyükçekmece TSS',
                'İstanbul\'da 5 Dakika TSS',
                'Mahalle Acentesi, Direkt İş',
                'Anlaşmalı Hastaneyi Sor',
                'Form 60sn, Cevap 30dk',
                '8 Şirket Yan Yana Fiyat',
                'Allianz TSS Aracılığı',
                'TSS Yenilemen de Buradan',
                'SGK Üstüne TSS, Cebine Az',
                'Hemen WhatsApp\'tan Yaz',
                'Soner Bey 25 Yıldır Burada',
                'Telefonsuz Tek Form',
              ],
              descriptions: [
                'Beylikdüzü, Esenyurt, Avcılar. 25 yıldır mahalleden mahalleye TSS yazıyoruz.',
                'Bölgendeki anlaşmalı hastane listesi ve en uygun fiyat 30 dakikada elinde.',
                'Numaranı sadece tekliften sonra arıyoruz, kimseyle paylaşmıyoruz.',
                'Online formu doldur, WhatsApp\'tan ya da sabit hattan biz dönüyoruz.',
              ],
            },
          ],
        },
      ],
    };
  },
};

// ─── 2) Modüler Sağlık Sigortası ──────────────────────────────────────────
const modulerSaglik: CampaignTemplate = {
  product: 'moduler-saglik',
  label: 'Modüler Sağlık - SGK Bağımsız',
  defaultBudgetTry: 60,
  defaultTargetCpaTry: 300,
  build: () => {
    const slug = 'moduler-saglik-sgk-bagimsiz';
    const url = buildLandingUrl('moduler-saglik', slug);
    return {
      name: 'Modüler Sağlık - SGK Bağımsız [İstanbul]',
      status: 'PAUSED',
      advertisingChannelType: 'SEARCH',
      budgetDailyTry: 60,
      biddingStrategy: { type: 'MAXIMIZE_CONVERSIONS' },
      geoTargets: [{ geoTargetConstant: '2792', label: 'Türkiye' }],
      insuranceProduct: 'moduler-saglik',
      adGroups: [
        {
          name: 'Modüler Sağlık - Genel',
          status: 'PAUSED',
          keywords: [
            kw('özel sağlık sigortası', 'BROAD'),
            kw('modüler sağlık sigortası', 'BROAD'),
            kw('özel sağlık sigortası teklif', 'EXACT'),
            kw('modüler sağlık sigortası', 'EXACT'),
            kw('sgk\'sız özel sağlık sigortası', 'PHRASE'),
            kw('sgk olmadan sağlık sigortası', 'PHRASE'),
            kw('kapsamlı sağlık sigortası', 'PHRASE'),
            kw('özel sağlık sigortası fiyat', 'PHRASE'),
            kw('özel sağlık sigortası karşılaştır', 'PHRASE'),
            kw('yurt dışı tedavi sigortası', 'PHRASE'),
          ],
          ads: [
            {
              finalUrl: url,
              path1: 'moduler-saglik',
              path2: 'teklif',
              headlines: [
                'Modüler Sağlık 5 Dakika',
                'SGK Olmadan Özel Sağlık',
                'Tüm Özel Hastanelerde',
                'Kapsamlı Sağlık Güvencesi',
                'Yurt Dışı Tedavi Dahil',
                'Özel Oda + Check-up',
                'Allianz Aracılığında',
                'Doğum & Kronik Kapsamı',
                'Yan Yana 8 Şirket Fiyat',
                'Beylikdüzü 25 Yıl Yerinde',
                'Form 60sn, Cevap 30dk',
                'Numaranı Satmıyoruz',
                'Modüleri Hemen Sor',
                'WhatsApp\'tan Anında',
                'Aile Paketi Avantajlı',
              ],
              descriptions: [
                'SGK yok mu? Sorun değil. Tüm özel hastanelerde geçerli modüler sağlık güvencesi.',
                'Geniş kapsam, özel oda, doğum, check-up, yurt dışı tedavi. 8 şirketten teklif.',
                '60 saniyede formu doldur, 30 dakika içinde size en uygun planı çıkarıyoruz.',
                'Allianz Aracılık Hizmetleri olarak 25 yıldır Beylikdüzü\'nden çalışıyoruz.',
              ],
            },
          ],
        },
        {
          name: 'Modüler Sağlık - İstanbul',
          status: 'PAUSED',
          keywords: [
            kw('istanbul özel sağlık sigortası', 'BROAD'),
            kw('beylikdüzü özel sağlık', 'EXACT'),
            kw('beylikdüzü özel sağlık sigortası', 'PHRASE'),
            kw('esenyurt özel sağlık sigortası', 'PHRASE'),
            kw('avcılar özel sağlık sigortası', 'PHRASE'),
            kw('bakırköy özel sağlık sigortası', 'PHRASE'),
            kw('bahçeşehir sağlık sigortası', 'PHRASE'),
          ],
          ads: [
            {
              finalUrl: url,
              path1: 'beylikduzu',
              path2: 'moduler',
              headlines: [
                'İstanbul Modüler Sağlık',
                'Beylikdüzü Özel Sağlık',
                'Esenyurt SGK\'sız Sağlık',
                'Bakırköy Modüler Sağlık',
                'Avcılar Sağlık Sigortası',
                'Bahçeşehir Modüler',
                'Soner Bey Beylikdüzü',
                '5 Dakika Form, 30dk Dönüş',
                'Allianz Aracı, Beylikdüzü',
                '8 Şirket Yan Yana Fiyat',
                'Yurt Dışı Tedavi Dahil',
                'Çocuk + Yetişkin Paketi',
                'Doğum Paketleri Var',
                'Numaranı Paylaşmıyoruz',
                'Hemen WhatsApp\'tan Yaz',
              ],
              descriptions: [
                'Beylikdüzü ofisten Marmara\'nın her noktasına modüler sağlık poliçesi yazıyoruz.',
                'Tüm özel hastanelerde geçerli, doğum ve çocuk paketi dahil seçenekler.',
                'Bir formla 8 şirketten teklif görüyorsun, karar senin. Biz 30 dakikada arıyoruz.',
                '25 yıl yerinde sigortacılık, WhatsApp hattı açık, numara paylaşımı yok.',
              ],
            },
          ],
        },
      ],
    };
  },
};

// ─── 3) Kasko ─────────────────────────────────────────────────────────────
const kasko: CampaignTemplate = {
  product: 'kasko',
  label: 'Kasko - 5 Dakika Teklif',
  defaultBudgetTry: 120,
  defaultTargetCpaTry: 80,
  build: () => {
    const slug = 'kasko-5dk';
    const url = buildLandingUrl('kasko', slug);
    return {
      name: 'Kasko - 5dk Teklif [İstanbul]',
      status: 'PAUSED',
      advertisingChannelType: 'SEARCH',
      budgetDailyTry: 120,
      biddingStrategy: { type: 'MAXIMIZE_CONVERSIONS' },
      geoTargets: [{ geoTargetConstant: '2792', label: 'Türkiye' }],
      insuranceProduct: 'kasko',
      adGroups: [
        {
          name: 'Kasko - Genel Niyet',
          status: 'PAUSED',
          keywords: [
            kw('kasko teklif', 'BROAD'),
            kw('kasko fiyat', 'BROAD'),
            kw('plaka ile kasko teklifi', 'EXACT'),
            kw('online kasko teklifi', 'EXACT'),
            kw('kasko sigorta', 'PHRASE'),
            kw('kasko hesaplama', 'PHRASE'),
            kw('en ucuz kasko', 'PHRASE'),
            kw('araç kasko fiyatları', 'PHRASE'),
            kw('kasko sigorta karşılaştır', 'PHRASE'),
            kw('kasko 2026 fiyatları', 'PHRASE'),
          ],
          ads: [
            {
              finalUrl: url,
              path1: 'kasko',
              path2: '5dk',
              headlines: [
                'Kasko Teklifin 5 Dakikada',
                'Plakayı Yaz, Fiyatı Gör',
                '8 Şirket Yan Yana Kasko',
                'İkame Araç Dahil Plan',
                'Hasarsızlık İndirimin Aynen',
                'Deprem + Sel + Yangın',
                'Allianz Kasko Aracı',
                'Cam, Çizik, Tampon',
                'Online Onay, Anında Poliçe',
                'Numaranı Satmıyoruz',
                'Beylikdüzü Kasko Acentesi',
                'Mavi Sigorta 25 Yıl',
                'Hemen WhatsApp\'tan Yaz',
                '30 Dakikada Geri Dönüyoruz',
                'Hasar Dosyanı Biz Açarız',
              ],
              descriptions: [
                'Plakanı yaz, 5 dakikada 8 sigorta şirketinden yan yana kasko fiyatlarını gör.',
                'İkame araç, cam çizik, doğal afet teminatları. Kapsamı sen seçiyorsun.',
                'Hasarsızlık indirimini koruyoruz. Hasar dosyanı bizzat biz takip ediyoruz.',
                'Beylikdüzü ofisten 25 yıllık kasko deneyimi. Numaranı kimseyle paylaşmıyoruz.',
              ],
            },
          ],
        },
        {
          name: 'Kasko - Lokasyon (İstanbul+çevre)',
          status: 'PAUSED',
          keywords: [
            kw('istanbul kasko teklifi', 'BROAD'),
            kw('beylikdüzü kasko', 'EXACT'),
            ...ISTANBUL_LOCATIONS.map((loc) => kw(`${loc} kasko`, 'PHRASE')),
            kw('bakırköy kasko', 'PHRASE'),
            kw('plakayla kasko teklifi istanbul', 'PHRASE'),
          ],
          ads: [
            {
              finalUrl: url,
              path1: 'beylikduzu',
              path2: 'kasko',
              headlines: [
                'Beylikdüzü Kasko 5 Dakika',
                'Esenyurt Kasko Teklifi',
                'Avcılar Kasko Fiyatı',
                'Büyükçekmece Kasko',
                'Bakırköy Plaka Kasko',
                'Bahçeşehir Plakayla',
                'İstanbul 8 Şirket Kasko',
                'Mavi Sigorta Beylikdüzü',
                'Allianz Kasko Aracılığı',
                'Mahalle Acentesi, Direkt İş',
                'Hasarda Bizzat Yanında',
                'İkame Araç Dahil',
                'Online Onay Anında Poliçe',
                'Hemen WhatsApp\'tan Yaz',
                '30 Dakikada Geri Dönüyoruz',
              ],
              descriptions: [
                'Beylikdüzü, Esenyurt, Avcılar, Bakırköy. Plakanla 5 dakikada kasko fiyatını gör.',
                'Hasarda Soner Bey ya da ofisten arkadaşlarımız bizzat takip ediyor.',
                '25 yıl mahalle acentesi. İkame araç, deprem, sel teminatları seçeneklerde.',
                'Numaranı sadece teklif için kullanıyoruz, üçüncü taraflarla paylaşmıyoruz.',
              ],
            },
          ],
        },
      ],
    };
  },
};

// ─── 4) Trafik Sigortası ──────────────────────────────────────────────────
const trafik: CampaignTemplate = {
  product: 'trafik',
  label: 'Trafik Sigortası - Plaka ile',
  defaultBudgetTry: 60,
  defaultTargetCpaTry: 50,
  build: () => {
    const slug = 'trafik-plaka';
    const url = buildLandingUrl('trafik', slug);
    return {
      name: 'Trafik Sigortası - Plaka ile [İstanbul]',
      status: 'PAUSED',
      advertisingChannelType: 'SEARCH',
      budgetDailyTry: 60,
      biddingStrategy: { type: 'MAXIMIZE_CONVERSIONS' },
      geoTargets: [{ geoTargetConstant: '2792', label: 'Türkiye' }],
      insuranceProduct: 'trafik',
      adGroups: [
        {
          name: 'Trafik - Genel',
          status: 'PAUSED',
          keywords: [
            kw('trafik sigortası', 'BROAD'),
            kw('zorunlu trafik sigortası', 'BROAD'),
            kw('plaka ile trafik sigortası', 'EXACT'),
            kw('online trafik sigortası', 'EXACT'),
            kw('trafik sigortası fiyat', 'PHRASE'),
            kw('trafik sigortası teklif', 'PHRASE'),
            kw('trafik sigortası hesaplama', 'PHRASE'),
            kw('en ucuz trafik sigortası', 'PHRASE'),
            kw('trafik sigortası 2026', 'PHRASE'),
          ],
          ads: [
            {
              finalUrl: url,
              path1: 'trafik',
              path2: 'plaka',
              headlines: [
                'Trafik Sigortası 5 Dakika',
                'Plakanı Yaz, Fiyatı Gör',
                'Zorunlu Trafik, Hemen',
                '4 Şirket Yan Yana Fiyat',
                'Hasarsızlık İndirimin Sağlam',
                'Online Onay, Dijital Poliçe',
                'En Uygun Trafik 2026',
                'Beylikdüzü Trafik Acentesi',
                'Mavi Sigorta 25 Yıl',
                'Anlaşmalı 4 Şirket',
                'Allianz Trafik Aracılığı',
                'Numaranı Paylaşmıyoruz',
                'Hemen WhatsApp\'tan Yaz',
                '7/24 Hasar Hattı',
                'Trafik + Kasko Cebe Yakın',
              ],
              descriptions: [
                'Plakanı yaz, 5 dakikada 4 şirketten zorunlu trafik fiyatını yan yana gör.',
                'Hasarsızlık indirimin aynen geçer. Dijital poliçe anında mailine düşer.',
                'Beylikdüzü\'nün 25 yıllık acentesi Mavi Sigorta\'dan hızlı ve uygun trafik.',
                'Numaranı sadece teklif için kullanıyoruz, üçüncü taraflarla paylaşmıyoruz.',
              ],
            },
          ],
        },
      ],
    };
  },
};

// ─── 5) Konut ─────────────────────────────────────────────────────────────
// NOT: Bu kampanya başlangıçta Türkiye'yi hedefliyor; Marmara'ya geçtiğinde
// CPC düşer. Operatör Google Ads UI'sından `geoTargets`'a İstanbul + çevre
// constant ID'lerini ekleyebilir (bkz: docs/GOOGLE_ADS_AUDIT.md).
const konut: CampaignTemplate = {
  product: 'konut',
  label: 'Konut Sigortası - Deprem & Yangın',
  defaultBudgetTry: 50,
  defaultTargetCpaTry: 90,
  build: () => {
    const slug = 'konut-deprem-yangin';
    const url = buildLandingUrl('konut', slug);
    return {
      name: 'Konut Sigortası - Deprem & Yangın [İstanbul]',
      status: 'PAUSED',
      advertisingChannelType: 'SEARCH',
      budgetDailyTry: 50,
      biddingStrategy: { type: 'MAXIMIZE_CONVERSIONS' },
      geoTargets: [{ geoTargetConstant: '2792', label: 'Türkiye' }],
      insuranceProduct: 'konut',
      adGroups: [
        {
          name: 'Konut - Genel',
          status: 'PAUSED',
          keywords: [
            kw('konut sigortası', 'BROAD'),
            kw('ev sigortası', 'BROAD'),
            kw('konut sigortası teklif', 'EXACT'),
            kw('ev sigortası teklif', 'EXACT'),
            kw('konut sigortası fiyat', 'PHRASE'),
            kw('konut paket sigorta', 'PHRASE'),
            kw('deprem sigortası ev', 'PHRASE'),
            kw('ev sigortası hesaplama', 'PHRASE'),
            kw('en uygun konut sigortası', 'PHRASE'),
          ],
          ads: [
            {
              finalUrl: url,
              path1: 'konut',
              path2: 'teklif',
              headlines: [
                'Konut Sigortan 5 Dakikada',
                'Adresi Yaz, Fiyatı Gör',
                'Yangın, Su, Hırsızlık',
                'Cam Kırılması Dahil',
                'Deprem + Sel Teminatı',
                '8 Şirket Yan Yana Fiyat',
                'Ev Eşyası da Güvende',
                'Hukuki Koruma Dahil',
                'Beylikdüzü Konut Acentesi',
                'Mavi Sigorta 25 Yıl',
                'Allianz Konut Aracılığı',
                'Numaranı Paylaşmıyoruz',
                'Hemen WhatsApp\'tan Yaz',
                'Hasarda Bizzat Yanında',
                '30 Dakikada Geri Dönüyoruz',
              ],
              descriptions: [
                'Adresini yaz, 5 dakikada 8 şirketten konut sigortası fiyatını yan yana gör.',
                'Yangın, su baskını, hırsızlık, deprem ve cam kırılması teminatları seçimde.',
                'Ev eşyası ve hukuki koruma da pakette. Beylikdüzü ofisten poliçe anlık.',
                '25 yıl mahalle acentesi. Numaranı kimseyle paylaşmıyoruz, sadece biz arıyoruz.',
              ],
            },
          ],
        },
      ],
    };
  },
};

// ─── 6) İşyeri ────────────────────────────────────────────────────────────
const isyeri: CampaignTemplate = {
  product: 'isyeri',
  label: 'İşyeri Sigortası - KOBİ',
  defaultBudgetTry: 50,
  defaultTargetCpaTry: 180,
  build: () => {
    const slug = 'isyeri-kobi';
    const url = buildLandingUrl('isyeri', slug);
    return {
      name: 'İşyeri Sigortası - KOBİ [İstanbul]',
      status: 'PAUSED',
      advertisingChannelType: 'SEARCH',
      budgetDailyTry: 50,
      biddingStrategy: { type: 'MAXIMIZE_CONVERSIONS' },
      geoTargets: [{ geoTargetConstant: '2792', label: 'Türkiye' }],
      insuranceProduct: 'isyeri',
      adGroups: [
        {
          name: 'İşyeri - Genel',
          status: 'PAUSED',
          keywords: [
            kw('işyeri sigortası', 'BROAD'),
            kw('kobi sigortası', 'BROAD'),
            kw('işyeri sigortası teklif', 'EXACT'),
            kw('işyeri paket sigorta', 'EXACT'),
            kw('işyeri sigortası fiyat', 'PHRASE'),
            kw('mağaza sigortası', 'PHRASE'),
            kw('depo sigortası', 'PHRASE'),
            kw('restoran sigortası', 'PHRASE'),
            kw('işveren mali sorumluluk', 'PHRASE'),
            kw('atölye sigortası', 'PHRASE'),
          ],
          ads: [
            {
              finalUrl: url,
              path1: 'isyeri',
              path2: 'teklif',
              headlines: [
                'İşyeri Sigortan 5 Dakika',
                'KOBİ Sigorta Paketi',
                'Mağaza, Depo, Atölye',
                'Restoran ve Ofis Paketi',
                'İşveren Mali Sorumluluk',
                'Stok ve Demirbaş Teminatı',
                'Cam, Hırsızlık, İş Durması',
                '8 Şirket Yan Yana Fiyat',
                'Beylikdüzü İşyeri Acentesi',
                'Mavi Sigorta 25 Yıl',
                'Allianz İşyeri Aracılığı',
                'Numaranı Paylaşmıyoruz',
                'Hemen WhatsApp\'tan Yaz',
                '30 Dakikada Geri Dönüyoruz',
                'Risk Analizi Ücretsiz',
              ],
              descriptions: [
                'Bina, demirbaş, stok, çalışan, müşteri. Tek poliçeyle her şey bir arada.',
                'Restoran, ofis, mağaza, depo, atölye için sektöre özel teminatlar.',
                '5 dakika form, 30 dakikada size en uygun KOBİ sigorta paketini sunuyoruz.',
                'Beylikdüzü\'nün 25 yıllık ticari sigorta acentesi. Risk analizi ücretsiz.',
              ],
            },
          ],
        },
      ],
    };
  },
};

// ─── 7) DASK ──────────────────────────────────────────────────────────────
const dask: CampaignTemplate = {
  product: 'dask',
  label: 'DASK - Zorunlu Deprem Sigortası',
  defaultBudgetTry: 40,
  defaultTargetCpaTry: 35,
  build: () => {
    const slug = 'dask-zorunlu';
    const url = buildLandingUrl('dask', slug);
    return {
      name: 'DASK - Zorunlu Deprem Sigortası [İstanbul]',
      status: 'PAUSED',
      advertisingChannelType: 'SEARCH',
      budgetDailyTry: 40,
      biddingStrategy: { type: 'MAXIMIZE_CONVERSIONS' },
      geoTargets: [{ geoTargetConstant: '2792', label: 'Türkiye' }],
      insuranceProduct: 'dask',
      adGroups: [
        {
          name: 'DASK - Genel',
          status: 'PAUSED',
          keywords: [
            kw('dask', 'BROAD'),
            kw('zorunlu deprem sigortası', 'BROAD'),
            kw('dask', 'EXACT'),
            kw('dask yenileme', 'EXACT'),
            kw('dask sigortası', 'PHRASE'),
            kw('dask fiyat', 'PHRASE'),
            kw('dask hesaplama', 'PHRASE'),
            kw('deprem sigortası', 'PHRASE'),
            kw('dask online', 'PHRASE'),
            kw('dask sorgulama', 'PHRASE'),
          ],
          ads: [
            {
              finalUrl: url,
              path1: 'dask',
              path2: 'teklif',
              headlines: [
                'DASK 5 Dakikada Cebinde',
                'Zorunlu Deprem Sigortası',
                'Adresi Yaz, Primi Gör',
                'Tapu Yok, Tapu Sorgudan',
                'DASK Yenilemen Hemen',
                'AKDM Onaylı Poliçe',
                'Beylikdüzü DASK Acentesi',
                'Mavi Sigorta 25 Yıl',
                'Allianz DASK Aracılığı',
                'Anında Dijital Poliçe',
                'Numaranı Paylaşmıyoruz',
                'Hemen WhatsApp\'tan Yaz',
                'Online DASK Hesaplama',
                'Süresi Doldu mu? Hemen',
                'Yasal Zorunlu, Önceliğin',
              ],
              descriptions: [
                'Adresini yaz, 5 dakikada DASK primini gör, anında dijital poliçeyi al.',
                'AKDM onaylı zorunlu deprem sigortası. Beylikdüzü\'nün 25 yıllık DASK acentesi.',
                'Tapu bilgisi yetiyor, ekstra evrak yok. Yenileme de aynı kolaylıkta.',
                'Numaranı sadece teklif için kullanıyoruz, üçüncü taraflarla paylaşmıyoruz.',
              ],
            },
          ],
        },
      ],
    };
  },
};

// ─── 8) Seyahat Sağlık ────────────────────────────────────────────────────
const seyahat: CampaignTemplate = {
  product: 'seyahat-saglik',
  label: 'Seyahat Sağlık - Schengen',
  defaultBudgetTry: 35,
  defaultTargetCpaTry: 60,
  build: () => {
    const slug = 'seyahat-schengen';
    const url = buildLandingUrl('seyahat-saglik', slug);
    return {
      name: 'Seyahat Sağlık - Schengen Vize [Türkiye]',
      status: 'PAUSED',
      advertisingChannelType: 'SEARCH',
      budgetDailyTry: 35,
      biddingStrategy: { type: 'MAXIMIZE_CONVERSIONS' },
      geoTargets: [{ geoTargetConstant: '2792', label: 'Türkiye' }],
      insuranceProduct: 'seyahat-saglik',
      adGroups: [
        {
          name: 'Seyahat - Schengen',
          status: 'PAUSED',
          keywords: [
            kw('schengen vize sigortası', 'BROAD'),
            kw('seyahat sağlık sigortası', 'BROAD'),
            kw('schengen sigortası', 'EXACT'),
            kw('vize için sağlık sigortası', 'EXACT'),
            kw('yurt dışı sağlık sigortası', 'PHRASE'),
            kw('seyahat sigortası online', 'PHRASE'),
            kw('seyahat sigortası fiyat', 'PHRASE'),
            kw('vize sigortası 30 bin euro', 'PHRASE'),
          ],
          ads: [
            {
              finalUrl: url,
              path1: 'seyahat-saglik',
              path2: 'schengen',
              headlines: [
                'Schengen Sigortan 5 Dakika',
                'Vize için Onaylı Poliçe',
                'Anında E-Poliçe',
                'Yurt Dışı Acil Tedavi',
                'Hastane + Ambulans + Nakil',
                '30 Bin Euro Limit Standart',
                'Beylikdüzü Seyahat Acentesi',
                'Mavi Sigorta 25 Yıl',
                'Allianz Seyahat Aracılığı',
                'Numaranı Paylaşmıyoruz',
                'Hemen WhatsApp\'tan Yaz',
                'Vize Yetiştirmek Acil mi?',
                'Schengen Onayı Garanti',
                'Konsolosluk Onaylı',
                '5 Dakika, Anlık Mail',
              ],
              descriptions: [
                'Schengen vize başvurun için konsolosluk onaylı seyahat sağlık sigortası, anlık e-poliçe.',
                'Yurt dışı acil tedavi, hastane, ambulans ve nakil teminatları paket içinde.',
                '5 dakikada form, anlık mail. Acil vize randevun varsa hemen WhatsApp\'tan yaz.',
                '25 yıllık Beylikdüzü acentesi. Numaranı sadece poliçe için kullanıyoruz.',
              ],
            },
          ],
        },
        {
          name: 'Seyahat - Ülke Bazlı',
          status: 'PAUSED',
          keywords: [
            kw('almanya vize sigortası', 'PHRASE'),
            kw('italya vize sigortası', 'PHRASE'),
            kw('fransa vize sigortası', 'PHRASE'),
            kw('ispanya vize sigortası', 'PHRASE'),
            kw('hollanda vize sigortası', 'PHRASE'),
            kw('yunanistan vize sigortası', 'PHRASE'),
            kw('amerika vize sigortası', 'PHRASE'),
            kw('ingiltere vize sigortası', 'PHRASE'),
          ],
          ads: [
            {
              finalUrl: url,
              path1: 'seyahat-saglik',
              path2: 'vize',
              headlines: [
                'Almanya Vize Sigortası',
                'İtalya Vize Sigortası',
                'Fransa Vize Sigortası',
                'İspanya Vize Sigortası',
                'Hollanda Vize Sigortası',
                'Yunanistan Vize Sigortası',
                'Amerika Vize Sigortası',
                'İngiltere Vize Sigortası',
                'Schengen Tek Poliçe',
                '30 Bin Euro Limit Standart',
                'Anlık E-Poliçe Mailine',
                'Vize Yetiştirmek Acil mi?',
                'Konsolosluk Onaylı',
                'Hemen WhatsApp\'tan Yaz',
                '5 Dakika, Form Bitti',
              ],
              descriptions: [
                'Almanya, İtalya, Fransa, İspanya, Hollanda — hangi konsolosluk olursa onaylı poliçe.',
                'Schengen kapsamı tek poliçeyle. 30 bin euro limit, acil tedavi ve nakil dahil.',
                'Vize randevun yarın mı? 5 dakikada e-poliçen mailine düşer.',
                'Beylikdüzü ofisten 25 yıllık seyahat sigortası deneyimi. Numara paylaşımı yok.',
              ],
            },
          ],
        },
      ],
    };
  },
};

// ─── Wrapper: ortak asset'leri + campaign-level negative'leri ekle ────────
function withFullAssets(base: CampaignTemplate): CampaignTemplate {
  return {
    ...base,
    build: () => {
      const campaign = base.build();
      return {
        ...campaign,
        sitelinks: campaign.sitelinks ?? buildSharedSitelinks(base.product),
        callouts: campaign.callouts ?? SHARED_CALLOUTS,
        call: campaign.call ?? SHARED_CALL,
        adSchedule: campaign.adSchedule ?? WORKING_HOURS_SCHEDULE,
        negativeKeywords: campaign.negativeKeywords ?? SHARED_NEGATIVES,
      };
    },
  };
}

export const CAMPAIGN_TEMPLATES: Record<InsuranceSlug, CampaignTemplate> = {
  'tamamlayici-saglik': withFullAssets(tamamlayiciSaglik),
  'moduler-saglik': withFullAssets(modulerSaglik),
  kasko: withFullAssets(kasko),
  trafik: withFullAssets(trafik),
  konut: withFullAssets(konut),
  isyeri: withFullAssets(isyeri),
  dask: withFullAssets(dask),
  'seyahat-saglik': withFullAssets(seyahat),
};

export function listTemplates(): CampaignTemplate[] {
  return Object.values(CAMPAIGN_TEMPLATES);
}

export function getTemplate(product: InsuranceSlug): CampaignTemplate | null {
  return CAMPAIGN_TEMPLATES[product] || null;
}
