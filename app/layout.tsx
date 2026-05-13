import type { Metadata } from 'next';
import { Bagel_Fat_One, JetBrains_Mono, Caveat } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { SiteHeader } from '@/components/site-header';
import { TooltipProvider } from '@/components/ui/tooltip';
import { siteMetadata } from '@/config/metadata';

const fontSans = localFont({ src: '../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2', variable: '--font-sans', display: 'swap', weight: '100 900' });
const fontHeading = localFont({ src: '../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2', variable: '--font-heading', display: 'swap', weight: '600 700' });
const fontDisplay = Bagel_Fat_One({ subsets: ['latin'], weight: '400', variable: '--font-display', display: 'swap' });
const fontMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });
const fontScript = Caveat({ subsets: ['latin'], variable: '--font-script', display: 'swap' });

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
      {
        url: '/static/favicons/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png'
      },
      {
        url: '/static/favicons/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png'
      }
    ],
    shortcut: '/static/favicons/favicon.ico',
    apple: [
      {
        url: '/static/favicons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/static/favicons/safari-pinned-tab.svg',
        color: '#5bbad5'
      }
    ]
  },
  manifest: '/static/favicons/site.webmanifest',
  other: {
    'msapplication-TileColor': '#da532c',
    'msapplication-config': '/static/favicons/browserconfig.xml',
    'theme-color': '#ffffff'
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
          fontSans.variable,
          fontHeading.variable,
          fontDisplay.variable,
          fontMono.variable,
          fontScript.variable
        )}
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
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
