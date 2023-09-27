/**
 * @jest-environment node
 */
import { SearchScope, SearchType } from '@/constants/enum';
import SearchResultQuery from '@/queries/SearchResultQuery';
import { createManySearchResults } from '@/repositories/searchResult';
import { createUser } from '@/repositories/user';
import { searchResultFactory } from '@test/factories/searchResult';
import { userFactory } from '@test/factories/user';

describe('SearchResultQuery', () => {
  describe('given individual scope params', () => {
    describe('given keyword scope', () => {
      describe('given search type is "pattern"', () => {
        it('returns valid data', async () => {
          const user = userFactory();
          const createdUser = await createUser(user);
          const searchResultPayload = [
            {
              ...searchResultFactory(),
              userId: createdUser.id,
              keyword: 'node',
            },
            {
              ...searchResultFactory(),
              userId: createdUser.id,
              keyword: 'noted',
            },
            {
              ...searchResultFactory(),
              userId: createdUser.id,
              keyword: 'litter',
            },
          ];
          await createManySearchResults(searchResultPayload);
          const searchResultQuery = new SearchResultQuery(createdUser.id, {
            paginationParams: { currentPage: 1, maxRows: 10 },
            filters: { queryInput: 'no', scope: SearchScope.KEYWORD },
          });

          const data = await searchResultQuery.query();

          expect(data.length).toEqual(2);
        });
      });

      describe('given search type is "exact"', () => {
        it('returns valid data', async () => {
          const user = userFactory();
          const createdUser = await createUser(user);
          const searchResultPayload = [
            {
              ...searchResultFactory(),
              userId: createdUser.id,
              keyword: 'node',
            },
            {
              ...searchResultFactory(),
              userId: createdUser.id,
              keyword: 'noted',
            },
            {
              ...searchResultFactory(),
              userId: createdUser.id,
              keyword: 'litter',
            },
          ];
          await createManySearchResults(searchResultPayload);
          const searchResultQuery = new SearchResultQuery(createdUser.id, {
            paginationParams: { currentPage: 1, maxRows: 10 },
            filters: { queryInput: 'node', scope: SearchScope.KEYWORD },
          });

          const data = await searchResultQuery.query();

          expect(data.length).toEqual(1);
        });
      });
    });

    describe('given url scope', () => {
      describe('given search type is "exact"', () => {
        it('returns filtered data', async () => {
          const user = userFactory();
          const createdUser = await createUser(user);
          const searchResultPayload = [
            {
              ...searchResultFactory(),
              userId: createdUser.id,
              adWordTopUrls: ['https://google.com', 'https://youtube.com'],
            },
            {
              ...searchResultFactory(),
              userId: createdUser.id,
              nonAdUrls: ['https://google.com', 'https://youtube.com'],
            },
            {
              ...searchResultFactory(),
              userId: createdUser.id,
              nonAdUrls: ['https://google.com'],
            },
          ];
          await createManySearchResults(searchResultPayload);
          const searchResultQuery = new SearchResultQuery(createdUser.id, {
            paginationParams: { currentPage: 1, maxRows: 10 },
            filters: {
              queryInput: 'https://youtube.com',
              type: SearchType.EXACT,
              scope: SearchScope.URL,
            },
          });

          const data = await searchResultQuery.query();

          expect(data.length).toEqual(2);
        });
      });

      describe('given search type is "pattern"', () => {
        it('returns valid data', async () => {
          const user = userFactory();
          const createdUser = await createUser(user);

          const searchResultPayload = [
            {
              ...searchResultFactory(),
              userId: createdUser.id,
              adWordTopUrls: ['https://google.com/nimble', 'https://youtube.com'],
            },
            {
              ...searchResultFactory(),
              userId: createdUser.id,
              nonAdUrls: ['https://google.com', 'https://youtube.com'],
            },
            {
              ...searchResultFactory(),
              userId: createdUser.id,
              nonAdUrls: ['https://google.com'],
            },
          ];
          await createManySearchResults(searchResultPayload);
          const searchResultQuery = new SearchResultQuery(createdUser.id, {
            paginationParams: { currentPage: 1, maxRows: 10 },
            filters: {
              queryInput: 'nimble',
              type: SearchType.PATTERN,
              scope: SearchScope.URL,
            },
          });

          const data = await searchResultQuery.query();

          expect(data.length).toEqual(1);
        });
      });

      describe('given search type is "partial"', () => {
        it('returns valid data', async () => {
          const user = userFactory();
          const createdUser = await createUser(user);
          const searchResultPayload = [
            {
              ...searchResultFactory(),
              userId: createdUser.id,
              adWordTopUrls: ['www.google.com/nimble/compass', 'www.youtube.com'],
            },
            {
              ...searchResultFactory(),
              userId: createdUser.id,
              nonAdUrls: ['www.google.com', 'www.youtube.com'],
            },
            {
              ...searchResultFactory(),
              userId: createdUser.id,
              nonAdUrls: ['www.google.com'],
            },
          ];
          await createManySearchResults(searchResultPayload);
          const searchResultQuery = new SearchResultQuery(createdUser.id, {
            paginationParams: { currentPage: 1, maxRows: 10 },
            filters: {
              queryInput: '/',
              type: SearchType.PARTIAL,
              scope: SearchScope.URL,
            },
          });

          const data = await searchResultQuery.query();

          expect(data.length).toEqual(1);
        });
      });
    });

    describe('given there is NO filter', () => {
      it('returns valid data', async () => {
        const user = userFactory();
        const createdUser = await createUser(user);
        const searchResultPayload = [
          {
            ...searchResultFactory(),
            userId: createdUser.id,
          },
          {
            ...searchResultFactory(),
            userId: createdUser.id,
          },
          {
            ...searchResultFactory(),
            userId: createdUser.id,
          },
        ];
        await createManySearchResults(searchResultPayload);
        const searchResultQuery = new SearchResultQuery(createdUser.id, {
          paginationParams: { currentPage: 1, maxRows: 10 },
        });

        const data = await searchResultQuery.query();

        expect(data.length).toEqual(3);
      });
    });
  });

  describe('given both scope params', () => {
    describe('given user has search results', () => {
      describe('given search type is "exact"', () => {
        it('returns valid data', async () => {
          const user = userFactory();
          const createdUser = await createUser(user);
          const searchResultPayload = [
            {
              ...searchResultFactory(),
              userId: createdUser.id,
              keyword: 'node',
              adWordTopUrls: ['https://google.com/nimble', 'https://youtube.com'],
            },
            {
              ...searchResultFactory(),
              userId: createdUser.id,
              keyword: 'noted',
              nonAdUrls: ['https://google.com', 'https://youtube.com'],
            },
            {
              ...searchResultFactory(),
              userId: createdUser.id,
              keyword: 'litter',
              nonAdUrls: ['https://google.com'],
            },
          ];
          await createManySearchResults(searchResultPayload);
          const searchResultQuery = new SearchResultQuery(createdUser.id, {
            paginationParams: { currentPage: 1, maxRows: 10 },
            filters: {
              queryInput: 'https://youtube.com',
              type: SearchType.EXACT,
              scope: SearchScope.ALL,
            },
          });

          const data = await searchResultQuery.query();

          expect(data.length).toEqual(0);
        });
      });

      describe('given search type is "pattern"', () => {
        it('returns valid data', async () => {
          const user = userFactory();
          const createdUser = await createUser(user);
          const searchResultPayload = [
            {
              ...searchResultFactory(),
              userId: createdUser.id,
              keyword: 'nimble',
              adWordTopUrls: ['https://google.com/nimble', 'https://youtube.com'],
            },
            {
              ...searchResultFactory(),
              userId: createdUser.id,
              keyword: 'noted',
              nonAdUrls: ['https://google.com', 'https://youtube.com'],
            },
            {
              ...searchResultFactory(),
              userId: createdUser.id,
              keyword: 'litter',
              nonAdUrls: ['https://google.com'],
            },
          ];
          await createManySearchResults(searchResultPayload);
          const searchResultQuery = new SearchResultQuery(createdUser.id, {
            paginationParams: { currentPage: 1, maxRows: 10 },
            filters: {
              queryInput: 'nimble',
              type: SearchType.PATTERN,
            },
          });

          const data = await searchResultQuery.query();

          expect(data.length).toEqual(1);
        });
      });

      describe('given search type is "partial"', () => {
        it('returns valid data', async () => {
          const user = userFactory();
          const createdUser = await createUser(user);
          const searchResultPayload = [
            {
              ...searchResultFactory(),
              userId: createdUser.id,
              keyword: 'no/de',
              adWordTopUrls: ['www.google.com/nimble/compass', 'www.youtube.com'],
            },
            {
              ...searchResultFactory(),
              userId: createdUser.id,
              keyword: 'noted',
              nonAdUrls: ['www.google.com', 'www.youtube.com'],
            },
            {
              ...searchResultFactory(),
              userId: createdUser.id,
              keyword: 'litter',
              nonAdUrls: ['www.google.com'],
            },
          ];
          await createManySearchResults(searchResultPayload);
          const searchResultQuery = new SearchResultQuery(createdUser.id, {
            paginationParams: { currentPage: 1, maxRows: 10 },
            filters: {
              queryInput: '/',
              type: SearchType.PATTERN,
              scope: SearchScope.ALL,
            },
          });

          const data = await searchResultQuery.query();

          expect(data.length).toEqual(1);
        });
      });
    });

    describe('given user has NO search results', () => {
      it('returns empty array', async () => {
        const searchResultQuery = new SearchResultQuery(2, {
          paginationParams: { currentPage: 1, maxRows: 10 },
          filters: {
            queryInput: 'https://youtube.com',
            type: SearchType.EXACT,
            scope: SearchScope.ALL,
          },
        });

        const data = await searchResultQuery.query();

        expect(data.length).toEqual(0);
        expect(data).toEqual([]);
      });
    });
  });
});
