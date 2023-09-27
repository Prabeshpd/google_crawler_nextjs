import * as fs from 'fs';

import dbClient from '@/config/database';
import { createUser as create } from '@/services/user/user';
import { SearchEngine } from '@prisma/client';
import { searchResultFactory } from '@test/factories/searchResult';
import { userFactory } from '@test/factories/user';

interface UserPayload {
  id: number;
  email: string;
  password: string;
}

interface SearchResultPayload {
  userId: number;
  keyword: string;
  adWordTopUrls?: string[];
  nonAdUrls?: string[];
}

interface SearchResultScrapedPayload {
  searchResult: SearchResultPayload;
  validHtml: true;
  searchEngine: SearchEngine;
}

export const createUser = async (user: UserPayload) => {
  const userPayload = { ...userFactory(), ...user };

  return create(userPayload);
};

export const createSearchResults = async (searchResults: SearchResultPayload[]) => {
  const searchResultPayload = searchResults.map((searchResult) => ({
    ...searchResultFactory(),
    ...searchResult,
  }));

  return dbClient.searchResult.createMany({ data: searchResultPayload });
};

export const createScrapedSearchResult = async (searchResultGoogle: SearchResultScrapedPayload) => {
  const { searchResult, validHtml, searchEngine } = searchResultGoogle;
  let html = '';
  if (validHtml && searchEngine === SearchEngine.google) {
    html = await fs.readFileSync('./test/fixtures/google-search-result.html', {
      encoding: 'utf-8',
    });
  }

  if (validHtml && searchEngine === SearchEngine.bing) {
    html = await fs.readFileSync('./test/fixtures/bing-search-result.html', {
      encoding: 'utf-8',
    });
  }

  const searchResultPayload = {
    ...searchResultFactory,
    ...searchResult,
    html,
    searchEngine,
  };

  return dbClient.searchResult.create({ data: searchResultPayload });
};
