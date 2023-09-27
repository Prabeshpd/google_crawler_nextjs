import httpStatusCode from 'http-status-codes';

import * as searchResultRepository from '@/repositories/searchResult';

export async function findById(id: string, userId: number) {
  const [searchResult] = await searchResultRepository.findById(id, userId);

  if (!searchResult) {
    const error = {
      code: httpStatusCode.NOT_FOUND,
      message: 'This keyword does not exist.',
    };

    throw error;
  }

  return searchResult;
}
