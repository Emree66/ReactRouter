import { describe, test, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import React from 'react';
import TodoForm from '../../../components/todo/TodoForm';

// Mock du contexte Auth - plus complet
vi.mock('../../../context/AuthContext', () => {
  const mockContext = React.createContext({
    user: null,
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn()
  });
  
  return {
    AuthContext: mockContext,
    AuthProvider: ({ children }: { children: React.ReactNode }) => 
      React.createElement(mockContext.Provider, {
        value: {
          user: null,
          isAuthenticated: false,
          login: vi.fn(),
          logout: vi.fn()
        }
      }, children),
    useAuth: () => ({
      user: null,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn()
    })
  };
});

// Mock des utilitaires
vi.mock('../../../utils/mockData', () => ({
  saveTodo: vi.fn(),
  getTodoById: vi.fn(),
  updateTodo: vi.fn()
}));

describe('TodoForm', () => {
  test('should render without crashing', () => {
    const { container } = render(
      <BrowserRouter>
        <TodoForm onSubmit={() => {}} />
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });
});