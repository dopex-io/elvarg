import allPage from '../page-objects/screenshot-all-page';

describe('Test all Page', () => {
  it('Connects with Metamask', () => {
    cy.addArbitrum();

    allPage.openDopexHomePage();
    cy.contains('Connect Wallet').click();
    cy.contains('MetaMask').click();
    cy.switchToMetamaskWindow();
    cy.acceptMetamaskAccess();
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

  // it('click on buttons', () => {
  // cy.contains('SSOV').click();
  // cy.go('back');
  // cy.contains('Open').click();
  // cy.contains('Open').invoke("removeAttr", "target").click();
  // cy.get(selector).invoke('removeAttr', 'target').click();

  // cy.get("a[href]")                           // get all <a> that have an href
  //   .each($el => {
  //     cy.wrap($el.attr('href'), {log:false})
  //     .should("include", "/")
  //     .invoke("removeAttr", "target")
  //     .click();
  //   });
  // cy.go('back');

  // cy.get("a[href]")
  //    .each($el => {
  //     if("cy.wrap($el.attr('href'), {log:false})".contains("/")){
  //       console.log("SSS");
  //     }
  //    });
  //
  // });

  // it('click on all SSOVs buttons', () => {
  //   cy.contains('SSOVs').each(($el, index, $list) => {
  //     cy.wrap($el).click();
  //     cy.go('back');
  //   });
  // });

  // it('click on all open buttons', () => {
  //   cy.contains('Open').each(($el, index, $list) => {
  //     cy.wrap($el).click();
  //     cy.go('back');
  //   });
  // });
});
