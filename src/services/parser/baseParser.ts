import * as cheerio from 'cheerio';

import NotImplementedError from '@/lib/notImplementedError';
import { IParse } from '@/types/parse';

const errorMessage = 'Abstract class methods can not be executed.';

class BaseParser implements IParse<cheerio.CheerioAPI> {
  htmlRawString: string;
  htmlDocumentAPI: cheerio.CheerioAPI;

  constructor(htmlRawString: string) {
    this.htmlRawString = htmlRawString;
    this.htmlDocumentAPI = this.loadHtmlDocumentApi();
  }

  parseTopAdWordList() {
    throw new NotImplementedError({ message: errorMessage });
  }

  parseBottomAdWordList() {
    throw new NotImplementedError({ message: errorMessage });
  }

  parseNonAdWordList() {
    throw new NotImplementedError({ message: errorMessage });
  }

  private loadHtmlDocumentApi() {
    return cheerio.load(this.htmlRawString);
  }
}

export default BaseParser;
