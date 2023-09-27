import * as React from 'react';
import selectEvent from 'react-select-event';

import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SearchScope, SearchType } from '@/constants/enum';

import FilterForm from './FilterForm';

describe('Filter form', () => {
  describe('given valid props', () => {
    it('renders the component', async () => {
      const onApplyFilter = jest.fn();
      const onResetFilter = jest.fn();

      render(<FilterForm onApplyFilter={onApplyFilter} onResetFilter={onResetFilter} />);

      await waitFor(() => {
        const inputQueryElement = screen.getByPlaceholderText('Search for keyword or url');

        expect(inputQueryElement).toBeInTheDocument();
      });
      const submitButtonElement = screen.getByRole('button', { name: 'Filter' });

      expect(submitButtonElement).toBeInTheDocument();
    });
  });

  describe('given form is submitted', () => {
    it('submits the form"s input values on submit', async () => {
      const onApplyFilter = jest.fn();
      const onResetFilter = jest.fn();

      render(<FilterForm onApplyFilter={onApplyFilter} onResetFilter={onResetFilter} />);

      const user = userEvent.setup();
      await selectEvent.select(screen.getByLabelText('Search Type'), ['Exact']);
      await selectEvent.select(screen.getByLabelText('Search Scope'), ['Keyword']);
      const inputQueryElement = screen.getByPlaceholderText('Search for keyword or url');
      const submitButtonElement = screen.getByRole('button', { name: 'Filter' });
      await user.type(inputQueryElement, 'node');
      await user.click(submitButtonElement);

      await waitFor(() => {
        expect(onApplyFilter).toHaveBeenCalledWith({
          queryInput: 'node',
          type: SearchType.EXACT,
          scope: SearchScope.KEYWORD,
        });
      });
    });
  });
});
