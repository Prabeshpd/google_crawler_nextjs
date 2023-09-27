/// <reference types="cypress" />

import '@testing-library/cypress/add-commands';

import { LOGIN_SELECTOR } from '../e2e/login/selectors';
import { APPLICATION_LOADER, APPLICATION_NAV_SELECTOR } from '../constants/selectors';

Cypress.Commands.add('hasToastMessage', (type: 'success' | 'error', message: string) => {
  const toastId = type === 'success' ? 'toast-success' : 'toast-error';

  cy.get(`[id=${toastId}]`).should('contain', message);
});

Cypress.Commands.add('hasActiveSpinner', () => {
  cy.get(`[aria-label=${APPLICATION_LOADER}]`).should('be.visible');
});

Cypress.Commands.add('login', (user: any) => {
  cy.visit('/auth/login');
  cy.findByTestId(LOGIN_SELECTOR.inputEmail).type(user.email);
  cy.findByTestId(LOGIN_SELECTOR.inputPassword).type(user.password);

  cy.findByTestId(LOGIN_SELECTOR.submitButton).click();
});

Cypress.Commands.add('navigateTo', (pageName: string) => {
  switch (pageName) {
    case 'searchResults':
      return cy.findByTestId(APPLICATION_NAV_SELECTOR.searchResult).click();

    case 'uploads':
      return cy.findByTestId(APPLICATION_NAV_SELECTOR.upload).click();

    default:
      throw new Error('Page does not exist in application');
  }
});

Cypress.Commands.add('findByTableHeaderColumn', (columnName: string) => {
  cy.get(`td[headers=${columnName}]`);
});

Cypress.Commands.add('getIframeContent', (dataTestId: string) => {
  cy.get(`iframe[data-test-id=${dataTestId}]`).its('0.contentDocument');
});
