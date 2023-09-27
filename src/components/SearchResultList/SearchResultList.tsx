'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';
import ClipLoader from 'react-spinners/ClipLoader';

import { listSearchResultsAction } from '@/app/actions/action';
import { PAGINATION_CURRENT_PAGE, PAGINATION_LIMIT } from '@/constants/constants';
import { SearchResultStatus } from '@/constants/enum';
import toast from '@/lib/toast';
import { SearchResultFilter } from '@/types/query';

import FilterForm from './FilterForm';
import Pagination from '../Pagination/Pagination';

interface Meta {
  limit: number;
  totalCounts: number;
  currentPage: number;
}

interface PaginationParams {
  maxRows: number;
  currentPage: number;
}

const SearchResultList = () => {
  const router = useRouter();

  const [pageNumber, setPageNumber] = React.useState<number>(PAGINATION_CURRENT_PAGE);
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [meta, setMeta] = React.useState<Meta>({
    limit: PAGINATION_LIMIT,
    totalCounts: 0,
    currentPage: PAGINATION_CURRENT_PAGE,
  });
  const [loading, setLoading] = React.useState<boolean>(false);
  const [filterParams, setFilterParams] = React.useState<any>(null);

  const getQueryParams = () => ({
    maxRows: PAGINATION_LIMIT,
    currentPage: pageNumber,
  });

  const listSearchResults = async (
    paginationParams: PaginationParams,
    filterQueryParams: SearchResultFilter = {}
  ) => {
    setLoading(true);
    try {
      const fetchedSearchResult = await listSearchResultsAction(
        paginationParams,
        filterQueryParams
      );
      setSearchResults(fetchedSearchResult.searchResults);
      setMeta({
        limit: PAGINATION_LIMIT,
        totalCounts: fetchedSearchResult.count,
        currentPage: pageNumber,
      });
      setLoading(false);
    } catch (err: any) {
      toast('Unable to fetch the list of keywords.', 'error');
      setLoading(false);
    }
  };

  const onApplyFilter = async (filterParameters: SearchResultFilter) => {
    const paginationParams = getQueryParams();
    setFilterParams(filterParameters);

    await listSearchResults(paginationParams, filterParameters);
  };

  const resetFilter = async () => {
    const paginationParams = getQueryParams();
    setFilterParams(null);

    await listSearchResults(paginationParams);
  };

  React.useEffect(() => {
    const paginationParams = getQueryParams();

    listSearchResults(paginationParams, filterParams);
  }, [pageNumber]);

  return (
    <section className="list-search-result">
      <header className="list-search-result__header">
        <FilterForm onApplyFilter={onApplyFilter} onResetFilter={resetFilter} />
      </header>
      <table className="table">
        <thead className="table__head">
          <tr data-test-id="table-header-columns">
            <th>Keyword</th>
            <th>Total Link Counts</th>
            <th>Status</th>
            <th>Search Engine</th>
          </tr>
        </thead>
        {(!loading && (
          <tbody data-test-id="search-table-body" className="table__body">
            {searchResults.map((result) => {
              return (
                <tr
                  onClick={() => {
                    router.push(`/search-result/${result.id}`);
                  }}
                  key={result.id}
                >
                  <td headers="keyword-column">{result.keyword}</td>
                  <td headers="total-links-count-column">{result.totalLinksCount || 0}</td>
                  <td headers="status-column">
                    {Object.keys(SearchResultStatus)[
                      Object.values(SearchResultStatus).indexOf(result.status)
                    ] || 'PENDING'}
                  </td>
                  <td headers="search-engine-column">{result.searchEngine || ''}</td>
                </tr>
              );
            })}
          </tbody>
        )) || <ClipLoader />}
      </table>
      <Pagination
        totalPageCount={Math.ceil(meta.totalCounts / meta.limit)}
        perPageLimit={meta.limit}
        currentPage={meta.currentPage}
        handleChange={(number: number) => {
          setPageNumber(number);
        }}
        totalRowCount={meta.totalCounts}
      />
    </section>
  );
};

export default SearchResultList;
