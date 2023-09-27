/**
 * @jest-environment node
 */
import * as fs from 'fs';

import { exportSearchResultPdf } from '@/app/actions/exportPdf';
import { getServerSession } from '@/lib/actionRequest/session';
import { SessionWithId } from '@/lib/handler/auth.action';
import { createManySearchResults } from '@/repositories/searchResult';
import { createUser } from '@/repositories/user';
import { convertHtmlToPdf } from '@/services/export/pdf';
import { searchResultFactory } from '@test/factories/searchResult';
import { userFactory } from '@test/factories/user';

const mimeTypeIdentifierPDF = 'JVBERi0';

jest.mock('../../lib/actionRequest/session');
jest.mock('../../services/export/pdf');
jest.mock('../../config/auth', () => ({ authOptions: {} }));

describe('exportSearchResultPdf', () => {
  const serverSessionUtilities = { getServerSession };
  const fileUtilities = { convertHtmlToPdf };
  const mockedServerSession = serverSessionUtilities as jest.Mocked<{
    getServerSession: () => Promise<SessionWithId | null>;
  }>;
  const mockedFile = fileUtilities as jest.Mocked<{
    convertHtmlToPdf: () => Promise<Buffer>;
  }>;

  describe('given user is authenticated', () => {
    describe('given valid search result with html', () => {
      it('returns base 64 string equivalent', async () => {
        const user = userFactory();
        const createdUser = await createUser(user);
        const searchResult = searchResultFactory();
        const htmlString = '<div>Test Html</div>';
        const searchResultPayload = { ...searchResult, html: htmlString, userId: createdUser.id };
        await createManySearchResults([searchResultPayload]);
        const pdfBuffer = await fs.readFileSync('./test/fixtures/sample-pdf.pdf');

        mockedServerSession.getServerSession.mockResolvedValue({
          user: { id: createdUser.id.toString() },
          expires: '',
        });
        mockedFile.convertHtmlToPdf.mockResolvedValue(pdfBuffer);

        const pdf = await exportSearchResultPdf(searchResult.id);

        expect(pdf).not.toBeNull();
        expect(pdf.includes(mimeTypeIdentifierPDF)).toEqual(true);
      });
    });

    describe('given search result with NO html', () => {
      it('rejects with 422 error', async () => {
        const user = userFactory();
        const createdUser = await createUser(user);
        const searchResult = searchResultFactory();
        const searchResultPayload = { ...searchResult, html: '', userId: createdUser.id };
        await createManySearchResults([searchResultPayload]);
        mockedServerSession.getServerSession.mockResolvedValue({
          user: { id: createdUser.id.toString() },
          expires: '',
        });

        await expect(exportSearchResultPdf(searchResult.id)).rejects.toHaveProperty('code', 422);
      });
    });
  });

  describe('given user is NOT authenticated', () => {
    it('rejects with 401 error', async () => {
      mockedServerSession.getServerSession.mockResolvedValue({
        user: { id: '2' },
        expires: '',
      });

      await expect(exportSearchResultPdf('1')).rejects.toHaveProperty('code', 401);
    });
  });
});
