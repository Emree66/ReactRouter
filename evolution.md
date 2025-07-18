# ISITECH B2D React: Intégration d'API et Hooks React dans une Application Todo

## Introduction

Bonjour à tous! Aujourd'hui, nous allons transformer notre application Todo en intégrant une mock API et en utilisant les bonnes pratiques React pour les appels HTTP. Nous allons apprendre comment :

1. Créer une mock API simple
2. Utiliser les hooks React pour gérer les appels HTTP
3. Implémenter une gestion d'état efficace
4. Gérer les erreurs et les états de chargement

Ce cours combinera théorie et pratique pour que vous puissiez immédiatement appliquer ces concepts. Je pars du principe que certains d'entre vous n'ont pas à disposition une API REST qui fonctionne de facon continue. Nous allons donc créer une API fictive avec JSON Server pour simuler les appels API....

## Plan du TP/Cours

1. **Partie 1**: Théorie - Les appels API dans React et les bonnes pratiques
2. **Partie 2**: TP - Création d'une mock API avec JSON Server
3. **Partie 3**: Théorie - Comprendre les custom hooks pour les appels API
4. **Partie 4**: TP - Refactorisation de l'application avec les custom hooks
5. **Partie 5**: Théorie - Gestion avancée des erreurs et états de chargement
6. **Partie 6**: TP - Finalisation et optimisations

## Partie 1: Théorie - Les appels API dans React et les bonnes pratiques

### Les problèmes courants avec les appels API dans React

Lorsqu'on travaille avec des API dans React, plusieurs défis se présentent:

- **Gestion des états**: chargement, succès, erreur
- **Synchronisation des données**: quand recharger?
- **Duplication de code**: répétition des mêmes patterns
- **Effets de bord**: nettoyage des appels API lors du démontage des composants
- **Cache et optimisation**: éviter les appels inutiles

### Bonnes pratiques pour les appels API dans React

1. **Séparation des préoccupations**:
   - Séparer la logique d'API du reste de l'application
   - Créer des services dédiés pour les appels API

2. **Utilisation efficace des hooks**:
   - `useEffect` pour les appels au montage ou lors des changements de dépendances
   - Custom hooks pour encapsuler la logique d'API

3. **Gestion des états avec des patterns clairs**:
   - État de chargement (loading)
   - État de succès avec données
   - État d'erreur avec messages
   - État d'invalidation et de rechargement

4. **Annulation des requêtes**:
   - Utiliser AbortController pour les requêtes fetch
   - Nettoyer les requêtes en cours lors du démontage

5. **Gestion du cache**:
   - Mémorisation des résultats pour éviter des appels redondants
   - Stratégies d'invalidation du cache

## Partie 2: TP - Création d'une mock API avec JSON Server

### Mise en place de JSON Server

JSON Server est un outil qui permet de créer rapidement une API REST complète à partir d'un simple fichier JSON.

#### Étape 1: Installation de JSON Server

```bash
# Installez JSON Server globalement
npm install -g json-server

# Ou en tant que dépendance de développement
npm install --save-dev json-server
```

#### Étape 2: Création du fichier de données

Créons un fichier `db.json` à la racine du projet:

```json
{
  "todos": [
    {
      "id": 1,
      "title": "Répondre aux emails urgents",
      "description": "Traiter les emails prioritaires de la journée",
      "completed": false,
      "priority": "high",
      "dueDate": "2025-04-23",
      "category": "travail",
      "tags": ["email", "urgent", "communication"]
    },
    {
      "id": 2,
      "title": "Préparer la présentation client",
      "description": "Finaliser les slides pour la réunion de demain",
      "completed": false,
      "priority": "high",
      "dueDate": "2025-04-24",
      "category": "travail",
      "tags": ["présentation", "client", "réunion"]
    },
    {
      "id": 3,
      "title": "Faire les courses",
      "description": "Acheter les ingrédients pour le dîner de ce soir",
      "completed": true,
      "priority": "medium",
      "dueDate": "2025-04-22",
      "category": "personnel",
      "tags": ["courses", "alimentation", "maison"]
    }
  ],
  "users": [
    {
      "id": 1,
      "username": "user1",
      "email": "user1@example.com"
    }
  ]
}
```

