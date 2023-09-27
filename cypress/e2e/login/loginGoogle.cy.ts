import { LOGIN_SELECTOR } from './selectors';

describe('Login with Google', () => {
  beforeEach(() => {
    cy.task('resetDatabase');
  });

  describe('given valid credentials', () => {
    it('redirects user to home page', () => {
      const baseUrl = Cypress.config('baseUrl');

      cy.visit('/auth/login');
      cy.intercept(
        {
          method: 'POST',
          url: `${baseUrl}/api/auth/signin/google?`,
        },
        { fixture: 'Authentication/Google/valid' }
      );
      cy.intercept(
        {
          method: 'POST',
          url: `${baseUrl}/`,
        },
        { body: { name: 'dev nimble' } }
      );

      cy.fixture('Authentication/Google/valid').then((oauthToken) => {
        cy.setCookie('next-auth.session-token', oauthToken.data.accessToken);
      });
      cy.findByTestId(LOGIN_SELECTOR.googleLoginButton).click();

      cy.location().should((location) => {
        expect(location.pathname).to.eq('/');
      });
    });
  });
});
