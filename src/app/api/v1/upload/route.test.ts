/**
 * @jest-environment node
 */
import * as fs from 'fs';

import { NextRequest, NextResponse } from 'next/server';
import { getToken, JWT } from 'next-auth/jwt';
// eslint-disable-next-line
import { createMocks } from 'node-mocks-http';

import { POST } from '@/app/api/v1/upload/route';
import dbClient from '@/config/database';
import { createUser } from '@/repositories/user';
import { userFactory } from '@test/factories/user';

jest.mock('next-auth/jwt');

describe('POST api/v1/upload:', () => {
  const nextAuthJwt = { getToken };
  const mockedNextAuthJwt = nextAuthJwt as jest.Mocked<{
    getToken: () => Promise<string | JWT | null>;
  }>;

  describe('given user is authorized', () => {
    describe('given valid file under 100 keywords', () => {
      it('uploads the document successfully', async () => {
        const user = userFactory();
        const createdUser = await createUser(user);
        const string = await fs.readFileSync('./test/fixtures/file.csv', 'utf8');
        const blob = new Blob([string], { type: 'text/csv' });
        const form = new FormData();
        form.append('keywords', blob);
        mockedNextAuthJwt.getToken.mockResolvedValue({ userId: createdUser.id });
        let { req }: { req: NextRequest; res: NextResponse } = createMocks({
          method: 'POST',
          headers: { 'content-type': 'multipart/form-data;' },
          body: { form },
        });
        req = { ...req, formData: async () => form } as NextRequest;

        const response = await POST(req as NextRequest);

        const searchResults = await dbClient.searchResult.findMany({
          where: { userId: createdUser.id },
        });
        expect(searchResults.length).toEqual(4);

        expect(response.status).toEqual(200);
      });
    });

    describe('given file of keywords more than 100', () => {
      it('returns unprocessable entity error', async () => {
        const user = userFactory();
        const createdUser = await createUser(user);
        const string = await fs.readFileSync('./test/fixtures/invalidFile.csv', 'utf8');
        const blob = new Blob([string], { type: 'text/csv' });
        const form = new FormData();
        form.append('keywords', blob);
        mockedNextAuthJwt.getToken.mockResolvedValue({ userId: createdUser.id });
        let { req }: { req: NextRequest; res: NextResponse } = createMocks({
          method: 'POST',
          headers: { 'content-type': 'multipart/form-data;' },
          body: { form },
        });
        req = { ...req, formData: async () => form } as NextRequest;

        const response = await POST(req as NextRequest);

        expect(response.status).toEqual(422);
      });
    });
  });

  describe('given user is unauthorized', () => {
    it('returns with unauthorized error', async () => {
      const user = userFactory();
      await createUser(user);
      const string = await fs.readFileSync('./test/fixtures/file.csv', 'utf8');
      const blob = new Blob([string], { type: 'text/csv' });
      const form = new FormData();
      form.append('keywords', blob);
      mockedNextAuthJwt.getToken.mockResolvedValue({ userId: 2 });
      let { req }: { req: NextRequest; res: NextResponse } = createMocks({
        method: 'POST',
        headers: { 'content-type': 'multipart/form-data;' },
        body: { form },
      });
      req = { ...req, formData: async () => form } as NextRequest;

      const response = await POST(req as NextRequest);

      expect(response.status).toEqual(401);
    });
  });
});