#### Étape 3: Ajout du script à package.json

Ajoutons un script dans notre `package.json` pour démarrer facilement notre mock API:

```json
"scripts": {
  "dev": "vite",
  "api": "json-server --watch db.json --port 3001",
  "dev:all": "concurrently \"npm run dev\" \"npm run api\"",
  "build": "tsc && vite build",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "preview": "vite preview"
}
```

N'oubliez pas d'installer `concurrently`:

```bash
npm install --save-dev concurrently
```

#### Étape 4: Démarrage du serveur

Lancez le serveur avec:

```bash
npm run api
```

Votre API sera disponible à l'adresse `http://localhost:3001` avec les routes:
- GET, POST `/todos`
- GET, PUT, DELETE `/todos/:id`
- GET `/users`

### TP: Création d'un service API

Créons maintenant un service API pour interagir avec notre mock API.

#### Étape 1: Créez un dossier services

```
src/
└─ services/
   └─ api.ts
```

#### Étape 2: Implémentation du service

```typescript
// src/services/api.ts
import { Todo, TodoFormData } from '../types/todo';

const API_URL = 'http://localhost:3001';

// Timeout helper pour simuler la latence réseau
const timeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch avec timeout pour simuler une latence
const fetchWithTimeout = async (url: string, options?: RequestInit) => {
  // Simuler une latence de 500ms pour voir les états de chargement
  await timeout(500); 
  return fetch(url, options);
};

// Gestionnaire d'erreurs génériques
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || `Error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }
  return response.json();
};

// API Todo
export const TodoAPI = {
  // Récupérer tous les todos
  getAll: async (): Promise<Todo[]> => {
    const response = await fetchWithTimeout(`${API_URL}/todos`);
    return handleResponse(response);
  },

  // Récupérer un todo par ID
  getById: async (id: number): Promise<Todo> => {
    const response = await fetchWithTimeout(`${API_URL}/todos/${id}`);
    return handleResponse(response);
  },

  // Créer un nouveau todo
  create: async (todoData: TodoFormData): Promise<Todo> => {
    const response = await fetchWithTimeout(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(todoData)
    });
    return handleResponse(response);
  },

  // Mettre à jour un todo
  update: async (id: number, todoData: TodoFormData): Promise<Todo> => {
    const response = await fetchWithTimeout(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...todoData, id })
    });
    return handleResponse(response);
  },

  // Supprimer un todo
  delete: async (id: number): Promise<void> => {
    const response = await fetchWithTimeout(`${API_URL}/todos/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error(`Failed to delete todo with id ${id}`);
    }
  },

  // Basculer l'état de complétion d'un todo
  toggleComplete: async (id: number, completed: boolean): Promise<Todo> => {
    // Récupérer d'abord le todo actuel
    const todo = await TodoAPI.getById(id);
    
    // Mettre à jour uniquement le statut de complétion
    const response = await fetchWithTimeout(`${API_URL}/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed: !todo.completed })
    });
    return handleResponse(response);
  }
};

