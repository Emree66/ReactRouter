import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SearchFilter from '../../components/SearchFilter';

// Mock data pour les tests
const mockTodos = [
  {
    id: 1,
    title: 'Répondre aux emails',
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
    tags: ['présentation', 'client', 'urgent']
  }
];

describe('SearchFilter Component', () => {
  const mockOnFilterChange = vi.fn();
  const mockOnSearchChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render search input and filter controls', () => {
    render(
      <SearchFilter
        todos={mockTodos}
        onFilterChange={mockOnFilterChange}
        onSearchChange={mockOnSearchChange}
      />
    );

    expect(screen.getByPlaceholderText(/rechercher par titre ou tags/i)).toBeInTheDocument();
    expect(screen.getByText(/tous/i)).toBeInTheDocument();
    expect(screen.getByText(/actifs/i)).toBeInTheDocument();
    expect(screen.getByText(/terminés/i)).toBeInTheDocument();
  });

  it('should call onSearchChange when typing in search input', async () => {
    const user = userEvent.setup();
    render(
      <SearchFilter
        todos={mockTodos}
        onFilterChange={mockOnFilterChange}
        onSearchChange={mockOnSearchChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(/rechercher par titre ou tags/i);
    await user.type(searchInput, 'email');

    await waitFor(() => {
      expect(mockOnSearchChange).toHaveBeenCalledWith('email');
    });
  });

  it('should call onFilterChange when clicking filter buttons', async () => {
    const user = userEvent.setup();
    render(
      <SearchFilter
        todos={mockTodos}
        onFilterChange={mockOnFilterChange}
        onSearchChange={mockOnSearchChange}
      />
    );

    const activeButton = screen.getByText(/actifs/i);
    await user.click(activeButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith('active');
  });

  it('should display available tags as clickable pills', () => {
    render(
      <SearchFilter
        todos={mockTodos}
        onFilterChange={mockOnFilterChange}
        onSearchChange={mockOnSearchChange}
      />
    );

    // Vérifier que les tags uniques sont affichés
    expect(screen.getByText('email')).toBeInTheDocument();
    expect(screen.getByText('urgent')).toBeInTheDocument();
    expect(screen.getByText('courses')).toBeInTheDocument();
    expect(screen.getByText('présentation')).toBeInTheDocument();
  });

  it('should trigger search when clicking on a tag', async () => {
    const user = userEvent.setup();
    render(
      <SearchFilter
        todos={mockTodos}
        onFilterChange={mockOnFilterChange}
        onSearchChange={mockOnSearchChange}
      />
    );

    const emailTag = screen.getByText('email');
    await user.click(emailTag);

    expect(mockOnSearchChange).toHaveBeenCalledWith('email');
  });

  it('should highlight active filter button', () => {
    render(
      <SearchFilter
        todos={mockTodos}
        onFilterChange={mockOnFilterChange}
        onSearchChange={mockOnSearchChange}
        currentFilter="completed"
      />
    );

    const completedButton = screen.getByText(/terminés/i);
    expect(completedButton).toHaveClass('bg-blue-500', 'text-white');
  });

  it('should clear search when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <SearchFilter
        todos={mockTodos}
        onFilterChange={mockOnFilterChange}
        onSearchChange={mockOnSearchChange}
        searchTerm="test"
      />
    );

    const clearButton = screen.getByLabelText(/effacer la recherche/i);
    await user.click(clearButton);

    expect(mockOnSearchChange).toHaveBeenCalledWith('');
  });
});
