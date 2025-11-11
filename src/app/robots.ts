import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://gymtracker.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/routines/',
          '/exercises/',
          '/workout/',
          '/history/'
        ]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