// API Auth simulée
export const AuthAPI = {
  login: async (username: string, password: string): Promise<{ user: { id: number, username: string }, token: string }> => {
    // Simuler un appel API avec une validation simple
    await timeout(800);
    
    if (password === '1234') {
      return {
        user: { id: 1, username },
        token: 'fake-jwt-token'
      };
    }
    
    throw new Error('Invalid credentials');
  }
};
```

## Partie 3: Théorie - Comprendre les custom hooks pour les appels API

Les custom hooks sont une fonctionnalité puissante de React qui permet d'extraire la logique des composants dans des fonctions réutilisables.

### Pourquoi des custom hooks pour les appels API?

1. **Réutilisabilité**: extraire la logique commune d'appel API
2. **Séparation des préoccupations**: séparer la logique d'état et d'UI
3. **Testabilité**: faciliter les tests unitaires
4. **Lisibilité**: rendre les composants plus concis et déclaratifs

### Structure d'un custom hook d'API

Un custom hook pour les appels API devrait généralement:

1. Gérer l'état de chargement (`loading`)
2. Gérer l'état de succès (`data`)
3. Gérer l'état d'erreur (`error`)
4. Fournir des méthodes pour déclencher les appels API
5. Gérer le nettoyage (cleanup) des requêtes

### Exemple de pattern pour un custom hook d'API

```typescript
function useApi<T>(apiFunction: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction();
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
}
```

## Partie 4: TP - Refactorisation de l'application avec les custom hooks

### Étape 1: Création de nos custom hooks

Créons un dossier `hooks` avec nos nouveaux custom hooks pour gérer les appels API.

```
src/
└─ hooks/
   ├─ useAuth.ts        # Déjà existant, à mettre à jour
   ├─ useTodos.ts       # Nouveau hook pour la gestion des todos
   └─ useTodo.ts        # Nouveau hook pour un todo spécifique
```

#### Hook d'authentification mis à jour

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { AuthAPI } from '../services/api';

interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  login: async () => false,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Initial loading
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const { user, token } = await AuthAPI.login(username, password);
      
      setUser(user);
      setIsAuthenticated(true);
      
      // Enregistrer dans localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  
  return context;
};
```

#### Hook pour la liste des todos

```typescript
// src/hooks/useTodos.ts
import { useState, useEffect, useCallback } from 'react';
import { TodoAPI } from '../services/api';
import { Todo, TodoFormData } from '../types/todo';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  // Charger les todos
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await TodoAPI.getAll();
      setTodos(data);
      
      // Extraire toutes les catégories uniques
      const uniqueCategories = Array.from(
        new Set(data.map(todo => todo.category))
      ).filter(Boolean);
      
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError('Impossible de charger les tâches');
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les todos au montage du composant
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Ajouter un todo
  const addTodo = async (todoData: TodoFormData) => {
    setLoading(true);
    
    try {
      const newTodo = await TodoAPI.create(todoData);
      setTodos(prevTodos => [...prevTodos, newTodo]);
      return newTodo;
    } catch (err) {
      console.error('Error adding todo:', err);
      setError('Impossible d\'ajouter la tâche');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un todo
  const deleteTodo = async (id: number) => {
    try {
      await TodoAPI.delete(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Impossible de supprimer la tâche');
      throw err;
    }
  };

  // Basculer l'état complété d'un todo
  const toggleTodoCompleted = async (id: number) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) throw new Error('Todo not found');
      
      const updatedTodo = await TodoAPI.toggleComplete(id, todo.completed);
      
      setTodos(prevTodos => 
        prevTodos.map(todo => todo.id === id ? updatedTodo : todo)
      );
      
      return updatedTodo;
    } catch (err) {
      console.error('Error toggling todo completion:', err);
      setError('Impossible de mettre à jour la tâche');
      throw err;
    }
  };

  return { 
    todos, 
    loading, 
    error, 
    categories,
    fetchTodos, 
    addTodo, 
    deleteTodo, 
    toggleTodoCompleted 
  };
};
```

#### Hook pour un todo individuel

