import type { InsuranceSlug } from '@/lib/types';

export type FieldType = 'text' | 'tel' | 'number' | 'select' | 'year' | 'plate';

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  helper?: string;
  /** Minimum number length for telephone, etc. */
  min?: number;
  max?: number;
  pattern?: string;
}

export interface ProductFormDef {
  product: InsuranceSlug;
  productLabel: string;
  step1Title: string;
  step1Description: string;
  step1Fields: FieldDef[];
  hopeFallback: string;
}

const CITIES = [
  'Beylikdüzü',
  'Esenyurt',
  'Büyükçekmece',
  'Avcılar',
  'Bahçeşehir',
  'Bağcılar',
  'Bakırköy',
  'Küçükçekmece',
  'Diğer',
];

export const PRODUCT_FORMS: Record<InsuranceSlug, ProductFormDef> = {
  'tamamlayici-saglik': {
    product: 'tamamlayici-saglik',
    productLabel: 'Tamamlayıcı Sağlık Sigortası',
    step1Title: 'Yaşınız ve şehriniz',
    step1Description: 'Sadece 2 alan; sigortalanacak kişinin yaş aralığını ve şehrini öğrenmemiz yeterli.',
    step1Fields: [
      {
        name: 'birthYear',
        label: 'Sigortalı doğum yılı',
        type: 'year',
        placeholder: 'Örn: 1985',
        required: true,
        min: 1925,
        max: new Date().getFullYear(),
      },
      {
        name: 'city',
        label: 'Şehir / İlçe',
        type: 'select',
        required: true,
        options: CITIES.map((c) => ({ value: c, label: c })),
      },
    ],
    hopeFallback: 'Yaşınıza özel yıllık prim aralığını paylaşacağız.',
  },
  'moduler-saglik': {
    product: 'moduler-saglik',
    productLabel: 'Modüler Sağlık Sigortası',
    step1Title: 'Birkaç bilgi alalım',
    step1Description: 'Sigortalı kişinin temel bilgileri ile tahmini prim aralığını gösterelim.',
    step1Fields: [
      {
        name: 'birthYear',
        label: 'Sigortalı doğum yılı',
        type: 'year',
        placeholder: 'Örn: 1985',
        required: true,
      },
      {
        name: 'gender',
        label: 'Cinsiyet',
        type: 'select',
        required: true,
        options: [
          { value: 'kadin', label: 'Kadın' },
          { value: 'erkek', label: 'Erkek' },
        ],
      },
      {
        name: 'smoker',
        label: 'Sigara kullanıyor mu?',
        type: 'select',
        required: true,
        options: [
          { value: 'hayir', label: 'Hayır' },
          { value: 'evet', label: 'Evet' },
        ],
      },
    ],
    hopeFallback: 'Profile özel modüler sağlık primi aralığı paylaşılacak.',
  },
  kasko: {
    product: 'kasko',
    productLabel: 'Kasko Sigortası',
    step1Title: 'Araç bilgileriniz',
    step1Description: 'Plakanız varsa hızlıca yazın; yoksa marka-model-yıl da yeterli.',
    step1Fields: [
      {
        name: 'plate',
        label: 'Plaka (opsiyonel)',
        type: 'plate',
        placeholder: '34 ABC 123',
      },
      {
        name: 'brand',
        label: 'Marka / Model',
        type: 'text',
        placeholder: 'Örn: Renault Clio',
        required: true,
      },
      {
        name: 'year',
        label: 'Model yılı',
        type: 'year',
        placeholder: 'Örn: 2019',
        required: true,
      },
    ],
    hopeFallback: '8 sigorta şirketinden kasko teklifi hazırlanıyor.',
  },
  trafik: {
    product: 'trafik',
    productLabel: 'Trafik Sigortası',
    step1Title: 'Plakanız',
    step1Description: 'Plakanızı yazın, sistemden tüm bilgileri çekelim.',
    step1Fields: [
      {
        name: 'plate',
        label: 'Plaka',
        type: 'plate',
        placeholder: '34 ABC 123',
        required: true,
      },
    ],
    hopeFallback: 'Aktif teklif bekliyor: 4 sigorta şirketi.',
  },
  konut: {
    product: 'konut',
    productLabel: 'Konut Sigortası',
    step1Title: 'Konutunuz hakkında 3 bilgi',
    step1Description: 'Brüt m², ilçe ve konut tipi yeterli; tahmini fiyat aralığını gösterelim.',
    step1Fields: [
      {
        name: 'm2',
        label: 'Brüt metrekare',
        type: 'number',
        placeholder: 'Örn: 120',
        required: true,
        min: 30,
        max: 1000,
      },
      {
        name: 'district',
        label: 'İlçe',
        type: 'select',
        required: true,
        options: CITIES.map((c) => ({ value: c, label: c })),
      },
      {
        name: 'buildingType',
        label: 'Konut tipi',
        type: 'select',
        required: true,
        options: [
          { value: 'apartman', label: 'Apartman dairesi' },
          { value: 'mustakil', label: 'Müstakil ev / villa' },
          { value: 'site', label: 'Site içi konut' },
        ],
      },
    ],
    hopeFallback: 'Tahmini konut sigortası primi hesaplanıyor.',
  },
  isyeri: {
    product: 'isyeri',
    productLabel: 'İşyeri Sigortası',
    step1Title: 'İşyeriniz hakkında',
    step1Description: 'Sektör, m² ve ilçe yeterli.',
    step1Fields: [
      {
        name: 'sector',
        label: 'Sektör',
        type: 'select',
        required: true,
        options: [
          { value: 'ofis', label: 'Ofis / hizmet' },
          { value: 'magaza', label: 'Mağaza / perakende' },
          { value: 'restoran', label: 'Restoran / kafe' },
          { value: 'depo', label: 'Depo / atölye' },
          { value: 'imalat', label: 'İmalat / sanayi' },
          { value: 'diger', label: 'Diğer' },
        ],
      },
      {
        name: 'm2',
        label: 'Brüt metrekare',
        type: 'number',
        placeholder: 'Örn: 80',
        required: true,
      },
      {
        name: 'district',
        label: 'İlçe',
        type: 'select',
        required: true,
        options: CITIES.map((c) => ({ value: c, label: c })),
      },
    ],
    hopeFallback: 'Tahmini işyeri sigortası primi hesaplanacak.',
  },
  dask: {
    product: 'dask',
    productLabel: 'DASK Deprem Sigortası',
    step1Title: 'Konut bilgisi',
    step1Description: 'Brüt m² ve inşaat yılı yeterli; DASK yasal zorunluluktur.',
    step1Fields: [
      {
        name: 'm2',
        label: 'Brüt metrekare',
        type: 'number',
        placeholder: 'Örn: 110',
        required: true,
      },
      {
        name: 'buildYear',
        label: 'İnşaat yılı',
        type: 'year',
        placeholder: 'Örn: 2010',
        required: true,
      },
    ],
    hopeFallback: 'Yasal zorunlu DASK primi anında hesaplanıyor.',
  },
  'seyahat-saglik': {
    product: 'seyahat-saglik',
    productLabel: 'Seyahat Sağlık Sigortası',
    step1Title: 'Seyahatiniz',
    step1Description: 'Ülke ve süre yeterli — Schengen başvuruları için uygun belge düzenliyoruz.',
    step1Fields: [
      {
        name: 'country',
        label: 'Ülke',
        type: 'text',
        placeholder: 'Örn: Almanya',
        required: true,
      },
      {
        name: 'days',
        label: 'Seyahat süresi (gün)',
        type: 'number',
        placeholder: 'Örn: 7',
        required: true,
        min: 1,
        max: 365,
      },
      {
        name: 'travelerAge',
        label: 'Yolcu yaşı',
        type: 'number',
        placeholder: 'Örn: 35',
        required: true,
        min: 0,
        max: 100,
      },
    ],
    hopeFallback: 'Schengen için yeterli teklif hazırlanıyor.',
  },
};
