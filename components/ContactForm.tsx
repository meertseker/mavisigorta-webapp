'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import Link from 'next/link';
import {
  trackInquiryFormStart,
  trackInquiryFormComplete,
  trackInquiryFormError,
  trackInsuranceQuoteIntent,
  trackLeadSubmitted,
} from '@/lib/analytics';

const contactSchema = z.object({
  name: z.string().min(2, 'Ad soyad en az 2 karakter olmalıdır'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
  insuranceType: z.string().optional(),
  message: z.string().min(10, 'Mesajınız en az 10 karakter olmalıdır'),
  kvkkConsent: z.literal(true, {
    message: 'KVKK aydınlatma metnini onaylamanız zorunludur',
  }),
  marketingConsent: z.boolean().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStarted, setFormStarted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { kvkkConsent: false as unknown as true, marketingConsent: false },
  });

  const handleFormFocus = () => {
    if (!formStarted) {
      setFormStarted(true);
      trackInquiryFormStart();
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        trackInquiryFormComplete();
        if (data.insuranceType) trackInsuranceQuoteIntent(data.insuranceType);
        trackLeadSubmitted(data.insuranceType || 'genel', 'organic', result.score);

        toast.success('Mesajınız alındı! Soner Bey en kısa sürede dönüş yapacak.');
        reset();
        setFormStarted(false);
      } else {
        trackInquiryFormError(result.error || 'Submission failed');
        toast.error(result.error || 'Bir hata oluştu, lütfen tekrar deneyiniz.');
      }
    } catch {
      trackInquiryFormError('Network error');
      toast.error('Bir hata oluştu, lütfen daha sonra tekrar deneyiniz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const errorFields = Object.keys(errors).join(', ');
      trackInquiryFormError(`Validation: ${errorFields}`);
    }
  }, [errors]);

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 shadow-xl p-7">
      <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-900 dark:text-white">Bize Mesaj Gönderin</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
        Hızlı bir teklif için <Link href="/teklif" className="text-primary-red font-semibold underline">60sn'lik teklif formunu</Link> tercih edebilirsiniz.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
            Adınız Soyadınız *
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            onFocus={handleFormFocus}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-red focus:border-transparent"
            placeholder="Ad Soyad"
            aria-required="true"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-primary-red" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
            E-posta *
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-red focus:border-transparent"
            placeholder="ornek@email.com"
            aria-required="true"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-primary-red" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
            Telefon *
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-red focus:border-transparent"
            placeholder="0555 123 45 67"
            aria-required="true"
            aria-invalid={errors.phone ? 'true' : 'false'}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && (
            <p id="phone-error" className="mt-1 text-sm text-primary-red" role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="insuranceType" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
            İlgilendiğiniz Sigorta
          </label>
          <select
            id="insuranceType"
            {...register('insuranceType')}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-red focus:border-transparent"
          >
            <option value="">Seçiniz…</option>
            <option value="tamamlayici-saglik">Tamamlayıcı Sağlık Sigortası</option>
            <option value="moduler-saglik">Modüler Sağlık Sigortası</option>
            <option value="kasko">Kasko Sigortası</option>
            <option value="trafik">Trafik Sigortası</option>
            <option value="konut">Konut Sigortası</option>
            <option value="isyeri">İşyeri Sigortası</option>
            <option value="dask">DASK Deprem Sigortası</option>
            <option value="seyahat-saglik">Seyahat Sağlık Sigortası</option>
            <option value="diger">Diğer</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
            Mesajınız *
          </label>
          <textarea
            id="message"
            {...register('message')}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-red focus:border-transparent resize-none"
            placeholder="Mesajınızı buraya yazınız…"
            aria-required="true"
            aria-invalid={errors.message ? 'true' : 'false'}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message && (
            <p id="message-error" className="mt-1 text-sm text-primary-red" role="alert">
              {errors.message.message}
            </p>
          )}
        </div>

        <div className="space-y-2 pt-1">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register('kvkkConsent')}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-red focus:ring-primary-red"
            />
            <span className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              <Link href="/kvkk-aydinlatma" target="_blank" className="underline hover:text-primary-red">
                KVKK aydınlatma metnini
              </Link>{' '}
              okudum, kişisel verilerimin işlenmesine onay veriyorum.{' '}
              <span className="text-primary-red">*</span>
            </span>
          </label>
          {errors.kvkkConsent && (
            <p className="text-xs text-primary-red ml-7">{errors.kvkkConsent.message}</p>
          )}

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register('marketingConsent')}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-red focus:ring-primary-red"
            />
            <span className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              Sigorta yenilemesi ve kampanyalar için Mavi Sigorta'dan bilgi almak istiyorum (opsiyonel).
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-primary-red to-secondary-orange text-white py-3.5 rounded-xl font-semibold hover:scale-[1.01] transition-transform disabled:opacity-60 disabled:hover:scale-100 shadow-glow-red"
        >
          {isSubmitting ? 'Gönderiliyor…' : 'Mesajı Gönder'}
        </button>

        <p className="text-[11px] text-center text-gray-500 dark:text-gray-400">
          🔒 Telefonunuzu 3. taraflarla paylaşmıyoruz.
        </p>
      </form>
    </div>
  );
}
