import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import Login from '../../pages/Login';

describe('Login Integration Tests', () => {
  test('should render login page', () => {
    const { container } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });
});