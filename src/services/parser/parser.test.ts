/**
 * @jest-environment node
 */

import { SearchEngine } from '@prisma/client';

import BingParser from './bingParser';
import GoogleParser from './googleParser';
import Parser from './parser';

describe('Parser', () => {
  describe('given search engine is "google"', () => {
    it('returns google parser instance', () => {
      const parser = new Parser(SearchEngine.google, '').parser;

      expect(parser).toBeInstanceOf(GoogleParser);
    });
  });

  describe('given search engine is "bing"', () => {
    it('returns bing parser instance', () => {
      const parser = new Parser(SearchEngine.bing, '').parser;

      expect(parser).toBeInstanceOf(BingParser);
    });
  });
});
