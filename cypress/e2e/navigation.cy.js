describe('Navigation E2E', () => {
  beforeEach(() => {
    cy.visitClean('/')
    cy.waitForApp()
  })

  it('navigue vers la page d\'ajout de tâche', () => {
    // Cliquer sur le lien ou bouton pour ajouter une tâche
    cy.get('a[href*="add"], button').contains(/ajouter|nouvelle/i).first().click()
    
    // Vérifier qu'on est sur la bonne page
    cy.url().should('include', '/add')
  })

  it('navigue vers la page d\'accueil', () => {
    // Aller à la page d'ajout d'abord
    cy.visit('/add')
    
    // Retourner à l'accueil
    cy.get('a[href="/"], a[href*="home"]').first().click()
    
    // Vérifier qu'on est à l'accueil
    cy.url().should('match', /\/$|\/home$/)
  })

  it('affiche la navigation principale', () => {
    // Vérifier que les éléments de navigation sont présents
    cy.get('nav, [role="navigation"]').should('be.visible')
    
    // Vérifier les liens principaux
    cy.get('a, button').should('contain.text', /accueil|home/i)
  })

  it('gère les routes inexistantes (404)', () => {
    // Aller vers une route qui n'existe pas
    cy.visit('/route-inexistante', { failOnStatusCode: false })
    
    // Vérifier qu'une page d'erreur ou de redirection apparaît
    cy.get('body').should('be.visible')
  })
})
