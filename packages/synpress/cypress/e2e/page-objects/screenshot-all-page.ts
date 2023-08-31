class AllPage {
  openDopexHomePage() {
    cy.visit('https://app.dopex.io/');
  }

  openPortfolioPage() {
    cy.visit('https://app.dopex.io/portfolio');
  }

  openFarmPage() {
    cy.visit('https://app.dopex.io/farms');
  }

  openVedpxPage() {
    cy.visit('https://app.dopex.io/governance/vedpx');
  }

  openSsovPage() {
    cy.visit('https://app.dopex.io/ssov');
  }

  openStraddlePage() {
    cy.visit('https://app.dopex.io/straddles');
  }

  takeScreenshot() {
    cy.viewport('macbook-15');
    cy.screenshot();
    cy.wait(200);

    cy.viewport('ipad-2');
    cy.screenshot();
    cy.wait(200);

    cy.viewport('iphone-6+');
    cy.screenshot();
    cy.wait(200);

    cy.viewport('macbook-15');
  }
}

export default new AllPage();
