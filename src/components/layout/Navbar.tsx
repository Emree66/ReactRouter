// src/components/layout/Navbar.tsx
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/app" className="text-xl font-bold text-white hover:text-purple-300 transition-colors">
                TodoApp
              </Link>
            </div>
            
            <nav className="ml-8 flex space-x-1">
              <NavLink 
                to="/app" 
                end
                className={({ isActive }) => 
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-purple-500/20 text-purple-300' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                A Faire
              </NavLink>
              
              <NavLink 
                to="/app/add" 
                className={({ isActive }) => 
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-purple-500/20 text-purple-300' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                Ajouter une tâche
              </NavLink>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <span className="text-gray-300 text-sm">
                Bonjour, <span className="text-white font-medium">{user.username}</span>
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 transition-all duration-200"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;