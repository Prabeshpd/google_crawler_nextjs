/**
 * @jest-environment node
 */
import dbClient from '@/config/database';
import BaseQuery from '@/queries/BaseQuery';
import { createManySearchResults } from '@/repositories/searchResult';
import { createUser } from '@/repositories/user';
import { searchResultFactory } from '@test/factories/searchResult';
import { userFactory } from '@test/factories/user';

describe('SearchResultQuery', () => {
  describe('given pagination is enabled', () => {
    it('returns valid paginated data', async () => {
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
      const paginationQuery = new BaseQuery({
        paginationParams: { currentPage: 1, maxRows: 2 },
        databaseModel: dbClient.searchResult,
      });

      const data = await paginationQuery.query();

      expect(data.length).toEqual(2);
    });
  });

  describe('given pagination is DISABLED', () => {
    it('returns all data without pagination', async () => {
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
      const paginationQuery = new BaseQuery({
        isPaginated: false,
        databaseModel: dbClient.searchResult,
      });

      const data = await paginationQuery.query();

      expect(data.length).toEqual(3);
    });
  });
});
