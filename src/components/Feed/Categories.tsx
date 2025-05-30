'use client';

import React from 'react';
import clsx from 'clsx';
import { Image } from '@components/Admin/Letters';
import { categories } from '@constants/feed';
import { useRouter } from 'next/navigation';

interface Props {
  desktopCols?: 6 | 4 | 3;
}

const Categories: React.FC<Props> = ({ desktopCols = 6 }) => {
  const router = useRouter();

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
    router.push(`/category?category=${category}`);
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
              alt={cat.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority={index === 0}
              loading={index === 0 ? 'eager' : undefined}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-lg font-semibold font-merriweather">
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
