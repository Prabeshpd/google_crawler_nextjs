import { SEARCH_RESULT_DETAIL_MODAL_SELECTOR, SEARCH_RESULT_DETAIL_SELECTOR } from './selectors';

describe('View search result detail from google', () => {
  beforeEach(() => {
    cy.task('resetDatabase');
  });

  it('displays the search result detail', () => {
    const [userId, email, password] = [1, 'dev@nimblehq.co', 'password'];
    const searchResultScrapedPayload = {
      searchResult: {
        userId,
        keyword: 'no/de',
      },
      validHtml: true,
      searchEngine: 'google',
    };

    cy.task('setupUser', { id: userId, email, password });
    cy.task('setupScrapedSearchResult', searchResultScrapedPayload);

    cy.login({ email, password });
    cy.navigateTo('searchResults');
    cy.findByTableHeaderColumn('search-engine-column').contains('google').click();

    cy.findByTestId(SEARCH_RESULT_DETAIL_SELECTOR.status)
      .invoke('text')
      .should('contain', 'PENDING');
    cy.findByTestId(SEARCH_RESULT_DETAIL_SELECTOR.searchEngine)
      .invoke('text')
      .should('contain', 'google');
  });

  describe('given there is valid scraped html', () => {
    it('renders the html content in modal', () => {
      const [userId, email, password] = [1, 'dev@nimblehq.co', 'password'];
      const searchResultScrapedPayload = {
        searchResult: {
          userId,
          keyword: 'no/de',
        },
        validHtml: true,
        searchEngine: 'google',
      };

      cy.task('setupUser', { id: userId, email, password });
      cy.task('setupScrapedSearchResult', searchResultScrapedPayload);

      cy.login({ email, password });
      cy.navigateTo('searchResults');
      cy.findByTableHeaderColumn('search-engine-column').contains('google').first().click();
      cy.findByTestId(SEARCH_RESULT_DETAIL_SELECTOR.loadHtmlButton).click();

      cy.getIframeContent(SEARCH_RESULT_DETAIL_MODAL_SELECTOR.iframe).as('iframeContent');
      cy.get('@iframeContent').its('body').as('iframeBody');

      cy.findByTestId(SEARCH_RESULT_DETAIL_MODAL_SELECTOR.modal).should('exist');
      cy.get('@iframeBody')
        .find(SEARCH_RESULT_DETAIL_MODAL_SELECTOR.iframeContentGoogle)
        .should('exist');
      cy.get('@iframeBody')
        .find(SEARCH_RESULT_DETAIL_MODAL_SELECTOR.iframeContentUrlGoogle)
        .first()
        .invoke('attr', 'href')
        .then((text) => {
          expect(text).contain('https://youtube.com');
        });
    });
  });

  describe('given there is empty html string', () => {
    it('renders empty html content in modal', () => {
      const [userId, email, password] = [1, 'dev@nimblehq.co', 'password'];
      const searchResultScrapedPayload = {
        searchResult: {
          userId,
          keyword: 'no/de',
        },
        validHtml: false,
        searchEngine: 'google',
      };

      cy.task('setupUser', { id: userId, email, password });
      cy.task('setupScrapedSearchResult', searchResultScrapedPayload);

      cy.login({ email, password });
      cy.navigateTo('searchResults');
      cy.findByTableHeaderColumn('search-engine-column').contains('google').first().click();
      cy.findByTestId(SEARCH_RESULT_DETAIL_SELECTOR.loadHtmlButton).click();

      cy.getIframeContent(SEARCH_RESULT_DETAIL_MODAL_SELECTOR.iframe).as('iframeContent');
      cy.get('@iframeContent').its('body').as('iframeBody').children().should('not.exist');
    });
  });
});
