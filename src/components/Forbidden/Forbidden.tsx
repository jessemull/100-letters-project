'use client';

import React from 'react';
import Link from 'next/link';
import { Skull } from 'lucide-react';

const Forbidden = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 text-center font-merriweather">
      <div className="max-w-xl w-full">
        <div className="text-black mb-6 flex justify-center">
          <Skull className="w-[20vw] h-[20vw] max-w-[160px] max-h-[160px]" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-6">
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

export default Forbidden;
