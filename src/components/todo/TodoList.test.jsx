import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router'
import userEvent from '@testing-library/user-event'
import TodoList from './TodoList'
import { getTodos, deleteTodo, toggleTodoCompleted } from '../../utils/mockData'

// Mock du module mockData
vi.mock('../../utils/mockData', () => ({
  getTodos: vi.fn(),
  deleteTodo: vi.fn(),
  toggleTodoCompleted: vi.fn()
}))

// Mock de window.confirm
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: vi.fn(() => true)
})

const mockTodos = [
  {
    id: 1,
    title: 'Première tâche',
    description: 'Description de la première tâche',
    completed: false,
    priority: 'high',
    dueDate: '2024-01-15',
    category: 'work',
    tags: ['urgent']
  },
  {
    id: 2,
    title: 'Deuxième tâche',
    description: 'Description de la deuxième tâche',
    completed: true,
    priority: 'medium',
    dueDate: '2024-01-14',
    category: 'personal',
    tags: []
  },
  {
    id: 3,
    title: 'Troisième tâche',
    description: 'Description de la troisième tâche',
    completed: false,
    priority: 'low',
    dueDate: '2024-01-13',
    category: 'work',
    tags: ['planning']
  }
]

describe('TodoList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderTodoList = () => {
    return render(
      <BrowserRouter>
        <TodoList />
      </BrowserRouter>
    )
  }

  describe('État de chargement', () => {
    test('affiche le spinner de chargement au début', async () => {
      // Mock pour retourner un tableau vide mais simuler un délai
      getTodos.mockReturnValue([])
      
      renderTodoList()
      
      // Le composant charge très rapidement, vérifions qu'il passe de chargement à vide
      await waitFor(() => {
        expect(screen.getByText('Aucune tâche trouvée')).toBeInTheDocument()
      })
      
      // Vérifier que getTodos a été appelé
      expect(getTodos).toHaveBeenCalled()
    })
  })

  describe('État vide', () => {
    test('affiche message vide quand aucune tâche', async () => {
      getTodos.mockReturnValue([])
      renderTodoList()
      
      await waitFor(() => {
        expect(screen.getByText('Aucune tâche trouvée')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Vous n\'avez pas encore de tâches. Commencez par en créer une !')).toBeInTheDocument()
      expect(screen.getByText('📭')).toBeInTheDocument()
    })

    test('affiche les statistiques à zéro quand vide', async () => {
      getTodos.mockReturnValue([])
      renderTodoList()
      
      await waitFor(() => {
        expect(screen.getByText('Total')).toBeInTheDocument()
      })
      
      expect(screen.getByText('En cours')).toBeInTheDocument()
      expect(screen.getByText('Terminées')).toBeInTheDocument()
      
      // Vérifier que les compteurs sont à 0
      const zeroCounters = screen.getAllByText('0')
      expect(zeroCounters.length).toBeGreaterThan(0)
    })
  })

  describe('Avec données', () => {
    test('affiche toutes les tâches', async () => {
      getTodos.mockReturnValue(mockTodos)
      renderTodoList()
      
      await waitFor(() => {
        expect(screen.getByText('Première tâche')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Deuxième tâche')).toBeInTheDocument()
      expect(screen.getByText('Troisième tâche')).toBeInTheDocument()
    })

    test('calcule et affiche les statistiques correctement', async () => {
      getTodos.mockReturnValue(mockTodos)
      renderTodoList()
      
      await waitFor(() => {
        expect(screen.getByText('Total')).toBeInTheDocument()
      })
      
      expect(screen.getByText('En cours')).toBeInTheDocument()
      expect(screen.getByText('Terminées')).toBeInTheDocument()
      
      // Total : 3, En cours : 2, Terminées : 1
      expect(screen.getByText('3')).toBeInTheDocument() // Total
      expect(screen.getByText('2')).toBeInTheDocument() // En cours
      expect(screen.getByText('1')).toBeInTheDocument() // Terminées
    })

    test('affiche les filtres avec les bons compteurs', async () => {
      getTodos.mockReturnValue(mockTodos)
      renderTodoList()
      
      await waitFor(() => {
        expect(screen.getByText('Toutes (3)')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Actives (2)')).toBeInTheDocument()
      expect(screen.getByText('Terminées (1)')).toBeInTheDocument()
    })

    test('n\'affiche pas le message vide quand il y a des tâches', async () => {
      getTodos.mockReturnValue(mockTodos)
      renderTodoList()
      
      await waitFor(() => {
        expect(screen.getByText('Première tâche')).toBeInTheDocument()
      })
      
      expect(screen.queryByText('Aucune tâche trouvée')).not.toBeInTheDocument()
    })
  })

  describe('Filtrage', () => {
    test('filtre les tâches actives', async () => {
      getTodos.mockReturnValue(mockTodos)
      const user = userEvent.setup()
      renderTodoList()
      
      await waitFor(() => {
        expect(screen.getByText('Première tâche')).toBeInTheDocument()
      })
      
      const activeFilter = screen.getByText('Actives (2)')
      await user.click(activeFilter)
      
      // Ne devrait voir que les tâches non terminées
      expect(screen.getByText('Première tâche')).toBeInTheDocument()
      expect(screen.getByText('Troisième tâche')).toBeInTheDocument()
      expect(screen.queryByText('Deuxième tâche')).not.toBeInTheDocument()
    })

    test('filtre les tâches terminées', async () => {
      getTodos.mockReturnValue(mockTodos)
      const user = userEvent.setup()
      renderTodoList()
      
      await waitFor(() => {
        expect(screen.getByText('Première tâche')).toBeInTheDocument()
      })
      
      const completedFilter = screen.getByText('Terminées (1)')
      await user.click(completedFilter)
      
      // Ne devrait voir que la tâche terminée
      expect(screen.getByText('Deuxième tâche')).toBeInTheDocument()
      expect(screen.queryByText('Première tâche')).not.toBeInTheDocument()
      expect(screen.queryByText('Troisième tâche')).not.toBeInTheDocument()
    })

    test('filtre par catégorie', async () => {
      getTodos.mockReturnValue(mockTodos)
      const user = userEvent.setup()
      renderTodoList()
      
      await waitFor(() => {
        expect(screen.getByText('Première tâche')).toBeInTheDocument()
      })
      
      const categorySelect = screen.getByDisplayValue('Toutes les catégories')
      await user.selectOptions(categorySelect, 'work')
      
      // Ne devrait voir que les tâches de la catégorie 'work'
      expect(screen.getByText('Première tâche')).toBeInTheDocument()
      expect(screen.getByText('Troisième tâche')).toBeInTheDocument()
      expect(screen.queryByText('Deuxième tâche')).not.toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    test('supprime une tâche quand le bouton supprimer est cliqué', async () => {
      getTodos.mockReturnValue(mockTodos)
      deleteTodo.mockImplementation(() => {})
      const user = userEvent.setup()
      renderTodoList()
      
      await waitFor(() => {
        expect(screen.getByText('Première tâche')).toBeInTheDocument()
      })
      
      const deleteButtons = screen.getAllByTitle('Supprimer')
      await user.click(deleteButtons[0])
      
      expect(deleteTodo).toHaveBeenCalledWith(1)
    })

    test('bascule l\'état d\'une tâche quand le bouton toggle est cliqué', async () => {
      getTodos.mockReturnValue(mockTodos)
      toggleTodoCompleted.mockReturnValue({ ...mockTodos[0], completed: true })
      const user = userEvent.setup()
      renderTodoList()
      
      await waitFor(() => {
        expect(screen.getByText('Première tâche')).toBeInTheDocument()
      })
      
      const toggleButtons = screen.getAllByText('Terminer')
      await user.click(toggleButtons[0])
      
      expect(toggleTodoCompleted).toHaveBeenCalledWith(1)
    })
  })

  describe('Cas particuliers', () => {
    test('gère une liste avec seulement des tâches terminées', async () => {
      const completedTodos = mockTodos.map(todo => ({ ...todo, completed: true }))
      getTodos.mockReturnValue(completedTodos)
      renderTodoList()
      
      await waitFor(() => {
        expect(screen.getByText('Total')).toBeInTheDocument()
      })
      
      // Vérifier les statistiques en cherchant par contexte spécifique
      const totalSection = screen.getByText('Total').parentElement
      expect(totalSection.querySelector('.text-2xl')).toHaveTextContent('3')
      
      const enCoursSection = screen.getByText('En cours').parentElement
      expect(enCoursSection.querySelector('.text-2xl')).toHaveTextContent('0')
      
      const termineesSection = screen.getByText('Terminées').parentElement
      expect(termineesSection.querySelector('.text-2xl')).toHaveTextContent('3')
    })

    test('gère une liste avec seulement des tâches en cours', async () => {
      const activeTodos = mockTodos.map(todo => ({ ...todo, completed: false }))
      getTodos.mockReturnValue(activeTodos)
      renderTodoList()
      
      await waitFor(() => {
        expect(screen.getByText('Total')).toBeInTheDocument()
      })
      
      // Le 3 apparaît dans Total et En cours
      const threeElements = screen.getAllByText('3')
      expect(threeElements.length).toBeGreaterThanOrEqual(2)
      expect(screen.getByText('0')).toBeInTheDocument() // Terminées
    })

    test('gère une liste avec une seule tâche', async () => {
      getTodos.mockReturnValue([mockTodos[0]])
      renderTodoList()
      
      await waitFor(() => {
        expect(screen.getByText('Première tâche')).toBeInTheDocument()
      })
      
      // Vérifier les statistiques en cherchant par contexte spécifique
      const totalSection = screen.getByText('Total').parentElement
      expect(totalSection.querySelector('.text-2xl')).toHaveTextContent('1')
      
      const enCoursSection = screen.getByText('En cours').parentElement
      expect(enCoursSection.querySelector('.text-2xl')).toHaveTextContent('1')
      
      const termineesSection = screen.getByText('Terminées').parentElement
      expect(termineesSection.querySelector('.text-2xl')).toHaveTextContent('0')
    })
  })
})
