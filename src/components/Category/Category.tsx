'use client';

import React, { useEffect, useState } from 'react';
import { Search } from '@components/Feed';
import { SearchIcon, X } from 'lucide-react';
import { TextInput } from '@components/Form';
import { titleCase } from '@util/feed';
import { useSearch } from '@hooks/useSearch';
import { useSearchParams, useRouter } from 'next/navigation';
import { CorrespondenceCard } from '@ts-types/correspondence';

const Category = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');

  const [term, setTerm] = useState('');
  const [category, setCategory] = useState<string | null>(initialCategory);

  const results = useSearch({
    type: 'all',
    term: category && !term ? category : term,
  }) as CorrespondenceCard[];

  const showCategoryHeader = category && !term;

  useEffect(() => {
    if (term && category) {
      window.history.pushState({ category }, '', `?`);
      setCategory(null);
    }
  }, [term, category]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const restoredCategory = params.get('category');
      setTerm('');
      setCategory(restoredCategory);
      router.replace(window.location.pathname + window.location.search, {
        scroll: false,
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [router]);

  return (
    <div className="relative flex flex-col items-center text-white min-h-screen py-4 lg:py-12 px-4 font-merriweather w-full">
      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center space-y-8 md:space-y-12">
        <TextInput
          id="search-all"
          IconEnd={term ? X : undefined}
          IconStart={SearchIcon}
          onChange={({ target: { value } }) => setTerm(value)}
          onIconEndClick={() => setTerm('')}
          placeholder="Search for letters and people..."
          type="text"
          value={term}
        />
        {showCategoryHeader && (
          <h2 className="text-2xl md:text-3xl font-semibold text-center">
            Explore {titleCase(category)} Letters
          </h2>
        )}
        <Search term={category || term} results={results} />
      </div>
    </div>
  );
};

export default Category;
