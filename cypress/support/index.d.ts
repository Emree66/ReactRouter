/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login
     * @example cy.login('email@example.com', 'password')
     */
    login(email?: string, password?: string): Chainable<Element>
    
    /**
     * Custom command to add a todo
     * @example cy.addTodo('My new task')
     */
    addTodo(todoText: string): Chainable<Element>
    
    /**
     * Custom command to complete a todo
     * @example cy.completeTodo('Task to complete')
     */
    completeTodo(todoText: string): Chainable<Element>
    
    /**
     * Custom command to delete a todo
     * @example cy.deleteTodo('Task to delete')
     */
    deleteTodo(todoText: string): Chainable<Element>
    
    /**
     * Custom command to clear all todos
     * @example cy.clearAllTodos()
     */
    clearAllTodos(): Chainable<Element>
    
    /**
     * Custom command to check todo count
     * @example cy.checkTodoCount(5)
     */
    checkTodoCount(count: number): Chainable<Element>
    
    /**
     * Custom command to visit page with clean localStorage
     * @example cy.visitClean('/dashboard')
     */
    visitClean(url?: string): Chainable<Element>
    
    /**
     * Custom command to wait for app to be ready
     * @example cy.waitForApp()
     */
    waitForApp(): Chainable<Element>
    
    /**
     * Custom command to check if todo is visible
     * @example cy.shouldHaveTodo('My task')
     */
    shouldHaveTodo(todoText: string): Chainable<Element>
    
    /**
     * Custom command to check if todo is not visible
     * @example cy.shouldNotHaveTodo('Deleted task')
     */
    shouldNotHaveTodo(todoText: string): Chainable<Element>
  }
}
