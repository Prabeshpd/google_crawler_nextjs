import httpStatusCode from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import appHandler from '@/lib/handler/auth.api';
import { findById } from '@/services/searchResultEntity';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  return appHandler(request, async (currentUser) => {
    try {
      const id = params.id;
      const userId = currentUser.id;

      const searchResult = await findById(id, userId);

      return NextResponse.json({ data: searchResult }, { status: httpStatusCode.OK });
    } catch (err: any) {
      return NextResponse.json(
        { message: err.message },
        { status: httpStatusCode.UNPROCESSABLE_ENTITY }
      );
    }
  });
}
