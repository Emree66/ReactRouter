import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router'
import userEvent from '@testing-library/user-event'
import TodoItem from '../todo/TodoItem'

const mockTodo = {
  id: 1,
  title: 'Tâche de test',
  description: 'Description de test',
  completed: false,
  priority: 'high',
  dueDate: '2024-01-15',
  category: 'work',
  tags: ['urgent', 'important']
}

const mockTodoCompleted = {
  ...mockTodo,
  completed: true
}

describe('TodoItem', () => {
  const mockOnToggleComplete = vi.fn()
  const mockOnDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('affiche les informations de la tâche', () => {
    render(
      <BrowserRouter>
        <TodoItem 
          todo={mockTodo} 
          onToggleComplete={mockOnToggleComplete} 
          onDelete={mockOnDelete} 
        />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Tâche de test')).toBeInTheDocument()
    expect(screen.getByText('Description de test')).toBeInTheDocument()
    expect(screen.getByText('work')).toBeInTheDocument()
    expect(screen.getByText('#urgent')).toBeInTheDocument()
    expect(screen.getByText('#important')).toBeInTheDocument()
  })

  test('affiche le bouton correct selon l\'état de complétion', () => {
    const { rerender } = render(
      <BrowserRouter>
        <TodoItem 
          todo={mockTodo} 
          onToggleComplete={mockOnToggleComplete} 
          onDelete={mockOnDelete} 
        />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Terminer')).toBeInTheDocument()
    
    rerender(
      <BrowserRouter>
        <TodoItem 
          todo={mockTodoCompleted} 
          onToggleComplete={mockOnToggleComplete} 
          onDelete={mockOnDelete} 
        />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Annuler')).toBeInTheDocument()
  })

  test('appelle onToggleComplete quand bouton cliqué', async () => {
    const user = userEvent.setup()
    
    render(
      <BrowserRouter>
        <TodoItem 
          todo={mockTodo} 
          onToggleComplete={mockOnToggleComplete} 
          onDelete={mockOnDelete} 
        />
      </BrowserRouter>
    )
    
    const toggleButton = screen.getByText('Terminer')
    await user.click(toggleButton)
    
    expect(mockOnToggleComplete).toHaveBeenCalledWith(1)
    expect(mockOnToggleComplete).toHaveBeenCalledTimes(1)
  })

  test('appelle onDelete quand bouton supprimer cliqué', async () => {
    const user = userEvent.setup()
    
    render(
      <BrowserRouter>
        <TodoItem 
          todo={mockTodo} 
          onToggleComplete={mockOnToggleComplete} 
          onDelete={mockOnDelete} 
        />
      </BrowserRouter>
    )
    
    const deleteButton = screen.getByTitle('Supprimer')
    await user.click(deleteButton)
    
    expect(mockOnDelete).toHaveBeenCalledWith(1)
    expect(mockOnDelete).toHaveBeenCalledTimes(1)
  })

  test('affiche le lien d\'édition correct', () => {
    render(
      <BrowserRouter>
        <TodoItem 
          todo={mockTodo} 
          onToggleComplete={mockOnToggleComplete} 
          onDelete={mockOnDelete} 
        />
      </BrowserRouter>
    )
    
    const editLink = screen.getByTitle('Modifier')
    expect(editLink).toHaveAttribute('href', '/app/edit/1')
  })

  test('applique l\'opacité réduite pour les tâches terminées', () => {
    render(
      <BrowserRouter>
        <TodoItem 
          todo={mockTodoCompleted} 
          onToggleComplete={mockOnToggleComplete} 
          onDelete={mockOnDelete} 
        />
      </BrowserRouter>
    )
    
    // Le composant applique opacity-75 sur le container principal quand completed=true
    const mainContainer = screen.getByText('Tâche de test').closest('div[class*="bg-white/10"]')
    expect(mainContainer).toHaveClass('opacity-75')
  })
})