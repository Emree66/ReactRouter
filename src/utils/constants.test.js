 import { describe, test, expect } from 'vitest'
 import { FILTER_TYPES, FILTER_LABELS } from './constants' 
describe('Constants', () => { 
  test('FILTER_TYPES contient les bonnes valeurs', () => { 
    expect(FILTER_TYPES.ALL).toBe('all') 
    expect(FILTER_TYPES.ACTIVE).toBe('active') 
    expect(FILTER_TYPES.COMPLETED).toBe('completed') 
  }) 
  test('FILTER_LABELS contient tous les types de filtres', () => { 
Object.values(FILTER_TYPES).forEach(filterType => { 
      expect(FILTER_LABELS[filterType]).toBeDefined() 
      expect(typeof FILTER_LABELS[filterType]).toBe('string') 
    }) 
  }) 
  test('FILTER_LABELS a les bonnes traductions', () => { 
    expect(FILTER_LABELS[FILTER_TYPES.ALL]).toBe('Toutes') 
    expect(FILTER_LABELS[FILTER_TYPES.ACTIVE]).toBe('En cours') 
    expect(FILTER_LABELS[FILTER_TYPES.COMPLETED]).toBe('Terminées') 
  }) 
}) 