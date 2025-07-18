// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom commands for TodoApp

// Login command (if authentication is needed)
Cypress.Commands.add('login', (email = 'test@example.com', password = 'password') => {
  cy.visit('/login')
  cy.get('[data-testid="email-input"]').type(email)
  cy.get('[data-testid="password-input"]').type(password)
  cy.get('[data-testid="login-button"]').click()
})

// Add a todo task
Cypress.Commands.add('addTodo', (todoText) => {
  cy.get('[placeholder*="tâche"], [placeholder*="Nouvelle"], input[type="text"]').first().type(todoText)
  cy.get('button').contains(/ajouter/i).click()
})

// Complete a todo task
Cypress.Commands.add('completeTodo', (todoText) => {
  cy.contains(todoText).parent().find('[type="checkbox"]').check()
})

// Delete a todo task
Cypress.Commands.add('deleteTodo', (todoText) => {
  cy.contains(todoText).parent().find('button').contains(/supprimer|delete/i).click()
})

// Clear all todos
Cypress.Commands.add('clearAllTodos', () => {
  cy.get('body').then(($body) => {
    if ($body.find('[data-testid="clear-all"], button').filter(':contains("Tout supprimer")').length > 0) {
      cy.get('[data-testid="clear-all"], button').filter(':contains("Tout supprimer")').click()
    }
  })
})

// Check todo count
Cypress.Commands.add('checkTodoCount', (count) => {
  cy.get('[data-testid="todos-count"], [data-testid="todo-count"]').should('contain', count.toString())
})

// Visit page with localStorage cleared
Cypress.Commands.add('visitClean', (url = '/') => {
  cy.clearLocalStorage()
  cy.visit(url)
})

// Wait for app to be ready
Cypress.Commands.add('waitForApp', () => {
  cy.get('[data-testid="app"], #root', { timeout: 10000 }).should('be.visible')
})

// Custom assertion for todo visibility
Cypress.Commands.add('shouldHaveTodo', (todoText) => {
  cy.contains(todoText).should('be.visible')
})

Cypress.Commands.add('shouldNotHaveTodo', (todoText) => {
  cy.contains(todoText).should('not.exist')
})
