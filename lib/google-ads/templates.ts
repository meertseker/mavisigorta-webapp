/**
 * Mavi Sigorta'ya özel kampanya şablonları.
 *
 * Her ürün için:
 * - Önerilen kampanya adı, günlük bütçe, bidding stratejisi
 * - Reklam grupları (genellikle 1-2: marka + lokasyon)
 * - RSA başlık + açıklama listesi (Google sınırlarına uygun)
 * - Anahtar kelime seti (broad / phrase / exact karışımı)
 * - Negatif anahtar kelimeler (CPC israfını önler)
 * - Landing URL builder (UTM parametreleri ile)
 *
 * Tüm RSA başlıkları ≤30 char, açıklamalar ≤90 char olarak doğrulanmalıdır.
 * Aşağıdaki şablonlar Türkçe karakter dahil bu sınırlara uyacak şekilde yazılmıştır.
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
import { tryToMicros } from './types';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamamlayicisaglikbeylikduzu.com';
const PHONE = process.env.NEXT_PUBLIC_AGENT_PHONE || '+905324807617';

// ─── Ortak asset setleri ──────────────────────────────────────────────────

/** Mavi Sigorta için tüm ürünlerde geçerli marka callout'ları. */
const SHARED_CALLOUTS: CalloutAsset[] = [
  { text: '25 Yıllık Sigorta Deneyimi' },
  { text: '8 Sigorta Şirketi Karşılaştır' },
  { text: '60 Saniyede Online Teklif' },
  { text: 'Soner Bey 30 Dakikada Arar' },
  { text: 'Beylikdüzü Yerel Acente' },
  { text: 'KVKK Uyumlu - Güvenli' },
  { text: 'WhatsApp\'tan Anında İletişim' },
  { text: 'Hızlı Poliçe Düzenleme' },
];

const SHARED_CALL: CallAsset = {
  phoneNumber: PHONE,
  countryCode: 'TR',
};

/** Türkiye iş saatleri: Pzt-Cmt 08:00-20:00 normal bid, dışı düşürülmüş. */
const WORKING_HOURS_SCHEDULE: AdScheduleEntry[] = [
  ...(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'] as const).flatMap(
    (day): AdScheduleEntry[] => [
      { dayOfWeek: day, startHour: 8, endHour: 12, bidModifier: 1.1 },
      { dayOfWeek: day, startHour: 12, endHour: 18, bidModifier: 1.0 },
      { dayOfWeek: day, startHour: 18, endHour: 22, bidModifier: 0.9 },
    ],
  ),
  { dayOfWeek: 'SATURDAY', startHour: 9, endHour: 18, bidModifier: 1.0 },
  { dayOfWeek: 'SUNDAY', startHour: 10, endHour: 18, bidModifier: 0.7 },
];

/** Her ürüne göre 4 sitelink üretir (kendi sayfası + 3 destek sayfası). */
function buildSharedSitelinks(productSlug: InsuranceSlug, productLabel: string): SitelinkAsset[] {
  return [
    {
      text: `${productLabel} Detayı`,
      description1: 'Kapsam, fiyat, teminatlar',
      description2: 'Anlaşmalı şirketler ve sıkça sorulanlar',
      finalUrl: new URL(`/sigortalar/${productSlug}`, SITE).toString(),
    },
    {
      text: 'Hakkımızda',
      description1: '25 yıllık Beylikdüzü acentesi',
      description2: 'Soner Şeker ve Mavi Sigorta hikâyesi',
      finalUrl: new URL('/hakkimizda', SITE).toString(),
    },
    {
      text: 'Sıkça Sorulanlar',
      description1: 'Sigorta hakkında merak edilenler',
      description2: 'Hızlı cevaplar ve örnek senaryolar',
      finalUrl: new URL('/sss', SITE).toString(),
    },
    {
      text: 'İletişim & WhatsApp',
      description1: 'Anında WhatsApp mesajı',
      description2: 'Telefon, e-posta, ofis adresi',
      finalUrl: new URL('/iletisim', SITE).toString(),
    },
  ];
}

