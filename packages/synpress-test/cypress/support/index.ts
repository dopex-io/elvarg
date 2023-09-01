import './commands';
import '@synthetixio/synpress/support';

// cypress/support/index.ts
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      addArbitrum(): void;
      disconnectAllAccountsFromAllDapps(): void;
      connectWallet(): void;
    }
  }
}
