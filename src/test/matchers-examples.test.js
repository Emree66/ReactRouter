 import { describe, test, expect } from 'vitest' 
describe('Exemples de matchers', () => { 
  test('matchers de base', () => { 
// Égalité stricte 
    expect(2 + 2).toBe(4); 
// Égalité d'objets (compare le contenu) 
    expect({ name: 'John' }).toEqual({ name: 'John' }); 
// Booléens 
    expect(true).toBeTruthy(); 
    expect(false).toBeFalsy(); 
    expect(null).toBeNull(); 
    expect(undefined).toBeUndefined(); 
// Nombres 
    expect(2 + 2).toBeGreaterThan(3); 
    expect(Math.PI).toBeCloseTo(3.14);
     // Chaînes 
    expect('hello world').toContain('world'); 
    expect('hello').toMatch(/ell/); 
// Tableaux 
    expect(['Alice', 'Bob', 'Charlie']).toContain('Bob'); 
    expect([1, 2, 3]).toHaveLength(3); 
  }); 
}); 