function buildLandingUrl(product: InsuranceSlug, campaignSlug: string): string {
  // /teklif/[urun] doğrudan kullanılabilir; aynı zamanda /sigortalar/[urun] da
  // mümkün. Default olarak en yüksek dönüşüm getiren /teklif sayfasına yolluyoruz.
  const url = new URL(`/teklif/${product}`, SITE);
  url.searchParams.set('utm_source', 'google');
  url.searchParams.set('utm_medium', 'cpc');
  url.searchParams.set('utm_campaign', campaignSlug);
  return url.toString();
}

function kw(text: string, matchType: KeywordItem['matchType'] = 'PHRASE'): KeywordItem {
  return { text, matchType };
}

function neg(text: string, matchType: KeywordItem['matchType'] = 'PHRASE'): KeywordItem {
  return { text, matchType, negative: true };
}

// İstanbul + çevre il/ilçeler (yer adı bazlı negatif değil, sadece keyword'lerde varyasyon)
const ISTANBUL_LOCATIONS = [
  'beylikdüzü',
  'esenyurt',
  'avcılar',
  'büyükçekmece',
  'küçükçekmece',
  'bahçeşehir',
  'istanbul',
];

// Tüm ürünler için ortak negatifler
const GENERIC_NEGATIVES: KeywordItem[] = [
  neg('ücretsiz', 'BROAD'),
  neg('bedava', 'BROAD'),
  neg('iş ilanı', 'BROAD'),
  neg('iş başvurusu', 'BROAD'),
  neg('staj', 'BROAD'),
  neg('eğitim', 'BROAD'),
  neg('hile', 'BROAD'),
  neg('forum', 'BROAD'),
  neg('şikayet', 'BROAD'),
  neg('iptal', 'BROAD'),
];

