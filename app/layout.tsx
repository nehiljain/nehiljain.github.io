import type { Metadata } from 'next';
import { Bagel_Fat_One, Caveat } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { TooltipProvider } from '@/components/ui/tooltip';
import { siteMetadata } from '@/config/metadata';

const fontDisplay = Bagel_Fat_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap'
});
const fontScript = Caveat({
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.siteName,
    locale: siteMetadata.locale,
    type: 'website',
    images: [
      {
        url: siteMetadata.socialImage,
        width: 1200,
        height: 630,
        alt: siteMetadata.title
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.title,
    description: siteMetadata.description,
    creator: siteMetadata.twitterHandle,
    images: [siteMetadata.socialImage]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: {
    icon: [
      { url: '/favicons/favicon.svg', type: 'image/svg+xml' },
      {
        url: '/favicons/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png'
      },
      {
        url: '/favicons/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png'
      }
    ],
    shortcut: '/favicons/favicon.ico',
    apple: [
      {
        url: '/favicons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      },
      {
        url: '/favicons/apple-touch-icon-167x167.png',
        sizes: '167x167',
        type: 'image/png'
      },
      {
        url: '/favicons/apple-touch-icon-152x152.png',
        sizes: '152x152',
        type: 'image/png'
      },
      {
        url: '/favicons/apple-touch-icon-120x120.png',
        sizes: '120x120',
        type: 'image/png'
      }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicons/safari-pinned-tab.svg',
        color: '#fe640b'
      }
    ]
  },
  manifest: '/favicons/site.webmanifest',
  other: {
    'msapplication-TileColor': '#ece9e2',
    'msapplication-config': '/favicons/browserconfig.xml',
    'theme-color': '#fe640b'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          GeistSans.variable,
          GeistMono.variable,
          fontDisplay.variable,
          fontScript.variable
        )}
        style={
          {
            '--font-sans': 'var(--font-geist-sans)',
            '--font-heading': 'var(--font-geist-sans)',
            '--font-mono': 'var(--font-geist-mono)'
          } as React.CSSProperties
        }
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <div className="flex-1">{children}</div>
              <SiteFooter />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
