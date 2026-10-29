import type { MetadataRoute } from 'next';
import { posts } from '#site/content';
import { siteMetadata } from '@/config/metadata';

// The static export writes this to out/sitemap.xml.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/writing', '/projects', '/cv'].map((path) => ({
    url: siteMetadata.siteUrl + path
  }));
  const writing = posts
    .filter((p) => p.published)
    .map((p) => ({
      url: `${siteMetadata.siteUrl}/${p.slug}`,
      lastModified: p.date
    }));
  return [...pages, ...writing];
}
