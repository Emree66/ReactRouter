import { useState, useEffect } from 'react';

const STORAGE_KEY = 'todoApp_todos';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
}

const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Charger les todos depuis localStorage au montage
  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem(STORAGE_KEY);
      if (savedTodos) {
        setTodos(JSON.parse(savedTodos));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des todos:', error);
      setTodos([]);
    }
  }, []);

  // Sauvegarder dans localStorage à chaque changement
  const saveTodos = (newTodos: Todo[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
      setTodos(newTodos);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // Ajouter un nouveau todo
  const addTodo = (text: string) => {
    const trimmedText = text.trim();
    if (trimmedText) {
      const newTodo: Todo = {
        id: Date.now(),
        text: trimmedText,
        completed: false,
        createdAt: new Date().toISOString()
      };
      const newTodos = [newTodo, ...todos];
      saveTodos(newTodos);
    }
  };

  // Basculer le statut d'un todo
  const toggleTodo = (id: number) => {
    const newTodos = todos.map(todo =>
      todo.id === id
        ? {
            ...todo,
            completed: !todo.completed,
            updatedAt: new Date().toISOString()
          }
        : todo
    );
    saveTodos(newTodos);
  };

  // Supprimer un todo
  const deleteTodo = (id: number) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    saveTodos(newTodos);
  };

  // Modifier un todo
  const editTodo = (id: number, newText: string) => {
    const trimmedText = newText.trim();
    if (trimmedText) {
      const newTodos = todos.map(todo =>
        todo.id === id
          ? {
              ...todo,
              text: trimmedText,
              updatedAt: new Date().toISOString()
            }
          : todo
      );
      saveTodos(newTodos);
    }
  };

  // Supprimer tous les todos terminés
  const clearCompleted = () => {
    const newTodos = todos.filter(todo => !todo.completed);
    saveTodos(newTodos);
  };

  // Basculer tous les todos
  const toggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
      updatedAt: new Date().toISOString()
    }));
    saveTodos(newTodos);
  };

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    toggleAll
  };
};

export default useTodos;
