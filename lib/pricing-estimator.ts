// Indicative annual prices (TL) used to build "umut" / commitment moments on the
// quote forms. These are NOT binding offers — final pricing depends on the
// insurer's underwriting and is communicated by Soner Bey after a phone call.
// Sources: Insurance company public tariffs + agent's 2024-2026 portfolio averages.

import type { InsuranceSlug, QuoteFormStep1 } from './types';

export interface PriceEstimate {
  min: number;
  max: number;
  currency: 'TRY';
  cadence: 'yillik';
  disclaimer: string;
  /** Short "hope statement" shown after step-1 form submit. */
  hope: string;
}

const DISCLAIMER =
  'Tahmini fiyattır. Kesin teklif uzman aramamızdan sonra netleşir. Bu site bir teklif değil, bilgi amaçlıdır.';

function pad(min: number, max: number, hope: string): PriceEstimate {
  return { min, max, currency: 'TRY', cadence: 'yillik', disclaimer: DISCLAIMER, hope };
}

function ageFromYear(year: number | undefined): number | null {
  if (!year) return null;
  const now = new Date().getFullYear();
  if (year < 1900 || year > now) return null;
  return now - year;
}

function ageFactor(age: number | null): number {
  if (age == null) return 1;
  if (age < 25) return 0.85;
  if (age < 35) return 0.95;
  if (age < 45) return 1.0;
  if (age < 55) return 1.15;
  if (age < 65) return 1.4;
  return 1.75;
}

export function estimatePrice(product: InsuranceSlug, step1: QuoteFormStep1 = {}): PriceEstimate {
  switch (product) {
    case 'tamamlayici-saglik': {
      const age = ageFromYear(Number(step1.birthYear));
      const f = ageFactor(age);
      const min = Math.round(7000 * f);
      const max = Math.round(9500 * f);
      const hope = age
        ? `${age} yaş için tahmini yıllık prim: ₺${min.toLocaleString('tr-TR')}–₺${max.toLocaleString('tr-TR')}.`
        : 'Yaşınıza özel tahmini yıllık prim hesaplanacak.';
      return pad(min, max, hope);
    }
    case 'moduler-saglik': {
      const age = ageFromYear(Number(step1.birthYear));
      const smoker = step1.smoker === 'evet' || step1.smoker === true;
      const f = ageFactor(age) * (smoker ? 1.25 : 1);
      const min = Math.round(12000 * f);
      const max = Math.round(18000 * f);
      return pad(
        min,
        max,
        `Tahmini yıllık prim: ₺${min.toLocaleString('tr-TR')}–₺${max.toLocaleString('tr-TR')}.`,
      );
    }
    case 'kasko': {
      // Baseline; older cars are cheaper, premium cars pricier.
      const year = Number(step1.year);
      let f = 1;
      if (year) {
        if (year >= 2023) f = 1.5;
        else if (year >= 2020) f = 1.2;
        else if (year >= 2015) f = 0.9;
        else f = 0.7;
      }
      const min = Math.round(8500 * f);
      const max = Math.round(14000 * f);
      return pad(
        min,
        max,
        `Aracın tahmini kasko fiyatı: ₺${min.toLocaleString('tr-TR')}–₺${max.toLocaleString('tr-TR')}/yıl.`,
      );
    }
    case 'trafik': {
      return pad(
        1800,
        4500,
        'Aktif teklif bekliyor: 4 sigorta şirketi. Plakanız ile en uygun fiyatı çekiyoruz.',
      );
    }
    case 'konut': {
      const m2 = Number(step1.m2);
      let f = 1;
      if (m2) {
        if (m2 > 200) f = 1.6;
        else if (m2 > 130) f = 1.3;
        else if (m2 > 80) f = 1;
        else f = 0.8;
      }
      const min = Math.round(800 * f);
      const max = Math.round(1800 * f);
      return pad(
        min,
        max,
        `Tahmini yıllık konut sigortası primi: ₺${min.toLocaleString('tr-TR')}–₺${max.toLocaleString('tr-TR')}.`,
      );
    }
    case 'isyeri': {
      const m2 = Number(step1.m2);
      let f = 1;
      if (m2) {
        if (m2 > 300) f = 1.8;
        else if (m2 > 150) f = 1.3;
        else f = 1;
      }
      const min = Math.round(2500 * f);
      const max = Math.round(6000 * f);
      return pad(
        min,
        max,
        `Tahmini yıllık işyeri sigortası primi: ₺${min.toLocaleString('tr-TR')}–₺${max.toLocaleString('tr-TR')}.`,
      );
    }
    case 'dask': {
      const m2 = Number(step1.m2);
      let f = 1;
      if (m2) {
        if (m2 > 130) f = 1.4;
        else if (m2 > 80) f = 1.1;
        else f = 0.9;
      }
      const min = Math.round(250 * f);
      const max = Math.round(700 * f);
      return pad(
        min,
        max,
        `Yasal zorunlu DASK primi: ₺${min.toLocaleString('tr-TR')}–₺${max.toLocaleString('tr-TR')}/yıl.`,
      );
    }
    case 'seyahat-saglik': {
      const days = Number(step1.days) || 7;
      const min = Math.max(200, Math.round(15 * days));
      const max = Math.max(400, Math.round(60 * days));
      return pad(
        min,
        max,
        `${days} günlük seyahat için tahmini prim: ₺${min.toLocaleString('tr-TR')}–₺${max.toLocaleString('tr-TR')}. Schengen için yeterli.`,
      );
    }
    default:
      return pad(0, 0, 'Tahmini fiyat bizimle iletişime geçtiğinizde paylaşılacak.');
  }
}
