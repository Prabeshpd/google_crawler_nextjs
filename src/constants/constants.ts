import { SearchType, SearchScope } from './enum';

export const DEBOUNCE_DEFAULT_VALUE = 250;

export const PAGINATION_CURRENT_PAGE = 1;
export const PAGINATION_LIMIT = 10;

export const SEARCH_TYPE_OPTIONS = [
  {
    value: SearchType.PARTIAL,
    label: 'Partial',
  },
  {
    value: SearchType.EXACT,
    label: 'Exact',
  },
  {
    value: SearchType.PATTERN,
    label: 'Pattern',
  },
];

export const SEARCH_SCOPE_OPTIONS = [
  {
    value: SearchScope.KEYWORD,
    label: 'Keyword',
  },
  {
    value: SearchScope.ALL,
    label: 'All',
  },
  {
    value: SearchScope.URL,
    label: 'Url',
  },
];

export const MODAL_DEFAULT_STYLES = {
  content: {
    top: '15%',
    left: '10%',
    width: '80%',
    height: '55%',
    backgroundColor: '#111827',
    color: '#ffffff',
  },
};
