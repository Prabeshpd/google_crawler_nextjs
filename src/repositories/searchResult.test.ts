/**
 * @jest-environment node
 */
import dbClient from '@/config/database';
import { SearchResultStatus } from '@/constants/enum';
import { searchResultFactory } from '@test/factories/searchResult';
import { userFactory } from '@test/factories/user';

import {
  createManySearchResults,
  findById,
  listSearchResultByStatus,
  updateSearchResult,
} from './searchResult';
import { createUser } from './user';

describe('createManySearchResults', () => {
  describe('given valid params', () => {
    it('creates multiple search results', async () => {
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
      ];

      const data = await createManySearchResults(searchResultPayload);

      expect(data.count).toEqual(2);
    });
  });
});

describe('findById', () => {
  describe('given search result exists', () => {
    it('returns search result', async () => {
      const user = userFactory();
      const searchResult = searchResultFactory();
      const createdUser = await createUser(user);
      const searchResultPayload = [
        {
          ...searchResult,
          userId: createdUser.id,
          keyword: 'node',
        },
      ];
      await createManySearchResults(searchResultPayload);

      const [data] = await findById(searchResult.id, createdUser.id);

      expect(data).not.toBeNull();
      expect(data.id).toEqual(searchResult.id);
    });
  });

  describe('given search result does not exists', () => {
    it('returns empty array', async () => {
      const searchResult = searchResultFactory();
      const data = await findById(searchResult.id, 1);

      expect(data.length).toEqual(0);
      expect(data).toEqual([]);
    });
  });
});

describe('listSearchResultByStatus', () => {
  describe('given search results exists', () => {
    it('returns search result', async () => {
      const user = userFactory();
      const createdUser = await createUser(user);
      const searchResultPayload = [
        {
          ...searchResultFactory(),
          userId: createdUser.id,
          status: SearchResultStatus.PENDING,
        },
        {
          ...searchResultFactory(),
          userId: createdUser.id,
          status: SearchResultStatus.SUCCESS,
        },
      ];
      await createManySearchResults(searchResultPayload);

      const data = await listSearchResultByStatus(createdUser.id, SearchResultStatus.PENDING);

      expect(data.length).toEqual(1);
      expect(data[0].status).toEqual(SearchResultStatus.PENDING);
    });
  });

  describe('given search results not exists', () => {
    it('returns null', async () => {
      const user = userFactory();
      const createdUser = await createUser(user);
      const searchResultPayload = [
        {
          ...searchResultFactory(),
          userId: createdUser.id,
          status: SearchResultStatus.PENDING,
        },
      ];
      await createManySearchResults(searchResultPayload);

      const data = await listSearchResultByStatus(createdUser.id, SearchResultStatus.FAILED);

      expect(data.length).toEqual(0);
    });
  });
});

describe('updateSearchResult', () => {
  describe('given valid params', () => {
    it('updates the search result', async () => {
      const user = userFactory();
      const searchResult = searchResultFactory();
      const createdUser = await createUser(user);
      const searchResultPayload = [
        {
          ...searchResult,
          userId: createdUser.id,
          keyword: 'node',
          status: SearchResultStatus.PENDING,
        },
      ];
      await createManySearchResults(searchResultPayload);
      const args = {
        where: {
          userId: createdUser.id,
          id: searchResult.id,
        },
        data: {
          status: SearchResultStatus.SUCCESS,
          keyword: 'nothing',
        },
      };

      await updateSearchResult(args);

      const data = await dbClient.searchResult.findUnique({ where: { id: searchResult.id } });

      expect(data?.status).toEqual(SearchResultStatus.SUCCESS);
      expect(data?.keyword).toEqual('nothing');
    });
  });
});
