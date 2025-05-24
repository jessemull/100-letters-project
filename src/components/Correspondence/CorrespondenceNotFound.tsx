import React from 'react';
import { Categories } from '@components/Feed';
import { useRouter } from 'next/navigation';

const CorrespondenceNotFound = () => {
  const router = useRouter();

  const goHome = () => {
    router.push('/');
  };

  return (
    <div className="max-w-4xl space-y-[125px] w-full h-full flex font-merriweather items-center justify-center flex-col mx-auto text-white">
      <div className="text-center space-y-6">
        <h2 className="text-3xl font-bold">Correspondence not found.</h2>
        <button
          className="bg-white/10 hover:bg-white/20 border rounded-3xl border-white pr-4 pl-4 pt-2 pb-2"
          id="go-home"
          data-testid="go-home"
          onClick={goHome}
        >
          Go Home
        </button>
      </div>
      <Categories desktopCols={4} />
    </div>
  );
};

export default CorrespondenceNotFound;
