'use client';

import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { MailX } from 'lucide-react';

interface Props {
  error: Error & { digest?: string };
}

const GlobalError: React.FC<Props> = ({ error }) => {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-gray-100 px-4 text-center font-merriweather">
        <div className="flex flex-col items-center max-w-xl w-full">
          <div className="text-black mb-6 flex justify-center">
            <MailX
              stroke="#CD1C18"
              strokeWidth="1"
              className="w-[20vw] h-[20vw] max-w-[160px] max-h-[160px]"
            />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-black mb-4">
            Something Went Wrong!
          </h1>
          <p className="text-md md:text-lg font-bold text-black mb-6">
            We’ve logged the issue. Please refresh to try again.
          </p>
          <Link
            href="/"
            className="text-gray-900 text-2xl hover:underline transition-colors"
          >
            Home
          </Link>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
