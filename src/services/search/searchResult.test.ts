/**
 * @jest-environment node
 */
import { SearchEngine } from '@prisma/client';

import request from '@/lib/searchRequest';

import { searchResult } from './searchResult';

jest.mock('../../lib/searchRequest.ts');
const mockedAxios = request as jest.Mocked<typeof request>;

describe('searchResult', () => {
  describe('given search engine is "google"', () => {
    describe('given a successful request to fetch the search result page', () => {
      it('returns resolved data', async () => {
        mockedAxios.get.mockResolvedValue({ data: { message: 'success' } });

        await expect(searchResult('node', SearchEngine.google)).resolves.toEqual({
          message: 'success',
        });
      });
    });

    describe('given a FAILED request to fetch the search result page', () => {
      it('throws an error', async () => {
        mockedAxios.get.mockRejectedValue({ error: { message: 'oops Something has happened' } });

        await expect(searchResult('node', SearchEngine.google)).rejects.toThrowError(
          'Unable to search result from google search for word node'
        );
      });
    });
  });

  describe('given search engine is "bing"', () => {
    describe('given a successful request to fetch the search result page', () => {
      it('returns resolved data', async () => {
        mockedAxios.get.mockResolvedValue({ data: { message: 'success' } });

        await expect(searchResult('node', SearchEngine.google)).resolves.toEqual({
          message: 'success',
        });
      });
    });

    describe('given a FAILED request to fetch the search result page', () => {
      it('throws an error', async () => {
        mockedAxios.get.mockRejectedValue({ error: { message: 'oops Something has happened' } });

        await expect(searchResult('node', SearchEngine.google)).rejects.toThrowError(
          'Unable to search result from google search for word node'
        );
      });
    });
  });

  describe('given search engine is INVALID', () => {
    it('throws error', async () => {
      await expect(searchResult('node', 'explorer')).rejects.toThrowError(
        'Unsupported search engine: explorer'
      );
    });
  });
});
