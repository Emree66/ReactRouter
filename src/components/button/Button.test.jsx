 import { describe, test, expect, vi } from 'vitest'
 import { render, screen, fireEvent } from '@testing-library/react'
 import userEvent from '@testing-library/user-event'
 import Button from './Button' 
describe('Button', () => { 
  test('affiche le texte du bouton', () => { 
    render(<Button>Cliquez-moi</Button>) 
    expect(screen.getByText('Cliquez-moi')).toBeInTheDocument() 
  }) 
  test('appelle onClick quand cliqué', async () => { 
const user = userEvent.setup() 
const handleClick = vi.fn() // Fonction mock 
    render(<Button onClick={handleClick}>Cliquer</Button>) 
await user.click(screen.getByText('Cliquer')) 
    expect(handleClick).toHaveBeenCalledTimes(1) 
  }) 
  test('est désactivé quand disabled=true', () => { 
    render(<Button disabled>Bouton</Button>) 
    expect(screen.getByRole('button')).toBeDisabled() 
  }) 
  test('n\'appelle pas onClick quand désactivé', async () => {
    const user = userEvent.setup() 
    const handleClick = vi.fn()

    render(<Button onClick={handleClick} disabled>Bouton</Button>)
     await user.click(screen.getByRole('button')) 
    expect(handleClick).not.toHaveBeenCalled() 
  }) 
  test('applique la bonne classe selon variant', () => { 
const { rerender } = render(<Button 
variant="secondary">Bouton</Button>) 
    expect(screen.getByRole('button')).toHaveClass('btn-secondary') 
    rerender(<Button variant="danger">Bouton</Button>) 
    expect(screen.getByRole('button')).toHaveClass('btn-danger') 
  }) 
}) 