```typescript
// src/hooks/useTodo.ts
import { useState, useEffect } from 'react';
import { TodoAPI } from '../services/api';
import { Todo, TodoFormData } from '../types/todo';

export const useTodo = (id?: number) => {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger un todo par son ID
  useEffect(() => {
    if (!id) return;

    const fetchTodo = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await TodoAPI.getById(id);
        setTodo(data);
      } catch (err) {
        console.error(`Error fetching todo with id ${id}:`, err);
        setError(`Impossible de charger la tâche #${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [id]);

  // Mettre à jour un todo
  const updateTodo = async (todoData: TodoFormData) => {
    if (!id) {
      setError('ID de la tâche manquant');
      throw new Error('Todo ID is required');
    }

    setLoading(true);
    setError(null);
    
    try {
      const updatedTodo = await TodoAPI.update(id, todoData);
      setTodo(updatedTodo);
      return updatedTodo;
    } catch (err) {
      console.error(`Error updating todo with id ${id}:`, err);
      setError('Impossible de mettre à jour la tâche');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { todo, loading, error, updateTodo };
};
```

### Étape 2: Mise à jour de nos composants

#### Mise à jour de TodoList

```typescript
// src/components/todo/TodoList.tsx
import React, { useState } from 'react';
import TodoItem from './TodoItem';
import { useTodos } from '../../hooks/useTodos';

const TodoList: React.FC = () => {
  const { todos, loading, error, categories, deleteTodo, toggleTodoCompleted } = useTodos();
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  // Filtrer les todos
  const filteredTodos = todos.filter(todo => {
    // Filtre par statut
    if (filter === 'completed' && !todo.completed) return false;
    if (filter === 'active' && todo.completed) return false;
    
    // Filtre par catégorie
    if (categoryFilter && todo.category !== categoryFilter) return false;
    
    return true;
  });

  // Gérer la suppression d'un todo
  const handleDeleteTodo = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      try {
        await deleteTodo(id);
      } catch (err) {
        // L'erreur est déjà gérée dans le hook
      }
    }
  };

  // Basculer l'état complété d'un todo
  const handleToggleComplete = async (id: number) => {
    try {
      await toggleTodoCompleted(id);
    } catch (err) {
      // L'erreur est déjà gérée dans le hook
    }
  };

  if (loading && todos.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-gray-500">Chargement des tâches...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="underline text-sm mt-2"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Mes tâches</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Tous
            </button>
            <button 
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-md ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Actifs
            </button>
            <button 
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-md ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Terminés
            </button>
          </div>
          
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      {filteredTodos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTodos.map(todo => (
            <TodoItem 
              key={todo.id} 
              todo={todo} 
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTodo}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500">Aucune tâche ne correspond à vos critères.</p>
        </div>
      )}
    </div>
  );
};

export default TodoList;
```

#### Mise à jour de AddTodo

```typescript
// src/pages/AddTodo.tsx
import React from 'react';
import { useNavigate } from 'react-router';
import TodoForm from '../components/todo/TodoForm';
import { TodoFormData } from '../types/todo';
import { useTodos } from '../hooks/useTodos';

