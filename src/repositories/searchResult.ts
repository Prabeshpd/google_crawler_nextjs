import { Prisma } from '@prisma/client';

import dbClient from '@/config/database';
import { SearchResultStatus } from '@/constants/enum';

const searchResultScraping = {
  keyword: true,
  userId: true,
};

export type SearchResultScraping = Prisma.SearchResultGetPayload<{
  select: typeof searchResultScraping;
}>;

export const createManySearchResults = async (
  searchResultAttributes: Prisma.SearchResultCreateManyInput[]
) => dbClient.searchResult.createMany({ data: searchResultAttributes });

export const updateSearchResult = async (args: Prisma.SearchResultUpdateManyArgs) =>
  dbClient.searchResult.updateMany(args);

export const findById = async (id: string, userId: number) =>
  dbClient.searchResult.findMany({ where: { id, userId } });

export const listSearchResultByStatus = async (
  userId: number,
  status: number = SearchResultStatus.PENDING
) => dbClient.searchResult.findMany({ where: { userId, status } });
