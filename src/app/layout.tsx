import './globals.css';
import Script from 'next/script';
import data from '../../public/data.json';
import { Correspondence, Letter, Recipient } from '../types';
import { CorrespondenceProvider } from '../contexts';
import { Geist, Geist_Mono } from 'next/font/google';

const { correspondences, letters, recipients } = data;

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const GA_TRACKING_ID = 'G-T56NPJ5SBE';

export const metadata = {
  alternates: {
    canonical: 'https://onehundredletters.com',
  },
  description: '100 letters, 100 people, 1 year.',
  metadataBase: new URL('https://onehundredletters.com'),
  openGraph: {
    description: '100 letters, 100 people, 1 year.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '100 Letters Project',
      },
    ],
    siteName: '100 Letters Project',
    title: '100 Letters Project',
    url: 'https://onehundredletters.com',
    type: 'website',
  },
  title: '100 Letters Project',
  twitter: {
    card: 'summary_large_image',
    title: '100 Letters Project',
    description: '100 letters, 100 people, 1 year.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isProduction = process.env.NODE_ENV === 'production';

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="description" content="100 letters, 100 people, 1 year." />
        <meta property="og:title" content="100 Letters Project" />
        <meta property="og:image" content="/og-image.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CorrespondenceProvider
          correspondences={correspondences as Correspondence[]}
          letters={letters as Letter[]}
          recipients={recipients as Recipient[]}
        >
          {children}
        </CorrespondenceProvider>
        {isProduction && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
