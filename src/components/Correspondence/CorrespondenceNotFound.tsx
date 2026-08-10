import React from 'react';
import Link from 'next/link';
import { Categories } from '@components/Feed';

interface Props {
  title?: string;
  description?: string;
}

const CorrespondenceNotFound = ({
  title = 'Correspondence not found.',
  description,
}: Props) => {
  return (
    <div className="max-w-4xl space-y-[125px] w-full h-full flex font-merriweather items-center justify-center flex-col mx-auto text-white md:py-12">
      <div className="text-center space-y-6">
        <h2 className="text-3xl font-bold">{title}</h2>
        {description ? (
          <p className="text-white/80 text-base">{description}</p>
        ) : null}
        <Link
          href="/"
          className="inline-block bg-white/10 hover:bg-white/20 border rounded-3xl border-white pr-4 pl-4 pt-2 pb-2 cursor-pointer"
          id="go-home"
          data-testid="go-home"
        >
          Go Home
        </Link>
      </div>
      <Categories desktopCols={4} />
    </div>
  );
};

export default CorrespondenceNotFound;
