// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//

import '@testing-library/cypress/add-commands';

// Cypress.Commands.add("login", () => {
//     cy.visit(`/`);
//     cy.findByRole("button", {
//       name: "Connect Wallet",
//     })
//       .click()
//       .then(() => {
//         cy.acceptMetamaskAccess().should("be.true");
//         cy.confirmMetamaskSignatureRequest().should("be.true");
//       });
//   });

Cypress.Commands.add('acceptMetamaskAccess', (allAccounts) => {
  return cy.task('acceptMetamaskAccess', allAccounts);
});

Cypress.Commands.add('addArbitrum', () => {
  cy.addMetamaskNetwork({
    networkName: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    chainId: '42161',
    symbol: 'ETH',
    blockExplorer: 'https://arbiscan.io/',
    isTestnet: false,
  });
  cy.changeMetamaskNetwork('Arbitrum One');
});

Cypress.Commands.add('disconnectAllAccountsFromAllDapps', () => {
  cy.visit(`/`);
  cy.get('[data-cy=metamaskButton]').then(($btn) => {
    if ($btn.text() !== 'Connect Wallet') {
      cy.switchMetamaskAccount(1);
      cy.disconnectMetamaskWalletFromDapp().should('be.true');
      cy.switchMetamaskAccount(2).should('be.true');
      cy.disconnectMetamaskWalletFromDapp().should('be.true');
      cy.switchMetamaskAccount(3).should('be.true');
      cy.disconnectMetamaskWalletFromDapp().should('be.true');
      cy.visit('/');
      cy.findByRole('button', { name: /connect wallet/i }).should('be.visible');
    }
  });
});

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
