import './globals.css';
import Script from 'next/script';
import { AuthProvider } from '@contexts/AuthProvider';

import { CorrespondenceProvider } from '@contexts/CorrespondenceProvider';
import { DesktopMenuProvider } from '@contexts/DesktopMenuProvider';
import { Merriweather } from 'next/font/google';

const merriweather = Merriweather({
  display: 'swap',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-merriweather',
  weight: ['400'],
});

export const metadata = {
  alternates: {
    canonical: 'https://www.onehundredletters.com',
  },
  description: 
    '100 letters written to 100 individuals over the course of one year. Each letter is a personal reflection, handwritten and sent with intention and love.',
  metadataBase: new URL('https://www.onehundredletters.com'),
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
    url: 'https://www.onehundredletters.com',
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

interface Props {
  children: React.ReactNode;
}

const RootLayout: React.FC<Props> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="canonical" href="https://www.onehundredletters.com/" />
        <meta name="description" content="100 letters, 100 people, 1 year." />
        <meta property="og:title" content="100 Letters Project" />
        <meta property="og:image" content="/og-image.png" />
      </head>
      <body className={`${merriweather.variable} antialiased`}>
        <AuthProvider>
          <DesktopMenuProvider>
            <CorrespondenceProvider>{children}</CorrespondenceProvider>
          </DesktopMenuProvider>
        </AuthProvider>
        <>
          <Script id="gtag-load" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              (window.requestIdleCallback || function(cb) { setTimeout(cb, 0); })(() => {
                const script = document.createElement('script');
                script.src = 'https://www.googletagmanager.com/gtag/js?id=${NEXT_PUBLIC_GA_TRACKING_ID}';
                script.async = true;
                document.head.appendChild(script);

                gtag('js', new Date());
                gtag('config', '${NEXT_PUBLIC_GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              });
            `}
          </Script>
        </>
      </body>
    </html>
  );
};

export default RootLayout;
