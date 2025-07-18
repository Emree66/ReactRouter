import { describe, test, expect } from 'vitest'
 import { render, screen } from '@testing-library/react' 
function ExampleComponent() { 
return ( 
<div> 
<h1>Titre principal</h1> 
<button>Valider</button> 
<input type="email" aria-label="Adresse email" /> 
<img src="photo.jpg" alt="Photo de profil" /> 
<div data-testid="custom-element">Élément personnalisé</div> 
</div> 
  ) 
} 
describe('Exemples de queries', () => { 
  beforeEach(() => { 
    render(<ExampleComponent />) 
  }) 
  test('queries par rôle (recommandé)', () => { 
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument() 
    expect(screen.getByRole('button', { name: 'Valider' 
})).toBeInTheDocument() 
    expect(screen.getByRole('textbox', { name: 'Adresse email' 
})).toBeInTheDocument() 
  }) 
  test('queries par texte visible', () => { 
    expect(screen.getByText('Titre principal')).toBeInTheDocument()
    expect(screen.getByText('Valider')).toBeInTheDocument() 
  }) 
  test('queries par label accessible', () => { 
    expect(screen.getByLabelText('Adresse email')).toBeInTheDocument() 
  }) 
  test('queries par alt text', () => { 
    expect(screen.getByAltText('Photo de profil')).toBeInTheDocument() 
  }) 
  test('queries par test id (dernier recours)', () => { 
    expect(screen.getByTestId('custom-element')).toBeInTheDocument() 
  }) 
}) 