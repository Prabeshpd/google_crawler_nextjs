/**
 * @jest-environment node
 */

import { createUser } from '@/app/actions/user';
import { userFactory } from '@test/factories/user';

import { authenticateCredentialLogin } from './auth';

jest.mock('../../config/auth', () => ({ authOptions: {} }));

describe('Auth:', () => {
  describe('authenticateCredentialLogin', () => {
    describe('given correct credentials', () => {
      it('returns user', async () => {
        const user = userFactory();
        const password = 'password';
        const userPayload = { name: user.name, email: user.email, password: password };
        await createUser(userPayload);

        const data = await authenticateCredentialLogin({
          email: user.email,
          password,
        });

        expect(data).not.toBeNull();
        expect(data?.email).toEqual(user.email);
        expect(data?.name).toEqual(user.name);
      });
    });

    describe('given there is NO user as credential', () => {
      it('throws custom error', async () => {
        await expect(
          authenticateCredentialLogin({ email: 'dev@nimblehq.co', password: 'random' })
        ).rejects.toHaveProperty('message', 'Provided email or password does not match.');
      });
    });

    describe('given NO credentials are passed', () => {
      it('throws bad request error', async () => {
        await expect(
          authenticateCredentialLogin({ email: '', password: '' })
        ).rejects.toHaveProperty('message', 'Provided email or password does not match.');
      });
    });

    describe('given passed password is INCORRECT', () => {
      it('throws custom error', async () => {
        const user = userFactory();
        const userPayload = {
          name: user.name,
          email: 'user@nimblehq.co',
          password: user.password,
        };
        await createUser(userPayload);

        await expect(
          authenticateCredentialLogin({
            email: 'user@nimblehq.co',
            password: '1234567',
          })
        ).rejects.toHaveProperty('message', 'Provided email or password does not match.');
      });
    });
  });
});
