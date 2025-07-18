// src/pages/Home.tsx
import React from 'react';
import TodoList from '../components/todo/TodoList';
import { Link } from 'react-router';

const Home: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* En-tête avec titre et action rapide */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Gestionnaire de Tâches
        </h1>
        <p className="text-gray-300 text-lg mb-8">
          Organisez votre quotidien avec style et efficacité
        </p>
        
        {/* Bouton d'action rapide */}
        <Link 
          to="/app/add"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          <span>Ajouter une nouvelle tâche</span>
        </Link>
      </div>
      
      {/* Liste des todos */}
      <TodoList />
    </div>
  );
};

export default Home;