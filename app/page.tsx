import { getPopularCourses, getSiteSettings, getCourses } from '@/lib/content';
import { getRecentBlogPosts } from '@/lib/mdx';
import { formatDate } from '@/lib/utils';
import Hero from '@/components/ui/Hero';
import Navigation from '@/components/ui/Navigation';
import StatsCard from '@/components/ui/StatsCard';
import FeatureCard from '@/components/ui/FeatureCard';
import CourseCard from '@/components/ui/CourseCard';
import BlogCard from '@/components/ui/BlogCard';
import TestimonialCard from '@/components/ui/TestimonialCard';
import Footer from '@/components/ui/Footer';

export default function Home() {
  const settings = getSiteSettings();
  const courses = getCourses();
  const popularCourses = courses.filter(c => c.popular);
  const recentPosts = getRecentBlogPosts();
  const stats = settings.stats;

  // Sample testimonials
  const testimonials = [
    {
      name: 'Zeynep Yılmaz',
      course: 'Konut Sigortası',
      rating: 5,
      text: 'Konut ve DASK sigortamı Mavi Sigorta\'dan aldım. Soner Bey çok ilgili ve profesyonel. Her şeyi detaylı anlattılar.',
    },
    {
      name: 'Ahmet Demir',
      course: 'Tamamlayıcı Sağlık Sigortası',
      rating: 5,
      text: 'Tamamlayıcı sağlık sigortam sayesinde hastanede hiç fark ödemedim. Mavi Sigorta\'ya çok teşekkür ederim.',
    },
    {
      name: 'Elif Kaya',
      course: 'Kasko Sigortası',
      rating: 5,
      text: 'Kasko sigortamda hasar yaşadım. Mavi Sigorta tüm süreci takip etti, çok memnun kaldım. Hızlı ve profesyonel hizmet.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 dark:from-black dark:via-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <Navigation siteName={settings.siteName} />

      {/* Add padding for fixed nav */}
      <div className="h-16"></div>

      {/* Hero Section */}
      <Hero
        title="Geleceğinizi Güvence Altına Alın"
        subtitle={`${stats.yearsOfExperience} yıllık deneyimimiz, %${stats.successRate} müşteri memnuniyeti ve profesyonel hizmet anlayışımızla sağlığınız ve varlıklarınız güvende.`}
        primaryCta={{ text: 'Hizmetlerimiz', href: '/kurslar' }}
        secondaryCta={{ text: 'WhatsApp ile İletişim', href: 'https://wa.me/905324807617?text=Merhaba,%20sigorta%20hakkında%20bilgi%20almak%20istiyorum' }}
        stats={[
          { value: `${stats.yearsOfExperience}+`, label: 'Yıl Deneyim' },
          { value: `%${stats.successRate}`, label: 'Memnuniyet' },
          { value: `${stats.totalStudents}+`, label: 'Mutlu Müşteri' },
        ]}
      />

      {/* Stats Section */}
      <section className="py-20">
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
              value={stats.totalStudents}
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
              value={stats.instructors}
              label="Uzman Danışman"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-h2 font-bold text-gray-900 dark:text-white mb-4">
              Neden Mavi Sigorta?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Farkımızı yaratan özelliklerimiz
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

      {/* Courses Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-red/5 via-transparent to-secondary-orange/5"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Sigorta Hizmetlerimiz
            </h2>
            <p className="text-xl text-gray-900 dark:text-white">
              Size en uygun sigorta çözümünü seçin
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {courses.slice(0, 3).map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                description={course.description}
                price={course.price}
                duration={course.duration}
                features={course.features}
                popular={course.popular}
                image={course.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-h2 font-bold text-gray-900 dark:text-white mb-4">
              Müşterilerimiz Ne Diyor?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Memnuniyet hikayelerini okuyun
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                name={testimonial.name}
                course={testimonial.course}
                rating={testimonial.rating}
                text={testimonial.text}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      {recentPosts.length > 0 && (
        <section className="py-20 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-bl from-accent-rose/10 via-transparent to-primary-red/10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-h2 font-bold text-gray-900 dark:text-white mb-4">
                Blog Yazılarımız
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Faydalı bilgiler ve ipuçları
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

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-red via-secondary-orange to-accent-rose"></div>
        
        {/* Animated mesh overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-radial from-secondary-gold/20 via-transparent to-transparent animate-pulse-slow"></div>
        </div>
        
        {/* Glass overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-h2 font-bold mb-6 text-white drop-shadow-lg">
            Geleceğinizi Bugün Güvence Altına Alın!
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Sağlığınız, aracınız, eviniz ve işyeriniz için en uygun sigorta çözümlerini sunuyoruz. 25 yıllık deneyimimizle yanınızdayız.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/iletisim"
              className="px-8 py-4 backdrop-blur-xl bg-white/95 text-primary-red rounded-2xl font-semibold text-lg shadow-[0_10px_40px_rgba(255,255,255,0.3)] hover:shadow-[0_15px_50px_rgba(255,255,255,0.4)] hover:scale-105 transition-all duration-300 border border-white/50"
            >
              ✉ Ücretsiz Teklif Al
            </a>
            <a
              href="/kurslar"
              className="px-8 py-4 backdrop-blur-xl bg-white/10 border-2 border-white/50 hover:bg-white/20 text-white rounded-2xl font-semibold text-lg shadow-glass-xl hover:shadow-glass-xl transition-all duration-300 hover:scale-105"
            >
              🛡️ Hizmetlerimiz
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
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
