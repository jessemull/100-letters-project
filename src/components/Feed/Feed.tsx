'use client';

import React, { useEffect, useState, useRef } from 'react';
import Search from './Search';
import Splash from './Splash';
import { SearchAllItem } from '@ts-types/search';
import { TextInput } from '@components/Form';
import { useSearch } from '@hooks/useSearch';

const Feed = () => {
  const [term, setTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const pushedHistoryRef = useRef(false);

  const results = useSearch({ type: 'all', term }) as SearchAllItem[];

  // Once the user has set search terms they can hit the back button to view the splash page component again.

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('search');
    if (query) {
      setTerm(query);
      setShowSearch(true);
      if (!window.history.state) {
        window.history.replaceState({ search: true }, '', window.location.href);
      }
      pushedHistoryRef.current = true;
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const currentQuery = url.searchParams.get('search');

    if (term && term !== currentQuery) {
      url.searchParams.set('search', term);
      if (!pushedHistoryRef.current) {
        window.history.pushState({ search: true }, '', url.toString());
        pushedHistoryRef.current = true;
      } else {
        window.history.replaceState({ search: true }, '', url.toString());
      }
      setShowSearch(true);
    } else if (!term && currentQuery) {
      url.searchParams.delete('search');
      window.history.replaceState({}, '', url.toString());
      pushedHistoryRef.current = false;
    }
  }, [term]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const params = new URLSearchParams(window.location.search);
      const query = params.get('search');
      if (query) {
        setTerm(query);
        setShowSearch(true);
        pushedHistoryRef.current = true;
      } else {
        setTerm('');
        setShowSearch(false);
        pushedHistoryRef.current = false;
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="relative flex flex-col items-center text-white min-h-screen py-4 lg:py-12 px-4 font-merriweather w-full">
      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center space-y-12">
        <TextInput
          id="search-all"
          onChange={({ target: { value } }) => setTerm(value)}
          placeholder="Search for letters and people..."
          type="text"
          value={term}
        />
        {hydrated &&
          (showSearch ? <Search results={term ? results : []} /> : <Splash />)}
      </div>
    </div>
  );
};

export default Feed;
