'use client';

import { Progress } from '@components/Form';
import dynamic from 'next/dynamic';

const LazyRecaptcha = dynamic(() => import('react-google-recaptcha'), {
  ssr: false,
  loading: () => (
    <div className="h-[78px] flex items-center justify-center">
      <Progress color="white" size={16} />
    </div>
  ),
});

export default LazyRecaptcha;
