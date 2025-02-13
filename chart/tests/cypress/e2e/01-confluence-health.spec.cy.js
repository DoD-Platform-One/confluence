describe('Basic Confluence', function() {
  it('Check Confluence is accessible', function() {
    cy.visit(Cypress.env('url'), { timeout: 15000 })
    cy.title().should('include', 'Confluence');
  })
})

