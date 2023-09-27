'use client';

import * as React from 'react';
import Modal from 'react-modal';

import { MODAL_DEFAULT_STYLES } from '@/constants/constants';

interface SearchResultHtmlModalProps {
  isOpenModal: boolean;
  htmlString: string;

  openModal: () => void;
  closeModal: () => void;
}

const SearchResultHtmlModal = (props: SearchResultHtmlModalProps) => {
  const { closeModal, isOpenModal, htmlString } = props;
  return (
    <div data-test-id="detail-search-result-modal" className="modal">
      <Modal
        isOpen={isOpenModal}
        onRequestClose={closeModal}
        style={{ content: { ...MODAL_DEFAULT_STYLES.content, height: '80%' } }}
        ariaHideApp={false}
      >
        <div className="modal__head">
          <h3>Search Result Html Page</h3>
          <button onClick={closeModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal__body" data-test-id="detail-search-result-modal-content">
          <iframe
            className="modal__iframe"
            data-test-id="detail-search-result-iframe"
            srcDoc={htmlString}
            title="Html Page"
          ></iframe>
        </div>

        <div className="modal__footer">
          <button type="reset" onClick={closeModal} className="button button--secondary">
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SearchResultHtmlModal;
