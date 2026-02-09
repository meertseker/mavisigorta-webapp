import { getSiteSettings } from './content';
import type { WithContext, LocalBusiness, BreadcrumbList, FAQPage, Service, Review, Article } from 'schema-dts';
import type { Course, BlogPost } from './types';

export function getLocalBusinessSchema(): WithContext<LocalBusiness> {
  const settings = getSiteSettings();
  
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://tamamlayicisaglikbeylikduzu.com',
    name: settings.siteName,
    image: 'https://tamamlayicisaglikbeylikduzu.com/images/logo.png',
    description: settings.seo.description,
    url: 'https://tamamlayicisaglikbeylikduzu.com',
    telephone: settings.contact.phone,
    email: settings.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.contact.fullAddress,
      addressLocality: 'Beylikdüzü',
      addressRegion: 'İstanbul',
      addressCountry: 'TR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.0022,
      longitude: 28.6403,
    },
    priceRange: '₺₺',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '17:00',
      },
    ],
    sameAs: [
      settings.socialMedia.facebook,
      settings.socialMedia.instagram,
      settings.socialMedia.twitter,
      settings.socialMedia.youtube,
    ].filter((url): url is string => typeof url === 'string'),
  };
}

export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

interface FAQ {
  question: string;
  answer: string;
}

export function getFAQPageSchema(faqs: FAQ[]): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getServiceSchema(course: Course): WithContext<Service> {
  const settings = getSiteSettings();
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: course.title,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: settings.siteName,
      telephone: settings.contact.phone,
      email: settings.contact.email,
    },
    areaServed: {
      '@type': 'Place',
      name: 'Beylikdüzü, İstanbul',
    },
    offers: {
      '@type': 'Offer',
      price: course.price,
      priceCurrency: 'TRY',
      availability: 'https://schema.org/InStock',
    },
  };
}

interface ReviewData {
  name: string;
  rating: number;
  text: string;
  date: string;
  verified?: boolean;
}

export function getReviewSchema(review: ReviewData): WithContext<Review> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.name,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: review.text,
    datePublished: review.date,
  };
}

export function getAggregateRatingSchema(averageRating: number, reviewCount: number) {
  const settings = getSiteSettings();
  
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.siteName,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: averageRating,
      reviewCount: reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  };
}

export function getArticleSchema(post: BlogPost): WithContext<Article> {
  const settings = getSiteSettings();
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.image ? `https://tamamlayicisaglikbeylikduzu.com${post.image}` : undefined,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: settings.siteName,
      logo: {
        '@type': 'ImageObject',
        url: 'https://tamamlayicisaglikbeylikduzu.com/images/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://tamamlayicisaglikbeylikduzu.com/blog/${post.slug}`,
    },
  };
}
