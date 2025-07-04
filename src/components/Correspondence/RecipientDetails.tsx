import React, { useState, useEffect } from 'react';
import { CorrespondenceCard } from '@ts-types/correspondence';
import { categoryLabelMap } from '@constants/correspondence';

interface Props {
  correspondence: CorrespondenceCard;
  dynamicHeight?: number;
}

const RecipientDetails: React.FC<Props> = ({
  correspondence,
  dynamicHeight,
}) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const containerStyle =
    isDesktop && dynamicHeight && dynamicHeight > 0
      ? {
          height: `${dynamicHeight}px`,
          maxHeight: `${dynamicHeight}px`,
          overflow: 'hidden',
        }
      : {};

  return (
    <div
      className="space-y-4 md:bg-white/20 md:p-4 lg:p-5 md:rounded-2xl md:shadow-xl md:border md:border-white/10 md:backdrop-blur-md md:flex md:flex-col"
      style={containerStyle}
    >
      <div className="md:flex-shrink-0">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-2xl font-bold text-white">
            {correspondence?.recipient?.firstName}{' '}
            {correspondence?.recipient?.lastName}
          </h2>
          <span className="border border-white rounded-md bg-white/10 px-2 py-0.5 md:px-3 md:py-1 text-sm md:text-base font-bold uppercase tracking-wider text-white shadow-sm">
            {categoryLabelMap[correspondence?.reason?.category] || 'Other'}
          </span>
        </div>
        <div className="space-y-1">
          <p className="text-white/70 italic text-sm leading-tight">
            {correspondence?.recipient?.occupation}
          </p>
          <p className="text-white/60 text-sm leading-tight">
            {correspondence?.recipient?.organization}
          </p>
        </div>
      </div>
      <div
        className={`${isDesktop && dynamicHeight ? 'md:flex-1 md:min-h-0 md:overflow-y-auto md:pr-2' : ''}`}
      >
        <p className="italic text-white/90 mt-4 md:mt-0 whitespace-pre-line">
          {correspondence?.recipient?.description}
        </p>
      </div>
    </div>
  );
};

export default RecipientDetails;
