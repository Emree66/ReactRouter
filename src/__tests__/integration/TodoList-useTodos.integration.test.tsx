// Integration tests for TodoForm and TodoList with useTodos hook
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { MemoryRouter } from 'react-router'
import { AuthProvider } from '../../context/AuthContext'
import TodoForm from '../../components/todo/TodoForm'
import TodoList from '../../components/todo/TodoList'
import useTodos from '../../hooks/useTodos'

// Wrapper component with all necessary providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </MemoryRouter>
  )
}

// Composant de test qui utilise le TodoForm avec useTodos
function TodoFormIntegration() {
  const { todos, addTodo } = useTodos()
  
  const handleSubmit = (todoData: any) => {
    addTodo(todoData.title)
  }

  return (
    <div>
      <TodoForm onSubmit={handleSubmit} />
      <div data-testid="todos-count">
        Nombre de tâches: {todos.length}
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} data-testid={`todo-${todo.id}`}>
            {todo.text} - {todo.completed ? 'Terminé' : 'En cours'}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Composant de test qui utilise TodoList avec useTodos
function TodoListIntegration() {
  const { todos, addTodo } = useTodos()

  return (
    <div>
      <button onClick={() => addTodo('Nouvelle tâche')}>
        Ajouter tâche test
      </button>
      <TodoList />
      <div data-testid="todos-stats">
        Total: {todos.length}
        En cours: {todos.filter(t => !t.completed).length}
        Terminées: {todos.filter(t => t.completed).length}
      </div>
    </div>
  )
}

// Mock localStorage et prompt
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})
global.prompt = vi.fn()

describe('Intégration TodoForm + useTodos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  test('ajouter une tâche met à jour la liste', async () => {
    const user = userEvent.setup()
    render(
      <TestWrapper>
        <TodoFormIntegration />
      </TestWrapper>
    )

    // État initial
    expect(screen.getByTestId('todos-count').textContent).toBe('Nombre de tâches: 0')

    const input = screen.getByPlaceholderText(/titre/i)
    await user.type(input, 'Ma première tâche')
    await user.click(screen.getByRole('button', { name: /ajouter/i }))

    // Vérifier que la tâche apparaît
    expect(screen.getByTestId('todos-count').textContent).toBe('Nombre de tâches: 1')
    expect(screen.getByText('Ma première tâche - En cours')).toBeDefined()
  })

  test('ajouter plusieurs tâches', async () => {
    const user = userEvent.setup()
    render(
      <TestWrapper>
        <TodoFormIntegration />
      </TestWrapper>
    )

    const input = screen.getByPlaceholderText(/titre/i)

    // Ajouter première tâche
    await user.type(input, 'Tâche 1')
    await user.click(screen.getByRole('button', { name: /ajouter/i }))

    // Ajouter deuxième tâche
    await user.clear(input)
    await user.type(input, 'Tâche 2')
    await user.click(screen.getByRole('button', { name: /ajouter/i }))

    // Vérifier
    expect(screen.getByTestId('todos-count').textContent).toBe('Nombre de tâches: 2')
    expect(screen.getByText('Tâche 1 - En cours')).toBeDefined()
    expect(screen.getByText('Tâche 2 - En cours')).toBeDefined()
  })

  test('la validation du formulaire fonctionne avec le hook', async () => {
    const user = userEvent.setup()
    render(
      <TestWrapper>
        <TodoFormIntegration />
      </TestWrapper>
    )

    // Essayer d'ajouter une tâche vide
    await user.click(screen.getByRole('button', { name: /ajouter/i }))

    // Vérifier qu'aucune tâche n'a été ajoutée
    expect(screen.getByTestId('todos-count').textContent).toBe('Nombre de tâches: 0')
  })

  test('la persistance fonctionne lors de l\'ajout', async () => {
    const user = userEvent.setup()
    render(
      <TestWrapper>
        <TodoFormIntegration />
      </TestWrapper>
    )

    const input = screen.getByPlaceholderText(/titre/i)
    await user.type(input, 'Tâche persistée')
    await user.click(screen.getByRole('button', { name: /ajouter/i }))

    // Vérifier que localStorage.setItem a été appelé
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'todoApp_todos',
      expect.stringContaining('Tâche persistée')
    )
  })
})

describe('Intégration TodoList + useTodos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  test('affichage initial de la liste', async () => {
    render(
      <TestWrapper>
        <TodoListIntegration />
      </TestWrapper>
    )

    // Vérifier que le composant se charge avec les stats
    const statsElement = screen.getByTestId('todos-stats')
    expect(statsElement.textContent).toContain('Total: 0')
    expect(statsElement.textContent).toContain('En cours: 0')
    expect(statsElement.textContent).toContain('Terminées: 0')
  })

  test('ajout via bouton met à jour les stats du hook', async () => {
    const user = userEvent.setup()
    render(
      <TestWrapper>
        <TodoListIntegration />
      </TestWrapper>
    )

    // Ajouter une tâche via le bouton
    await user.click(screen.getByRole('button', { name: 'Ajouter tâche test' }))

    // Vérifier que les stats du hook changent (même si TodoList ne les utilise pas)
    const statsElement = screen.getByTestId('todos-stats')
    expect(statsElement.textContent).toContain('Total: 1')
    expect(statsElement.textContent).toContain('En cours: 1')
  })
})