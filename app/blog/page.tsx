import { getAllBlogPosts, getAllCategories } from '@/lib/mdx';
import { getSiteSettings } from '@/lib/content';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Metadata } from 'next';
import Navigation from '@/components/ui/Navigation';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'Blog - Mavi Sigorta',
  description: 'Sağlık sigortası, kasko, konut sigortası ve sigorta dünyası hakkında faydalı bilgiler.',
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const categories = getAllCategories();
  const settings = getSiteSettings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Navigation siteName={settings.siteName} />
      
      <div className="h-20"></div>
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Blog</h1>
          <p className="text-xl text-gray-300">
            Sigorta ve güvence hakkında faydalı bilgiler
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button className="px-4 py-2 bg-primary-red text-white rounded-full text-sm font-medium shadow-glow hover:shadow-glow-lg transition-all hover:scale-105">
            Tümü
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 backdrop-blur-xl bg-white/10 border border-white/20 text-white rounded-full text-sm font-medium hover:bg-white/20 transition-all hover:scale-105"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg shadow-glass-xl overflow-hidden hover:shadow-glass-xl transition-all hover:scale-105 group"
            >
              <div className="h-48 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={post.image || `https://source.unsplash.com/800x400/?driving,car,${post.category}`}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-primary-red/20 text-secondary-orange border border-primary-red/30 text-xs font-medium px-2.5 py-0.5 rounded">
                    {post.category}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {formatDate(post.date)}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-secondary-orange transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-gray-400 bg-white/5 border border-white/10 px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">Henüz blog yazısı bulunmuyor.</p>
          </div>
        )}
      </main>

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
