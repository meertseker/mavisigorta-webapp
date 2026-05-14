import { getSiteSettings } from '@/lib/content';
import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';
import FloatingCTAStack from '@/components/ui/FloatingCTAStack';
import MobileStickyBar from '@/components/ui/MobileStickyBar';

export const metadata: Metadata = {
  title: 'İletişim - Mavi Sigorta',
  description: 'Beylikdüzü Mavi Sigorta ile iletişime geçin. Telefon, WhatsApp, e-posta veya iletişim formundan ulaşabilirsiniz.',
  alternates: { canonical: '/iletisim' },
};

export default function ContactPage() {
  const settings = getSiteSettings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 pb-16 md:pb-0">
      <Navigation siteName={settings.siteName} />

      <div className="h-20"></div>

      <section className="py-16 bg-gradient-to-br from-primary-red via-primary-red-dark to-accent-burgundy text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-secondary-gold/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">İletişim</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Telefon, WhatsApp veya formdan ulaşın. Soner Bey en geç 1 saat içinde geri dönüş yapar.
          </p>
        </div>
      </section>

      <section className="relative py-12 md:py-20 overflow-hidden">
        {/* Ambient bg — İstanbul / Beylikdüzü cityscape feel */}
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1600&h=900&fit=crop"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-10 dark:opacity-15"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="grid md:grid-cols-2 gap-10 md:gap-12 max-w-6xl mx-auto">
            <ContactForm />

            <div className="space-y-8">
              <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 shadow-xl p-7">
                <h2 className="text-xl md:text-2xl font-bold mb-5 text-gray-900 dark:text-white">İletişim Bilgileri</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-red/10 rounded-xl border border-primary-red/20 shrink-0">
                      <svg className="w-6 h-6 text-primary-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">Telefon</div>
                      <a
                        href={`tel:${settings.contact.phone.replace(/\s/g, '')}`}
                        className="text-primary-red hover:underline font-semibold"
                      >
                        {settings.contact.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#25D366]/10 rounded-xl border border-[#25D366]/20 shrink-0">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#25D366]" fill="currentColor">
                        <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">WhatsApp</div>
                      <a
                        href={`https://wa.me/${settings.contact.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#25D366] hover:underline font-semibold"
                      >
                        {settings.contact.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-secondary-amber/10 rounded-xl border border-secondary-amber/20 shrink-0">
                      <svg className="w-6 h-6 text-secondary-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">E-posta</div>
                      <a
                        href={`mailto:${settings.contact.email}`}
                        className="text-secondary-amber hover:underline font-semibold"
                      >
                        {settings.contact.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent-rose/10 rounded-xl border border-accent-rose/20 shrink-0">
                      <svg className="w-6 h-6 text-accent-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1">Adres</div>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{settings.contact.fullAddress}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-7 pt-7 border-t border-gray-100 dark:border-white/10">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Çalışma Saatleri</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Hafta İçi:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{settings.workingHours.weekdays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Cumartesi:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{settings.workingHours.saturday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Pazar:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{settings.workingHours.sunday}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 shadow-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps?q=Beylikd%C3%BCz%C3%BC%2C+Adnan+Kahveci+Mahallesi%2C+Yavuz+Sultan+Selim+Bulvar%C4%B1+116%2C+%C4%B0stanbul&output=embed"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mavi Sigorta Beylikdüzü Konum"
                ></iframe>
              </div>
            </div>
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
