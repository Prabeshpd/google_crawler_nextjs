import httpStatusCode from 'http-status-codes';

import withAuth from '@/lib/handler/auth.action';
import { PaginationParams } from '@/lib/pagination';
import SearchResultQuery from '@/queries/SearchResultQuery';
import { findById } from '@/services/searchResultEntity';
import { SearchResultFilter } from '@/types/query';

export async function listSearchResults(
  paginationParams: PaginationParams,
  filters: SearchResultFilter
) {
  return withAuth(async (currentUser) => {
    try {
      const userId = currentUser.id;

      let filterParams = { paginationParams, filters };
      const searchResults = await new SearchResultQuery(userId, filterParams).query();

      filterParams = { ...filterParams, ...{ isPaginated: false } };
      const count = (await new SearchResultQuery(userId, filterParams).query()).length;

      return { searchResults, count };
    } catch (err: any) {
      const error = {
        code: err.code || httpStatusCode.NOT_FOUND,
        message: err.message,
      };

      throw error;
    }
  });
}

export async function findSearchResultById(id: string) {
  return withAuth(async (currentUser) => {
    try {
      return findById(id, currentUser.id);
    } catch (err: any) {
      const error = {
        code: err.code || httpStatusCode.NOT_FOUND,
        message: err.message,
      };

      throw error;
    }
  });
}
