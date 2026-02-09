import { getSiteSettings } from '@/lib/content';
import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'İletişim - Mavi Sigorta',
  description: 'Mavi Sigorta ile iletişime geçin. Sigorta ihtiyaçlarınız için bize ulaşın. Ücretsiz teklif alın.',
};

export default function ContactPage() {
  const settings = getSiteSettings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Navigation siteName={settings.siteName} />
      
      <div className="h-20"></div>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-red via-primary-red-dark to-accent-burgundy text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-secondary-gold/20 via-transparent to-transparent animate-pulse-slow"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            İletişim
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Sigorta ihtiyaçlarınız için bize ulaşın, ücretsiz teklif alın. Size yardımcı olmaktan mutluluk duyarız
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <ContactForm />

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-glass-xl p-8">
                <h2 className="text-2xl font-bold mb-6 text-white">İletişim Bilgileri</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-red/20 rounded-xl border border-primary-red/30">
                      <svg
                        className="w-6 h-6 text-secondary-orange"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-white mb-1">Telefon</div>
                      <a
                        href={`tel:${settings.contact.phone.replace(/\s/g, '')}`}
                        className="text-secondary-orange hover:text-secondary-amber hover:underline transition-colors"
                      >
                        {settings.contact.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent-rose/20 rounded-xl border border-accent-rose/30">
                      <svg
                        className="w-6 h-6 text-secondary-amber"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-white mb-1">E-posta</div>
                      <a
                        href={`mailto:${settings.contact.email}`}
                        className="text-secondary-amber hover:text-secondary-gold hover:underline transition-colors"
                      >
                        {settings.contact.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-secondary-orange/20 rounded-xl border border-secondary-orange/30">
                      <svg
                        className="w-6 h-6 text-accent-coral"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-white mb-1">Adres</div>
                      <p className="text-gray-300">{settings.contact.fullAddress}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <h3 className="font-semibold text-white mb-4">Çalışma Saatleri</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Hafta İçi:</span>
                      <span className="font-medium text-white">{settings.workingHours.weekdays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cumartesi:</span>
                      <span className="font-medium text-white">{settings.workingHours.saturday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pazar:</span>
                      <span className="font-medium text-white">{settings.workingHours.sunday}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-glass-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d192697.8017470453!2d28.38544!3d41.01226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b55fbd91e47e75%3A0x13e5a6c8c428b01f!2zQsO8ecO8a8OnZWttZWNlLCDEsHN0YW5idWw!5e0!3m2!1str!2str!4v1234567890123!5m2!1str!2str"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Efe Sürücü Kursu Lokasyon"
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
    </div>
  );
}
