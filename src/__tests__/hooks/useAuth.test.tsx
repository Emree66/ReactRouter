import { describe, test, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuth } from '../../hooks/useAuth';

describe('useAuth hook', () => {
  test('should initialize with default values', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current).toBeDefined();
  });
});