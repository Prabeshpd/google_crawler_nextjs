import { ISelectorId } from '@/types/common';

import BaseParser from './baseParser';

const googleSelectorIds: ISelectorId = {
  adLinkElementAttribute: '.sVXRqc',
  adTopParent: '#tvcap',
  adWords: '.uEierd',
  linkElement: 'a',
  adBottomParent: '#bottomads',
  nonAdWords: '.MjjYud',
  linkElementAttribute: 'href',
  nonAdParent: '#search',
};

class GoogleParser extends BaseParser {
  selectorIds: ISelectorId;

  constructor(htmlRawString: string) {
    super(htmlRawString);
    this.selectorIds = googleSelectorIds;
  }

  parseTopAdWordList() {
    const urls: string[] = [];
    const adElementsDom = this.htmlDocumentAPI(this.selectorIds.adTopParent).find(
      this.selectorIds.adWords
    );

    const adUrlElements = this.htmlDocumentAPI(adElementsDom).find(
      `${this.selectorIds.linkElement}${this.selectorIds.adLinkElementAttribute}`
    );

    adUrlElements.each((_, element) => {
      const url = this.htmlDocumentAPI(element).attr(this.selectorIds.linkElementAttribute);
      if (url) urls.push(url);
    });

    return urls;
  }

  parseBottomAdWordList() {
    const urls: string[] = [];

    const adElementsDom = this.htmlDocumentAPI(this.selectorIds.adBottomParent).find(
      this.selectorIds.adWords
    );

    const adUrlElements = this.htmlDocumentAPI(adElementsDom).find(
      `${this.selectorIds.linkElement}${this.selectorIds.adLinkElementAttribute}`
    );

    adUrlElements.each((_, element) => {
      const url = this.htmlDocumentAPI(element).attr(this.selectorIds.linkElementAttribute);
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

export default GoogleParser;
