import * as React from 'react';

import { render, waitFor, screen } from '@testing-library/react';

import SearchResultHtmlModal from './SearchResultHtmlModal';

describe('Search Result Html Modal', () => {
  describe('given valid props', () => {
    describe('given props is set to open', () => {
      it('renders the component', async () => {
        const isOpenModal = true;
        const openModal = jest.fn();
        const closeModal = jest.fn();
        const htmlString = '';

        render(
          <SearchResultHtmlModal
            htmlString={htmlString}
            openModal={openModal}
            closeModal={closeModal}
            isOpenModal={isOpenModal}
          />
        );

        await waitFor(() => {
          const modalElement = screen.queryByTestId('detail-search-result-modal-content');

          expect(modalElement).toBeInTheDocument();
        });
      });
    });

    describe('given props is set to CLOSE', () => {
      it('does NOT render the modal content', async () => {
        const isOpenModal = false;
        const openModal = jest.fn();
        const closeModal = jest.fn();
        const htmlString = '';

        render(
          <SearchResultHtmlModal
            htmlString={htmlString}
            openModal={openModal}
            closeModal={closeModal}
            isOpenModal={isOpenModal}
          />
        );

        await waitFor(() => {
          const modalElement = screen.queryByTestId('detail-search-result-modal-content');

          expect(modalElement).toBeNull();
        });
      });
    });
  });
});