const AddTodo: React.FC = () => {
  const navigate = useNavigate();
  const { addTodo, error } = useTodos();

  const handleAddTodo = async (todoData: TodoFormData) => {
    try {
      await addTodo(todoData);
      navigate('/app');
    } catch (err) {
      // L'erreur est déjà gérée dans le hook
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Ajouter une nouvelle tâche</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <TodoForm onSubmit={handleAddTodo} />
    </div>
  );
};

export default AddTodo;
```

#### Mise à jour de EditTodo

```typescript
// src/pages/EditTodo.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router';
import TodoForm from '../components/todo/TodoForm';
import { TodoFormData } from '../types/todo';
import { useTodo } from '../hooks/useTodo';

const EditTodo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { todo, loading, error, updateTodo } = useTodo(id ? parseInt(id, 10) : undefined);

  const handleUpdateTodo = async (todoData: TodoFormData) => {
    try {
      await updateTodo(todoData);
      navigate('/app');
    } catch (err) {
      // L'erreur est déjà gérée dans le hook
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
        <button 
          onClick={() => navigate('/app')} 
          className="mt-2 text-sm underline"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
        <p>Aucune tâche trouvée avec cet identifiant.</p>
        <button 
          onClick={() => navigate('/app')} 
          className="mt-2 text-sm underline"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Modifier la tâche</h1>
      <TodoForm initialData={todo} onSubmit={handleUpdateTodo} isEdit />
    </div>
  );
};

export default EditTodo;
```

#### Mise à jour de la page Login

```typescript
// src/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, isAuthenticated, loading, error } = useAuth();
  const navigate = useNavigate();
  
  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app');
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      return;
    }
    
    if (!password) {
      return;
    }
    
    const success = await login(username, password);
    
    if (success) {
      navigate('/app');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            TodoApp
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connectez-vous pour gérer vos tâches
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Nom d'utilisateur</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Nom d'utilisateur"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
              />
            </div>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </div>
          
          <div className="text-sm text-center text-gray-500">
            <p>Pour tester l'application, utilisez n'importe quel nom d'utilisateur avec le mot de passe: 123456</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
```

## Partie 5: Théorie - Gestion avancée des erreurs et états de chargement

### Les différents états d'une requête API

Lorsqu'on travaille avec des API, il est important de gérer correctement tous les états possibles :

1. **État initial** : Avant que la requête ne soit lancée
2. **Chargement** : Pendant l'exécution de la requête
3. **Succès** : La requête a réussi et les données sont disponibles
4. **Erreur** : La requête a échoué

### Patterns pour la gestion des erreurs

#### 1. Gestion centralisée des erreurs

Au lieu de gérer les erreurs dans chaque composant, créer un système centralisé :

```typescript
// Exemple de hook de gestion des erreurs
const useErrorHandler = () => {
  const [error, setError] = useState<Error | null>(null);
  
  const handleError = useCallback((error: unknown) => {
    if (error instanceof Error) {
      setError(error);
    } else {
      setError(new Error(String(error)));
    }
    
    // Logique supplémentaire (logging, analytics...)
  }, []);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return { error, handleError, clearError };
};
```

#### 2. Composants d'affichage des erreurs

Créer des composants réutilisables pour l'affichage des erreurs :

```tsx
// Exemple de composant d'erreur
const ErrorMessage = ({ error, onRetry }: { error: string, onRetry?: () => void }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
    <p>{error}</p>
    {onRetry && (
      <button onClick={onRetry} className="underline text-sm mt-2">
        Réessayer
      </button>
    )}
  </div>
);
```

### Stratégies pour les états de chargement

#### 1. Indicateurs de chargement explicites

```tsx
// Exemple de composant de chargement
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Utilisation
{loading && <LoadingSpinner />}
```

#### 2. Skeleton loading

Afficher une interface "squelette" pendant le chargement :

```tsx
// Exemple de composant squelette pour un todo
const TodoSkeleton = () => (
  <div className="bg-white shadow rounded-lg overflow-hidden animate-pulse">
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded mb-3 w-full"></div>
      <div className="h-3 bg-gray-200 rounded mb-1 w-1/2"></div>
      <div className="h-3 bg-gray-200 rounded mb-3 w-1/3"></div>
      <div className="flex gap-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 bg-gray-200 rounded w-20"></div>
        <div className="h-6 bg-gray-200 rounded w-20"></div>
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  </div>
);

// Utilisation
{loading ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(6)].map((_, i) => <TodoSkeleton key={i} />)}
  </div>
) : (
  // Contenu réel
)}
```

#### 3. État de chargement optimiste

Mettre à jour l'UI immédiatement, puis confirmer avec l'API :

```typescript
// Exemple de mise à jour optimiste
const toggleTodoCompletedOptimistic = async (id: number) => {
  // Trouver le todo actuel
  const todoIndex = todos.findIndex(t => t.id === id);
  if (todoIndex === -1) return;
  
  const originalTodo = todos[todoIndex];
  
  // Mettre à jour localement d'abord (optimiste)
  setTodos(prev => prev.map(todo => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  ));
  
  try {
    // Faire l'appel API
    await TodoAPI.toggleComplete(id, originalTodo.completed);
  } catch (err) {
    // En cas d'erreur, revenir à l'état précédent
    setTodos(prev => prev.map(todo => 
      todo.id === id ? originalTodo : todo
    ));
    throw err;
  }
};
```

## Partie 6: TP - Finalisation et optimisations

Maintenant, améliorons notre application avec des fonctionnalités plus avancées.

### Étape 1: Création d'un composant de skeleton loading

```typescript
// src/components/ui/Skeletons.tsx
import React from 'react';

