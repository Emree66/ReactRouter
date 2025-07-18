import { describe, test, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useTodos from '../../hooks/useTodos'

// Mock localStorage complet
const localStorageMock = { 
  getItem: vi.fn(), 
  setItem: vi.fn(), 
  removeItem: vi.fn(), 
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
}) 

describe('useTodos', () => {
  beforeEach(() => {
    // Réinitialiser tous les mocks avant chaque test
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  test('hook is defined', () => {
    const { result } = renderHook(() => useTodos())
    expect(result.current).toBeDefined()
    expect(typeof result.current.addTodo).toBe('function')
    expect(typeof result.current.toggleTodo).toBe('function')
    expect(typeof result.current.deleteTodo).toBe('function')
  })

  describe('Initialisation', () => { 
    test('initialise avec tableau vide si pas de données localStorage', () => { 
      const { result } = renderHook(() => useTodos()) 
      expect(result.current.todos).toEqual([]) 
      expect(localStorageMock.getItem).toHaveBeenCalledWith('todoApp_todos') 
    }) 
    
    test('charge les données depuis localStorage', () => { 
      const savedTodos = [ 
        {  
          id: 1,  
          text: 'Tâche sauvée',  
          completed: false,  
          createdAt: '2024-01-15T10:00:00.000Z'  
        } 
      ] 
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedTodos)) 
      const { result } = renderHook(() => useTodos()) 
      expect(result.current.todos).toEqual(savedTodos) 
    }) 
    
    test('gère JSON invalide dans localStorage', () => { 
      localStorageMock.getItem.mockReturnValue('invalid json') 
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {}) 
      const { result } = renderHook(() => useTodos()) 
      expect(result.current.todos).toEqual([]) 
      expect(consoleSpy).toHaveBeenCalled() 
      consoleSpy.mockRestore() 
    }) 
  })

  describe('addTodo', () => { 
    test('ajoute une nouvelle tâche', () => { 
      const { result } = renderHook(() => useTodos()) 
      act(() => { 
        result.current.addTodo('Nouvelle tâche') 
      }) 
      expect(result.current.todos).toHaveLength(1) 
      expect(result.current.todos[0]).toMatchObject({ 
        text: 'Nouvelle tâche', 
        completed: false 
      }) 
      expect(result.current.todos[0].id).toBeDefined() 
      expect(result.current.todos[0].createdAt).toBeDefined() 
    }) 
    
    test('ajoute la tâche en premier dans la liste', () => { 
      const { result } = renderHook(() => useTodos()) 
      act(() => { 
        result.current.addTodo('Première tâche') 
      }) 
      act(() => { 
        result.current.addTodo('Deuxième tâche') 
      }) 
      expect(result.current.todos[0].text).toBe('Deuxième tâche') 
      expect(result.current.todos[1].text).toBe('Première tâche') 
    }) 
    
    test('supprime les espaces en début et fin', () => { 
      const { result } = renderHook(() => useTodos()) 
      act(() => { 
        result.current.addTodo('   Tâche avec espaces   ') 
      }) 
      expect(result.current.todos[0].text).toBe('Tâche avec espaces') 
    }) 
    
    test('sauvegarde dans localStorage', () => { 
      const { result } = renderHook(() => useTodos()) 
      act(() => { 
        result.current.addTodo('Tâche test') 
      }) 
      expect(localStorageMock.setItem).toHaveBeenCalledWith( 
        'todoApp_todos', 
        expect.stringContaining('Tâche test') 
      ) 
    }) 
  })

  describe('toggleTodo', () => { 
    test('bascule le statut completed d\'une tâche', () => { 
      const { result } = renderHook(() => useTodos()) 
      act(() => { 
        result.current.addTodo('Tâche à basculer') 
      }) 
      const todoId = result.current.todos[0].id 
      act(() => { 
        result.current.toggleTodo(todoId) 
      }) 
      expect(result.current.todos[0].completed).toBe(true) 
      expect(result.current.todos[0].updatedAt).toBeDefined() 
    }) 
    
    test('bascule de terminé à non terminé', () => { 
      const { result } = renderHook(() => useTodos()) 
      act(() => { 
        result.current.addTodo('Tâche test') 
      }) 
      const todoId = result.current.todos[0].id 
      // Marquer comme terminé 
      act(() => { 
        result.current.toggleTodo(todoId) 
      }) 
      expect(result.current.todos[0].completed).toBe(true) 
      // Marquer comme non terminé 
      act(() => { 
        result.current.toggleTodo(todoId) 
      }) 
      expect(result.current.todos[0].completed).toBe(false) 
    }) 
    
    test('ne fait rien si ID inexistant', () => { 
      const { result } = renderHook(() => useTodos()) 
      act(() => { 
        result.current.addTodo('Tâche test') 
      }) 
      const initialTodos = result.current.todos 
      act(() => { 
        result.current.toggleTodo(999) // ID qui n'existe pas 
      }) 
      expect(result.current.todos).toEqual(initialTodos) 
    }) 
  })

  describe('deleteTodo', () => { 
    test('supprime une tâche par ID', () => { 
      const { result } = renderHook(() => useTodos()) 
      
      // Ajouter d'abord une tâche
      act(() => { 
        result.current.addTodo('Tâche à garder') 
      }) 
      expect(result.current.todos).toHaveLength(1)
      
      // Puis ajouter la deuxième tâche
      act(() => { 
        result.current.addTodo('Tâche à supprimer') 
      }) 
      
      // Vérifier qu'on a bien 2 tâches
      expect(result.current.todos).toHaveLength(2)
      expect(result.current.todos[0].text).toBe('Tâche à supprimer')
      expect(result.current.todos[1].text).toBe('Tâche à garder')
      
      const todoToDeleteId = result.current.todos[0].id
      act(() => { 
        result.current.deleteTodo(todoToDeleteId) 
      }) 
      expect(result.current.todos).toHaveLength(1) 
      expect(result.current.todos[0].text).toBe('Tâche à garder') 
    }) 
    
    test('ne fait rien si ID inexistant', () => { 
      const { result } = renderHook(() => useTodos()) 
      act(() => { 
        result.current.addTodo('Tâche test') 
      }) 
      const initialLength = result.current.todos.length 
      act(() => { 
        result.current.deleteTodo(999) 
      }) 
      expect(result.current.todos).toHaveLength(initialLength) 
    }) 
  })
})
