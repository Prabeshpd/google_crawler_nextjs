/**
 * @jest-environment node
 */

import { User } from '@prisma/client';
import httpStatusCode from 'http-status-codes';

import { findById } from '@/repositories/user';
import { userFactory } from '@test/factories/user';

import withAuth, { SessionWithId } from './auth.action';
import { getServerSession } from '../actionRequest/session';

jest.mock('../actionRequest/session');
jest.mock('../../repositories/user');
jest.mock('../../config/auth', () => ({ authOptions: {} }));

describe('withAuth', () => {
  const userId = 1;
  const callback = jest.fn();
  const user = userFactory();
  const resolvedUser = { ...user, id: userId };

  const userRepository = { findById };
  const serverSessionUtilities = { getServerSession };

  const mockedServerSession = serverSessionUtilities as jest.Mocked<{
    getServerSession: () => Promise<SessionWithId | null>;
  }>;
  const mockedUserRepository = userRepository as jest.Mocked<{
    findById: () => Promise<User | null>;
  }>;

  describe('given valid session', () => {
    describe('given user exists', () => {
      it('calls callback with resolved user', async () => {
        mockedUserRepository.findById.mockResolvedValue(resolvedUser);
        mockedServerSession.getServerSession.mockResolvedValue({
          user: { id: userId.toString() },
          expires: '',
        });

        await withAuth(callback);

        expect(callback).toHaveBeenCalledWith(resolvedUser);
      });
    });

    describe('given user does not exists', () => {
      it('rejects with error code of unauthorized', async () => {
        mockedServerSession.getServerSession.mockResolvedValue({
          user: { id: userId.toString() },
          expires: '',
        });
        mockedUserRepository.findById.mockResolvedValue(null);

        await expect(withAuth(callback)).rejects.toHaveProperty(
          'code',
          httpStatusCode.UNAUTHORIZED
        );
      });
    });
  });

  describe('given session is not valid', () => {
    it('rejects with error code of unauthorized', async () => {
      mockedServerSession.getServerSession.mockResolvedValue(null);

      await expect(withAuth(callback)).rejects.toHaveProperty('code', httpStatusCode.UNAUTHORIZED);
    });
  });
});
