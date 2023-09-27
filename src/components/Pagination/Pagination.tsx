'use client';

import * as React from 'react';

import { usePagination, PAGINATION_CHANGE, PaginationProps } from './hooks';

export interface PaginationUnitProps {
  state: string;
  text: string;
  keyIndex: number;

  onClick: (page: number) => void;
}

interface PaginationBlockProps extends PaginationProps {
  currentPage: number;

  onPreviousClick: () => void;
  onNextClick: () => void;
  onPageUnitClick: (pageNumber: number) => void;
}

function PaginationUnit(paginationUnitProps: PaginationUnitProps) {
  return (
    <li key={`${paginationUnitProps.keyIndex}-${paginationUnitProps.text}`}>
      <button
        data-test-id={`pagination-button-page-${paginationUnitProps.keyIndex}`}
        onClick={() => {
          paginationUnitProps.onClick(paginationUnitProps.keyIndex);
        }}
        className={`pagination__button ${
          paginationUnitProps.state === 'active' ? 'pagination__button--active' : ''
        }`}
      >
        {paginationUnitProps.text}
      </button>
    </li>
  );
}

function PaginationList(paginationBlockProps: PaginationBlockProps) {
  if (paginationBlockProps.totalPageCount === 1) {
    const props = {
      onClick: () => {
        paginationBlockProps.onPageUnitClick(1);
      },
      state: 'active',
      text: '1',
      keyIndex: 1,
    };

    return <PaginationUnit {...props} />;
  }

  let paginationChildren: Array<any> = Array.from(
    { length: paginationBlockProps.totalPageCount },
    (_, i) => i + 1
  );

  paginationChildren = paginationChildren.map((page) => {
    const props = {
      onClick: () => {
        paginationBlockProps.onPageUnitClick(page);
      },
      state: page === paginationBlockProps.currentPage ? 'active' : 'inactive',
      text: page.toString(),
      keyIndex: page,
    };

    return <PaginationUnit key={page} {...props} />;
  });

  paginationChildren.unshift(
    PaginationUnit({
      state: 'inactive',
      text: 'Prev',
      onClick: () => {
        paginationBlockProps.onPreviousClick();
      },
      keyIndex: 0,
    })
  );

  paginationChildren.push(
    PaginationUnit({
      state: 'inactive',
      text: 'Next',
      onClick: () => {
        paginationBlockProps.onNextClick();
      },
      keyIndex: paginationBlockProps.totalPageCount + 1,
    })
  );

  return paginationChildren;
}

export default function Pagination(paginationProps: PaginationProps) {
  const { state, dispatch } = usePagination(paginationProps);

  React.useEffect(() => {
    paginationProps.handleChange(state.currentPage);
  }, [state.currentPage]);

  const currentPage = Number(state.currentPage);
  const perPageLimit = Number(paginationProps.perPageLimit);

  const startRowNumber = currentPage === 1 ? 1 : (currentPage - 1) * perPageLimit + 1;
  const endRowNumber =
    startRowNumber - 1 + perPageLimit > paginationProps.totalRowCount
      ? paginationProps.totalRowCount
      : startRowNumber - 1 + perPageLimit;

  const onPreviousClick = () => {
    dispatch({ type: PAGINATION_CHANGE.PREV_PAGE });
  };

  const onNextClick = () => {
    dispatch({ type: PAGINATION_CHANGE.NEXT_PAGE });
  };

  const onPageUnitClick = (pageNumber: number) => {
    dispatch({ type: PAGINATION_CHANGE.GO_TO_PAGE, payload: pageNumber });
  };

  if (!paginationProps.totalPageCount) return <></>;

  return (
    <nav className="pagination-navigation" data-test-id="pagination">
      <span className="pagination-navigation__info">
        Showing
        <span className="pagination-navigation__info--bold">{`${startRowNumber}-${endRowNumber}`}</span>
        of
        <span className="pagination-navigation__info--bold">{`${paginationProps.totalRowCount}`}</span>
      </span>
      <ul data-test-id="pagination__list" className="pagination-navigation__list">
        {PaginationList({
          ...paginationProps,
          onNextClick,
          onPageUnitClick,
          onPreviousClick,
          currentPage: state.currentPage,
        })}
      </ul>
    </nav>
  );
}
