import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://rightoffer.co.uk';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard',
        '/dashboard/*',
        '/api',
        '/api/*',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
