import type { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import TrustStrip from '@/components/ui/TrustStrip';
import FloatingCTAStack from '@/components/ui/FloatingCTAStack';
import MobileStickyBar from '@/components/ui/MobileStickyBar';
import { getInsurances, getSiteSettings } from '@/lib/content';

export const metadata: Metadata = {
  title: '60 Saniyede Teklif Al',
  description:
    'Hangi sigorta için teklif almak istediğinizi seçin: tamamlayıcı sağlık, kasko, trafik, konut, işyeri, DASK, seyahat veya modüler sağlık.',
  alternates: { canonical: '/teklif' },
};

const CATEGORY_LABELS: Record<string, string> = {
  saglik: 'Sağlık',
  arac: 'Araç',
  mulkiyet: 'Mülkiyet',
  seyahat: 'Seyahat',
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  saglik: 'from-emerald-500/90 to-teal-600/90',
  arac: 'from-blue-500/90 to-indigo-600/90',
  mulkiyet: 'from-amber-500/90 to-orange-600/90',
  seyahat: 'from-fuchsia-500/90 to-pink-600/90',
};

export default function TeklifIndexPage() {
  const insurances = getInsurances();
  const settings = getSiteSettings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800">
      <Navigation siteName={settings.siteName} />
      <div className="h-20" />

      <section className="py-12 md:py-16 bg-gradient-to-br from-primary-red via-primary-red-dark to-accent-burgundy text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-secondary-gold/25 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-bold mb-4">
            ⏱ ORTALAMA 60 SANİYE
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow">
            Hangi sigortayı istiyorsunuz?
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Birini seçin, 2 adımda formu doldurun. 30 dakika içinde Soner Bey sizi arasın.
          </p>
        </div>
      </section>

      <TrustStrip
        partners={settings.partners}
        yearsActive={settings.stats.agentYearsActive}
        phone={settings.contact.phone}
      />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 max-w-6xl mx-auto">
            {insurances.map((ins) => (
              <Link
                key={ins.id}
                href={`/teklif/${ins.id}`}
                className="group relative overflow-hidden rounded-2xl p-5 md:p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    CATEGORY_GRADIENTS[ins.category] || 'from-primary-red to-secondary-orange'
                  }`}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <div className="relative">
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-1">
                    {CATEGORY_LABELS[ins.category] || 'Sigorta'}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold mb-2">{ins.shortTitle}</h2>
                  <p className="text-sm text-white/85 line-clamp-2 mb-4 min-h-[2.5rem]">
                    {ins.description.split('.')[0]}.
                  </p>
                  {ins.priceRange && (
                    <div className="text-xs text-white/80 mb-3">
                      Tahmini: <strong className="text-white">₺{ins.priceRange.min.toLocaleString('tr-TR')}+</strong>
                    </div>
                  )}
                  <div className="inline-flex items-center gap-2 text-sm font-bold">
                    Teklif Al
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <p className="text-center mt-10 text-sm text-gray-500 dark:text-gray-400">
            Hangisi olduğundan emin değil misiniz?{' '}
            <a
              href={`https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent('Merhaba Soner Bey, hangi sigortanın bana uygun olduğunu konuşmak istiyorum.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary-red hover:underline"
            >
              WhatsApp'tan Soner Bey'e sorun
            </a>
          </p>
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
