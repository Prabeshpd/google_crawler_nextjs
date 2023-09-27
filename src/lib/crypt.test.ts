/**
 * @jest-environment node
 */

import { hash, compareWithHashValue } from './crypt';

describe('Crypt', () => {
  describe('hash()', () => {
    it('generates a hash for the string', async () => {
      const inputText = 'test';
      const generatedHash = await hash(inputText);

      expect(generatedHash).not.toBeNull();
    });
  });

  describe('compareWithHashValue()', () => {
    it('matches given same strings', async () => {
      const string = 'test';
      const expectedHashString = await hash(string);

      const result = await compareWithHashValue(string, expectedHashString);

      expect(result).toEqual(true);
    });

    it('does not matches given different strings', async () => {
      const string = 'test';
      const randomString = 'testing';
      const expectedHashString = await hash(string);

      const result = await compareWithHashValue(randomString, expectedHashString);

      expect(result).toEqual(false);
    });
  });
});
