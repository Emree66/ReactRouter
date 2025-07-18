// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Home from './pages/Home';
import AddTodo from './pages/AddTodo';
import EditTodo from './pages/EditTodo';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Route publique */}
        <Route path="/login" element={<Login />} />
        
        {/* Routes protégées - AppLayout vérifie l'authentification */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="add" element={<AddTodo />} />
          <Route path="edit/:id" element={<EditTodo />} />
        </Route>
        
        {/* Redirection par défaut vers /login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;