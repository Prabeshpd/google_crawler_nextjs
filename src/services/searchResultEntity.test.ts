/**
 * @jest-environment node
 */
import httpStatusCode from 'http-status-codes';

import { createManySearchResults } from '@/repositories/searchResult';
import { createUser } from '@/repositories/user';
import { findById } from '@/services/searchResultEntity';
import { searchResultFactory } from '@test/factories/searchResult';
import { userFactory } from '@test/factories/user';

describe('findById:', () => {
  describe('given valid id', () => {
    describe('given user has search result', () => {
      it('returns valid data', async () => {
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

        const data = await findById(searchResult.id, createdUser.id);

        expect(data.userId).toEqual(createdUser.id);
        expect(data.keyword).toEqual('node');
      });

      describe('given user has no given search result', () => {
        it('rejects with not found error', async () => {
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

          await expect(findById(searchResult.id, 4)).rejects.toHaveProperty(
            'code',
            httpStatusCode.NOT_FOUND
          );
        });
      });
    });
  });

  describe('given invalid id', () => {
    it('rejects with not found error', async () => {
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

      await expect(
        findById('a895bb89-b29d-47b1-96c9-3501b2f26d0c', createdUser.id)
      ).rejects.toHaveProperty('code', httpStatusCode.NOT_FOUND);
    });
  });
});
