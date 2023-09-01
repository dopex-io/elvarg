import allPage from '../page-objects/screenshot-all-page';

describe('Test all Page', () => {
  it('Connects with Metamask', () => {
    cy.addArbitrum();

    allPage.openDopexHomePage();
    cy.contains('Connect Wallet').click();
    cy.contains('MetaMask').click();
    cy.switchToMetamaskWindow();
    cy.acceptMetamaskAccess(true);
    cy.switchToCypressWindow();
    cy.get('body').type('{esc}');

    allPage.openPortfolioPage();
    cy.url().should('include', 'portfolio');
    allPage.takeScreenshot();

    allPage.openFarmPage();
    cy.url().should('include', 'farms');
    allPage.takeScreenshot();

    allPage.openVedpxPage();
    cy.url().should('include', 'vedpx');
    allPage.takeScreenshot();

    allPage.openSsovPage();
    cy.url().should('include', 'ssov');
    allPage.takeScreenshot();

    allPage.openStraddlePage();
    cy.url().should('include', 'straddles');
    allPage.takeScreenshot();
  });
});
