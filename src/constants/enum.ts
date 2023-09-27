export enum SearchResultStatus {
  'PENDING' = 1,
  'SUCCESS' = 2,
  'FAILED' = 3,
}

export enum AsyncProcess {
  'SCRAPE' = 'scrape',
  'QUEUE_SCRAPE' = 'queueScrape',
}

export enum SearchType {
  'PARTIAL' = 'partial',
  'EXACT' = 'exact',
  'PATTERN' = 'pattern',
}

export enum SearchScope {
  'KEYWORD' = 'keyword',
  'URL' = 'url',
  'ALL' = 'all',
}
