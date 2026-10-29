import { DATA } from '@/data/resume';

export const siteMetadata = {
  title: DATA.name,
  description: DATA.description,
  siteUrl: 'https://nehiljain.dev',
  siteName: DATA.name,
  twitterHandle: '@nehiljain',
  socialImage: '/favicons/og-image.png',
  locale: 'en-US',
  analytics: {
    googleAnalyticsId: '' // Add if you have GA
  },
  author: {
    name: DATA.name,
    twitter: '@nehiljain'
  }
};

// Origin for absolute URLs in page metadata (og:url, share images). Preview builds set
// PREVIEW_URL to their own address, so a shared preview link unfurls with the preview's
// cards, drafts included. siteUrl stays the production address that cards and the sitemap use.
export const metadataOrigin = process.env.PREVIEW_URL || siteMetadata.siteUrl;
