// https://on.cypress.io/api

describe('App Root', () => {
  it('Visits app root depending on the mode', () => {
    cy.visit('/', {})

    if (Cypress.env('mode') === 'maintenance') {
      cy.contains('p', 'Site web en maintenance');
    } else {
      cy.contains('h1', 'Home Page')
    }
  })
})
