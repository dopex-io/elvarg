import './commands';
import '@synthetixio/synpress/support';

declare global {
  namespace Cypress {
    interface Chainable {
      addArbitrum(): void;
      disconnectAllAccountsFromAllDapps(): void;
      connectWallet(): void;
    }
  }
}
