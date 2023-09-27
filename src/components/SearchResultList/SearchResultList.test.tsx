import * as React from 'react';

import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { listSearchResultsAction } from '@/app/actions/action';
import { searchResultFactory } from '@test/factories/searchResult';

import SearchResultList from './SearchResultList';

jest.mock('../../app/actions/action', () => ({
  listSearchResultsAction: jest.fn(),
  getSearchResultCountAction: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Lists search result', () => {
  describe('given user has no search results', () => {
    it('renders the component with empty rows', async () => {
      (listSearchResultsAction as jest.Mock).mockResolvedValue({ searchResults: [], count: 0 });

      render(<SearchResultList />);

      await waitFor(() => {
        const table = screen.queryByTestId('search-table-body');

        expect(table).toBeNull();
      });
      const tableHeaderColumns = screen.getByTestId('table-header-columns');

      expect(screen.queryByText('Keyword')).toBeInTheDocument();
      expect(screen.queryByTestId('pagination')).toBeNull();
      expect(tableHeaderColumns.children.item(0)?.textContent).toEqual('Keyword');
      expect(tableHeaderColumns.children.item(1)?.textContent).toEqual('Total Link Counts');
      expect(tableHeaderColumns.children.item(2)?.textContent).toEqual('Status');
      expect(tableHeaderColumns.children.item(3)?.textContent).toEqual('Search Engine');
    });
  });

  describe('given user has search results', () => {
    it('renders the table with valid rows', async () => {
      (listSearchResultsAction as jest.Mock).mockResolvedValue({
        searchResults: [searchResultFactory(), searchResultFactory()],
        count: 2,
      });

      render(<SearchResultList />);

      await waitFor(() => {
        const table = screen.queryByTestId('search-table-body');

        expect(table?.children.length).toEqual(2);
      });
      expect(screen.queryByTestId('pagination')).not.toBeNull();
    });
  });

  describe('given next button is clicked', () => {
    it('adds class name active to the page number button', async () => {
      (listSearchResultsAction as jest.Mock).mockResolvedValue({
        searchResults: [searchResultFactory(), searchResultFactory()],
        count: 12,
      });

      render(<SearchResultList />);

      const user = userEvent.setup();

      await waitFor(async () => {
        await user.click(screen.getByText('Next'));
        const button = screen.queryByTestId('pagination-button-page-2');
        expect(button?.classList.contains('pagination__button--active')).toBe(true);
      });
    });
  });

  describe('given filters are applied', () => {
    it('fetches search result with given filters', async () => {
      (listSearchResultsAction as jest.Mock).mockResolvedValue({
        searchResults: [],
        count: 1,
      });

      render(<SearchResultList />);

      const user = userEvent.setup();

      await user.type(screen.getByPlaceholderText('Search for keyword or url'), 'nimble');
      await user.click(screen.getByRole('button', { name: /filter/i }));

      await waitFor(async () => {
        expect(listSearchResultsAction).toHaveBeenCalled();
      });
    });
  });
});
