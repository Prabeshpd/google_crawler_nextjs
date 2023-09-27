'use client';

import * as React from 'react';
import Select from 'react-select';

import { Formik } from 'formik';

import { SEARCH_TYPE_OPTIONS, SEARCH_SCOPE_OPTIONS } from '@/constants/constants';
import { SearchScope, SearchType } from '@/constants/enum';
import { SearchResultFilter } from '@/types/query';

interface FilterFormProps {
  onApplyFilter: (filterParams: SearchResultFilter) => void;
  onResetFilter: () => void;
}

interface FilterFormValues {
  searchType: { value: SearchType; label: string } | null;
  searchScope: { value: SearchScope; label: string } | null;
  queryInput: string;
}

const FilterForm = (props: FilterFormProps) => {
  const { onApplyFilter, onResetFilter } = props;

  const initialValues: FilterFormValues = {
    searchType: null,
    searchScope: null,
    queryInput: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      onReset={() => {
        onResetFilter();
      }}
      onSubmit={async (values) => {
        const payload = {
          queryInput: values.queryInput.trim(),
          scope: values.searchScope?.value,
          type: values.searchType?.value,
        };

        onApplyFilter(payload);
      }}
    >
      {({ handleChange, handleSubmit, isSubmitting, setFieldValue, values, handleReset }) => (
        <form
          className="form list-search-result-form"
          onSubmit={handleSubmit}
          onReset={handleReset}
        >
          <Select
            aria-label="Search Type"
            id="list-search-result-form-type"
            className="react-select"
            classNamePrefix="react-select"
            name="search-type"
            key={values.searchType?.value}
            value={SEARCH_TYPE_OPTIONS.find((option) => option.value === values.searchType?.value)}
            options={SEARCH_TYPE_OPTIONS}
            onChange={(selectedOption) => setFieldValue('searchType', selectedOption)}
            isClearable={true}
          />
          <Select
            name="search-scope"
            id="list-search-result-form-scope"
            aria-label="Search Scope"
            className="react-select"
            classNamePrefix="react-select"
            key={values.searchScope?.value}
            value={SEARCH_SCOPE_OPTIONS.find(
              (option) => option.value === values.searchScope?.value
            )}
            options={SEARCH_SCOPE_OPTIONS}
            onChange={(selectedOption) => setFieldValue('searchScope', selectedOption)}
            isClearable={true}
          />
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <input
            onChange={handleChange}
            type="text"
            data-test-id="list-search-result-form-input"
            id="table-search"
            name="queryInput"
            className="list-search-result__input"
            placeholder="Search for keyword or url"
          />
          <button
            data-test-id="list-search-result-form-submit"
            className="button button--primary"
            disabled={isSubmitting}
            type="submit"
            name="submit"
          >
            Filter
          </button>
          <button
            data-test-id="list-search-result-form-reset"
            type="reset"
            name="reset"
            className="button button--secondary list-search-result-form__button--reset"
          >
            Reset
          </button>
        </form>
      )}
    </Formik>
  );
};

export default FilterForm;
