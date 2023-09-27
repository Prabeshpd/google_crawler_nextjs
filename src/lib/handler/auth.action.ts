import { User } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { Session, User as UserInterface } from 'next-auth';

import { findById } from '@/repositories/user';

import { getServerSession } from '../actionRequest/session';

interface SessionUserWithId extends UserInterface {
  id: string;
}

export interface SessionWithId extends Session {
  user: SessionUserWithId;
}

export default async function withAuth<T>(callback: (currentUser: User) => T) {
  const session = (await getServerSession()) as SessionWithId;

  const currentUser = await findById(+session?.user?.id);

  if (!currentUser) {
    const error = { code: StatusCodes.UNAUTHORIZED, message: 'Invalid token' };

    throw error;
  }

  return callback(currentUser);
}
