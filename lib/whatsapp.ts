// Default WhatsApp number (digits-only, with country code). Override via NEXT_PUBLIC_WA_NUMBER.
export const DEFAULT_WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || '905324807617';

export type WhatsappContext =
  | 'tamamlayici-saglik'
  | 'moduler-saglik'
  | 'kasko'
  | 'trafik'
  | 'konut'
  | 'isyeri'
  | 'dask'
  | 'seyahat-saglik'
  | 'genel';

const productLabels: Record<WhatsappContext, string> = {
  'tamamlayici-saglik': 'Tamamlayıcı Sağlık Sigortası',
  'moduler-saglik': 'Modüler Sağlık Sigortası',
  kasko: 'Kasko',
  trafik: 'Trafik Sigortası',
  konut: 'Konut Sigortası',
  isyeri: 'İşyeri Sigortası',
  dask: 'DASK Deprem Sigortası',
  'seyahat-saglik': 'Seyahat Sağlık Sigortası',
  genel: 'sigorta',
};

interface BuildWaArgs {
  product?: WhatsappContext;
  name?: string;
  city?: string;
  message?: string;
  number?: string;
}

export function buildWaUrl({ product = 'genel', name, city, message, number }: BuildWaArgs = {}): string {
  const phone = (number || DEFAULT_WA_NUMBER).replace(/\D/g, '');
  const productLabel = productLabels[product];
  const greetingName = name ? `, ben ${name}` : '';
  const cityPart = city ? ` (${city})` : '';

  const text =
    message ||
    `Merhaba Soner Bey${greetingName}${cityPart}, ${productLabel} için teklif almak istiyorum.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function buildTelHref(phone: string): string {
  return `tel:${phone.replace(/\s/g, '')}`;
}
