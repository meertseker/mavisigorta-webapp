import { MetadataRoute } from 'next';
import { getAllBlogSlugs } from '@/lib/mdx';
import { getInsurances } from '@/lib/content';

const baseUrl = 'https://tamamlayicisaglikbeylikduzu.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const blogSlugs = getAllBlogSlugs();
  const insurances = getInsurances();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/sigortalar`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/teklif`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/hakkimizda`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/iletisim`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/sss`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/gizlilik-politikasi`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/kullanim-kosullari`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/kvkk-aydinlatma`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/kvkk-acik-riza`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const insurancePages: MetadataRoute.Sitemap = insurances.flatMap((ins) => [
    {
      url: `${baseUrl}/sigortalar/${ins.id}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/teklif/${ins.id}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
  ]);

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...insurancePages, ...blogPages];
}
