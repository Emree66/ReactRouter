import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { vi } from 'vitest';
import App from '../App';

// Mock des modules qui pourraient causer des problèmes
vi.mock('../context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn()
  })
}));

vi.mock('../components/layout/AppLayout', () => ({
  default: () => <div>AppLayout Mock</div>
}));

vi.mock('../pages/Login', () => ({
  default: () => <div>Login Mock</div>
}));

vi.mock('../pages/Home', () => ({
  default: () => <div>Home Mock</div>
}));

vi.mock('../pages/AddTodo', () => ({
  default: () => <div>AddTodo Mock</div>
}));

vi.mock('../pages/EditTodo', () => ({
  default: () => <div>EditTodo Mock</div>
}));

test('renders app without crashing', () => {
  const { container } = render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  // Test pour vérifier que l'app se rend sans erreur
  expect(container).toBeTruthy();
});