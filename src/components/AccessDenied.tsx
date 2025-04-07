'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

const AccessDenied = () => {
  return (
    <div
      className="flex items-center justify-center bg-gray-100 px-4 text-center font-merriweather"
      style={{
        height: 'calc(100vh - 56px - 36px)',
      }}
    >
      <div className="max-w-xl w-full">
        <div className="text-black mb-6 flex justify-center">
          <AlertTriangle className="w-[20vw] h-[20vw] max-w-[160px] max-h-[160px]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
          Access Denied
        </h1>
        <p className="text-lg md:text-xl text-black font-bold mb-6">
          You do not have permission to view this page. If you believe this is
          an error, please contact the site administrator.
        </p>
        <Link
          href="/"
          className="text-gray-900 text-2xl hover:underline transition-colors"
        >
          Home
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;
