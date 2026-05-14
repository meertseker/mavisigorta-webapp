'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  trackQuoteFormView,
  trackQuoteFormStart,
  trackQuoteStep1Complete,
  trackQuoteStep2Start,
  trackQuoteFormComplete,
  trackQuoteFormError,
  trackLeadSubmitted,
} from '@/lib/analytics';
import { estimatePrice, type PriceEstimate } from '@/lib/pricing-estimator';
import type { InsuranceSlug, QuoteFormStep1 } from '@/lib/types';
import { PRODUCT_FORMS, type FieldDef } from './fields';

interface QuoteFormProps {
  product: InsuranceSlug;
  variant?: 'card' | 'embedded';
  /** Optional override: heading text. Defaults to the product's step1Title. */
  heading?: string;
}

function storageKey(product: InsuranceSlug) {
  return `mavi_quote_${product}_v1`;
}

function PlateInput({ field, value, onChange }: { field: FieldDef; value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      inputMode="text"
      autoComplete="off"
      placeholder={field.placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value.toUpperCase().slice(0, 10))}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg tracking-widest font-mono focus:ring-2 focus:ring-primary-red focus:border-transparent"
      aria-label={field.label}
    />
  );
}

function FieldInput({ field, value, onChange }: { field: FieldDef; value: string; onChange: (v: string) => void }) {
  if (field.type === 'plate') return <PlateInput field={field} value={value} onChange={onChange} />;
  if (field.type === 'select') {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-red focus:border-transparent"
        aria-label={field.label}
      >
        <option value="">Seçiniz…</option>
        {field.options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
  const inputType = field.type === 'number' || field.type === 'year' ? 'number' : field.type === 'tel' ? 'tel' : 'text';
  return (
    <input
      type={inputType}
      inputMode={inputType === 'number' ? 'numeric' : inputType === 'tel' ? 'tel' : 'text'}
      placeholder={field.placeholder}
      value={value}
      min={field.min}
      max={field.max}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-red focus:border-transparent"
      aria-label={field.label}
    />
  );
}

export default function QuoteForm({ product, variant = 'card', heading }: QuoteFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const def = PRODUCT_FORMS[product];

  const [step, setStep] = useState<1 | 2>(1);
  const [step1, setStep1] = useState<Record<string, string>>({});
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [kvkkConsent, setKvkkConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startedTracked, setStartedTracked] = useState(false);

  // Restore step1 from sessionStorage if present.
  useEffect(() => {
    trackQuoteFormView(product);
    if (typeof window === 'undefined') return;
    try {
      const raw = window.sessionStorage.getItem(storageKey(product));
      if (raw) {
        const parsed = JSON.parse(raw) as { step1?: Record<string, string>; step?: 1 | 2 };
        if (parsed.step1) setStep1(parsed.step1);
        if (parsed.step === 2) setStep(2);
      }
    } catch {
      /* ignore */
    }
  }, [product]);

  // Persist step1 + current step.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(storageKey(product), JSON.stringify({ step1, step }));
    } catch {
      /* ignore */
    }
  }, [step1, step, product]);

  const fillField = (name: string, value: string) => {
    if (!startedTracked) {
      trackQuoteFormStart(product);
      setStartedTracked(true);
    }
    setStep1((prev) => ({ ...prev, [name]: value }));
  };

  const estimate: PriceEstimate | null = useMemo(() => {
    if (step !== 2) return null;
    return estimatePrice(product, step1 as QuoteFormStep1);
  }, [product, step1, step]);

  const validateStep1 = (): string | null => {
    for (const f of def.step1Fields) {
      if (f.required && !step1[f.name]?.toString().trim()) {
        return `Lütfen "${f.label}" alanını doldurun.`;
      }
    }
    return null;
  };

  const goStep2 = () => {
    const err = validateStep1();
    if (err) {
      setError(err);
      trackQuoteFormError(product, err);
      return;
    }
    setError(null);
    trackQuoteStep1Complete(product);
    trackQuoteStep2Start(product);
    setStep(2);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);

    if (!name.trim() || name.trim().length < 2) {
      setError('Lütfen adınızı yazın.');
      trackQuoteFormError(product, 'invalid_name');
      return;
    }
    const cleanedPhone = phone.replace(/\D/g, '');
    if (cleanedPhone.length < 10) {
      setError('Geçerli bir telefon numarası girin.');
      trackQuoteFormError(product, 'invalid_phone');
      return;
    }
    if (!kvkkConsent) {
      setError('KVKK aydınlatma metnini onaylamanız zorunludur.');
      trackQuoteFormError(product, 'kvkk_required');
      return;
    }

    setSubmitting(true);
    try {
      const utm = {
        source: searchParams.get('utm_source') || undefined,
        medium: searchParams.get('utm_medium') || undefined,
        campaign: searchParams.get('utm_campaign') || undefined,
        term: searchParams.get('utm_term') || undefined,
        content: searchParams.get('utm_content') || undefined,
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product,
          name: name.trim(),
          phone: cleanedPhone,
          email: email.trim() || undefined,
          kvkkConsent,
          marketingConsent,
          step1,
          source: utm.source ? 'ads' : 'organic',
          utm,
        }),
      });

      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(result.error || 'Bir hata oluştu.');
      }

      try {
        window.sessionStorage.removeItem(storageKey(product));
      } catch {
        /* ignore */
      }

      trackQuoteFormComplete(product, result.score);
      trackLeadSubmitted(product, utm.source ? 'ads' : 'organic', result.score);

      router.push(`/teklif/${product}/tesekkurler`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Bir hata oluştu.';
      setError(msg);
      trackQuoteFormError(product, msg);
    } finally {
      setSubmitting(false);
    }
  };

  const containerCls =
    variant === 'card'
      ? 'rounded-3xl bg-white/95 dark:bg-gray-900/95 border border-white/30 dark:border-white/10 shadow-2xl backdrop-blur-xl'
      : '';

  return (
    <div className={`${containerCls} p-5 md:p-7`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs font-semibold text-secondary-amber uppercase tracking-wider mb-1">
            {def.productLabel} · 60 saniyede
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {heading || (step === 1 ? def.step1Title : 'Sizi nasıl arayalım?')}
          </h2>
        </div>
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 shrink-0 ml-3">
          Adım {step}/2
        </div>
      </div>

      <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full mb-5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-red to-secondary-orange transition-all duration-500"
          style={{ width: step === 1 ? '50%' : '100%' }}
        />
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">{def.step1Description}</p>

          {def.step1Fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                {field.label}
                {field.required && <span className="text-primary-red"> *</span>}
              </label>
              <FieldInput
                field={field}
                value={step1[field.name] || ''}
                onChange={(v) => fillField(field.name, v)}
              />
              {field.helper && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{field.helper}</p>
              )}
            </div>
          ))}

          {error && (
            <p className="text-sm text-primary-red bg-primary-red/10 border border-primary-red/30 rounded-lg p-3">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={goStep2}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-red to-secondary-orange text-white font-bold text-base shadow-glow-red hover:scale-[1.01] transition-transform"
          >
            Devam Et →
          </button>
          <p className="text-[11px] text-center text-gray-500 dark:text-gray-400">
            🔒 Telefonunuzu 3. taraflarla paylaşmıyoruz. Sadece teklif için arıyoruz.
          </p>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={onSubmit} className="space-y-4">
          {estimate && estimate.max > 0 && (
            <div className="rounded-2xl bg-gradient-to-br from-secondary-gold/15 to-secondary-amber/10 border border-secondary-gold/40 px-4 py-3">
              <div className="text-xs font-bold text-secondary-amber uppercase tracking-wider mb-1">
                Hesaplandı
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {estimate.hope}
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                {estimate.disclaimer}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
              Adınız Soyadınız <span className="text-primary-red">*</span>
            </label>
            <input
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-red focus:border-transparent"
              placeholder="Ad Soyad"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
              Telefon <span className="text-primary-red">*</span>
            </label>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-red focus:border-transparent"
              placeholder="0532 123 45 67"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
              E-posta (opsiyonel)
            </label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-red focus:border-transparent"
              placeholder="ornek@email.com"
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={kvkkConsent}
                onChange={(e) => setKvkkConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-red focus:ring-primary-red"
                required
              />
              <span className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                <a href="/kvkk-aydinlatma" target="_blank" className="underline hover:text-primary-red">
                  KVKK aydınlatma metnini
                </a>{' '}
                okudum, kişisel verilerimin teklif amacıyla işlenmesine onay veriyorum.{' '}
                <span className="text-primary-red">*</span>
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-red focus:ring-primary-red"
              />
              <span className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                Sigorta yenilemesi ve kampanyalar için Mavi Sigorta'dan bilgi almak istiyorum (opsiyonel).
              </span>
            </label>
          </div>

          {error && (
            <p className="text-sm text-primary-red bg-primary-red/10 border border-primary-red/30 rounded-lg p-3">
              {error}
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              ← Geri
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-primary-red to-secondary-orange text-white font-bold text-base shadow-glow-red hover:scale-[1.01] transition-transform disabled:opacity-60 disabled:hover:scale-100"
            >
              {submitting ? 'Gönderiliyor…' : 'Teklif Talebimi Gönder'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