export interface CampaignTemplate {
  product: InsuranceSlug;
  label: string;
  defaultBudgetTry: number;
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
      biddingStrategy: { type: 'TARGET_CPA', targetCpaMicros: tryToMicros(220) },
      geoTargets: [{ geoTargetConstant: '2792', label: 'Türkiye' }],
      insuranceProduct: 'tamamlayici-saglik',
      adGroups: [
        {
          name: 'TSS - Genel Niyet',
          status: 'PAUSED',
          keywords: [
            kw('tamamlayıcı sağlık sigortası', 'PHRASE'),
            kw('tamamlayıcı sağlık sigortası teklif', 'PHRASE'),
            kw('tamamlayıcı sağlık sigortası fiyat', 'PHRASE'),
            kw('tamamlayıcı sağlık sigortası 2026', 'PHRASE'),
            kw('tamamlayıcı sağlık sigortası ne kadar', 'PHRASE'),
            kw('tamamlayıcı sağlık sigortası hangi hastane', 'PHRASE'),
            kw('tss', 'EXACT'),
            kw('tss teklif', 'EXACT'),
            kw('ssk fark ödeme', 'PHRASE'),
            kw('özel hastanede fark ödememe', 'PHRASE'),
            kw('allianz tamamlayıcı sağlık', 'PHRASE'),
            ...GENERIC_NEGATIVES,
          ],
          ads: [
            {
              finalUrl: url,
              path1: 'tamamlayici-saglik',
              path2: 'teklif',
              headlines: [
                'TSS Teklif - 60 Saniyede',
                'Tamamlayıcı Sağlık Teklifi',
                'SSK Fark Ödemeyin',
                'Özel Hastane Fark Yok',
                'Allianz TSS Acentesi',
                '8 Şirketten Karşılaştırma',
                'Beylikdüzü TSS - Mavi Sigorta',
                '25 Yıllık Deneyim',
                'Soner Bey 30dk\'da Arar',
                'Ücretsiz TSS Teklifi',
                'Online TSS Başvurusu',
                'TSS Anlaşmalı Hastane',
                '60 Saniyede Online Teklif',
                'KVKK Uyumlu - Güvenli',
                'Hızlı Poliçe Düzenleme',
              ],
              descriptions: [
                '60 saniyede online formu doldur, 8 sigorta şirketinden karşılaştırmalı TSS teklifi al.',
                'SSK anlaşmalı özel hastanelerde fark ödemeden tedavi. Allianz TSS uzmanı acente.',
                'Soner Bey 30 dakika içinde sizi arar, ihtiyacınıza özel en uygun TSS poliçesini önerir.',
                'Beylikdüzü\'nün 25 yıllık sigorta acentesi. Telefonunuzu 3. taraflarla paylaşmıyoruz.',
              ],
            },
          ],
        },
        {
          name: 'TSS - Lokasyon (Beylikdüzü+çevre)',
          status: 'PAUSED',
          keywords: [
            ...ISTANBUL_LOCATIONS.map((loc) => kw(`tamamlayıcı sağlık sigortası ${loc}`, 'PHRASE')),
            ...ISTANBUL_LOCATIONS.map((loc) => kw(`${loc} tamamlayıcı sağlık`, 'PHRASE')),
            kw('beylikdüzü sigorta acentesi', 'PHRASE'),
            kw('esenyurt sağlık sigortası', 'PHRASE'),
            ...GENERIC_NEGATIVES,
          ],
          ads: [
            {
              finalUrl: url,
              path1: 'beylikduzu',
              path2: 'tss',
              headlines: [
                'TSS Beylikdüzü Acentesi',
                'Esenyurt TSS Teklif',
                'Avcılar Tamamlayıcı Sağlık',
                'Büyükçekmece TSS',
                'İstanbul TSS - 60sn',
                'Mavi Sigorta - 25 Yıl',
                'Bölgenin Güvenilir Acentesi',
                '8 Şirket Tek Form',
                'Allianz TSS Uzmanı',
                'SSK Hastanesi Fark Yok',
                'TSS Karşılaştırma',
                'Online TSS Başvuru',
                'KVKK Onaylı Acente',
                'Soner Bey 30dk\'da Arar',
                'Ücretsiz TSS Teklifi',
              ],
              descriptions: [
                'Beylikdüzü, Esenyurt, Avcılar bölgesinin 25 yıllık TSS acentesi Mavi Sigorta.',
                'Yaşadığınız bölgedeki anlaşmalı hastane listesi + en uygun fiyat 30 dakikada.',
                'Telefonunuzu sadece teklif için kullanırız. KVKK uyumlu, güvenli işlem.',
                'Online formu doldurun, Soner Bey en kısa sürede sizi arasın.',
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
      biddingStrategy: { type: 'TARGET_CPA', targetCpaMicros: tryToMicros(300) },
      geoTargets: [{ geoTargetConstant: '2792', label: 'Türkiye' }],
      insuranceProduct: 'moduler-saglik',
      adGroups: [
        {
          name: 'Modüler Sağlık - Genel',
          status: 'PAUSED',
          keywords: [
            kw('modüler sağlık sigortası', 'PHRASE'),
            kw('özel sağlık sigortası', 'PHRASE'),
            kw('sgk\'sız özel sağlık sigortası', 'PHRASE'),
            kw('sgk olmadan sağlık sigortası', 'PHRASE'),
            kw('kapsamlı sağlık sigortası', 'PHRASE'),
            kw('özel sağlık sigortası fiyat', 'PHRASE'),
            kw('özel sağlık sigortası karşılaştır', 'PHRASE'),
            ...GENERIC_NEGATIVES,
            neg('tamamlayıcı', 'PHRASE'),
          ],
          ads: [
            {
              finalUrl: url,
              path1: 'moduler-saglik',
              path2: 'teklif',
              headlines: [
                'Modüler Sağlık Sigortası',
                'SGK\'sız Özel Sağlık',
                'Tüm Özel Hastanelerde',
                'Geniş Kapsamlı Poliçe',
                '60 Saniyede Teklif',
                'Kapsamlı Sağlık Güvencesi',
                '8 Şirketten Teklif',
                'Soner Bey 30dk\'da Arar',
                'Mavi Sigorta - 25 Yıl',
                'Online Modüler Sağlık',
                'Ücretsiz Karşılaştırma',
                'Beylikdüzü Acentesi',
                'KVKK Onaylı',
                'Hızlı Poliçe Düzenleme',
                'Yurt Dışı Tedavi Desteği',
              ],
              descriptions: [
                'SGK\'dan bağımsız, Türkiye\'deki tüm özel hastanelerde geçerli modüler sağlık güvencesi.',
                'Geniş kapsam, özel oda, check-up, yurt dışı tedavi. 8 şirketten karşılaştırma.',
                'Online formu 60 saniyede doldurun, 30 dakikada Soner Bey size en uygun teklifi sunar.',
                '25 yıllık deneyimle Mavi Sigorta\'da modüler sağlık poliçesi.',
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
  label: 'Kasko - 30 Saniye Teklif',
  defaultBudgetTry: 120,
  defaultTargetCpaTry: 80,
  build: () => {
    const slug = 'kasko-30sn';
    const url = buildLandingUrl('kasko', slug);
    return {
      name: 'Kasko - 30sn Teklif [İstanbul]',
      status: 'PAUSED',
      advertisingChannelType: 'SEARCH',
      budgetDailyTry: 120,
      biddingStrategy: { type: 'TARGET_CPA', targetCpaMicros: tryToMicros(80) },
      geoTargets: [{ geoTargetConstant: '2792', label: 'Türkiye' }],
      insuranceProduct: 'kasko',
      adGroups: [
        {
          name: 'Kasko - Genel Niyet',
          status: 'PAUSED',
          keywords: [
            kw('kasko teklif', 'PHRASE'),
            kw('kasko fiyat', 'PHRASE'),
            kw('kasko sigorta', 'PHRASE'),
            kw('kasko hesaplama', 'PHRASE'),
            kw('en ucuz kasko', 'PHRASE'),
            kw('online kasko teklifi', 'PHRASE'),
            kw('plaka ile kasko teklifi', 'PHRASE'),
            kw('araç kasko fiyatları', 'PHRASE'),
            kw('kasko sigorta karşılaştır', 'PHRASE'),
            kw('kasko 2026 fiyatları', 'PHRASE'),
            ...GENERIC_NEGATIVES,
          ],
          ads: [
            {
              finalUrl: url,
              path1: 'kasko',
              path2: '30sn',
              headlines: [
                'Kasko Teklifi - 30 Saniye',
                'Plaka ile Kasko Fiyatı',
                '8 Şirketten Kasko',
                'En Uygun Kasko Fiyatı',
                'Online Kasko Teklif',
                'Kasko Karşılaştırma',
                'İkame Araç Hizmeti',
                'Beylikdüzü Kasko Acentesi',
                'Soner Bey 30dk\'da Arar',
                'Mavi Sigorta - 25 Yıl',
                'Hızlı Poliçe Düzenleme',
                'Kasko Hasar Takibi',
                'Hasarsızlık İndirimi',
                'Deprem & Sel Teminatı',
                'KVKK Uyumlu - Güvenli',
              ],
              descriptions: [
                'Plakanızı yazın, 30 saniyede 8 sigorta şirketinden karşılaştırmalı kasko teklifi alın.',
                'Çarpışma, çalınma, yangın, doğal afet teminatları. İkame araç dahil seçenekler.',
                'Online formu doldurun, Soner Bey 30 dakika içinde en uygun teklifi sunar.',
                'Beylikdüzü\'nün 25 yıllık sigorta acentesi. Hızlı poliçe, kolay hasar süreci.',
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
      biddingStrategy: { type: 'TARGET_CPA', targetCpaMicros: tryToMicros(50) },
      geoTargets: [{ geoTargetConstant: '2792', label: 'Türkiye' }],
      insuranceProduct: 'trafik',
      adGroups: [
        {
          name: 'Trafik - Genel',
          status: 'PAUSED',
          keywords: [
            kw('trafik sigortası', 'PHRASE'),
            kw('trafik sigortası fiyat', 'PHRASE'),
            kw('trafik sigortası teklif', 'PHRASE'),
            kw('zorunlu trafik sigortası', 'PHRASE'),
            kw('plaka ile trafik sigortası', 'PHRASE'),
            kw('online trafik sigortası', 'PHRASE'),
            kw('trafik sigortası hesaplama', 'PHRASE'),
            kw('en ucuz trafik sigortası', 'PHRASE'),
            ...GENERIC_NEGATIVES,
          ],
          ads: [
            {
              finalUrl: url,
              path1: 'trafik',
              path2: 'plaka',
              headlines: [
                'Trafik Sigortası - Plaka ile',
                'Online Trafik Teklif',
                '4 Şirketten Karşılaştırma',
                'Hızlı Poliçe Düzenleme',
                '60 Saniyede Teklif',
                'Trafik Sigortası 2026',
                'En Uygun Trafik Fiyatı',
                'Beylikdüzü Acente',
                'Mavi Sigorta - 25 Yıl',
                'Soner Bey Arar',
                'Hasarsızlık İndirimi',
                'Online Poliçe Teslim',
                'KVKK Uyumlu',
                'Zorunlu Trafik Sigortası',
                '7/24 Hasar Hattı',
              ],
              descriptions: [
                'Plakanızı yazın, 4 sigorta şirketinden karşılaştırmalı trafik sigortası teklifi alın.',
                'Online işlem ve dijital poliçe teslimi. Hasarsızlık indiriminiz aynen geçerli.',
                'Mavi Sigorta\'nın 25 yıllık deneyimiyle hızlı ve uygun trafik sigortası.',
                'KVKK uyumlu, güvenli işlem; telefon numaranızı sadece teklif için kullanırız.',
              ],
            },
          ],
        },
      ],
    };
  },
};

// ─── 5) Konut ─────────────────────────────────────────────────────────────
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
      biddingStrategy: { type: 'TARGET_CPA', targetCpaMicros: tryToMicros(90) },
      geoTargets: [{ geoTargetConstant: '2792', label: 'Türkiye' }],
      insuranceProduct: 'konut',
      adGroups: [
        {
          name: 'Konut - Genel',
          status: 'PAUSED',
          keywords: [
            kw('konut sigortası', 'PHRASE'),
            kw('konut sigortası fiyat', 'PHRASE'),
            kw('ev sigortası', 'PHRASE'),
            kw('ev sigortası teklif', 'PHRASE'),
            kw('konut paket sigorta', 'PHRASE'),
            kw('deprem sigortası ev', 'PHRASE'),
            kw('ev sigortası hesaplama', 'PHRASE'),
            kw('en uygun konut sigortası', 'PHRASE'),
            ...GENERIC_NEGATIVES,
          ],
          ads: [
            {
              finalUrl: url,
              path1: 'konut',
              path2: 'teklif',
              headlines: [
                'Konut Sigortası Teklifi',
                'Ev Sigortası - 60sn',
                'Yangın & Su Baskını',
                'Hırsızlık Güvencesi',
                'Cam Kırılması Dahil',
                '8 Şirketten Karşılaştırma',
                'Doğal Afet Koruması',
                'Beylikdüzü Konut Acentesi',
                'Mavi Sigorta - 25 Yıl',
                'Soner Bey 30dk\'da Arar',
                'Online Konut Teklifi',
                'Ev Eşyası Sigortası',
                'Hukuki Koruma Dahil',
                'KVKK Onaylı',
                'En Uygun Konut Primi',
              ],
              descriptions: [
                'Yangın, su baskını, hırsızlık ve doğal afet teminatları. 8 sigorta şirketi karşılaştırması.',
                'Ev eşyası sigortası, cam kırılması ve hukuki koruma dahil paket seçenekleri.',
                'Online formu doldurun, Soner Bey size en uygun konut sigortası teklifini iletsin.',
                '25 yıllık deneyimle Beylikdüzü\'nün güvenilir konut sigortası acentesi.',
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
      biddingStrategy: { type: 'TARGET_CPA', targetCpaMicros: tryToMicros(180) },
      geoTargets: [{ geoTargetConstant: '2792', label: 'Türkiye' }],
      insuranceProduct: 'isyeri',
      adGroups: [
        {
          name: 'İşyeri - Genel',
          status: 'PAUSED',
          keywords: [
            kw('işyeri sigortası', 'PHRASE'),
            kw('işyeri sigortası fiyat', 'PHRASE'),
            kw('işyeri paket sigorta', 'PHRASE'),
            kw('kobi sigortası', 'PHRASE'),
            kw('mağaza sigortası', 'PHRASE'),
            kw('depo sigortası', 'PHRASE'),
            kw('restoran sigortası', 'PHRASE'),
            kw('işveren mali sorumluluk', 'PHRASE'),
            ...GENERIC_NEGATIVES,
          ],
          ads: [
            {
              finalUrl: url,
              path1: 'isyeri',
              path2: 'teklif',
              headlines: [
                'İşyeri Sigortası Teklifi',
                'KOBİ Sigorta Paketi',
                'Mağaza & Depo Sigortası',
                'İşveren Mali Sorumluluk',
                'Cam & Stok Teminatı',
                '60 Saniyede Teklif',
                'Beylikdüzü İşyeri Acentesi',
                '25 Yıllık Deneyim',
                'Mavi Sigorta',
                '8 Şirket Karşılaştırma',
                'İş Durması Teminatı',
                'Hırsızlık Güvencesi',
                'Online İşyeri Sigortası',
                'KVKK Uyumlu',
                'Soner Bey Arar',
              ],
              descriptions: [
                'İşyeri binası, demirbaş, stok, işveren sorumluluğu — tek paketle güvenceye alın.',
                'Restoran, mağaza, ofis, depo, atölye için özel teminat paketleri.',
                'Soner Bey 30 dakika içinde size en uygun KOBİ sigorta paketini sunar.',
                '25 yıllık deneyimle Beylikdüzü\'nün KOBİ sigorta uzmanı.',
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
      biddingStrategy: { type: 'TARGET_CPA', targetCpaMicros: tryToMicros(35) },
      geoTargets: [{ geoTargetConstant: '2792', label: 'Türkiye' }],
      insuranceProduct: 'dask',
      adGroups: [
        {
          name: 'DASK - Genel',
          status: 'PAUSED',
          keywords: [
            kw('dask', 'EXACT'),
            kw('dask sigortası', 'PHRASE'),
            kw('dask fiyat', 'PHRASE'),
            kw('dask hesaplama', 'PHRASE'),
            kw('deprem sigortası', 'PHRASE'),
            kw('zorunlu deprem sigortası', 'PHRASE'),
            kw('dask yenileme', 'PHRASE'),
            kw('dask online', 'PHRASE'),
            ...GENERIC_NEGATIVES,
          ],
          ads: [
            {
              finalUrl: url,
              path1: 'dask',
              path2: 'teklif',
              headlines: [
                'DASK Teklifi - 60sn',
                'Zorunlu Deprem Sigortası',
                'DASK Online Hesaplama',
                'DASK Yenileme',
                'Hızlı Poliçe',
                'Beylikdüzü DASK Acentesi',
                'Mavi Sigorta - 25 Yıl',
                'En Uygun DASK Fiyatı',
                'Online DASK Başvurusu',
                'Soner Bey 30dk\'da Arar',
                'KVKK Uyumlu',
                'Tapu ile DASK Teklifi',
                'DASK Hasar Süreci',
                'AKDM Onaylı',
                'Yasal Zorunlu Deprem',
              ],
              descriptions: [
                'Adresinizi yazın, 60 saniyede DASK primi hesaplansın. Hızlı poliçe ve teslim.',
                'Yasal zorunlu deprem sigortası — Mavi Sigorta\'nın 25 yıllık deneyimiyle.',
                'Online DASK başvurusu, AKDM onaylı poliçe, anında teslimat.',
                'KVKK uyumlu işlem. Telefonunuzu 3. taraflarla paylaşmıyoruz.',
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
      biddingStrategy: { type: 'TARGET_CPA', targetCpaMicros: tryToMicros(60) },
      geoTargets: [{ geoTargetConstant: '2792', label: 'Türkiye' }],
      insuranceProduct: 'seyahat-saglik',
      adGroups: [
        {
          name: 'Seyahat - Schengen',
          status: 'PAUSED',
          keywords: [
            kw('seyahat sağlık sigortası', 'PHRASE'),
            kw('schengen vize sigortası', 'PHRASE'),
            kw('schengen sigortası', 'PHRASE'),
            kw('vize için sağlık sigortası', 'PHRASE'),
            kw('yurt dışı sağlık sigortası', 'PHRASE'),
            kw('seyahat sigortası online', 'PHRASE'),
            kw('seyahat sigortası fiyat', 'PHRASE'),
            ...GENERIC_NEGATIVES,
          ],
          ads: [
            {
              finalUrl: url,
              path1: 'seyahat-saglik',
              path2: 'schengen',
              headlines: [
                'Schengen Vize Sigortası',
                'Seyahat Sağlık Teklifi',
                'Yurt Dışı Sağlık Güvencesi',
                'Online Seyahat Sigortası',
                '60 Saniyede Poliçe',
                'Mavi Sigorta - 25 Yıl',
                'Anında Belge',
                'Schengen Onaylı',
                'En Uygun Seyahat Sigortası',
                'Acil Tedavi Teminatı',
                'Soner Bey Arar',
                'Beylikdüzü Acente',
                'Vize için Geçerli',
                'KVKK Uyumlu',
                'Online Anında Poliçe',
              ],
              descriptions: [
                'Schengen vize başvurusu için onaylı seyahat sağlık sigortası. Anında e-poliçe.',
                'Yurt dışı acil tedavi, hastane, ambulans, nakil teminatları dahil paket.',
                'Online formu doldurun, 30 dakika içinde Soner Bey size geri dönsün.',
                '25 yıllık deneyimle Mavi Sigorta — KVKK uyumlu, güvenli işlem.',
              ],
            },
          ],
        },
      ],
    };
  },
};

/** Asset'lerle zenginleştirilmiş template wrapper. */
function withFullAssets(
  base: CampaignTemplate,
  productLabel: string,
): CampaignTemplate {
  return {
    ...base,
    build: () => {
      const campaign = base.build();
      return {
        ...campaign,
        sitelinks: campaign.sitelinks ?? buildSharedSitelinks(base.product, productLabel),
        callouts: campaign.callouts ?? SHARED_CALLOUTS,
        call: campaign.call ?? SHARED_CALL,
        adSchedule: campaign.adSchedule ?? WORKING_HOURS_SCHEDULE,
      };
    },
  };
}

export const CAMPAIGN_TEMPLATES: Record<InsuranceSlug, CampaignTemplate> = {
  'tamamlayici-saglik': withFullAssets(tamamlayiciSaglik, 'Tamamlayıcı Sağlık'),
  'moduler-saglik': withFullAssets(modulerSaglik, 'Modüler Sağlık'),
  kasko: withFullAssets(kasko, 'Kasko'),
  trafik: withFullAssets(trafik, 'Trafik Sigortası'),
  konut: withFullAssets(konut, 'Konut Sigortası'),
  isyeri: withFullAssets(isyeri, 'İşyeri Sigortası'),
  dask: withFullAssets(dask, 'DASK'),
  'seyahat-saglik': withFullAssets(seyahat, 'Seyahat Sağlık'),
};

export function listTemplates(): CampaignTemplate[] {
  return Object.values(CAMPAIGN_TEMPLATES);
}

export function getTemplate(product: InsuranceSlug): CampaignTemplate | null {
  return CAMPAIGN_TEMPLATES[product] || null;
}
