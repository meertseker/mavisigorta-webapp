import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import TrustStrip from '@/components/ui/TrustStrip';
import FloatingCTAStack from '@/components/ui/FloatingCTAStack';
import MobileStickyBar from '@/components/ui/MobileStickyBar';
import QuoteForm from '@/components/QuoteForm';
import { getAgent, getInsuranceById, getInsurances, getSiteSettings } from '@/lib/content';
import type { InsuranceSlug } from '@/lib/types';
import type { WhatsappContext } from '@/lib/whatsapp';

export const dynamicParams = false;

export function generateStaticParams() {
  return getInsurances().map((i) => ({ urun: i.id }));
}

interface PageProps {
  params: Promise<{ urun: InsuranceSlug }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { urun } = await params;
  const ins = getInsuranceById(urun);
  if (!ins) return { title: 'Teklif Bulunamadı' };
  return {
    title: `${ins.title} Teklifi - 60 Saniyede`,
    description: `${ins.title} için 60 saniyede teklif alın. ${ins.description.split('.')[0]}.`,
    alternates: { canonical: `/teklif/${ins.id}` },
  };
}

export default async function QuoteProductPage({ params }: PageProps) {
  const { urun } = await params;
  const ins = getInsuranceById(urun);
  if (!ins) notFound();

  const settings = getSiteSettings();
  const agent = getAgent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 pb-16 md:pb-0">
      <Navigation siteName={settings.siteName} />
      <div className="h-20" />

      <section className="py-10 md:py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-red/90 via-primary-red-dark/85 to-accent-burgundy/90" />
        <div className="absolute inset-0 bg-gradient-radial from-secondary-gold/20 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-[11px] font-bold mb-4">
                ⏱ 60 SANİYE · 30 DAKİKA İÇİNDE GERİ ARAMA
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight drop-shadow">
                {ins.title} Teklifi
              </h1>
              <p className="text-base md:text-lg text-white/90 mb-6 max-w-xl">
                {ins.description}
              </p>
              <ul className="space-y-2 mb-6 text-sm md:text-base">
                {ins.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-secondary-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-white/95">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center font-bold">
                  {agent.name
                    .split(' ')
                    .map((p) => p[0])
                    .join('')}
                </div>
                <div>
                  <div className="font-semibold">{agent.name} sizi arayacak</div>
                  <div className="text-white/80 text-xs">{agent.yearsActive} yıllık sigorta acentesi</div>
                </div>
              </div>
            </div>

            <div className="lg:pl-10">
              <Suspense
                fallback={
                  <div className="rounded-3xl bg-white/95 p-8 text-center text-gray-600">Yükleniyor…</div>
                }
              >
                <QuoteForm product={ins.id} variant="card" />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip
        partners={settings.partners}
        yearsActive={settings.stats.agentYearsActive}
        phone={settings.contact.phone}
      />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Mavi Sigorta'da nasıl işler?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: '1', t: 'Formu doldurun', d: '60 saniyede 2 adımda bilgilerinizi alalım.' },
              { n: '2', t: 'Teklif hazırlayalım', d: 'Allianz ürünleri için uygun teklif seçeneklerini değerlendirelim.' },
              { n: '3', t: 'Soner Bey arasın', d: '30 dakika içinde ücretsiz danışmanlık ve poliçe.' },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 p-6 shadow-md"
              >
                <div className="w-10 h-10 rounded-full bg-primary-red text-white flex items-center justify-center font-bold mb-3">
                  {s.n}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{s.t}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {ins.faqs && ins.faqs.length > 0 && (
        <section className="py-12 bg-gray-50/60 dark:bg-black/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Sıkça Sorulan Sorular
            </h2>
            <div className="space-y-3">
              {ins.faqs.map((q) => (
                <details
                  key={q.question}
                  className="group rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5 shadow-sm"
                >
                  <summary className="cursor-pointer flex items-center justify-between font-semibold text-gray-900 dark:text-white">
                    {q.question}
                    <span className="ml-3 text-primary-red transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{q.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer
        siteName={settings.siteName}
        phone={settings.contact.phone}
        email={settings.contact.email}
        address={settings.contact.address}
        socialMedia={settings.socialMedia}
      />

      <FloatingCTAStack
        phone={settings.contact.phone}
        whatsapp={settings.contact.whatsapp}
        product={ins.id as WhatsappContext}
      />
      <MobileStickyBar
        phone={settings.contact.phone}
        whatsapp={settings.contact.whatsapp}
        product={ins.id as WhatsappContext}
      />
    </div>
  );
}
