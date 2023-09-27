import httpStatusCode from 'http-status-codes';
import { NextRequest, NextResponse } from 'next/server';

import { PAGINATION_CURRENT_PAGE, PAGINATION_LIMIT } from '@/constants/constants';
import { SearchScope, SearchType } from '@/constants/enum';
import appHandler from '@/lib/handler/auth.api';
import { getPaginatedMeta } from '@/lib/pagination';
import SearchResultQuery from '@/queries/SearchResultQuery';
import { searchResultListSerializer } from '@/serializers/searchResult';

export async function GET(request: NextRequest) {
  return appHandler(request, async (currentUser) => {
    try {
      const userId = currentUser.id;
      const requestUrl = new URL(request.url);

      const queryInput = requestUrl.searchParams.get('queryInput') || '';
      const scope = (requestUrl.searchParams.get('scope') || SearchScope.ALL) as SearchScope;
      const type = (requestUrl.searchParams.get('type') || SearchType.PATTERN) as SearchType;

      const currentPage = Number(
        requestUrl.searchParams.get('currentPage') || PAGINATION_CURRENT_PAGE
      );
      const maxRows = Number(requestUrl.searchParams.get('maxRows') || PAGINATION_LIMIT);
      const paginationParams = { maxRows, currentPage };

      const filters = { queryInput, scope, type };
      let queryParams = { paginationParams, filters };
      const searchResults = await new SearchResultQuery(userId, queryParams).query();

      queryParams = { ...queryParams, ...{ isPaginated: false } };
      const totalRowCount = (await new SearchResultQuery(userId, queryParams).query()).length;

      const result = searchResultListSerializer(
        searchResults,
        getPaginatedMeta({
          currentPage: currentPage,
          totalRowCount,
          perPageCount: maxRows,
        })
      );

      return NextResponse.json({ data: result }, { status: httpStatusCode.OK });
    } catch (err: any) {
      return NextResponse.json(
        { message: err.message },
        { status: httpStatusCode.UNPROCESSABLE_ENTITY }
      );
    }
  });
}
