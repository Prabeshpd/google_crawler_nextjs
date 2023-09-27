/**
 * @jest-environment node
 */
import { NextRequest, NextResponse } from 'next/server';
// eslint-disable-next-line
import { createMocks } from 'node-mocks-http';

import { POST } from '@/app/api/v1/users/route';
import { createUser } from '@/repositories/user';
import { userFactory } from '@test/factories/user';

describe('User post API:', () => {
  describe('given valid params', () => {
    it('returns created user with status 200', async () => {
      let { req }: { req: NextRequest; res: NextResponse } = createMocks({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      });
      req = {
        ...req,
        json: async () => {
          return new Promise((resolve) => {
            resolve({ name: 'dev nimble', email: 'dev@nimblehq.co', password: '1234566' });
          });
        },
      } as NextRequest;

      const response = await POST(req as NextRequest);

      const { data } = await response.json();

      expect(response.status).toEqual(200);
      expect(data.email).toEqual('dev@nimblehq.co');
    });
  });

  describe('given email is NOT unique', () => {
    it('returns with unprocessable entity error', async () => {
      const user = userFactory();
      const userPayload = {
        name: user.name,
        email: 'dev@nimblehq.co',
        password: user.password,
      };
      await createUser(userPayload);
      let { req }: { req: NextRequest; res: NextResponse } = createMocks({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      });
      req = {
        ...req,
        json: async () => {
          return new Promise((resolve) => {
            resolve({ name: 'dev nimble', email: 'dev@nimblehq.co', password: '1234566' });
          });
        },
      } as NextRequest;

      const response = await POST(req as NextRequest);

      expect(response.status).toEqual(422);
    });
  });
});
