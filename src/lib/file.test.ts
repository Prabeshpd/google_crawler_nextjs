/**
 * @jest-environment node
 */
import fs from 'fs';

import { parseCSVFormData } from './file';

describe('parseCSVFormData:', () => {
  it('returns a parsed array of string from csv file', async () => {
    const string = await fs.readFileSync('./test/fixtures/file.csv', 'utf8');
    const blob = new Blob([string], { type: 'text/csv' });
    const data = await parseCSVFormData(blob as FormDataEntryValue);

    expect(data).toEqual(['node', 'react']);
  });
});
