import { hash } from '@/lib/crypt';
import { userFactory } from '@test/factories/user';

import { validateUserPassword } from './auth';

describe('validateUserPassword', () => {
  describe('given user is valid', () => {
    describe('given password matches', () => {
      it('returns true', async () => {
        const password = 'password';
        const hashedPassword = await hash(password);
        const user = { ...userFactory(), password: hashedPassword };

        const isMatchedPassword = await validateUserPassword(user, password);

        expect(isMatchedPassword).toEqual(true);
      });
    });

    describe('given password does NOT match', () => {
      it('returns false', async () => {
        const password = 'password';
        const hashedPassword = await hash(password);
        const user = { ...userFactory(), password: hashedPassword };

        const isMatchedPassword = await validateUserPassword(user, 'random');

        expect(isMatchedPassword).toEqual(false);
      });
    });
  });

  describe('given user is NOT valid', () => {
    describe('given user is NULL', () => {
      it('returns false', async () => {
        const password = 'password';
        const isMatchedPassword = await validateUserPassword(null, password);

        expect(isMatchedPassword).toEqual(false);
      });
    });

    describe('given user has NO password', () => {
      it('returns false', async () => {
        const password = 'password';
        const user = { ...userFactory(), password: null };
        const isMatchedPassword = await validateUserPassword(user, password);

        expect(isMatchedPassword).toEqual(false);
      });
    });
  });
});
