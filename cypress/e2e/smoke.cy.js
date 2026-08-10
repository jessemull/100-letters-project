describe('Critical flows', () => {
  const baseUrl = () => Cypress.config('baseUrl') || '';

  before(() => {
    // Settle proxy signed-cookie redirect (merge) or static server health (PR).
    const healthUrl = baseUrl().includes(':8080')
      ? `${baseUrl()}/healthcheck`
      : baseUrl();
    cy.request({ url: healthUrl, failOnStatusCode: false });
  });

  it('Loads the homepage feed shell.', () => {
    cy.visit(baseUrl());
    cy.contains('100 Letters Project', { timeout: 15000 });
    cy.get('input[placeholder="Search for letters and people..."]', {
      timeout: 15000,
    }).should('be.visible');
  });

  it('Loads the login page.', () => {
    cy.visit(`${baseUrl()}/login`, { failOnStatusCode: false });
    cy.contains('Login', { timeout: 15000 });
    cy.get('input[placeholder="Username"]').should('be.visible');
    cy.get('input[placeholder="Password"]').should('be.visible');
  });

  it('Gates admin behind auth (Access Denied).', () => {
    // Edge may serve static 403.html; client ProtectedRoute may land on /forbidden.
    // Both surfaces share the Access Denied copy.
    cy.visit(`${baseUrl()}/admin`, { failOnStatusCode: false });
    cy.contains(/Access Denied/i, { timeout: 20000 });
    cy.contains(/Home/i);
  });

  it('Loads the contact page shell.', () => {
    cy.visit(`${baseUrl()}/contact`, { failOnStatusCode: false });
    cy.contains('Contact Us', { timeout: 15000 });
  });
});
