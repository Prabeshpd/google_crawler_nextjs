import { Prisma } from '@prisma/client';

import * as crypt from '@/lib/crypt';
import * as userRepository from '@/repositories/user';

import UserError from './error';

export async function createUser(payload: Prisma.UserCreateInput) {
  if (!payload.email || !payload.password) {
    throw new UserError({
      message: 'Please enter email and password.',
    });
  }

  const user = await userRepository.findByEmail(payload.email);
  if (user) {
    throw new UserError({ message: 'Account with this email already exists.' });
  }

  const encryptedPassword = await crypt.hash(payload.password);
  const userPayload = {
    ...payload,
    password: encryptedPassword,
  };

  return userRepository.createUser(userPayload);
}
