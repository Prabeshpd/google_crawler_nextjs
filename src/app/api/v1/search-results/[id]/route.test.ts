/**
 * @jest-environment node
 */
import { NextRequest, NextResponse } from 'next/server';
import { getToken, JWT } from 'next-auth/jwt';
// eslint-disable-next-line
import { createMocks } from 'node-mocks-http';

import { GET } from '@/app/api/v1/search-results/[id]/route';
import config from '@/config/config';
import { createManySearchResults } from '@/repositories/searchResult';
import { createUser } from '@/repositories/user';
import { searchResultFactory } from '@test/factories/searchResult';
import { userFactory } from '@test/factories/user';

jest.mock('next-auth/jwt');

describe('GET api/v1/search-results/[id]:', () => {
  const testAppHost = config.testAppHost;
  const nextAuthJwt = { getToken };
  const mockedNextAuthJwt = nextAuthJwt as jest.Mocked<{
    getToken: () => Promise<string | JWT | null>;
  }>;

  describe('given user is authorized', () => {
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
        mockedNextAuthJwt.getToken.mockResolvedValue({ userId: createdUser.id });
        let { req }: { req: NextRequest; res: NextResponse } = createMocks({
          method: 'GET',
          headers: { 'content-type': 'application/json' },
        });
        req = {
          ...req,
          url: `${testAppHost}/api/v1/search-results?userId=${createdUser.id}`,
        } as NextRequest;

        const response = await GET(req, { params: { id: searchResult.id } });

        const { data } = await response.json();

        expect(response.status).toBe(200);
        expect(data.keyword).toEqual('node');
        expect(data.id).toEqual(searchResult.id);
      });

      describe('given user has NO given search result', () => {
        it('rejects with unprocessable entity error', async () => {
          const user = userFactory();
          const searchResult = searchResultFactory();
          const createdUser = await createUser(user);
          mockedNextAuthJwt.getToken.mockResolvedValue({ userId: createdUser.id });
          let { req }: { req: NextRequest; res: NextResponse } = createMocks({
            method: 'GET',
            headers: { 'content-type': 'application/json' },
          });
          req = {
            ...req,
            url: `${testAppHost}/api/v1/search-results`,
          } as NextRequest;

          const response = await GET(req, { params: { id: searchResult.id } });

          expect(response.status).toEqual(422);
        });
      });
    });
  });

  describe('given user is authorized', () => {
    it('returns with unauthorized error', async () => {
      const user = userFactory();
      const searchResult = searchResultFactory();
      await createUser(user);
      mockedNextAuthJwt.getToken.mockResolvedValue({ userId: 2 });
      let { req }: { req: NextRequest; res: NextResponse } = createMocks({
        method: 'GET',
        headers: { 'content-type': 'application/json' },
      });
      req = {
        ...req,
        url: `${testAppHost}/api/v1/search-results`,
      } as NextRequest;

      const response = await GET(req, { params: { id: searchResult.id } });

      expect(response.status).toEqual(401);
    });
  });
});
