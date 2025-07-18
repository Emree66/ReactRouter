import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import TodoListWithSearch from '../../pages/TodoListWithSearch';
import { useTodos } from '../../hooks/useTodos';

// Mock du hook useTodos
vi.mock('../../hooks/useTodos');
const mockUseTodos = useTodos as vi.MockedFunction<typeof useTodos>;

const mockTodos = [
  {
    id: 1,
    title: 'Répondre aux emails urgents',
    description: 'Traiter les emails prioritaires',
    completed: false,
    priority: 'high',
    category: 'travail',
    tags: ['email', 'urgent', 'communication']
  },
  {
    id: 2,
    title: 'Faire les courses',
    description: 'Acheter les ingrédients',
    completed: false,
    priority: 'medium',
    category: 'personnel',
    tags: ['courses', 'alimentation']
  },
  {
    id: 3,
    title: 'Préparer présentation',
    description: 'Slides pour la réunion',
    completed: true,
    priority: 'high',
    category: 'travail',
    tags: ['présentation', 'client']
  }
];

describe('TodoListWithSearch Integration', () => {
  const mockFunctions = {
    fetchTodos: vi.fn(),
    addTodo: vi.fn(),
    deleteTodo: vi.fn(),
    toggleTodoCompleted: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTodos.mockReturnValue({
      todos: mockTodos,
      loading: false,
      error: null,
      categories: ['travail', 'personnel'],
      ...mockFunctions
    });
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <TodoListWithSearch />
      </MemoryRouter>
    );
  };

  it('should render todo list with search functionality', () => {
    renderComponent();
    
    expect(screen.getByPlaceholderText(/rechercher par titre ou tags/i)).toBeInTheDocument();
    expect(screen.getByText('Répondre aux emails urgents')).toBeInTheDocument();
    expect(screen.getByText('Faire les courses')).toBeInTheDocument();
    expect(screen.getByText('Préparer présentation')).toBeInTheDocument();
  });

  it('should filter todos by search term', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    const searchInput = screen.getByPlaceholderText(/rechercher par titre ou tags/i);
    await user.type(searchInput, 'email');
    
    await waitFor(() => {
      expect(screen.getByText('Répondre aux emails urgents')).toBeInTheDocument();
      expect(screen.queryByText('Faire les courses')).not.toBeInTheDocument();
      expect(screen.queryByText('Préparer présentation')).not.toBeInTheDocument();
    });
  });

  it('should filter todos by status and search term combined', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Cliquer sur le filtre "Actifs"
    const activeButton = screen.getByText(/actifs/i);
    await user.click(activeButton);
    
    // Puis rechercher par tag
    const searchInput = screen.getByPlaceholderText(/rechercher par titre ou tags/i);
    await user.type(searchInput, 'urgent');
    
    await waitFor(() => {
      // Seul le todo actif avec le tag "urgent" devrait être visible
      expect(screen.getByText('Répondre aux emails urgents')).toBeInTheDocument();
      expect(screen.queryByText('Faire les courses')).not.toBeInTheDocument();
      expect(screen.queryByText('Préparer présentation')).not.toBeInTheDocument();
    });
  });

  it('should show "no results" message when search returns empty', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    const searchInput = screen.getByPlaceholderText(/rechercher par titre ou tags/i);
    await user.type(searchInput, 'inexistant');
    
    await waitFor(() => {
      expect(screen.getByText(/aucune tâche trouvée/i)).toBeInTheDocument();
    });
  });

  it('should clear search when clicking clear button', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    const searchInput = screen.getByPlaceholderText(/rechercher par titre ou tags/i);
    await user.type(searchInput, 'email');
    
    // Vérifier que la recherche filtre les résultats
    await waitFor(() => {
      expect(screen.queryByText('Faire les courses')).not.toBeInTheDocument();
    });
    
    // Cliquer sur le bouton clear
    const clearButton = screen.getByLabelText(/effacer la recherche/i);
    await user.click(clearButton);
    
    // Vérifier que tous les todos sont de nouveau visibles
    await waitFor(() => {
      expect(screen.getByText('Répondre aux emails urgents')).toBeInTheDocument();
      expect(screen.getByText('Faire les courses')).toBeInTheDocument();
      expect(screen.getByText('Préparer présentation')).toBeInTheDocument();
    });
  });

  it('should search when clicking on tag pills', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    // Cliquer sur un tag
    const emailTag = screen.getByText('email');
    await user.click(emailTag);
    
    await waitFor(() => {
      expect(screen.getByText('Répondre aux emails urgents')).toBeInTheDocument();
      expect(screen.queryByText('Faire les courses')).not.toBeInTheDocument();
    });
  });

  it('should handle loading state', () => {
    mockUseTodos.mockReturnValue({
      todos: [],
      loading: true,
      error: null,
      categories: [],
      ...mockFunctions
    });
    
    renderComponent();
    
    expect(screen.getByText(/chargement/i)).toBeInTheDocument();
  });

  it('should handle error state', () => {
    mockUseTodos.mockReturnValue({
      todos: [],
      loading: false,
      error: 'Erreur de chargement',
      categories: [],
      ...mockFunctions
    });
    
    renderComponent();
    
    expect(screen.getByText(/erreur de chargement/i)).toBeInTheDocument();
  });
});
