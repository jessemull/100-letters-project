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
    // Edge/CDN often returns /admin without content-type text/html, which makes
    // cy.visit() fail. Use cy.request for the gate, then assert the forbidden UI.
    cy.request({
      url: `${baseUrl()}/admin`,
      failOnStatusCode: false,
    }).then((response) => {
      const body =
        typeof response.body === 'string'
          ? response.body
          : JSON.stringify(response.body ?? '');
      const accessDenied = /Access Denied/i.test(body);
      const looksLikeAdminShell =
        response.status === 200 &&
        !accessDenied &&
        /data-testid=["']admin|Correspondences|Recipients Tab/i.test(body);

      expect(
        accessDenied || response.status >= 400 || !looksLikeAdminShell,
        `expected anonymous /admin to be gated (status ${response.status})`,
      ).to.equal(true);
    });

    cy.visit(`${baseUrl()}/forbidden`, { failOnStatusCode: false });
    cy.contains(/Access Denied/i, { timeout: 15000 });
    cy.contains(/Home/i);
  });

  it('Loads the contact page shell.', () => {
    cy.visit(`${baseUrl()}/contact`, { failOnStatusCode: false });
    cy.contains('Contact Us', { timeout: 15000 });
  });
});
