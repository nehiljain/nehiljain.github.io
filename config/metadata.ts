import { DATA } from '@/data/resume';

export const siteMetadata = {
  title: DATA.name,
  description: DATA.description,
  siteUrl: 'https://nehiljain.com',
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
