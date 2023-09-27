/**
 * @jest-environment node
 */
import { NextRequest, NextResponse } from 'next/server';
import { getToken, JWT } from 'next-auth/jwt';
// eslint-disable-next-line
import { createMocks } from 'node-mocks-http';

import { GET } from '@/app/api/v1/search-results/route';
import config from '@/config/config';
import { SearchScope, SearchType } from '@/constants/enum';
import { createManySearchResults } from '@/repositories/searchResult';
import { createUser } from '@/repositories/user';
import { searchResultFactory } from '@test/factories/searchResult';
import { userFactory } from '@test/factories/user';

jest.mock('next-auth/jwt');

describe('GET api/v1/search-results', () => {
  const testAppHost = config.testAppHost;
  const nextAuthJwt = { getToken };
  const mockedNextAuthJwt = nextAuthJwt as jest.Mocked<{
    getToken: () => Promise<string | JWT | null>;
  }>;

  describe('given user is authorized', () => {
    describe('given only pagination params', () => {
      it('returns all the data with pagination', async () => {
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
        await createManySearchResults(searchResultPayload);

        mockedNextAuthJwt.getToken.mockResolvedValue({ userId: createdUser.id });
        let { req }: { req: NextRequest; res: NextResponse } = createMocks({
          method: 'GET',
          headers: { 'content-type': 'application/json' },
        });
        req = {
          ...req,
          url: `${testAppHost}/api/v1/search-results?currentPage=1&maxRows=10`,
        } as NextRequest;

        const response = await GET(req);

        const { data } = await response.json();

        expect(response.status).toBe(200);
        expect(data.searchResults.length).toEqual(2);
        expect(data.meta).toEqual({
          totalRowCount: 2,
          totalPageCount: 1,
          perPageCount: 10,
          currentPage: 1,
        });
      });
    });

    describe('given all filter params', () => {
      describe('given user have search results', () => {
        it('returns the valid data with pagination after filter', async () => {
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

          mockedNextAuthJwt.getToken.mockResolvedValue({ userId: createdUser.id });
          let { req }: { req: NextRequest; res: NextResponse } = createMocks({
            method: 'GET',
            headers: { 'content-type': 'application/json' },
          });
          req = {
            ...req,
            url: `${testAppHost}/api/v1/search-results?currentPage=1&maxRows=10&queryInput=/&searchType=${SearchType.PARTIAL}&scope=${SearchScope.URL}`,
          } as NextRequest;

          const response = await GET(req);

          const { data } = await response.json();

          expect(response.status).toBe(200);
          expect(data.searchResults.length).toEqual(1);
          expect(data.meta).toEqual({
            totalRowCount: 1,
            totalPageCount: 1,
            perPageCount: 10,
            currentPage: 1,
          });
        });
      });
    });

    describe('given user have NO search results', () => {
      it('returns empty data', async () => {
        const user = userFactory();
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

        const response = await GET(req);

        const { data } = await response.json();

        expect(response.status).toBe(200);
        expect(data.searchResults.length).toEqual(0);
        expect(data.searchResults).toEqual([]);
        expect(data.meta).toEqual({
          totalRowCount: 0,
          totalPageCount: 0,
          perPageCount: 10,
          currentPage: 1,
        });
      });
    });
  });

  describe('given user is unauthorized', () => {
    it('returns with unauthorized error', async () => {
      const user = userFactory();
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

      const response = await GET(req);

      expect(response.status).toEqual(401);
    });
  });
});
