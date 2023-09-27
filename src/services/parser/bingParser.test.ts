/**
 * @jest-environment node
 */
import * as fs from 'fs';

import BingParser from './bingParser';

describe('BingParser:', () => {
  describe('given valid raw html', () => {
    it('parses the required information', async () => {
      const rawHtmlString = await fs.readFileSync('./test/fixtures/bing-search-result.html', {
        encoding: 'utf-8',
      });
      const parser = new BingParser(rawHtmlString);
      const topAdWordUrls = parser.parseTopAdWordList();
      const bottomAdWordUrls = parser.parseBottomAdWordList();
      const nonAdWordUrls = parser.parseNonAdWordList();

      expect(topAdWordUrls).toEqual([
        'https://google.com',
        'https://google.com',
        'https://google.com',
      ]);
      expect(bottomAdWordUrls).toEqual([
        'https://nimble.com',
        'https://nimble.com',
        'https://nimble.com',
      ]);
      expect(nonAdWordUrls).toEqual([
        'https://youtube.com',
        'https://youtube.com',
        'https://youtube.com',
      ]);
    });
  });

  describe('given EMPTY html string', () => {
    it('parses with empty elements', async () => {
      const parser = new BingParser('');

      const topAdWordUrls = parser.parseTopAdWordList();
      const bottomAdWordUrls = parser.parseBottomAdWordList();
      const nonAdWordUrls = parser.parseNonAdWordList();

      expect(topAdWordUrls).toEqual([]);
      expect(bottomAdWordUrls).toEqual([]);
      expect(nonAdWordUrls).toEqual([]);
    });
  });
});
