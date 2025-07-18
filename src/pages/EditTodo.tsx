// src/pages/EditTodo.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import TodoForm from '../components/todo/TodoForm';
import { getTodos, updateTodo } from '../utils/mockData';
import { Todo, TodoFormData } from '../types/todo';

const EditTodo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [todo, setTodo] = useState<Todo | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const todoId = parseInt(id, 10);
      const todos = getTodos();
      const foundTodo = todos.find(t => t.id === todoId);
      
      if (foundTodo) {
        setTodo(foundTodo);
      } else {
        setError(`Aucune tâche trouvée avec l'ID ${id}`);
      }
      
      setIsLoading(false);
    }
  }, [id]);

  const handleUpdateTodo = (todoData: TodoFormData) => {
    if (todo) {
      const updatedTodo: Todo = {
        ...todoData,
        id: todo.id
      };
      updateTodo(updatedTodo);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        <span className="ml-3 text-gray-300">Chargement...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-6 py-4 rounded-xl text-center">
          <div className="text-4xl mb-2">❌</div>
          <p className="font-medium">{error}</p>
          <button 
            onClick={() => navigate('/app')} 
            className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            🏠 Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <div className="text-6xl mb-4">✏️</div>
        <h1 className="text-3xl font-bold text-white mb-2">Modifier la tâche</h1>
        <p className="text-gray-300">Mettez à jour les détails de votre tâche</p>
      </div>

      {/* Bouton retour */}
      <div className="flex justify-start">
        <button 
          onClick={() => navigate('/app')}
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
        >
          <span>🔙</span>
          <span>Retour à la liste</span>
        </button>
      </div>

      {/* Formulaire */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8">
        {todo && <TodoForm initialData={todo} onSubmit={handleUpdateTodo} isEdit />}
      </div>
    </div>
  );
};

export default EditTodo;