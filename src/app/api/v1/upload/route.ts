import httpStatusCode from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { uploadCsv } from '@/app/actions/upload';
import appHandler from '@/lib/handler/auth.api';

export async function POST(request: NextRequest) {
  return appHandler(request, async (currentUser) => {
    try {
      const userId = currentUser.id;
      const formData = await request.formData();

      const keywordsFile = formData.get('keywords');
      await uploadCsv(keywordsFile, userId);

      return NextResponse.json(
        { message: 'File uploaded successfully' },
        { status: httpStatusCode.OK }
      );
    } catch (err: any) {
      return NextResponse.json(
        { message: err.message },
        { status: httpStatusCode.UNPROCESSABLE_ENTITY }
      );
    }
  });
}
