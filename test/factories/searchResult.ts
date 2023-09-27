import { faker } from '@faker-js/faker';
import { SearchEngine, SearchResult } from '@prisma/client';

export const searchResultFactory = (): SearchResult => ({
  id: faker.string.uuid(),
  userId: faker.number.int(),
  keyword: faker.word.words(1),
  createdAt: new Date(),
  updatedAt: new Date(),
  html: null,
  totalLinksCount: null,
  searchEngine: SearchEngine.google,
  adWordsCount: null,
  nonAdLinksCount: null,
  adWordTopUrls: [],
  adWordsTopCount: null,
  nonAdUrls: [],
  status: 1,
});
