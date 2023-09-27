import { Prisma, SearchResult } from '@prisma/client';

import dbClient from '@/config/database';
import { SearchScope, SearchType } from '@/constants/enum';
import { SearchResultFilter } from '@/types/query';

import BaseQuery, { QueryParams, BaseQueryInterface } from './BaseQuery';

interface SearchResultQueryParams extends Omit<QueryParams, 'databaseModel'> {
  filters?: SearchResultFilter;
}

interface SearchResultQueryInterface extends BaseQueryInterface<SearchResult> {
  userId: number;
  filters?: SearchResultFilter;
}

interface FilterParams extends Omit<SearchResultFilter, 'queryInput'> {
  queryInput: string;
}

class SearchResultQuery extends BaseQuery<SearchResult> implements SearchResultQueryInterface {
  userId: number;
  filters?: SearchResultFilter;

  constructor(userId: number, queryParams: SearchResultQueryParams) {
    super({ ...queryParams, databaseModel: dbClient.searchResult });

    this.userId = userId;
    this.filters = queryParams.filters;
  }

  async query() {
    this.buildPaginationQueryParams();

    if (!this.filters?.queryInput) {
      return this.databaseModel.findMany({
        where: { userId: this.userId },
        ...this.paginationQuery,
      });
    }

    const { queryInput, type, scope } = this.filters;

    return this.filterResults({ queryInput, scope, type });
  }

  private async filterResults(filter: FilterParams): Promise<SearchResult[]> {
    const { queryInput = '', scope = SearchScope.ALL, type = SearchType.PATTERN } = filter;

    switch (scope) {
      case SearchScope.KEYWORD:
        return this.filterByKeyword(queryInput, type);

      case SearchScope.URL:
        return this.filterByUrl({ queryInput, type });

      default:
        return this.filterByUrlAndKeyword({ queryInput, type });
    }
  }

  private async filterByKeyword(keyword: string, type: SearchType): Promise<SearchResult[]> {
    if (type === SearchType.EXACT) {
      return this.databaseModel.findMany({ where: { userId: this.userId, keyword } });
    }

    return this.databaseModel.findMany({
      where: { userId: this.userId, keyword: { contains: keyword } },
      ...this.paginationQuery,
    });
  }

  private async filterByUrl(urlFilterParams: FilterParams): Promise<SearchResult[]> {
    const { queryInput, type } = urlFilterParams;

    switch (type) {
      case SearchType.EXACT:
        return this.filterByExactUrl(queryInput);

      case SearchType.PARTIAL:
        return this.filterByPartialUrl(queryInput);

      default:
        return this.filterByPatternUrl(queryInput);
    }
  }

  private async filterByUrlAndKeyword(urlFilterParams: FilterParams): Promise<SearchResult[]> {
    const { queryInput, type } = urlFilterParams;

    switch (type) {
      case SearchType.EXACT:
        return this.filterByExactKeywordAndUrl(queryInput);

      case SearchType.PARTIAL:
        return this.filterByPartialKeywordAndUrl(queryInput);

      default:
        return this.filterByPatternKeywordAndUrl(queryInput);
    }
  }

  private async filterByExactUrl(queryInput: string): Promise<SearchResult[]> {
    return this.databaseModel.findMany({
      where: {
        userId: this.userId,
        OR: [
          {
            adWordTopUrls: {
              has: queryInput,
            },
          },
          {
            nonAdUrls: {
              has: queryInput,
            },
          },
        ],
      },
      ...this.paginationQuery,
    });
  }

  private async filterByExactKeywordAndUrl(queryInput: string): Promise<SearchResult[]> {
    return this.databaseModel.findMany({
      where: {
        userId: this.userId,
        keyword: queryInput,
        OR: [
          {
            adWordTopUrls: {
              has: queryInput,
            },
          },
          {
            nonAdUrls: {
              has: queryInput,
            },
          },
        ],
      },
      ...this.paginationQuery,
    });
  }

  private async filterByPatternUrl(queryInput: string): Promise<SearchResult[]> {
    return dbClient.$queryRaw(
      Prisma.sql`SELECT * FROM search_results sr
       WHERE sr."userId" = ${this.userId}
       AND array_to_string(sr.ad_word_top_urls, ', ') ~ ${queryInput}
       LIMIT ${this.paginationQuery.take} OFFSET ${this.paginationQuery.skip}`
    );
  }

  private async filterByPatternKeywordAndUrl(queryInput: string): Promise<SearchResult[]> {
    return dbClient.$queryRaw(
      Prisma.sql`SELECT * FROM search_results sr
       WHERE sr."userId" = ${this.userId}
       AND sr."keyword" ~ ${queryInput}
       AND array_to_string(sr.ad_word_top_urls, ', ') ~ ${queryInput}
       LIMIT ${this.paginationQuery.take} OFFSET ${this.paginationQuery.skip}`
    );
  }

  private async filterByPartialUrl(queryInput: string): Promise<SearchResult[]> {
    const characterToSearch = `%${queryInput}%`;

    return dbClient.$queryRaw(
      Prisma.sql`
      SELECT flatten.id, flatten.keyword, flatten.nod_ad_urls, flatten.ad_word_top_urls, flatten.status, flatten.search_engine  FROM 
        (SELECT sr.id,
          sr.keyword,
          UNNEST(sr.nod_ad_urls) as ad_url_string, 
          UNNEST(sr.ad_word_top_urls) as non_ads_url_string, 
          sr.nod_ad_urls, 
          sr.ad_word_top_urls,
          sr.status,
          sr.search_engine  
          FROM search_results sr
          WHERE sr."userId"=${this.userId}
        ) AS flatten
      WHERE
      flatten.ad_url_string LIKE ${characterToSearch}
      OR flatten.non_ads_url_string LIKE ${characterToSearch}
      GROUP BY flatten.id, flatten.keyword, flatten.nod_ad_urls, flatten.ad_word_top_urls, flatten.status, flatten.search_engine
      LIMIT ${this.paginationQuery.take} OFFSET ${this.paginationQuery.skip}`
    );
  }

  private async filterByPartialKeywordAndUrl(queryInput: string): Promise<SearchResult[]> {
    const characterToSearch = `%${queryInput}%`;

    return dbClient.$queryRaw(
      Prisma.sql`
        SELECT flatten.id, flatten.keyword, flatten.nod_ad_urls, flatten.ad_word_top_urls, flatten.status, flatten.search_engine  FROM 
          (SELECT sr.id,
            sr.keyword,
            UNNEST(sr.nod_ad_urls) as ad_url_string, 
            UNNEST(sr.ad_word_top_urls) as non_ads_url_string, 
            sr.nod_ad_urls, 
            sr.ad_word_top_urls,
            sr.status,
            sr.search_engine
            FROM search_results sr
            WHERE sr."userId"=${this.userId}
            AND sr."keyword" LIKE ${characterToSearch}
          ) AS flatten
        WHERE
        flatten.ad_url_string LIKE ${characterToSearch}
        OR flatten.non_ads_url_string LIKE ${characterToSearch}
        GROUP BY flatten.id, flatten.keyword, flatten.nod_ad_urls, flatten.ad_word_top_urls, flatten.status, flatten.search_engine
        LIMIT ${this.paginationQuery.take} OFFSET ${this.paginationQuery.skip}`
    );
  }
}

export default SearchResultQuery;
