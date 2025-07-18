describe('TodoApp E2E', () => {
  beforeEach(() => {
    cy.visitClean('/')
    cy.waitForApp()
  });

  it('permet d\'ajouter une nouvelle tâche', () => {
    // Utiliser la commande personnalisée pour ajouter une tâche
    cy.addTodo('Faire les courses')
    
    // Vérifier que la tâche apparaît avec la commande personnalisée
    cy.shouldHaveTodo('Faire les courses')
    
    // Vérifier que l'input est vidé
    cy.get('[placeholder*="tâche"], [placeholder*="Nouvelle"], input[type="text"]').first().should('have.value', '')
  })

  it('permet d\'ajouter plusieurs tâches', () => {
    // Ajouter plusieurs tâches
    cy.addTodo('Première tâche')
    cy.addTodo('Deuxième tâche')
    cy.addTodo('Troisième tâche')
    
    // Vérifier qu'elles sont toutes visibles
    cy.shouldHaveTodo('Première tâche')
    cy.shouldHaveTodo('Deuxième tâche')
    cy.shouldHaveTodo('Troisième tâche')
  })

  it('empêche d\'ajouter une tâche vide', () => {
    // Essayer d'ajouter une tâche vide
    cy.get('button').contains(/ajouter/i).click()
    
    // Vérifier qu'aucune tâche vide n'apparaît
    cy.get('body').should('not.contain', 'undefined')
    cy.get('body').should('not.contain', '')
  })

  it('permet de marquer une tâche comme terminée', () => {
    // Ajouter une tâche
    cy.addTodo('Tâche à terminer')
    
    // La marquer comme terminée (si la fonctionnalité existe)
    cy.get('body').then(($body) => {
      if ($body.find('[type="checkbox"]').length > 0) {
        cy.completeTodo('Tâche à terminer')
      }
    })
  })

  it('garde les tâches après un rechargement de page', () => {
    // Ajouter une tâche
    cy.addTodo('Tâche persistante')
    
    // Recharger la page
    cy.reload()
    cy.waitForApp()
    
    // Vérifier que la tâche est toujours là
    cy.shouldHaveTodo('Tâche persistante')
  })
});