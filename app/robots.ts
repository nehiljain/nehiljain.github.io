import type { MetadataRoute } from 'next';
import { siteMetadata } from '@/config/metadata';

// The static export writes this to out/robots.txt. Cloudflare adds its content-signal comments on top.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`
  };
}
