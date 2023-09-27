import { SearchEngine } from '@prisma/client';
import httpStatusCode from 'http-status-codes';

import { parseCSVFormData } from '@/lib/file';
import { createManySearchResults } from '@/repositories/searchResult';

export async function uploadCsv(file: FormDataEntryValue | null, userId: number) {
  try {
    if (!file) {
      const error = { status: httpStatusCode.BAD_REQUEST, message: 'File must be sent' };

      throw error;
    }

    const keywords = await parseCSVFormData(file);
    if (!keywords.length) {
      const error = {
        status: httpStatusCode.BAD_REQUEST,
        message: 'Empty files are not allowed',
      };

      throw error;
    }
    if (keywords.length > 100) {
      const error = {
        code: httpStatusCode.BAD_REQUEST,
        message: 'Keywords cannot be more than 100 words',
      };

      throw error;
    }

    const payload = keywords.flatMap((keyword) => {
      return [
        { keyword, userId: +userId, searchEngine: SearchEngine.google },
        { keyword, userId: +userId, searchEngine: SearchEngine.bing },
      ];
    });

    await createManySearchResults(payload);
  } catch (err: any) {
    const error = { status: httpStatusCode.INTERNAL_SERVER_ERROR, message: err.message };

    throw error;
  }
}
