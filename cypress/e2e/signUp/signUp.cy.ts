import { SIGN_UP_SELECTOR } from './selectors';

describe('Sign Up', () => {
  beforeEach(() => {
    cy.task('resetDatabase');
  });

  describe('given valid credentials', () => {
    it('creates user successfully', () => {
      cy.visit('/auth/signup');

      cy.findByTestId(SIGN_UP_SELECTOR.inputName).type('Dev Nimble');
      cy.findByTestId(SIGN_UP_SELECTOR.inputEmail).type('dev@nimblehq.co');
      cy.findByTestId(SIGN_UP_SELECTOR.inputPassword).type('password');

      cy.findByTestId(SIGN_UP_SELECTOR.submitButton).invoke('click').hasActiveSpinner();

      cy.hasToastMessage(
        'success',
        'The user account has been successfully created. You can now log in.'
      );
    });
  });

  describe('given email is NOT unique', () => {
    it('throws error', () => {
      const [id, email, password] = [1, 'dev@nimblehq.co', 'password'];

      cy.task('setupUser', { email, password, id });

      cy.visit('/auth/signup');
      cy.findByTestId(SIGN_UP_SELECTOR.inputName).type('Dev Nimble');
      cy.findByTestId(SIGN_UP_SELECTOR.inputEmail).type(email);
      cy.findByTestId(SIGN_UP_SELECTOR.inputPassword).type(password);

      cy.findByTestId(SIGN_UP_SELECTOR.submitButton).invoke('click').hasActiveSpinner();

      cy.hasToastMessage('error', 'An issue occurred when creating the user account');
    });
  });
});
