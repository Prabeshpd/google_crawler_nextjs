'use client';

import * as React from 'react';

import ClipLoader from 'react-spinners/ClipLoader';

import { findSearchResultAction, exportSearchResultPdfAction } from '@/app/actions/action';
import { SearchResultStatus } from '@/constants/enum';
import { useModal } from '@/hooks/useModal';
import toast from '@/lib/toast';

import SearchResultHtmlModal from './SearchResultHtmlModal';

interface DownloadLinkParams {
  base64String: string;
  fileName: string;
  mimeType: string;
}

const MIME_TYPE_PDF = 'application/pdf';

const generateDownloadLink = (downloadLinkParams: DownloadLinkParams) => {
  const { base64String, fileName, mimeType } = downloadLinkParams;

  const byteCharacters = Buffer.from(base64String, 'base64');
  const downloadUrl = window.URL.createObjectURL(new Blob([byteCharacters], { type: mimeType }));
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', fileName);

  link.click();
};

interface SearchResultDetailProps {
  id: string;
}

const SearchResultDetail = (props: SearchResultDetailProps) => {
  const { id } = props;
  const [searchResult, setSearchResult] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [downloadInProgress, setDownloadInProgress] = React.useState<boolean>(false);

  const { openModal, closeModal, modalStatus } = useModal();

  React.useEffect(() => {
    async function findSearchResult() {
      try {
        setLoading(false);
        const data = await findSearchResultAction(id);
        setSearchResult(data);
      } catch (err: any) {
        toast(err.message, 'error');
        setLoading(false);
      }
    }

    findSearchResult();
  }, [id]);

  const downloadPdf = async () => {
    try {
      setDownloadInProgress(true);
      const pdfString = await exportSearchResultPdfAction(searchResult.id);
      if (!pdfString) {
        throw new Error('The PDF file cannot be exported');
      }

      const fileName = `${searchResult.keyword}-${searchResult.searchEngine}-result.pdf`;
      generateDownloadLink({ base64String: pdfString, fileName, mimeType: MIME_TYPE_PDF });
      setDownloadInProgress(false);

      toast(`PDF export successfully created: ${fileName}`, 'success');
    } catch (_err) {
      setDownloadInProgress(false);

      toast('The PDF file cannot be exported', 'error');
    }
  };

  const status =
    Object.keys(SearchResultStatus)[
      Object.values(SearchResultStatus).indexOf(searchResult?.status)
    ] || 'PENDING';

  return (
    (!loading && (
      <>
        <SearchResultHtmlModal
          isOpenModal={modalStatus}
          openModal={openModal}
          closeModal={closeModal}
          htmlString={searchResult?.html || ''}
        />
        <section className="detail-search-result">
          <header
            className="detail-search-result__header"
            data-test-id="detail-search-result-header"
          >
            Search Result Detail of {searchResult && searchResult.keyword?.toUpperCase()}
          </header>
          <p
            className="detail-search-result__info"
            data-test-id="detail-search-result-status"
          >{`Status: ${status}`}</p>
          <p className="detail-search-result__info" data-test-id="detail-search-result-link-counts">
            Total number of links in page: {searchResult?.totalLinksCount || 0}
          </p>
          <p className="detail-search-result__info" data-test-id="detail-search-result-ad-counts">
            Total number of ad words in page: {searchResult?.adWordsTopCount || 0}
          </p>
          <p
            className="detail-search-result__info"
            data-test-id="detail-search-result-non-ad-counts"
          >
            Total number of non ad words: {searchResult?.nonAdLinksCount || 0}
          </p>
          <p
            className="detail-search-result__info"
            data-test-id="detail-search-result-search-engine"
          >
            Search Engine: {searchResult?.searchEngine}
          </p>
          <button
            onClick={openModal}
            data-test-id="detail-search-result-load"
            className="button button--primary detail-search-result__button"
          >
            Load Html
          </button>
          {downloadInProgress ? (
            <ClipLoader />
          ) : (
            <button
              data-test-id="detail-search-result-download"
              className="button button--primary detail-search-result__button"
              onClick={downloadPdf}
            >
              Download PDF
            </button>
          )}
        </section>
      </>
    )) || <ClipLoader />
  );
};

export default SearchResultDetail;
