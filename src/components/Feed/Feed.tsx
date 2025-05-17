'use client';

import React, { useState } from 'react';
import Splash from './Splash';
import { SearchAllItem } from '@ts-types/search';
import { TextInput } from '@components/Form';
import { useSearch } from '@hooks/useSearch';

const Feed = () => {
  const [term, setTerm] = useState('');
  const results = useSearch({ type: 'all', term }) as SearchAllItem[];
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
        <Splash />
      </div>
    </div>
  );
};

export default Feed;
