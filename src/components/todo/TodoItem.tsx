// src/components/todo/TodoItem.tsx
import React from 'react';
import { Link } from 'react-router';
import { Todo } from '../../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ 
  todo, 
  onToggleComplete, 
  onDelete 
}) => {
  const priorityConfig = {
    high: { colors: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Haute' },
    medium: { colors: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Moyenne' },
    low: {colors: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Faible' }
  };

  const priority = priorityConfig[todo.priority];

  return (
    <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-2xl ${
      todo.completed ? 'opacity-75' : ''
    }`}>
      {/* En-tête avec titre et priorité */}
      <div className="flex justify-between items-start mb-4">
        <h3 className={`text-lg font-semibold text-white flex-1 mr-2 ${
          todo.completed ? 'line-through opacity-60' : ''
        }`}>
          {todo.title}
        </h3>
        <div className={`px-3 py-1 text-xs rounded-full border ${priority.colors} flex items-center space-x-1`}>
          <span>{priority.emoji}</span>
          <span>{priority.label}</span>
        </div>
      </div>
      
      {/* Description */}
      <p className={`text-gray-300 text-sm mb-4 ${todo.completed ? 'opacity-60' : ''}`}>
        {todo.description}
      </p>
      
      {/* Métadonnées */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-xs text-gray-400">
          <span className="mr-2">🏷️</span>
          <span>{todo.category}</span>
        </div>
        <div className="flex items-center text-xs text-gray-400">
          <span className="mr-2">📅</span>
          <span>{new Date(todo.dueDate).toLocaleDateString('fr-FR')}</span>
        </div>
      </div>
      
      {/* Tags */}
      {todo.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {todo.tags.map((tag, index) => (
            <span 
              key={index} 
              className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-md text-xs border border-purple-500/30"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      
      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-white/10">
        <button 
          onClick={() => onToggleComplete(todo.id)}
          className={`flex items-center justify-center flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
            todo.completed 
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg' 
              : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
          }`}
        >
          <span>{todo.completed ? 'Annuler' : 'Terminer'}</span>
        </button>
        
        <Link 
          to={`/app/edit/${todo.id}`}
          className="flex items-center justify-center px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white transition-all duration-200 transform hover:scale-105 shadow-lg"
          title="Modifier"
        >
          <span>✏️</span>
        </Link>
        
        <button 
          onClick={() => onDelete(todo.id)}
          className="flex items-center justify-center px-3 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white transition-all duration-200 transform hover:scale-105 shadow-lg"
          title="Supprimer"
        >
          <span>🗑️</span>
        </button>
      </div>
    </div>
  );
};

export default TodoItem;