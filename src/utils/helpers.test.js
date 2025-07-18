 // src/utils/helpers.test.js
 import { describe, test, expect } from 'vitest'
 import { formatDate, filterTodos } from './helpers' 
describe('Helpers - formatDate', () => { 
  test('formate une date récente en "À l\'instant"', () => { 
const now = new Date() 
const result = formatDate(now.toISOString()) 
    expect(result).toBe('À l\'instant') 
  }) 
  test('formate une date d\'il y a 2 heures', () => { 
const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000) 
const result = formatDate(twoHoursAgo.toISOString()) 
    expect(result).toBe('Il y a 2h') 
  }) 
  test('formate une date d\'hier', () => { 
const yesterday = new Date(Date.now() - 25 * 60 * 60 * 1000) 
const result = formatDate(yesterday.toISOString()) 
    expect(result).toBe('Hier') 
  }) 
  test('formate une date ancienne avec jour/mois', () => { 
const oldDate = new Date('2023-01-15T10:00:00.000Z') 
const result = formatDate(oldDate.toISOString()) 
    expect(result).toMatch(/15 janv/) 
  }) 
  test('gère une date invalide', () => { 
const result = formatDate('invalid-date') 
    expect(result).toBe('Date invalide') 
  }) 
}) 
describe('Helpers - filterTodos', () => { 
  const mockTodos = [ 
    { id: 1, text: 'Tâche 1', completed: false }, 
    { id: 2, text: 'Tâche 2', completed: true }, 
    { id: 3, text: 'Tâche 3', completed: false }
  ]; 
  test('retourne tous les todos avec filtre "all"', () => { 
const result = filterTodos(mockTodos, 'all') 
    expect(result).toEqual(mockTodos) 
    expect(result).toHaveLength(3) 
  }) 
  test('retourne seulement les todos actifs avec filtre "active"', () => { 
const result = filterTodos(mockTodos, 'active') 
    expect(result).toHaveLength(2) 
    expect(result.every(todo => !todo.completed)).toBe(true) 
  }) 
  test('retourne seulement les todos terminés avec filtre "completed"', () => { 
const result = filterTodos(mockTodos, 'completed') 
    expect(result).toHaveLength(1) 
    expect(result.every(todo => todo.completed)).toBe(true) 
  }) 
  test('retourne tableau vide pour filtre inconnu', () => { 
const result = filterTodos(mockTodos, 'unknown') 
    expect(result).toEqual([]) 
  }) 
  test('gère un tableau vide', () => { 
const result = filterTodos([], 'all') 
    expect(result).toEqual([]) 
  }) 
  test('gère des données invalides', () => { 
    expect(filterTodos(null, 'all')).toEqual([]) 
    expect(filterTodos(undefined, 'all')).toEqual([]) 
  }) 
}) 