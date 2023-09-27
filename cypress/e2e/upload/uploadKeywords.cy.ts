import { SEARCH_RESULT_LIST_SELECTOR } from '../searchResults/selectors';

import { UPLOAD_SELECTOR } from './selectors';

describe('Upload keyword CSV file', () => {
  beforeEach(() => {
    cy.task('resetDatabase');
  });

  describe('given a valid CSV file', () => {
    it('creates keywords uploading file successfully', () => {
      const [userId, email, password] = [1, 'dev@nimblehq.co', 'password'];

      cy.task('setupUser', { id: userId, email, password });

      cy.login({ email, password });
      cy.navigateTo('uploads');
      cy.findByTestId(UPLOAD_SELECTOR.input).selectFile('./test/fixtures/file.csv', {
        force: true,
      });

      cy.findByTestId(UPLOAD_SELECTOR.uploadButton).invoke('click').hasActiveSpinner();
      cy.navigateTo('searchResults');
      cy.findByTestId(SEARCH_RESULT_LIST_SELECTOR.tableBody).children().as('tableRows');

      cy.get('@tableRows').should('have.length', 4);
    });
  });

  describe('given an INVALID file', () => {
    it('fails to create keywords', () => {
      const [userId, email, password] = [1, 'dev@nimblehq.co', 'password'];

      cy.task('setupUser', { id: userId, email, password });

      cy.login({ email, password });
      cy.navigateTo('uploads');
      cy.findByTestId(UPLOAD_SELECTOR.input).selectFile('./test/fixtures/invalidFile.csv', {
        force: true,
      });

      cy.findByTestId(UPLOAD_SELECTOR.uploadButton).invoke('click').hasActiveSpinner();
      cy.navigateTo('searchResults');
      cy.findByTestId(SEARCH_RESULT_LIST_SELECTOR.tableBody).children().should('not.exist');
    });
  });
});
