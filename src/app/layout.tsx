import './globals.css';
import Script from 'next/script';
import data from '@public/data.json';
import { AuthProvider } from '@contexts/AuthProvider';
import { Correspondence, CorrespondencesMap } from '@ts-types/correspondence';
import { CorrespondenceProvider } from '@contexts/CorrespondenceProvider';
import { Merriweather } from 'next/font/google';
import { DesktopMenuProvider } from '@contexts/DesktopMenuProvider';

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-merriweather',
  display: 'swap',
});

const correspondences = data.correspondences ?? [];
const earliestSentAtDate = data.earliestSentAtDate ?? '';
const correspondencesById = data.correspondencesById ?? {};
const responseCompletion = data.responseCompletion ?? 0;

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

const NEXT_PUBLIC_GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://www.google-analytics.com"
          crossOrigin="anonymous"
        />
        <meta name="description" content="100 letters, 100 people, 1 year." />
        <meta property="og:title" content="100 Letters Project" />
        <meta property="og:image" content="/og-image.png" />
      </head>
      <body className={`${merriweather.variable} antialiased`}>
        <AuthProvider>
          <DesktopMenuProvider>
            <CorrespondenceProvider
              correspondences={correspondences as Correspondence[]}
              correspondencesById={correspondencesById as CorrespondencesMap}
              earliestSentAtDate={earliestSentAtDate as string}
              responseCompletion={responseCompletion as number}
            >
              {children}
            </CorrespondenceProvider>
          </DesktopMenuProvider>
        </AuthProvider>
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${NEXT_PUBLIC_GA_TRACKING_ID}`}
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${NEXT_PUBLIC_GA_TRACKING_ID}');
              `}
          </Script>
        </>
      </body>
    </html>
  );
}
