import '@testing-library/cypress/add-commands';

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
