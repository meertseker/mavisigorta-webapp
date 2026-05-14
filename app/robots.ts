import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://tamamlayicisaglikbeylikduzu.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/teklif/*/tesekkurler'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
