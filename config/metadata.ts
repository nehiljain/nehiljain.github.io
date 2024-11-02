import { DATA } from '@/data/resume';

export const siteMetadata = {
  title: DATA.name,
  description: DATA.description,
  siteUrl: 'https://nehiljain.com',
  siteName: DATA.name,
  twitterHandle: '@nehiljain',
  socialImage: '/static/favicons/og-image.png', // Assuming you have this
  locale: 'en-US',
  analytics: {
    googleAnalyticsId: '' // Add if you have GA
  },
  author: {
    name: DATA.name,
    twitter: '@nehiljain'
  }
};
