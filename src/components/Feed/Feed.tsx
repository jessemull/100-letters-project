'use client';

import React, { useEffect, useState } from 'react';
import { Search, Splash } from '@components/Feed';
import { SearchIcon, X } from 'lucide-react';
import { TextInput } from '@components/Form';
import { useSearch } from '@hooks/useSearch';
import { CorrespondenceCard } from '@ts-types/correspondence';

const Feed = () => {
  const [term, setTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const { error, results } = useSearch({ type: 'all', term });

  const handleTermChange = (value: string) => {
    setTerm(value);
    if (value && !showSearch) {
      window.history.pushState({ search: true }, '');
      setShowSearch(true);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setShowSearch(false);
      setTerm('');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="relative flex flex-col items-center text-white min-h-screen py-4 md:py-8 lg:py-12 px-4 font-merriweather w-full">
      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center space-y-8 md:space-y-12">
        <TextInput
          id="search-all"
          IconEnd={term ? X : undefined}
          IconStart={SearchIcon}
          ariaLabel="Search for letters and people"
          iconEndLabel="Clear search"
          onChange={({ target: { value } }) => handleTermChange(value)}
          onIconEndClick={() => setTerm('')}
          placeholder="Search for letters and people..."
          type="text"
          value={term}
        />
        {showSearch ? (
          <Search
            error={error}
            term={term}
            results={results as CorrespondenceCard[]}
          />
        ) : (
          <Splash />
        )}
      </div>
    </div>
  );
};

export default Feed;
