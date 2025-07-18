 import { describe, test, expect } from 'vitest'
import { validateEmail, validatePassword } from './validation'

describe('validateEmail', () => {
  test('email valide', () => {
    const result = validateEmail('user@example.com');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('');
  })
  
  test('email vide', () => {
    const result = validateEmail('');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Email requis');
  })
  
  test('email sans @', () => {
    const result = validateEmail('userexample.com');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Format email invalide');
  })
  
  test('email trop court', () => {
    const result = validateEmail('a@b');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Email trop court');
  })
})

describe('validatePassword', () => {
  test('mot de passe valide', () => {
    const result = validatePassword('Password123');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('');
  })
  
  test('mot de passe vide', () => {
    const result = validatePassword('');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Mot de passe requis');
  })
  
  test('mot de passe trop court', () => {
    const result = validatePassword('Pass1');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Minimum 8 caractères');
  })
  
  test('mot de passe sans majuscule', () => {
    const result = validatePassword('password123');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Au moins une majuscule');
  })
  
  test('mot de passe sans chiffre', () => {
    const result = validatePassword('Password');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Au moins un chiffre');
  })
})