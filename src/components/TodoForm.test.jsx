import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router'
import userEvent from '@testing-library/user-event'
import React from 'react'
import TodoForm from './todo/TodoForm'

// Mock du contexte Auth
vi.mock('../context/AuthContext', () => {
  const mockContext = React.createContext({
    user: null,
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn()
  });
  
  return {
    AuthContext: mockContext,
    AuthProvider: ({ children }) => 
      React.createElement(mockContext.Provider, {
        value: {
          user: null,
          isAuthenticated: false,
          login: vi.fn(),
          logout: vi.fn()
        }
      }, children),
    useAuth: () => ({
      user: null,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn()
    })
  };
});

// Mock des utilitaires
vi.mock('../utils/mockData', () => ({
  saveTodo: vi.fn(),
  getTodoById: vi.fn(),
  updateTodo: vi.fn()
}));

describe('TodoForm', () => { 
  const mockOnSubmit = vi.fn() 
  
  beforeEach(() => { 
    mockOnSubmit.mockClear() 
  }) 
  
  const renderTodoForm = (props = {}) => {
    return render(
      <BrowserRouter>
        <TodoForm onSubmit={mockOnSubmit} {...props} />
      </BrowserRouter>
    )
  }
  
  describe('Rendu initial', () => { 
    test('affiche le formulaire avec tous les éléments', () => {
      renderTodoForm()
      expect(screen.getByPlaceholderText('Donnez un titre à votre tâche')).toBeInTheDocument() 
      expect(screen.getByRole('button', { name: /ajouter/i })).toBeInTheDocument() 
      expect(screen.getByPlaceholderText('Décrivez votre tâche en détail...')).toBeInTheDocument()
    }) 
    
    test('le champ titre est vide au départ', () => { 
      renderTodoForm()
      const input = screen.getByPlaceholderText('Donnez un titre à votre tâche') 
      expect(input).toHaveValue('') 
    }) 
  }) 

  describe('Validation', () => { 
    test('affiche erreur pour titre vide', async () => { 
      const user = userEvent.setup() 
      renderTodoForm()
      const submitButton = screen.getByRole('button', { name: /ajouter/i }) 
      await user.click(submitButton) 
      // Vérifier qu'aucune soumission n'a eu lieu
      expect(mockOnSubmit).not.toHaveBeenCalled() 
    }) 
    
    test('accepte un titre valide', async () => { 
      const user = userEvent.setup() 
      renderTodoForm()
      const titleInput = screen.getByPlaceholderText('Donnez un titre à votre tâche') 
      await user.type(titleInput, 'Tâche valide') 
      
      const submitButton = screen.getByRole('button', { name: /ajouter/i })
      await user.click(submitButton) 
      
      expect(mockOnSubmit).toHaveBeenCalled()
      const call = mockOnSubmit.mock.calls[0][0]
      expect(call.title).toBe('Tâche valide')
    }) 
  })

  describe('Soumission', () => { 
    test('appelle onSubmit avec les données du formulaire', async () => { 
      const user = userEvent.setup() 
      renderTodoForm()
      
      // Remplir les champs requis
      const titleInput = screen.getByPlaceholderText('Donnez un titre à votre tâche') 
      await user.type(titleInput, 'Nouvelle tâche') 
      
      const descriptionInput = screen.getByPlaceholderText('Décrivez votre tâche en détail...')
      await user.type(descriptionInput, 'Description de la tâche')
      
      const submitButton = screen.getByRole('button', { name: /ajouter/i })
      await user.click(submitButton) 
      
      expect(mockOnSubmit).toHaveBeenCalledTimes(1)
      const submittedData = mockOnSubmit.mock.calls[0][0]
      expect(submittedData.title).toBe('Nouvelle tâche')
      expect(submittedData.description).toBe('Description de la tâche')
    }) 
  })
}) 