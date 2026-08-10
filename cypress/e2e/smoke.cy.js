describe('Critical flows', () => {
  const baseUrl = () => Cypress.config('baseUrl');

  it('Loads the homepage feed shell.', () => {
    cy.visit(baseUrl());
    cy.contains('100 Letters Project');
    cy.get('input[placeholder="Search for letters and people..."]').should(
      'be.visible',
    );
  });

  it('Loads the login page.', () => {
    cy.visit(`${baseUrl()}/login`);
    cy.contains('Login');
    cy.get('input[placeholder="Username"]').should('be.visible');
    cy.get('input[placeholder="Password"]').should('be.visible');
  });

  it('Gates admin behind auth (redirects to Access Denied).', () => {
    cy.visit(`${baseUrl()}/admin`);
    cy.contains('Access Denied', { timeout: 15000 });
    cy.contains('Home');
  });

  it('Loads the contact page shell.', () => {
    cy.visit(`${baseUrl()}/contact`);
    cy.contains('Contact Us');
  });
});
