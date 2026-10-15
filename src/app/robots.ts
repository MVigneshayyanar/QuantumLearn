import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.quanbit.tech';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin',
          '/admin/',
          '/instructor',
          '/instructor/',
          '/dashboard',
          '/dashboard/',
          // /verify and /verify/ REMOVED — certificate pages should be indexed;
          // they are linkable, shareable, and valuable for SEO authority.
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin',
          '/admin/',
          '/instructor',
          '/instructor/',
          '/dashboard',
          '/dashboard/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
