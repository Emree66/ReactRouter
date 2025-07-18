// src/components/todo/TodoList.tsx
import React, { useState, useEffect } from 'react';
import { Todo } from '../../types/todo';
import TodoItem from './TodoItem';
import { getTodos, deleteTodo, toggleTodoCompleted } from '../../utils/mockData';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les todos
  useEffect(() => {
    const loadTodos = () => {
      try {
        const loadedTodos = getTodos();
        setTodos(loadedTodos);
        
        // Extraire toutes les catégories uniques
        const uniqueCategories = Array.from(
          new Set(loadedTodos.map(todo => todo.category))
        ).filter(Boolean);
        
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error loading todos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

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
  const handleDeleteTodo = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    }
  };

  // Basculer l'état complété d'un todo
  const handleToggleComplete = (id: number) => {
    const updatedTodo = toggleTodoCompleted(id);
    if (updatedTodo) {
      setTodos(prev => 
        prev.map(todo => todo.id === id ? updatedTodo : todo)
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        <span className="ml-3 text-gray-300">Chargement des tâches...</span>
      </div>
    );
  }

  // Statistiques
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-200">
          <div className="text-2xl font-bold text-white">{totalTodos}</div>
          <div className="text-gray-300 text-sm">Total</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-200">
          <div className="text-2xl font-bold text-green-400">{completedTodos}</div>
          <div className="text-gray-300 text-sm">Terminées</div>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-200">
          <div className="text-2xl font-bold text-yellow-400">{activeTodos}</div>
          <div className="text-gray-300 text-sm">En cours</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <h3 className="text-lg font-medium text-white">Filtres</h3>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Filtres par statut */}
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                filter === 'all' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              Toutes ({totalTodos})
            </button>
            <button 
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                filter === 'active' 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              Actives ({activeTodos})
            </button>
            <button 
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                filter === 'completed' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              Terminées ({completedTodos})
            </button>
          </div>
          
          {/* Filtre par catégorie */}
          <div className="flex-1 max-w-xs">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-md"
            >
              <option value="" className="bg-gray-800">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category} value={category} className="bg-gray-800">{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Liste des todos */}
      {filteredTodos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTodos.map((todo, index) => (
            <div 
              key={todo.id} 
              className="transform transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <TodoItem 
                todo={todo} 
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTodo}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-medium text-white mb-2">Aucune tâche trouvée</h3>
          <p className="text-gray-400">
            {filter === 'all' 
              ? "Vous n'avez pas encore de tâches. Commencez par en créer une !" 
              : `Aucune tâche ne correspond au filtre "${filter === 'active' ? 'actives' : 'terminées'}".`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default TodoList;