import { getAllBlogSlugs, getBlogPostBySlug } from '@/lib/mdx';
import { getSiteSettings } from '@/lib/content';
import { formatDate } from '@/lib/utils';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Yazı Bulunamadı',
    };
  }

  return {
    title: `${post.title} - Mavi Sigorta Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  const settings = getSiteSettings();

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Navigation siteName={settings.siteName} />
      
      <div className="h-20"></div>
      
      <article className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center text-secondary-orange hover:text-secondary-amber mb-8 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Blog'a Dön
          </Link>

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-primary-red/20 text-secondary-orange border border-primary-red/30 text-sm font-medium px-3 py-1 rounded">
                {post.category}
              </span>
              <span className="text-gray-400">{formatDate(post.date)}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {post.title}
            </h1>
            <p className="text-xl text-gray-300">{post.excerpt}</p>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-gray-400">Yazar:</span>
              <span className="text-sm font-medium text-white">{post.author}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm text-gray-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          {/* Featured Image */}
          <div className="h-96 relative rounded-lg overflow-hidden mb-8 shadow-glow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={post.image || `https://source.unsplash.com/1600x900/?driving,car,${post.category}`}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg shadow-glass-xl p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              {/* Simple content renderer - will be enhanced with MDX later */}
              <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                {post.content}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-br from-primary-red via-secondary-orange to-accent-rose text-white rounded-lg p-8 text-center shadow-glow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-secondary-gold/20 via-transparent to-transparent animate-pulse-slow"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4 drop-shadow-lg">
                Geleceğinizi Güvence Altına Almak İçin Hazır mısınız?
              </h2>
              <p className="mb-6 text-white/90">
                25 yıllık deneyimimiz ve profesyonel danışmanlarımızla size en uygun
                sigorta çözümlerini sunuyoruz.
              </p>
              <Link
                href="/iletisim"
                className="inline-block backdrop-blur-xl bg-white/95 text-primary-red px-8 py-3 rounded-lg font-semibold shadow-[0_10px_40px_rgba(255,255,255,0.3)] hover:shadow-[0_15px_50px_rgba(255,255,255,0.4)] transition-all hover:scale-105 border border-white/50"
              >
                Ücretsiz Teklif Al
              </Link>
            </div>
          </div>
        </div>
      </article>

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
