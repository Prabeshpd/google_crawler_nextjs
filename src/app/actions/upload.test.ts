/**
 * @jest-environment node
 */

import fs from 'fs';

import dbClient from '@/config/database';
import { userFactory } from '@test/factories/user';

import { uploadCsv } from './upload';

describe('Upload:', () => {
  describe('given csv file', () => {
    it('inserts the keyword successfully on uploading the csv file', async () => {
      const user = userFactory();
      const userPayload = {
        ...user,
        name: 'dev nimble',
        email: 'devnimble@hq.co',
        password: user.password,
      };
      await dbClient.user.create({ data: userPayload });
      const string = await fs.readFileSync('./test/fixtures/file.csv', 'utf8');
      const blob = new Blob([string], { type: 'text/csv' });
      await uploadCsv(blob as FormDataEntryValue, user.id);

      const data = await dbClient.searchResult.findMany({
        where: {
          userId: user.id,
        },
      });

      expect(data.length).toEqual(4);
    });
  });
});
