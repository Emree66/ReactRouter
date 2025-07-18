 import { describe, test, expect } from 'vitest'
 import { render, screen } from '@testing-library/react'
 import Badge from './Badge' 
describe('Badge', () => { 
// TODO : Écrire les tests suivants : 
  test('affiche le contenu du badge', () => { 
// Tester que le texte passé en children s'affiche 
  }) 
  test('applique la couleur par défaut', () => { 
// Tester que sans prop color, la classe badge-blue est appliquée 
  }) 
  test('applique la couleur spécifiée', () => { 
// Tester avec color="red" que la classe badge-red est appliquée 
  }) 
  test('applique la taille par défaut', () => { 
// Tester que sans prop size, la classe badge-md est appliquée 
  }) 
  test('applique la taille spécifiée', () => { 
// Tester avec size="lg" que la classe badge-lg est appliquée 
  }) 
}) 