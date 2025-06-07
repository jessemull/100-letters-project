'use client';

import React from 'react';
import clsx from 'clsx';
import { Image } from '@components/Image';
import { categories } from '@constants/feed';

interface Props {
  desktopCols?: 6 | 4 | 3;
}

const Categories: React.FC<Props> = ({ desktopCols = 6 }) => {
  const gridColsClass = clsx(
    'grid',
    'grid-cols-2',
    'md:grid-cols-4',
    {
      'lg:grid-cols-3': desktopCols === 3,
      'lg:grid-cols-4': desktopCols === 4,
      'lg:grid-cols-6': desktopCols === 6,
    },
    'gap-4',
  );

  const onClick = (category: string) => {
    const newUrl = `/category?category=${encodeURIComponent(category)}`;
    window.location.href = newUrl;
  };

  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-bold">Browse by Category</h2>
      <div className={gridColsClass}>
        {categories.map((cat, index) => (
          <div
            key={index}
            role="button"
            tabIndex={0}
            aria-label={`View letters in category ${cat.name}`}
            className="relative rounded-xl overflow-hidden group cursor-pointer h-32"
            onClick={() => onClick(cat.name)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(cat.name);
              }
            }}
          >
            <Image
              src={cat.imageUrl}
              alt=""
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority={index === 0}
              loading={index === 0 ? 'eager' : undefined}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center px-2">
              <span className="text-white text-lg font-semibold font-merriweather text-ellipsis truncate overflow-hidden whitespace-nowrap">
                {cat.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
