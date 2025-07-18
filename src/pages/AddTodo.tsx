// src/pages/AddTodo.tsx
import React from 'react';
import TodoForm from '../components/todo/TodoForm';
import { addTodo } from '../utils/mockData';
import { TodoFormData } from '../types/todo';
import { Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

const AddTodo: React.FC = () => {
  const handleAddTodo = (todoData: TodoFormData) => {
    addTodo(todoData);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-purple-500/20 rounded-full">
            <Plus className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          Nouvelle Tâche
        </h1>
        <p className="text-gray-300">
          Créez une nouvelle tâche pour rester organisé
        </p>
      </div>

      {/* Bouton retour */}
      <div className="flex justify-start">
        <Link 
          to="/app"
          className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la liste</span>
        </Link>
      </div>

      {/* Formulaire */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8">
        <TodoForm onSubmit={handleAddTodo} />
      </div>
    </div>
  );
};

export default AddTodo;