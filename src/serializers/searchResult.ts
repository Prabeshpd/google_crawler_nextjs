import { SearchResult } from '@prisma/client';

import { PaginatedMeta } from '@/lib/pagination';

export const searchResultListSerializer = (data: SearchResult[], meta: PaginatedMeta) => {
  return { searchResults: data, meta };
};
