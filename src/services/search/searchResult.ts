import { SearchEngine } from '@prisma/client';

import request from '@/lib/searchRequest';

import SearchError from './error';

const googleRequestUrl = 'https://www.google.com';
const bingRequestUrl = 'https://www.bing.com';

export const searchResultGoogle = async (keyword: string) => {
  try {
    const { data } = await request.get(`${googleRequestUrl}/search?q=${keyword}&hl=en`);

    return data;
  } catch (err) {
    throw new SearchError({
      message: `Unable to search result from google search for word ${keyword}`,
    });
  }
};

export const searchResultBing = async (keyword: string) => {
  try {
    const { data } = await request.get(`${bingRequestUrl}/search?q=${keyword}&setlang=en`);

    return data;
  } catch (err) {
    throw new SearchError({
      message: `Unable to search result from bing search for word ${keyword}`,
    });
  }
};

export const searchResult = async (keyword: string, searchEngine: SearchEngine) => {
  switch (searchEngine) {
    case SearchEngine.google:
      return searchResultGoogle(keyword);
    case SearchEngine.bing:
      return searchResultBing(keyword);

    default:
      throw new SearchError({ message: `Unsupported search engine: ${searchEngine}` });
  }
};
