/**
 * @jest-environment node
 */

import { userFactory } from '@test/factories/user';

import { createUser } from './user';

describe('User:', () => {
  describe('createUser', () => {
    describe('given valid params', () => {
      const user = userFactory();
      it('creates the user successfully with encrypted password', async () => {
        const userPayload = {
          name: 'dev nimble',
          email: 'devnimble@hq.co',
          password: user.password,
        };

        const createdUser = await createUser(userPayload);

        expect(createdUser.email).toEqual('devnimble@hq.co');
        expect(createdUser.name).toEqual('dev nimble');
      });
    });

    describe('given email is not unique', () => {
      it('throws error', async () => {
        const user = userFactory();
        const userPayload = {
          name: user.name,
          email: 'unique.user@nimblehq.co',
          password: user.password,
        };

        await createUser(userPayload);

        await expect(createUser(userPayload)).rejects.toHaveProperty(
          'message',
          'Account with this email already exists.'
        );
      });
    });
  });
});
