import * as React from 'react';

import { render, waitFor, screen } from '@testing-library/react';

import Pagination from './Pagination';

describe('Pagination:', () => {
  describe('given valid props', () => {
    it('renders the component', async () => {
      render(
        <Pagination
          totalRowCount={12}
          perPageLimit={10}
          currentPage={1}
          totalPageCount={2}
          handleChange={jest.fn()}
        />
      );

      await waitFor(() => {
        expect(screen.queryByTestId('pagination')).not.toBeNull();
      });
      const paginationList = screen.getByTestId('pagination__list');
      expect(paginationList.children.length).toEqual(4);
    });
  });

  describe('given totalLength is zero', () => {
    it('does not render the component', async () => {
      render(
        <Pagination
          totalRowCount={0}
          perPageLimit={10}
          currentPage={1}
          totalPageCount={0}
          handleChange={jest.fn()}
        />
      );

      await waitFor(() => {
        expect(screen.queryByTestId('pagination')).toBeNull();
      });
    });
  });
});
