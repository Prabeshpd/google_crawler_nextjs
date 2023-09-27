import { ISelectorId } from '@/types/common';

import BaseParser from './baseParser';

const bingSelectorIds: ISelectorId = {
  adLinkElementAttribute: '.b_adurl',
  adTopParent: '.b_ad, .b_adTop',
  adWords: '.sb_ad, .sb_adTA',
  linkElement: 'a',
  adBottomParent: '.b_ad, .b_adBottom',
  nonAdWords: '.b_algo',
  linkElementAttribute: 'href',
  nonAdParent: '#b_results',
};

class BingParser extends BaseParser {
  selectorIds: ISelectorId;

  constructor(htmlRawString: string) {
    super(htmlRawString);
    this.selectorIds = bingSelectorIds;
  }

  parseTopAdWordList() {
    const urls: string[] = [];
    const adElementsDom = this.htmlDocumentAPI(this.selectorIds.adTopParent);

    const adUrlElements = this.htmlDocumentAPI(adElementsDom).find(
      `${this.selectorIds.adTopParent} ${this.selectorIds.adLinkElementAttribute}`
    );

    adUrlElements.each((_, element) => {
      const url = this.htmlDocumentAPI(element).find(this.selectorIds.linkElement).text();
      if (url) urls.push(url);
    });

    return urls;
  }

  parseBottomAdWordList() {
    const urls: string[] = [];

    const adElementsDom = this.htmlDocumentAPI(this.selectorIds.adBottomParent);

    const adUrlElements = this.htmlDocumentAPI(adElementsDom).find(
      `${this.selectorIds.adBottomParent} ${this.selectorIds.adLinkElementAttribute}`
    );

    adUrlElements.each((_, element) => {
      const url = this.htmlDocumentAPI(element).find(this.selectorIds.linkElement).text();
      if (url) urls.push(url);
    });

    return urls;
  }

  parseNonAdWordList() {
    const urls: string[] = [];

    const nonAdElementsDom = this.htmlDocumentAPI(this.selectorIds.nonAdParent).find(
      this.selectorIds.nonAdWords
    );
    const nonAdUrlElements = this.htmlDocumentAPI(nonAdElementsDom).find(
      this.selectorIds.linkElement
    );

    nonAdUrlElements.each((_, element) => {
      const url = this.htmlDocumentAPI(element).attr(this.selectorIds.linkElementAttribute);
      if (url) urls.push(url);
    });

    return urls;
  }
}

export default BingParser;
