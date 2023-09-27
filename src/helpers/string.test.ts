/**
 * @jest-environment node
 */

import { generateRandomString } from './string';

describe('generateRandomString()', () => {
  describe('given character count', () => {
    it('generates the password of given length', () => {
      const randomString = generateRandomString(8);

      expect(randomString.length).toEqual(8);
    });
  });
});