export const TodoSkeleton: React.FC = () => (
  <div className="bg-white shadow rounded-lg overflow-hidden animate-pulse">
    <div className="p-4">
      <div className="flex justify-between">
        <div className="h-6 bg-gray-200 rounded mb-2 w-1/2"></div>
        <div className="h-5 bg-gray-200 rounded-full w-16"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded mb-3 w-full"></div>
      <div className="h-3 bg-gray-200 rounded mb-1 w-1/2"></div>
      <div className="h-3 bg-gray-200 rounded mb-3 w-1/3"></div>
      <div className="flex gap-2 mb-4">
        <div className="h-5 bg-gray-200 rounded w-16"></div>
        <div className="h-5 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-7 bg-gray-200 rounded w-20"></div>
        <div className="h-7 bg-gray-200 rounded w-20"></div>
        <div className="h-7 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  </div>
);

export const TodoListSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(6)].map((_, i) => <TodoSkeleton key={i} />)}
  </div>
);

export const FormSkeleton: React.FC = () => (
  <div className="bg-white shadow-md rounded-lg p-6 animate-pulse">
    <div className="h-8 bg-gray-200 rounded mb-6 w-3/4"></div>
    
    <div className="space-y-4">
      <div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
      
      <div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-28"></div>
        <div className="h-24 bg-gray-200 rounded w-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-20"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-32"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
      
      <div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
      
      <div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-48"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <div className="h-10 bg-gray-200 rounded w-24"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  </div>
);
```

### Étape 2: Création de composants d'erreur réutilisables

```typescript
// src/components/ui/ErrorMessage.tsx
import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry, 
  onDismiss 
}) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
      <div className="flex justify-between">
        <p>{message}</p>
        {onDismiss && (
          <button 
            onClick={onDismiss}
            className="text-red-700 hover:text-red-900"
            aria-label="Fermer"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        )}
      </div>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-2 text-sm underline"
        >
          Réessayer
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
```

### Étape 3: Mise à jour des hooks pour une gestion optimiste

```typescript
// src/hooks/useTodos.ts (mise à jour)
// Dans la fonction useTodos, ajoutons une gestion optimiste

// Basculer l'état complété d'un todo (optimiste)
const toggleTodoCompletedOptimistic = async (id: number) => {
  // Trouver le todo actuel
  const todoIndex = todos.findIndex(t => t.id === id);
  if (todoIndex === -1) return;
  
  const originalTodo = todos[todoIndex];
  
  // Mettre à jour localement d'abord (optimiste)
  setTodos(prev => prev.map(todo => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  ));
  
  try {
    // Faire l'appel API
    await TodoAPI.toggleComplete(id, originalTodo.completed);
  } catch (err) {
    // En cas d'erreur, revenir à l'état précédent
    setTodos(prev => prev.map(todo => 
      todo.id === id ? originalTodo : todo
    ));
    setError('Impossible de mettre à jour la tâche. Veuillez réessayer.');
    console.error('Error toggling todo completion:', err);
  }
};

// Ajouter cette fonction à notre return
return { 
  // ... autres props
  toggleTodoCompletedOptimistic 
};
```

### Étape 4: Utilisation des skeletons et gestion optimiste dans nos composants

#### Mise à jour de la liste des todos

```typescript
// src/components/todo/TodoList.tsx (mise à jour)
import React, { useState } from 'react';
import TodoItem from './TodoItem';
import { useTodos } from '../../hooks/useTodos';
import { TodoListSkeleton } from '../ui/Skeletons';
import ErrorMessage from '../ui/ErrorMessage';

