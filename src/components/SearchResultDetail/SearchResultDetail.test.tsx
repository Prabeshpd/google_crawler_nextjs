import * as React from 'react';

import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { findSearchResultAction, exportSearchResultPdfAction } from '@/app/actions/action';
import { SearchResultStatus } from '@/constants/enum';
import { searchResultFactory } from '@test/factories/searchResult';

import SearchResultDetail from './SearchResultDetail';

jest.mock('../../app/actions/action', () => ({
  findSearchResultAction: jest.fn(),
  exportSearchResultPdfAction: jest.fn(),
}));

describe('search result detail', () => {
  describe('given valid props', () => {
    it('renders the component', async () => {
      const searchResult = searchResultFactory();
      const resolvedSearchResult = {
        ...searchResult,
        status: SearchResultStatus.PENDING,
        keyword: 'detail',
      };
      (findSearchResultAction as jest.Mock).mockResolvedValue(resolvedSearchResult);

      render(<SearchResultDetail id={'2'} />);

      await waitFor(() => {
        expect(screen.getByText('Search Result Detail of DETAIL')).toBeInTheDocument();
      });
      expect(screen.getByText(`Status: PENDING`)).toBeInTheDocument();
      expect(screen.getByText('Search Engine: google')).toBeInTheDocument();
      expect(screen.getByText('Download PDF')).toBeInTheDocument();
    });
  });

  describe('given download button is clicked', () => {
    it('calls the exportSearchResultPdfAction function', async () => {
      const searchResult = searchResultFactory();
      const resolvedSearchResult = {
        ...searchResult,
        status: 1,
        keyword: 'detail',
        searchEngine: 'google',
      };
      (findSearchResultAction as jest.Mock).mockResolvedValue(resolvedSearchResult);
      (exportSearchResultPdfAction as jest.Mock).mockResolvedValue('Sample-PDF');

      render(<SearchResultDetail id="3" />);
      const user = userEvent.setup();

      await waitFor(async () => {
        const downloadButton = screen.getByTestId('detail-search-result-download');
        await user.click(downloadButton);
      });

      expect(exportSearchResultPdfAction).toHaveBeenCalled();
    });
  });
});
