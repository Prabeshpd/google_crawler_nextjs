import { SearchType, SearchScope } from '@/constants/enum';

export interface SearchResultFilter {
  queryInput?: string | null;
  type?: SearchType;
  scope?: SearchScope;
}
