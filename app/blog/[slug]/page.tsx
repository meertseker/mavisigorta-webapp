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
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800">
      <Navigation siteName={settings.siteName} />

      <div className="h-20"></div>

      <article className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center text-primary-red hover:underline mb-8 transition-colors"
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
              <span className="bg-primary-red/15 text-primary-red border border-primary-red/30 text-sm font-medium px-3 py-1 rounded">
                {post.category}
              </span>
              <span className="text-gray-500 dark:text-gray-400">{formatDate(post.date)}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 drop-shadow">
              {post.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">{post.excerpt}</p>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Yazar:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{post.author}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          {post.image && (
            <div className="h-96 relative rounded-2xl overflow-hidden mb-8 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl shadow-lg p-8 md:p-12">
            <div className="prose dark:prose-invert prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-200 leading-relaxed">
                {post.content}
              </div>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-br from-primary-red via-secondary-orange to-accent-rose text-white rounded-2xl p-8 text-center shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-secondary-gold/20 via-transparent to-transparent" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 drop-shadow">
                60 saniyede sigorta teklifi alın
              </h2>
              <p className="mb-6 text-white/95">
                Soner Bey 30 dakika içinde sizi arar, Allianz ürünleri için teklif sürecinizi başlatır.
              </p>
              <Link
                href="/teklif"
                className="inline-block bg-white text-primary-red px-8 py-3 rounded-xl font-semibold shadow-lg transition-all hover:scale-105"
              >
                60sn'de Teklif Al
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
