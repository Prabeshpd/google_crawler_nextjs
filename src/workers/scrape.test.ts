/**
 * @jest-environment node
 */
import { SearchEngine } from '@prisma/client';
import { Job } from 'bullmq';

import dbClient from '@/config/database';
import { SearchResultStatus } from '@/constants/enum';
import { searchResultFactory } from '@test/factories/searchResult';
import { userFactory } from '@test/factories/user';

import { scrape } from './scraper';

describe('Scrape:', () => {
  describe('given keyword for user', () => {
    describe('given search engine is "google"', () => {
      it('updates the search result record successfully with scraped data', async () => {
        const searchResult = searchResultFactory();
        const user = userFactory();
        const mockJob: Partial<Job> = {
          data: {
            keyword: searchResult.keyword,
            userId: user.id,
            id: searchResult.id,
            searchEngine: SearchEngine.google,
          },
        };
        const searchResultPayload = { ...searchResult, userId: user.id };
        await dbClient.user.create({ data: user });
        await dbClient.searchResult.create({ data: searchResultPayload });

        await scrape(mockJob as Job);

        const data = await dbClient.searchResult.findUnique({
          where: { id: searchResult.id },
        });

        expect(data?.keyword).toEqual(searchResult.keyword);
        expect(data?.html).not.toBeNull();
        expect(data?.status).toEqual(SearchResultStatus.SUCCESS);
      });
    });

    describe('given search engine is "bing"', () => {
      it('updates the search result record successfully with scraped data', async () => {
        const searchResult = searchResultFactory();
        const user = userFactory();
        const mockJob: Partial<Job> = {
          data: {
            keyword: searchResult.keyword,
            userId: user.id,
            id: searchResult.id,
            searchEngine: SearchEngine.google,
          },
        };
        const searchResultPayload = { ...searchResult, userId: user.id };
        await dbClient.user.create({ data: user });
        await dbClient.searchResult.create({ data: searchResultPayload });

        await scrape(mockJob as Job);

        const data = await dbClient.searchResult.findUnique({
          where: { id: searchResult.id },
        });

        expect(data?.keyword).toEqual(searchResult.keyword);
        expect(data?.html).not.toBeNull();
        expect(data?.status).toEqual(SearchResultStatus.SUCCESS);
      });
    });
  });
});
