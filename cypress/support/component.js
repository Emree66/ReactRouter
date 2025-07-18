// Import commands.js using ES2015 syntax:
import './commands'

// Import React component testing support
import { mount } from 'cypress/react18'

// Add mount command
Cypress.Commands.add('mount', mount)
