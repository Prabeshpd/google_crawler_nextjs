/**
 * @jest-environment node
 */

import { User } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { NextRequest } from 'next/server';
import { getToken, JWT } from 'next-auth/jwt';

import { findById } from '@/repositories/user';
import { userFactory } from '@test/factories/user';

import appHandler from './auth.api';

jest.mock('../../repositories/user');
jest.mock('next-auth/jwt');

describe('appHandler', () => {
  const req: Partial<NextRequest> = {};
  const userAttributes = { id: 1 };
  const user = userFactory();
  const resolvedUser = { ...user, ...userAttributes };

  const callback = jest.fn();

  const userRepository = { findById };
  const nextAuthJwt = { getToken };
  const mockedUserRepository = userRepository as jest.Mocked<{
    findById: () => Promise<User | null>;
  }>;
  const mockedNextAuthJwt = nextAuthJwt as jest.Mocked<{
    getToken: () => Promise<string | JWT | null>;
  }>;

  describe('given token is valid', () => {
    describe('given user exists', () => {
      it('calls callback with user and request', async () => {
        mockedUserRepository.findById.mockResolvedValue(resolvedUser);
        mockedNextAuthJwt.getToken.mockResolvedValue({ userId: 1 });

        await appHandler(req as NextRequest, callback);

        expect(callback).toHaveBeenCalledWith(resolvedUser);
      });
    });
  });

  describe('given user does NOT exists', () => {
    it('returns invalid token error', async () => {
      mockedUserRepository.findById.mockResolvedValue(null);
      mockedNextAuthJwt.getToken.mockResolvedValue({ userId: 1 });

      const response = await appHandler(req as NextRequest, callback);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });
  });

  describe('given token is NOT valid', () => {
    it('returns invalid token error', async () => {
      mockedNextAuthJwt.getToken.mockResolvedValue({});

      const response = await appHandler(req as NextRequest, callback);

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });
  });
});
