import type { Metadata } from 'next';
import { getFAQPageSchema, getBreadcrumbSchema } from '@/lib/structured-data';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { getSiteSettings } from '@/lib/content';
import FAQAccordion from '@/components/ui/FAQAccordion';
import faqs from '@/content/faqs.json';

const settings = getSiteSettings();

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular',
  description: 'Mavi Sigorta hakkında merak ettiğiniz her şey. Sağlık sigortası, kasko, konut sigortası ve daha fazlası hakkında sorularınızın cevapları.',
  keywords: ['sigorta SSS', 'sağlık sigortası soruları', 'kasko fiyatları', 'sigorta teminatları'],
  openGraph: {
    title: 'Sıkça Sorulan Sorular | Mavi Sigorta',
    description: 'Sigorta poliçeleri hakkında merak ettiğiniz soruların cevapları.',
    url: 'https://tamamlayicisaglikbeylikduzu.com/sss',
  },
};

export default function SSSPage() {
  const faqSchema = getFAQPageSchema(faqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'SSS', url: 'https://tamamlayicisaglikbeylikduzu.com/sss' }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Navigation siteName={settings.siteName} logo={settings.logo} />

      <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-red via-primary-red-dark to-accent-burgundy text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-secondary-gold/20 via-transparent to-transparent animate-pulse-slow"></div>
          <div className="container mx-auto px-4 relative z-10">
            <Breadcrumbs items={[{ label: 'Sıkça Sorulan Sorular' }]} />
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
              Sıkça Sorulan Sorular
            </h1>
            <p className="text-xl text-white/90 max-w-3xl drop-shadow-md">
              Sigorta poliçeleri hakkında merak ettiğiniz soruların cevapları burada. 
              Aradığınızı bulamadıysanız bize ulaşabilirsiniz.
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&h=900&fit=crop"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover opacity-10 dark:opacity-15"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900" />
          </div>
          <div className="container mx-auto px-4 max-w-4xl relative">
            <div className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/80 border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl p-6 md:p-8">
              <FAQAccordion faqs={faqs} />
            </div>

            {/* Contact CTA */}
            <div className="mt-12 bg-gradient-to-r from-primary-red/10 to-secondary-orange/10 dark:from-primary-red/20 dark:to-secondary-orange/20 rounded-2xl p-8 text-center border border-primary-red/20 dark:border-primary-red/30 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Başka Sorunuz mu Var?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Cevabını bulamadığınız sorular için bize ulaşabilirsiniz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/teklif"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary-red text-white rounded-lg hover:bg-primary-red-dark transition-all duration-300 font-semibold shadow-glow hover:scale-105"
                >
                  60sn'de Teklif Al
                </a>
                <a
                  href={`tel:${settings.contact.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-white/10 border-2 border-gray-200 dark:border-white/30 hover:bg-gray-50 dark:hover:bg-white/20 text-gray-900 dark:text-white rounded-lg transition-all duration-300 font-semibold hover:scale-105"
                >
                  {settings.contact.phone}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer
        siteName={settings.siteName}
        phone={settings.contact.phone}
        email={settings.contact.email}
        address={settings.contact.address}
        socialMedia={settings.socialMedia}
      />
    </>
  );
}
