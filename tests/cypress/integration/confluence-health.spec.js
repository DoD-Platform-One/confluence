// needs to be fixed
describe('Basic Confluence', function() {
  it('Check Confluence is accessible', function() {
  cy.visit(Cypress.env('confluence_url'))
  cy.wait(5000)
  })
})

