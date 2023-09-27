import httpStatusCode from 'http-status-codes';

import withAuth from '@/lib/handler/auth.action';
import { convertHtmlToPdf } from '@/services/export/pdf';
import { findById } from '@/services/searchResultEntity';

export async function exportSearchResultPdf(searchResultId: string) {
  return withAuth(async (currentUser) => {
    try {
      const userId = currentUser.id;
      const searchResult = await findById(searchResultId, userId);
      if (!searchResult.html) {
        const error = {
          code: httpStatusCode.UNPROCESSABLE_ENTITY,
          message: 'There is no html content for given keyword',
        };

        throw error;
      }

      const pdf = await convertHtmlToPdf(searchResult.html);

      return Buffer.from(pdf).toString('base64');
    } catch (err: any) {
      const error = {
        code: httpStatusCode.UNPROCESSABLE_ENTITY,
        message: err.message,
      };

      throw error;
    }
  });
}
