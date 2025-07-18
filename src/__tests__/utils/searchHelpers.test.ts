import { describe, it, expect } from 'vitest';
import { filterTodos, searchInTodos, extractUniqueTags } from '../../utils/searchHelpers';

// Mock data pour les tests
const mockTodos = [
  {
    id: 1,
    title: 'Répondre aux emails urgents',
    description: 'Traiter les emails prioritaires de la journée',
    completed: false,
    priority: 'high',
    category: 'travail',
    tags: ['email', 'urgent', 'communication']
  },
  {
    id: 2,
    title: 'Faire les courses',
    description: 'Acheter les ingrédients pour le dîner',
    completed: false,
    priority: 'medium',
    category: 'personnel',
    tags: ['courses', 'alimentation', 'maison']
  },
  {
    id: 3,
    title: 'Préparer la présentation client',
    description: 'Finaliser les slides pour la réunion de demain',
    completed: true,
    priority: 'high',
    category: 'travail',
    tags: ['présentation', 'client', 'urgent']
  },
  {
    id: 4,
    title: 'Réviser le code',
    description: 'Code review des nouvelles fonctionnalités',
    completed: false,
    priority: 'medium',
    category: 'développement',
    tags: ['code', 'review', 'qualité']
  }
];

describe('Search and Filter Helpers', () => {
  describe('filterTodos', () => {
    it('should return all todos when filter is "all"', () => {
      const result = filterTodos(mockTodos, 'all');
      expect(result).toEqual(mockTodos);
      expect(result).toHaveLength(4);
    });

    it('should return only completed todos when filter is "completed"', () => {
      const result = filterTodos(mockTodos, 'completed');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(3);
      expect(result[0].completed).toBe(true);
    });

    it('should return only active todos when filter is "active"', () => {
      const result = filterTodos(mockTodos, 'active');
      expect(result).toHaveLength(3);
      expect(result.every(todo => !todo.completed)).toBe(true);
    });

    it('should return empty array for unknown filter', () => {
      const result = filterTodos(mockTodos, 'unknown' as any);
      expect(result).toEqual([]);
    });
  });

  describe('searchInTodos', () => {
    it('should return all todos when search term is empty', () => {
      const result = searchInTodos(mockTodos, '');
      expect(result).toEqual(mockTodos);
    });

    it('should find todos by title (case insensitive)', () => {
      const result = searchInTodos(mockTodos, 'EMAIL');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('should find todos by description', () => {
      const result = searchInTodos(mockTodos, 'slides');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(3);
    });

    it('should find todos by tags', () => {
      const result = searchInTodos(mockTodos, 'urgent');
      expect(result).toHaveLength(2);
      expect(result.map(todo => todo.id).sort()).toEqual([1, 3]);
    });

    it('should find todos by category', () => {
      const result = searchInTodos(mockTodos, 'travail');
      expect(result).toHaveLength(2);
      expect(result.map(todo => todo.id).sort()).toEqual([1, 3]);
    });

    it('should handle partial matches', () => {
      const result = searchInTodos(mockTodos, 'cour');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it('should return empty array when no matches found', () => {
      const result = searchInTodos(mockTodos, 'nonexistent');
      expect(result).toEqual([]);
    });

    it('should handle special characters and accents', () => {
      const result = searchInTodos(mockTodos, 'présentation');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(3);
    });
  });

  describe('extractUniqueTags', () => {
    it('should extract all unique tags from todos', () => {
      const result = extractUniqueTags(mockTodos);
      const expected = ['email', 'urgent', 'communication', 'courses', 'alimentation', 'maison', 'présentation', 'client', 'code', 'review', 'qualité'];
      
      expect(result.sort()).toEqual(expected.sort());
    });

    it('should return empty array when no todos provided', () => {
      const result = extractUniqueTags([]);
      expect(result).toEqual([]);
    });

    it('should handle todos without tags', () => {
      const todosWithoutTags = [
        { id: 1, title: 'Test', description: 'Test', completed: false, priority: 'low', category: 'test', tags: [] }
      ];
      
      const result = extractUniqueTags(todosWithoutTags);
      expect(result).toEqual([]);
    });

    it('should sort tags alphabetically', () => {
      const result = extractUniqueTags(mockTodos);
      const sortedResult = [...result].sort();
      
      expect(result).toEqual(sortedResult);
    });
  });

  describe('Combined search and filter', () => {
    it('should correctly combine search and filter operations', () => {
      // D'abord filtrer les todos actifs
      const filteredTodos = filterTodos(mockTodos, 'active');
      // Puis chercher "urgent" dans les todos actifs
      const result = searchInTodos(filteredTodos, 'urgent');
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].completed).toBe(false);
    });

    it('should handle edge case: search in completed todos', () => {
      const filteredTodos = filterTodos(mockTodos, 'completed');
      const result = searchInTodos(filteredTodos, 'client');
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(3);
      expect(result[0].completed).toBe(true);
    });
  });
});
