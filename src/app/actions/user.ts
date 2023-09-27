import { Prisma } from '@prisma/client';
import httpStatusCode from 'http-status-codes';

import withAuth from '@/lib/handler/auth.action';
import * as userService from '@/services/user/user';

export async function createUser(userPayload: Prisma.UserCreateInput) {
  try {
    const user = await userService.createUser(userPayload);

    return { data: user, message: 'The user account has been created successfully' };
  } catch (err: any) {
    const error = {
      code: err.code || httpStatusCode.UNPROCESSABLE_ENTITY,
      message: err.message,
    };

    throw error;
  }
}

export async function fetchCurrentUser() {
  return withAuth(async (currentUser) => {
    return currentUser;
  });
}
