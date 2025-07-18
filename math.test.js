// math.test.js
import { add, subtract } from './src/utils/math.js';

describe('Fonctions mathématiques', () => {
  test('addition de deux nombres positifs', () => {
    // Arrange (Préparer)
    const a = 2;
    const b = 3;
    
    // Act (Agir)
    const result = add(a, b);
    
    // Assert (Vérifier)
    expect(result).toBe(5);
  });
  
  test('soustraction avec résultat négatif', () => {
    expect(subtract(2, 5)).toBe(-3);
  });
});