describe('Smoke Test', () => {
  it('Loads the homepage.', () => {
    const baseUrl = Cypress.config('baseUrl');
    cy.visit(baseUrl);
    cy.contains('100 Letters Project');
  });
});