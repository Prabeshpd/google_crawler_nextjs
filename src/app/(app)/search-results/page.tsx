'use client';

import * as React from 'react';

import SearchResultList from '@/components/SearchResultList/SearchResultList';

export default function SearchResult() {
  return (
    <div className="search-result">
      <h2>All Search Results</h2>
      <SearchResultList />
    </div>
  );
}
