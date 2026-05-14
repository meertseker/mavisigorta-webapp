import { getSiteSettings } from '@/lib/content';
import { Metadata } from 'next';
import Navigation from '@/components/ui/Navigation';
import StatsCard from '@/components/ui/StatsCard';
import FeatureCard from '@/components/ui/FeatureCard';
import Footer from '@/components/ui/Footer';
import ImageStorySection from '@/components/ui/ImageStorySection';

export const metadata: Metadata = {
  title: 'Hakkımızda - Mavi Sigorta',
  description: 'Geniş ürün yelpazemiz ve 25 yıllık başarı hikayemiz hakkında bilgi edinin.',
};

export default function AboutPage() {
  const settings = getSiteSettings();
  const stats = settings.stats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 pb-16 md:pb-0">
      <Navigation siteName={settings.siteName} />
      
      <div className="h-20"></div>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-red via-primary-red-dark to-accent-burgundy text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-secondary-gold/20 via-transparent to-transparent animate-pulse-slow"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Hakkımızda
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto drop-shadow-md">
            {stats.yearsOfExperience} yıllık deneyimimiz ile İstanbul Beylikdüzü'nün
            en güvenilir sigorta aracılık şirketi
          </p>
        </div>
      </section>

      {/* Story: who we are */}
      <ImageStorySection
        eyebrow="Hikayemiz"
        title="1999'dan beri Beylikdüzü ailesinin sigorta danışmanı."
        description="Soner Bey, 1999 yılında Beylikdüzü'nde küçük bir ofiste başladı. 25 yıl sonra hâlâ aynı mahallede, aynı titizlikle çalışıyor. 8 anlaşmalı şirketin tekliflerini biz topluyoruz, siz sadece en uygununu seçiyorsunuz."
        bullets={[
          'SEDDK lisanslı sigorta aracılık şirketi',
          'KVKK ve aracılık yönetmeliklerine tam uyum',
          'Hasar anında dosya takibi — biz arar, biz hatırlatırız',
          '8 sigorta şirketi: Allianz, AXA, Anadolu, HDI ve daha fazlası',
        ]}
        image="/sonerbey.webp"
        imageAlt="Soner Şeker — Mavi Sigorta kurucusu, 25 yıldır Beylikdüzü'nde"
        imagePosition="right"
        primaryCta={{ text: 'Bize Ulaşın', href: '/iletisim' }}
      />

      {/* Mission: what we promise */}
      <ImageStorySection
        eyebrow="Misyonumuz"
        title="Sigortayı karmaşık olmaktan çıkarmak."
        description="Sigorta poliçeleri sayfalarca yazıyla, ince yazıyla, anlaşılması zor terimlerle gelir. Bizim işimiz tam buradan başlar: poliçeyi sade Türkçe ile anlatmak, sizin için en doğru teminatı seçmek ve hasar anında yanınızda olmak."
        bullets={[
          'Şeffaf fiyat: hangi şirket, hangi prim — biz gösteririz',
          'Sadece komisyon — sizden ek ücret yok',
          'Hasar danışmanlığı: 7/24 telefonla yanınızdayız',
          'Yenileme hatırlatması: 30 gün öncesinde size dönüyoruz',
        ]}
        image="/allianz.webp"
        imageAlt="Allianz yetkili acente — Mavi Sigorta"
        imagePosition="left"
        variant="tinted"
        primaryCta={{ text: '60sn\'de Teklif Al', href: '/teklif' }}
        secondaryCta={{ text: 'SSS', href: '/sss' }}
      />

      {/* Stats Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1600&h=900&fit=crop"
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
              Rakamlarla
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3">
              25 yılda biriktirdiklerimiz
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Her sayı bir Beylikdüzü ailesinin hikayesi
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatsCard
              value={stats.yearsOfExperience}
              label="Yıl Deneyim"
              suffix="+"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              delay={0.2}
            />
            <StatsCard
              value={stats.partnerCompanies}
              label="Anlaşmalı Sigorta Şirketi"
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

      {/* Features Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&h=900&fit=crop"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-10 dark:opacity-15"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white to-white/95 dark:from-gray-900/95 dark:via-gray-900 dark:to-gray-900/95" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-secondary-orange/10 dark:bg-secondary-orange/20 text-secondary-orange-dark dark:text-secondary-amber rounded-full text-sm font-semibold border border-secondary-orange/20">
              Farkımız
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 drop-shadow">Neden Biz?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Farkımızı yaratan özelliklerimiz</p>
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

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-red via-secondary-orange to-accent-rose"></div>
        <div className="absolute inset-0 backdrop-blur-sm bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
            Aramıza Katılın!
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Binlerce mutlu müşterimize siz de katılın, geleceğinizi güvence altına alın
          </p>
          <a
            href="/teklif"
            className="inline-block px-8 py-4 backdrop-blur-xl bg-white/95 text-primary-red rounded-2xl font-semibold text-lg shadow-[0_10px_40px_rgba(255,255,255,0.3)] hover:shadow-[0_15px_50px_rgba(255,255,255,0.4)] hover:scale-105 transition-all duration-300 border border-white/50"
          >
            60sn'de Teklif Al
          </a>
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
