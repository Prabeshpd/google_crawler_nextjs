import { User } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

import * as userRepository from '@/repositories/user';

export default async function appHandler(
  request: NextRequest,
  callback: (currentUser: User) => Promise<NextResponse>
) {
  try {
    // Need to pass secret on every getToken function
    const token = await getToken({ req: request, secret: process.env.NEXT_AUTH_SECRET });
    const currentUser = await userRepository.findById(Number(token?.userId));

    if (!currentUser) {
      return NextResponse.json({ message: 'Invalid token' }, { status: StatusCodes.UNAUTHORIZED });
    }

    return callback(currentUser);
  } catch (err) {
    return NextResponse.json(
      { message: (err as Error).message },
      { status: StatusCodes.UNPROCESSABLE_ENTITY }
    );
  }
}
