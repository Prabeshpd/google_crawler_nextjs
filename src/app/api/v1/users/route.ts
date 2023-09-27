import httpStatusCode from 'http-status-codes';
import { NextResponse } from 'next/server';

import { createUser } from '@/services/user/user';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const user = await createUser(payload);

    return NextResponse.json({ data: user }, { status: httpStatusCode.OK });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message },
      { status: httpStatusCode.UNPROCESSABLE_ENTITY }
    );
  }
}
