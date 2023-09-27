import { SearchEngine } from '@prisma/client';

import BingParser from './bingParser';
import ParseError from './error';
import GoogleParser from './googleParser';

class Parser {
  parser: GoogleParser | BingParser;

  constructor(searchEngine: SearchEngine, htmlRawString: string) {
    if (!this.isSupportedSearchEngine(searchEngine)) {
      throw new ParseError({ message: `Unsupported search engine: ${searchEngine}` });
    }

    switch (searchEngine) {
      case SearchEngine.bing:
        this.parser = new BingParser(htmlRawString);
        break;
      case SearchEngine.google:
        this.parser = new GoogleParser(htmlRawString);
    }
  }

  private isSupportedSearchEngine(searchEngine: SearchEngine) {
    return Object.values(SearchEngine).includes(searchEngine);
  }
}

export default Parser;
