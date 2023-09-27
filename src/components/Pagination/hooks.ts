import { useReducer } from 'react';

export enum PAGINATION_CHANGE {
  GO_TO_PAGE = 'GOTO',
  PREV_PAGE = 'PREV',
  NEXT_PAGE = 'NEXT',
}

export interface PaginationProps {
  perPageLimit: number;
  currentPage: number;
  totalRowCount: number;
  totalPageCount: number;

  handleChange: (page: number) => void;
}

function handlePageChange(state: any, action: string, totalPageCount: number) {
  switch (action) {
    case PAGINATION_CHANGE.PREV_PAGE:
      return state.currentPage > 1
        ? { ...state, currentPage: state.currentPage - 1 }
        : { ...state };

    case PAGINATION_CHANGE.NEXT_PAGE:
      return state.currentPage < totalPageCount
        ? { ...state, currentPage: state.currentPage + 1 }
        : { ...state };

    default:
      return { ...state };
  }
}

function usePagination(pageProps: PaginationProps) {
  const totalPageCount = pageProps.totalPageCount;

  const [pageState, dispatch] = useReducer(
    (state: any, action: any) => {
      switch (action.type) {
        case PAGINATION_CHANGE.GO_TO_PAGE:
          return {
            ...state,
            currentPage: action.payload,
          };
        case PAGINATION_CHANGE.PREV_PAGE:
          return handlePageChange(
            state,
            (action.state = PAGINATION_CHANGE.PREV_PAGE),
            totalPageCount
          );
        case PAGINATION_CHANGE.NEXT_PAGE:
          return handlePageChange(
            state,
            (action.state = PAGINATION_CHANGE.NEXT_PAGE),
            totalPageCount
          );
        default:
          return state;
      }
    },
    {
      currentPage: pageProps.currentPage,
      totalPageCount,
    }
  );

  return { state: pageState, dispatch };
}

export { usePagination };
