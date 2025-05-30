'use client';

import React, { useEffect, useState } from 'react';
import { Search, Splash } from '@components/Feed';
import { SearchAllItem } from '@ts-types/search';
import { TextInput } from '@components/Form';
import { useSearch } from '@hooks/useSearch';
import { SearchIcon, X } from 'lucide-react';

const Feed = () => {
  const [term, setTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const results = useSearch({ type: 'all', term }) as SearchAllItem[];

  useEffect(() => {
    if (term && !showSearch) {
      window.history.pushState({ search: true }, '');
      setShowSearch(true);
    }
  }, [term, showSearch]);

  useEffect(() => {
    const handlePopState = () => {
      setShowSearch(false);
      setTerm('');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
        {showSearch ? <Search term={term} results={results} /> : <Splash />}
      </div>
    </div>
  );
};

export default Feed;
