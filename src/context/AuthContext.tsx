// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulation d'une API d'authentification
    // Dans un vrai scénario, vous appelleriez votre backend ici
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock de validation simple (en production, utilisez une vraie validation)
        if (username.trim() && password === '1234') {
          const newUser = { id: 1, username };
          setUser(newUser);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(newUser));
          resolve(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem('user');
          resolve(false);
        }
      }, 500); // Simuler un délai réseau
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};