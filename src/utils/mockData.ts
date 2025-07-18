// src/utils/mockData.ts
import { Todo } from '../types/todo';

const todos: Todo[] = [
  {
    id: 1,
    title: "Configurer le serveur CI/CD",
    description: "Mettre en place Jenkins pour les déploiements automatiques",
    completed: false,
    priority: "high",
    dueDate: "2025-04-23",
    category: "infrastructure",
    tags: ["CI/CD", "Jenkins", "déploiement"]
  },
  {
    id: 2,
    title: "Créer la documentation API",
    description: "Rédiger les endpoints REST pour le service utilisateur",
    completed: false,
    priority: "high",
    dueDate: "2025-04-24",
    category: "documentation",
    tags: ["API", "REST", "documentation"]
  },
  {
    id: 3,
    title: "Corriger les bugs critiques",
    description: "Résoudre les tickets P1 dans le backlog",
    completed: true,
    priority: "high",
    dueDate: "2025-04-22",
    category: "développement",
    tags: ["bugs", "priorité", "backlog"]
  },
  {
    id: 4,
    title: "Préparer la démo client",
    description: "Créer un environnement de test pour la présentation",
    completed: false,
    priority: "medium",
    dueDate: "2025-04-25",
    category: "présentation",
    tags: ["démo", "client", "test"]
  },
  {
    id: 5,
    title: "Mettre à jour les dépendances",
    description: "Passer aux dernières versions des librairies utilisées",
    completed: false,
    priority: "medium",
    dueDate: "2025-04-30",
    category: "maintenance",
    tags: ["dépendances", "mise à jour", "sécurité"]
  },
  {
    id: 6,
    title: "Planifier la migration vers TypeScript",
    description: "Établir un plan pour convertir le projet en TypeScript",
    completed: false,
    priority: "medium",
    dueDate: "2025-05-05",
    category: "planification",
    tags: ["TypeScript", "migration", "plan"]
  },
  {
    id: 7,
    title: "Optimiser les performances",
    description: "Analyser les goulots d'étranglement et améliorer le temps de réponse",
    completed: false,
    priority: "high",
    dueDate: "2025-04-28",
    category: "optimisation",
    tags: ["performances", "analyse", "amélioration"]
  },
  {
    id: 8,
    title: "Former l'équipe sur GraphQL",
    description: "Organiser un atelier pour introduire GraphQL",
    completed: false,
    priority: "high",
    dueDate: "2025-05-10",
    category: "formation",
    tags: ["GraphQL", "atelier", "équipe"]
  },
  {
    id: 9,
    title: "Nettoyer le code legacy",
    description: "Supprimer les fonctions inutilisées et refactoriser le code",
    completed: false,
    priority: "low",
    dueDate: "2025-04-26",
    category: "refactoring",
    tags: ["legacy", "nettoyage", "refactorisation"]
  },
  {
    id: 10,
    title: "Mettre en place le monitoring",
    description: "Installer et configurer Prometheus et Grafana",
    completed: true,
    priority: "medium",
    dueDate: "2025-04-21",
    category: "infrastructure",
    tags: ["monitoring", "Prometheus", "Grafana"]
  }
];

// LocalStorage key
const TODOS_STORAGE_KEY = 'todos';

// Fonction pour initialiser les todos ou récupérer ceux existants
export const getTodos = (): Todo[] => {
  const storedTodos = localStorage.getItem(TODOS_STORAGE_KEY);
  if (storedTodos) {
    return JSON.parse(storedTodos);
  }
  
  // Si aucun todo n'existe, initialiser avec notre liste de mock
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
  return todos;
};

// Fonction pour sauvegarder les todos
export const saveTodos = (todos: Todo[]): void => {
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
};

// Fonction pour ajouter un todo
export const addTodo = (todo: Omit<Todo, 'id'>): Todo => {
  const currentTodos = getTodos();
  const newTodo: Todo = {
    ...todo,
    id: currentTodos.length > 0 
      ? Math.max(...currentTodos.map(t => t.id)) + 1 
      : 1
  };
  
  const updatedTodos = [...currentTodos, newTodo];
  saveTodos(updatedTodos);
  
  return newTodo;
};

// Fonction pour mettre à jour un todo
export const updateTodo = (todo: Todo): Todo => {
  const currentTodos = getTodos();
  const updatedTodos = currentTodos.map(t => 
    t.id === todo.id ? todo : t
  );
  
  saveTodos(updatedTodos);
  return todo;
};

// Fonction pour supprimer un todo
export const deleteTodo = (id: number): void => {
  const currentTodos = getTodos();
  const updatedTodos = currentTodos.filter(todo => todo.id !== id);
  
  saveTodos(updatedTodos);
};

// Fonction pour basculer l'état terminé d'un todo
export const toggleTodoCompleted = (id: number): Todo | undefined => {
  const currentTodos = getTodos();
  let updatedTodo: Todo | undefined;
  
  const updatedTodos = currentTodos.map(todo => {
    if (todo.id === id) {
      updatedTodo = { ...todo, completed: !todo.completed };
      return updatedTodo;
    }
    return todo;
  });
  
  saveTodos(updatedTodos);
  return updatedTodo;
};