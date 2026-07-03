import { getInsurances, getSiteSettings } from '@/lib/content';
import { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/components/ui/Navigation';
import InsuranceCard from '@/components/ui/InsuranceCard';
import Footer from '@/components/ui/Footer';
import FloatingCTAStack from '@/components/ui/FloatingCTAStack';
import MobileStickyBar from '@/components/ui/MobileStickyBar';

export const metadata: Metadata = {
  title: 'Sigorta Ürünlerimiz - 60sn\'de Teklif',
  description:
    'Tamamlayıcı sağlık, kasko, trafik, konut, işyeri, DASK, seyahat sigortası ve modüler sağlık. Allianz ürünleri için 60 saniyede teklif.',
  alternates: { canonical: '/sigortalar' },
};

export default function InsurancesPage() {
  const insurances = getInsurances();
  const settings = getSiteSettings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800">
      <Navigation siteName={settings.siteName} />

      <div className="h-20"></div>

      <section className="py-16 bg-gradient-to-br from-primary-red via-primary-red-dark to-accent-burgundy text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-secondary-gold/20 via-transparent to-transparent" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Sigorta Ürünlerimiz
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-6 drop-shadow-md">
            Allianz ürünleri için 60 saniyede teklif talebi oluşturun.
            25 yıllık deneyimle Soner Bey sizi 30 dakika içinde arar.
          </p>
          <Link
            href="/teklif"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-red rounded-2xl font-bold text-lg shadow-glow hover:scale-105 transition-transform"
          >
            60 Saniyede Teklif Al →
          </Link>
        </div>
      </section>

      <section className="relative py-12 md:py-20 overflow-hidden">
        {/* Ambient bg — protection / family */}
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&h=900&fit=crop"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-10 dark:opacity-15"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-1.5 bg-primary-red/10 dark:bg-primary-red/20 text-primary-red dark:text-primary-red-light rounded-full text-sm font-semibold border border-primary-red/20">
              Tüm Ürünler
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
              İhtiyacınıza uygun çözümü seçin
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              8 ürün kategorisi, Allianz odaklı teklif süreci. Başvurunuzu 60 saniyede tamamlayın.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {insurances.map((ins) => (
              <InsuranceCard
                key={ins.id}
                id={ins.id}
                title={ins.title}
                description={ins.description}
                duration={ins.duration}
                features={ins.features}
                popular={ins.popular}
                image={ins.image}
                priceRange={ins.priceRange}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&h=900&fit=crop"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-15 dark:opacity-20"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/85 to-white dark:from-gray-900/90 dark:via-gray-900/85 dark:to-gray-900" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-red/5 via-secondary-orange/5 to-transparent dark:from-primary-red/10 dark:via-secondary-orange/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 drop-shadow">
            Hangi Sigortayı Seçeceğinizden Emin Değil Misiniz?
          </h2>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            5 sorulu kısa testimizle size en uygun ürünü öneriyoruz ya da Soner Bey'le doğrudan WhatsApp'tan konuşun.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/teklif"
              className="inline-block px-8 py-4 bg-primary-red text-white rounded-xl font-semibold text-lg shadow-glow hover:bg-primary-red-dark transition-colors hover:scale-105"
            >
              60sn'de Teklif Al
            </Link>
            <a
              href={`https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent(
                'Merhaba Soner Bey, sigorta seçimi için yardım almak istiyorum.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-[#25D366] text-white rounded-xl font-semibold text-lg shadow-glow hover:scale-105 transition-transform"
            >
              WhatsApp'tan Sor
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

      <FloatingCTAStack phone={settings.contact.phone} whatsapp={settings.contact.whatsapp} />
      <MobileStickyBar phone={settings.contact.phone} whatsapp={settings.contact.whatsapp} />
    </div>
  );
}
