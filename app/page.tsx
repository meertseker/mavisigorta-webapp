import Link from 'next/link';
import { getInsurances, getSiteSettings } from '@/lib/content';
import { getRecentBlogPosts } from '@/lib/mdx';
import { formatDate } from '@/lib/utils';
import Hero from '@/components/ui/Hero';
import Navigation from '@/components/ui/Navigation';
import StatsCard from '@/components/ui/StatsCard';
import FeatureCard from '@/components/ui/FeatureCard';
import InsuranceCard from '@/components/ui/InsuranceCard';
import BlogCard from '@/components/ui/BlogCard';
import TestimonialCard from '@/components/ui/TestimonialCard';
import Footer from '@/components/ui/Footer';
import TrustStrip from '@/components/ui/TrustStrip';
import FloatingCTAStack from '@/components/ui/FloatingCTAStack';
import MobileStickyBar from '@/components/ui/MobileStickyBar';
import ExitIntentModal from '@/components/ui/ExitIntentModal';
import ImageStorySection from '@/components/ui/ImageStorySection';

export default function Home() {
  const settings = getSiteSettings();
  const insurances = getInsurances();
  const recentPosts = getRecentBlogPosts();
  const stats = settings.stats;

  const testimonials = [
    {
      name: 'Zeynep Yılmaz',
      role: 'Konut & DASK Sigortası',
      rating: 5,
      text: "Konut ve DASK sigortamı Mavi Sigorta'dan aldım. Soner Bey her şeyi sabırla anlattı, fiyatı da en uygunuydu.",
    },
    {
      name: 'Ahmet Demir',
      role: 'Tamamlayıcı Sağlık Sigortası',
      rating: 5,
      text: 'TSS sayesinde özel hastanede hiç fark ödemedim. Süreç boyunca Soner Bey her sorumu hızlıca cevapladı.',
    },
    {
      name: 'Elif Kaya',
      role: 'Kasko Sigortası',
      rating: 5,
      text: 'Kasko hasarımda Mavi Sigorta tüm süreci takip etti. 24 saatte servise yönlendirildim. Çok memnun kaldım.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 pb-16 md:pb-0">
      <Navigation siteName={settings.siteName} />

      <div className="h-20"></div>

      <Hero
        title="60 Saniyede Sigorta Teklifi Al"
        subtitle={`${stats.yearsOfExperience} yıllık deneyim, Allianz ile çalışan sigorta aracılığı. Tamamlayıcı sağlık, kasko, konut ve daha fazlasında Allianz ürünleri için teklif. Soner Bey 30 dakika içinde sizi arasın.`}
        primaryCta={{ text: '60 Saniyede Teklif Al', href: '/teklif' }}
        secondaryCta={{
          text: 'WhatsApp ile Sor',
          href: `https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent(
            'Merhaba Soner Bey, sigorta teklifi almak istiyorum.'
          )}`,
        }}
        stats={[
          { value: `${stats.yearsOfExperience}+`, label: 'Yıl Deneyim' },
          { value: `%${stats.successRate}`, label: 'Memnuniyet' },
          { value: `${stats.customersServed}+`, label: 'Mutlu Müşteri' },
        ]}
      />

      <TrustStrip
        partners={settings.partners}
        yearsActive={stats.agentYearsActive}
        phone={settings.contact.phone}
      />

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatsCard
              value={stats.yearsOfExperience}
              label="Yıl Deneyim"
              suffix="+"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              delay={0}
            />
            <StatsCard
              value={stats.successRate}
              label="Memnuniyet Oranı"
              prefix="%"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              }
              delay={0.1}
            />
            <StatsCard
              value={stats.customersServed}
              label="Mutlu Müşteri"
              suffix="+"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              delay={0.2}
            />
            <StatsCard
              value={stats.partnerCompanies}
              label="Çalışılan Sigorta Şirketi"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              delay={0.3}
            />
          </div>
        </div>
      </section>

      <ImageStorySection
        eyebrow="25 Yıldır Beylikdüzü'nde"
        title="Soner Bey, telefonunuzun öbür ucunda."
        description="Mavi Sigorta, Beylikdüzü Adnan Kahveci'de fiziksel ofisi olan, SEDDK lisanslı bir sigorta aracılık şirketi. Soner Bey Allianz ürünleri için teklif, poliçe ve hasar süreçlerinizi takip ediyor."
        bullets={[
          'Fiziki ofis: Yavuz Sultan Selim Bulvarı 116, Beylikdüzü',
          'SEDDK lisanslı, KVKK uyumlu aracılık',
          'Hasar anında 7/24 takip — siz aramadan biz dönüyoruz',
          'Allianz ürünleri için teklif ve poliçe süreci',
        ]}
        image="/sonerbey.webp"
        imageAlt="Soner Şeker — Mavi Sigorta, Beylikdüzü"
        imagePosition="right"
        primaryCta={{ text: '60sn\'de Teklif Al', href: '/teklif' }}
        secondaryCta={{ text: 'Hakkımızda', href: '/hakkimizda' }}
      />

      <section className="relative py-12 md:py-20 overflow-hidden">
        {/* Ambient background image */}
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
              Neden Biz?
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Neden Mavi Sigorta?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
              25 yıllık deneyim, Allianz ile çalışma, 60 saniyede teklif
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {settings.features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
                title={feature.name}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 relative overflow-hidden">
        {/* Ambient bg image — family/protection */}
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1600&h=900&fit=crop"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-15 dark:opacity-20"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/85 to-white dark:from-gray-900/90 dark:via-gray-900/85 dark:to-gray-900" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-red/5 via-transparent to-secondary-orange/5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-1.5 bg-secondary-orange/10 dark:bg-secondary-orange/20 text-secondary-orange-dark dark:text-secondary-amber rounded-full text-sm font-semibold border border-secondary-orange/20">
              Ürünler
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Sigorta Ürünlerimiz
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
              8 ürün kategorisi, Allianz odaklı teklif süreci
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {insurances.slice(0, 6).map((ins) => (
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

          <div className="mt-10 text-center">
            <Link
              href="/sigortalar"
              className="inline-flex items-center gap-2 px-7 py-4 bg-gradient-to-r from-primary-red to-secondary-orange text-white rounded-2xl font-semibold shadow-glow-red hover:scale-105 transition-transform"
            >
              <span>Tüm Sigorta Ürünlerini Gör</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative py-12 md:py-20 overflow-hidden">
        {/* Ambient bg — happy customers */}
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&h=900&fit=crop"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-10 dark:opacity-15"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-1.5 bg-secondary-gold/15 text-yellow-700 dark:text-secondary-gold rounded-full text-sm font-semibold border border-secondary-gold/30">
              Referanslar
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Müşterilerimiz Ne Diyor?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Beylikdüzü ve çevresinden 10.000+ müşteri Soner Bey'le çalıştı
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((t, i) => (
              <TestimonialCard
                key={i}
                name={t.name}
                course={t.role}
                rating={t.rating}
                text={t.text}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {recentPosts.length > 0 && (
        <section className="py-12 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-bl from-accent-rose/10 via-transparent to-primary-red/10" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Blog Yazılarımız
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Sigorta dünyasından faydalı bilgiler ve ipuçları
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {recentPosts.map((post, index) => (
                <BlogCard
                  key={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  category={post.category}
                  date={formatDate(post.date)}
                  slug={post.slug}
                  tags={post.tags}
                  image={post.image}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-14 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-red via-secondary-orange to-accent-rose" />
        <div className="absolute inset-0 backdrop-blur-sm bg-black/20" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
            Sigorta Teklifinizi 60 Saniyede Başlatın
          </h2>
          <p className="text-lg md:text-xl mb-8 text-white/95 max-w-2xl mx-auto drop-shadow-md">
            Soner Bey ve ekibi 25 yıldır Beylikdüzü'nde — Allianz teklif sürecinizi sizin için takip ediyor.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/teklif"
              className="px-8 py-4 bg-white text-primary-red rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-transform"
            >
              60sn'de Teklif Al
            </Link>
            <a
              href={`https://wa.me/${settings.contact.whatsapp}?text=${encodeURIComponent('Merhaba Soner Bey, sigorta teklifi almak istiyorum.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-[#25D366] text-white rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-transform"
            >
              WhatsApp ile Yaz
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
      <ExitIntentModal />
    </div>
  );
}
