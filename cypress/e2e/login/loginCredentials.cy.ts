import { LOGIN_SELECTOR } from './selectors';

describe('Login with Credentials', () => {
  beforeEach(() => {
    cy.task('resetDatabase');
  });

  describe('given valid credentials', () => {
    it('redirects user to home page', () => {
      const email = 'dev@nimblehq.co';
      const password = 'password';
      cy.task('setupUser', { email, password });
      cy.visit('/auth/login');

      cy.findByTestId(LOGIN_SELECTOR.inputEmail).type(email);
      cy.findByTestId(LOGIN_SELECTOR.inputPassword).type(password);
      cy.findByTestId(LOGIN_SELECTOR.submitButton).invoke('click').hasActiveSpinner();

      cy.location().should((location) => {
        expect(location.pathname).to.eq('/');
      });
    });
  });

  describe('given INVALID credentials', () => {
    it('throws error', () => {
      const email = 'dev@nimblehq.co';
      const password = 'password';
      cy.visit('/auth/login');

      cy.findByTestId(LOGIN_SELECTOR.inputEmail).type(email);
      cy.findByTestId(LOGIN_SELECTOR.inputPassword).type(password);
      cy.findByTestId(LOGIN_SELECTOR.submitButton).invoke('click').hasActiveSpinner();

      cy.hasToastMessage('error', 'The provided credentials are invalid.');
    });
  });
});