const TodoList: React.FC = () => {
  const { 
    todos, 
    loading, 
    error, 
    categories, 
    fetchTodos,
    deleteTodo, 
    toggleTodoCompletedOptimistic 
  } = useTodos();
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  // Filtrer les todos
  const filteredTodos = todos.filter(todo => {
    // Filtre par statut
    if (filter === 'completed' && !todo.completed) return false;
    if (filter === 'active' && todo.completed) return false;
    
    // Filtre par catégorie
    if (categoryFilter && todo.category !== categoryFilter) return false;
    
    return true;
  });

  // Gérer la suppression d'un todo
  const handleDeleteTodo = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      try {
        await deleteTodo(id);
      } catch (err) {
        // L'erreur est déjà gérée dans le hook
      }
    }
  };

  // Basculer l'état complété d'un todo avec gestion optimiste
  const handleToggleComplete = (id: number) => {
    toggleTodoCompletedOptimistic(id);
  };

  if (loading && todos.length === 0) {
    return <TodoListSkeleton />;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Mes tâches</h1>
        
        {error && (
          <div className="mb-4">
            <ErrorMessage 
              message={error} 
              onRetry={fetchTodos} 
            />
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Tous
            </button>
            <button 
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-md ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Actifs
            </button>
            <button 
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-md ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              Terminés
            </button>
          </div>
          
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      {filteredTodos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTodos.map(todo => (
            <TodoItem 
              key={todo.id} 
              todo={todo} 
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTodo}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500">Aucune tâche ne correspond à vos critères.</p>
        </div>
      )}
    </div>
  );
};

export default TodoList;
```

#### Mise à jour de la page d'édition

```typescript
// src/pages/EditTodo.tsx (mise à jour)
import React from 'react';
import { useParams, useNavigate } from 'react-router';
import TodoForm from '../components/todo/TodoForm';
import { TodoFormData } from '../types/todo';
import { useTodo } from '../hooks/useTodo';
import { FormSkeleton } from '../components/ui/Skeletons';
import ErrorMessage from '../components/ui/ErrorMessage';

const EditTodo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { todo, loading, error, updateTodo } = useTodo(id ? parseInt(id, 10) : undefined);

  const handleUpdateTodo = async (todoData: TodoFormData) => {
    try {
      await updateTodo(todoData);
      navigate('/app');
    } catch (err) {
      // L'erreur est déjà gérée dans le hook
    }
  };

  if (loading) {
    return <FormSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Modifier la tâche</h1>
        <ErrorMessage 
          message={error} 
          onRetry={() => navigate(0)} // Recharger la page
          onDismiss={() => navigate('/app')}
        />
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Modifier la tâche</h1>
        <ErrorMessage 
          message="Aucune tâche trouvée avec cet identifiant."
          onDismiss={() => navigate('/app')}
        />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Modifier la tâche</h1>
      <TodoForm initialData={todo} onSubmit={handleUpdateTodo} isEdit />
    </div>
  );
};

export default EditTodo;
```

## Résumé des concepts vus aujourd'hui

1. **Création d'une mock API**
   - Utilisation de JSON Server pour simuler un back-end REST
   - Configuration d'endpoints pour les opérations CRUD

2. **Service API**
   - Création d'un service centralisé pour les appels API
   - Gestion des réponses et des erreurs
   - Organisation des méthodes par entité

3. **Custom Hooks pour les appels API**
   - Extraction de la logique d'API dans des hooks réutilisables
   - Gestion des états (loading, error, data)
   - Séparation des préoccupations

4. **Optimisations UI**
   - Skeleton loading pour améliorer l'UX
   - Gestion optimiste des mises à jour
   - Composants d'erreur réutilisables

5. **Bonnes pratiques React**
   - Séparation des préoccupations
   - Composition de composants
   - Gestion des effets de bord

## Pour aller plus loin

Vous pouvez continuer à améliorer cette application en:

1. **Implémentant une vraie API backend**
   - Remplacer JSON Server par une API Express.js ou autre
   - Ajouter une authentification JWT complète

2. **Utilisant des bibliothèques spécialisées**
   - React Query ou SWR pour la gestion des données serveur
   - React Hook Form pour des formulaires plus puissants

3. **Ajoutant des fonctionnalités avancées**
   - Recherche en temps réel
   - Pagination et tri
   - Glisser-déposer pour réorganiser les todos
   - Notifications temps réel

## Exercices supplémentaires

1. Ajoutez une fonctionnalité de recherche dans la liste des todos
2. Implémentez un système de pagination pour la liste des todos
3. Créez un système de filtrage avancé (par priorité, date, etc.)
4. Ajoutez un système de tags cliquables pour filtrer rapidement
5. Créez un tableau de bord avec des statistiques (todos par catégorie, par priorité, etc.)

