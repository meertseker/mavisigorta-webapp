import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import TrustStrip from '@/components/ui/TrustStrip';
import FloatingCTAStack from '@/components/ui/FloatingCTAStack';
import MobileStickyBar from '@/components/ui/MobileStickyBar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import QuoteForm from '@/components/QuoteForm';
import { getAgent, getInsuranceById, getInsurances, getSiteSettings } from '@/lib/content';
import { getFAQPageSchema, getBreadcrumbSchema, getInsuranceServiceSchema } from '@/lib/structured-data';
import type { InsuranceSlug } from '@/lib/types';
import type { WhatsappContext } from '@/lib/whatsapp';

const SITE = 'https://tamamlayicisaglikbeylikduzu.com';

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
  if (!ins) return { title: 'Sigorta Bulunamadı' };
  return {
    title: `${ins.title} - Beylikdüzü'nün En Hızlı Teklif Servisi`,
    description: `${ins.title} hakkında her şey: kapsam, fiyat aralığı, anlaşmalı şirketler ve 60 saniyede teklif. ${ins.description.split('.')[0]}.`,
    alternates: { canonical: `/sigortalar/${ins.id}` },
    openGraph: {
      title: `${ins.title} | Mavi Sigorta`,
      description: ins.description,
      url: `${SITE}/sigortalar/${ins.id}`,
    },
  };
}

export default async function InsuranceDetailPage({ params }: PageProps) {
  const { urun } = await params;
  const ins = getInsuranceById(urun);
  if (!ins) notFound();

  const settings = getSiteSettings();
  const agent = getAgent();

  const faqSchema = ins.faqs && ins.faqs.length > 0 ? getFAQPageSchema(ins.faqs) : null;
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Sigorta Ürünleri', url: `${SITE}/sigortalar` },
    { name: ins.title, url: `${SITE}/sigortalar/${ins.id}` },
  ]);
  const serviceSchema = getInsuranceServiceSchema(ins);

  const samplePrices = ins.priceRange
    ? [
        { profile: '25 yaş, Beylikdüzü', price: ins.priceRange.min },
        {
          profile: '35 yaş, Esenyurt',
          price: Math.round((ins.priceRange.min + ins.priceRange.max) / 2),
        },
        { profile: '50 yaş, Avcılar', price: ins.priceRange.max },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 pb-16 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <Navigation siteName={settings.siteName} />
      <div className="h-20" />

      <section className="py-10 md:py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-red/95 via-primary-red-dark/90 to-accent-burgundy/95" />
        <div className="absolute inset-0 bg-gradient-radial from-secondary-gold/20 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <Breadcrumbs
            items={[
              { label: 'Sigorta Ürünleri', href: '/sigortalar' },
              { label: ins.title },
            ]}
          />
          <div className="grid lg:grid-cols-2 gap-10 items-start mt-6">
            <div className="text-white">
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight drop-shadow">
                {ins.title} <span className="text-secondary-gold">— Beylikdüzü</span>
              </h1>
              <p className="text-base md:text-lg text-white/90 mb-6 max-w-xl">{ins.description}</p>

              <div className="flex flex-wrap gap-3 mb-6">
                <Link
                  href={`/teklif/${ins.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-primary-red font-bold shadow-xl hover:scale-105 transition-transform"
                >
                  60 Saniyede Teklif Al
                </Link>
                <a
                  href={`tel:${settings.contact.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/15 backdrop-blur border border-white/40 text-white font-semibold hover:bg-white/25 transition-colors"
                >
                  📞 {settings.contact.phone}
                </a>
              </div>

              {ins.priceRange && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur border border-white/30">
                  <span className="text-xs uppercase tracking-wider opacity-80">Tahmini yıllık prim</span>
                  <span className="font-bold">
                    ₺{ins.priceRange.min.toLocaleString('tr-TR')} – ₺
                    {ins.priceRange.max.toLocaleString('tr-TR')}
                  </span>
                </div>
              )}
            </div>

            <div className="lg:pl-8">
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

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            {ins.title} neleri kapsar?
          </h2>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {ins.features.map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 p-5 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-secondary-gold/15 text-secondary-amber flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-gray-800 dark:text-gray-100 font-medium leading-relaxed">{feature}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-50/60 dark:bg-black/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Mavi Sigorta'da nasıl işler?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: '1', t: 'Formu doldurun', d: '60 saniyede 2 adımda bilgilerinizi alalım.' },
              { n: '2', t: 'Karşılaştırma', d: '8 anlaşmalı şirketten en uygun teklifi çıkaralım.' },
              { n: '3', t: 'Soner Bey arasın', d: '30 dakika içinde poliçeniz hazır.' },
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

      {samplePrices.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Fiyat örnekleri
            </h2>
            <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 shadow-md overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-white/5 text-sm font-bold text-gray-700 dark:text-gray-200">
                  <tr>
                    <th className="px-5 py-3">Profil</th>
                    <th className="px-5 py-3 text-right">Tahmini yıllık prim</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                  {samplePrices.map((p) => (
                    <tr key={p.profile}>
                      <td className="px-5 py-4 text-gray-800 dark:text-gray-200">{p.profile}</td>
                      <td className="px-5 py-4 text-right font-bold text-gray-900 dark:text-white">
                        ₺{p.price.toLocaleString('tr-TR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
              Tahmini fiyatlardır; kesin teklif Soner Bey'in araması sonrası netleşir.
            </p>
          </div>
        </section>
      )}

      <section className="py-12 md:py-16 bg-gray-50/60 dark:bg-black/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Anlaşmalı sigorta şirketlerimiz
          </h2>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-gray-700 dark:text-gray-300 font-semibold">
            {settings.partners.map((p) => (
              <span key={p.name} className="text-sm md:text-base">
                {p.name}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-6 text-center max-w-2xl mx-auto">
            8 farklı sigorta şirketinin tarifesini sizin için karşılaştırıyoruz. Tek başınıza her şirketi
            tek tek aramak yerine, ücretsiz olarak bizden bekleyin.
          </p>
        </div>
      </section>

      {ins.faqs && ins.faqs.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              {ins.title} - Sıkça Sorulan Sorular
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

      <section className="py-14 md:py-20 bg-gradient-to-br from-primary-red via-primary-red-dark to-accent-burgundy text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-secondary-gold/20 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 drop-shadow">
            Sorularınız mı var?
          </h2>
          <p className="text-lg text-white/90 mb-6 max-w-xl mx-auto">
            WhatsApp'tan {agent.name}'le doğrudan yazışabilir veya hemen teklif formunu doldurabilirsiniz.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={`/teklif/${ins.id}`}
              className="inline-flex items-center px-7 py-3 rounded-2xl bg-white text-primary-red font-bold shadow-xl hover:scale-105 transition-transform"
            >
              60sn'de Teklif Al
            </Link>
            <a
              href={`https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent(`Merhaba Soner Bey, ${ins.title} için teklif almak istiyorum.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-7 py-3 rounded-2xl bg-[#25D366] text-white font-bold shadow-xl hover:scale-105 transition-transform"
            >
              WhatsApp ile yaz
            </a>
          </div>
        </div>
      </section>

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
