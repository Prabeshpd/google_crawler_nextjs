import { RouteHandler, RouteMatcher } from 'cypress/types/net-stubbing';

declare global {
  namespace Cypress {
    interface Chainable {
      hasToastMessage(type: 'success' | 'error', message: string): Chainable<any>;
      hasActiveSpinner(): Chainable<any>;
      login(user: any): Chainable<any>;
      navigateTo(pageName: string): Chainable<any>;
      findByTableHeaderColumn(columnName: string): Chainable<any>;
      getIframeContent(dataTestId: string): Chainable<any>;
    }
  }
}
