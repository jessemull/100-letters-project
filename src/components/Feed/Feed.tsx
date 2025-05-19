'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Search, Splash } from '@components/Feed';
import { SearchAllItem } from '@ts-types/search';
import { TextInput } from '@components/Form';
import { useSearch } from '@hooks/useSearch';
import { X } from 'lucide-react';

const Feed = () => {
  const [term, setTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const hasPushedHistory = useRef(false);

  const results = useSearch({ type: 'all', term }) as SearchAllItem[];

  const updateURLSearchParam = (value: string | null) => {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set('search', value);
      const method = hasPushedHistory.current ? 'replaceState' : 'pushState';
      window.history[method]({ search: true }, '', url.toString());
      hasPushedHistory.current = true;
    } else {
      url.searchParams.delete('search');
      window.history.replaceState({}, '', url.toString());
      hasPushedHistory.current = false;
    }
  };

  const syncWithURL = () => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('search');
    if (query) {
      setTerm(query);
      setShowSearch(true);
      hasPushedHistory.current = true;
    } else {
      setTerm('');
      hasPushedHistory.current = false;
    }
  };

  useEffect(() => {
    syncWithURL();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentQuery = params.get('search');
    if (term && term !== currentQuery) {
      updateURLSearchParam(term);
      setShowSearch(true);
    } else if (!term && currentQuery) {
      updateURLSearchParam(null);
    }
  }, [term]);

  useEffect(() => {
    const handlePopState = () => {
      syncWithURL();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="relative flex flex-col items-center text-white min-h-screen py-4 lg:py-12 px-4 font-merriweather w-full">
      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center space-y-12">
        <TextInput
          id="search-all"
          IconEnd={term ? X : undefined}
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
