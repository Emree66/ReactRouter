// src/types/todo.ts
export interface Todo {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    category: string;
    tags: string[];
  }
  
  export type TodoFormData = Omit<Todo, 'id'>;