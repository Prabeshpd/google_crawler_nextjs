/**
 * @jest-environment node
 */

import { userFactory } from '@test/factories/user';

import { createUser } from './user';

jest.mock('../../config/auth', () => ({ authOptions: {} }));

describe('User:', () => {
  describe('given valid params', () => {
    it('creates the user successfully', async () => {
      const user = userFactory();
      const userPayload = { name: 'dev nimble', email: 'devnimble@hq.co', password: user.password };
      const { data: createdUser } = await createUser(userPayload);

      expect(createdUser.email).toEqual('devnimble@hq.co');
      expect(createdUser.name).toEqual('dev nimble');
    });
  });

  describe('given email is not unique', () => {
    it('returns with unprocessable entity error', async () => {
      const user = userFactory();
      const userPayload = {
        name: user.name,
        email: 'unique.user@nimblehq.co',
        password: user.password,
      };
      await createUser(userPayload);

      await expect(createUser(userPayload)).rejects.toHaveProperty('code', 422);
    });
  });
});
