import { SEARCH_RESULT_LIST_FILTER_SELECTOR, SEARCH_RESULT_LIST_SELECTOR } from './selectors';

describe('Filter search results with url', () => {
  beforeEach(() => {
    cy.task('resetDatabase');
  });

  describe('given search type is "exact"', () => {
    it('displays valid data', () => {
      const queryText = 'www.node.com';
      const [userId, email, password] = [1, 'dev@nimblehq.co', 'password'];
      const searchResultPayload = [
        {
          userId,
          keyword: 'no/de',
          adWordTopUrls: ['www.google.com/nimble/compass', 'www.youtube.com'],
        },
        {
          userId,
          keyword: 'noted',
          nonAdUrls: ['www.node.com', 'www.youtube.com'],
        },
      ];

      cy.task('setupUser', { id: userId, email, password });
      cy.task('setupSearchResults', searchResultPayload);

      cy.login({ email, password });
      cy.navigateTo('searchResults');
      cy.get(SEARCH_RESULT_LIST_FILTER_SELECTOR.selectType).type('Exact {enter}{enter}');
      cy.get(SEARCH_RESULT_LIST_FILTER_SELECTOR.selectScope).type('url {enter}{enter}');
      cy.findByTestId(SEARCH_RESULT_LIST_FILTER_SELECTOR.inputText).type(queryText);
      cy.findByTestId(SEARCH_RESULT_LIST_FILTER_SELECTOR.submitButton).click();

      cy.findByTestId(SEARCH_RESULT_LIST_SELECTOR.tableBody).children().as('tableRows');

      cy.get('@tableRows').should('have.length', 1);
      cy.findByTableHeaderColumn('keyword-column').should('contain', 'noted');
    });
  });

  describe('given search type is "pattern"', () => {
    it('displays valid data', () => {
      const queryText = 'nimble';
      const [userId, email, password] = [1, 'dev@nimblehq.co', 'password'];
      const searchResultPayload = [
        {
          userId,
          keyword: 'no/de',
          adWordTopUrls: ['www.google.com/nimble/compass', 'www.youtube.com'],
        },
        {
          userId,
          keyword: 'noted',
          nonAdUrls: ['www.node.com', 'www.youtube.com'],
        },
      ];

      cy.task('setupUser', { id: userId, email, password });
      cy.task('setupSearchResults', searchResultPayload);

      cy.login({ email, password });
      cy.navigateTo('searchResults');
      cy.get(SEARCH_RESULT_LIST_FILTER_SELECTOR.selectType).type('Pattern {enter}{enter}');
      cy.get(SEARCH_RESULT_LIST_FILTER_SELECTOR.selectScope).type('url {enter}{enter}');
      cy.findByTestId(SEARCH_RESULT_LIST_FILTER_SELECTOR.inputText).type(queryText);
      cy.findByTestId(SEARCH_RESULT_LIST_FILTER_SELECTOR.submitButton).click();

      cy.findByTestId(SEARCH_RESULT_LIST_SELECTOR.tableBody).children().as('tableRows');

      cy.get('@tableRows').should('have.length', 1);
      cy.findByTableHeaderColumn('keyword-column').should('contain', 'no/de');
    });
  });

  describe('given search type is "partial"', () => {
    it('displays valid data', () => {
      const queryText = '/';
      const [userId, email, password] = [1, 'dev@nimblehq.co', 'password'];
      const searchResultPayload = [
        {
          userId,
          keyword: 'no/de',
          adWordTopUrls: ['www.google.com/nimble/compass', 'www.youtube.com'],
        },
        {
          userId,
          keyword: 'noted',
          nonAdUrls: ['www.node.com', 'www.youtube.com'],
        },
      ];

      cy.task('setupUser', { id: userId, email, password });
      cy.task('setupSearchResults', searchResultPayload);

      cy.login({ email, password });
      cy.navigateTo('searchResults');
      cy.get(SEARCH_RESULT_LIST_FILTER_SELECTOR.selectType).type('Partial {enter}{enter}');
      cy.get(SEARCH_RESULT_LIST_FILTER_SELECTOR.selectScope).type('url {enter}{enter}');
      cy.findByTestId(SEARCH_RESULT_LIST_FILTER_SELECTOR.inputText).type(queryText);
      cy.findByTestId(SEARCH_RESULT_LIST_FILTER_SELECTOR.submitButton).click();

      cy.findByTestId(SEARCH_RESULT_LIST_SELECTOR.tableBody).children().as('tableRows');

      cy.get('@tableRows').should('have.length', 1);
      cy.findByTableHeaderColumn('keyword-column').should('contain', 'no/de');
    });
  });
});
