export interface IParse<T> {
  htmlRawString: string;
  htmlDocumentAPI: T;
  parseTopAdWordList: () => void | string[];
  parseBottomAdWordList: () => void | string[];
  parseNonAdWordList: () => void | string[];
}
