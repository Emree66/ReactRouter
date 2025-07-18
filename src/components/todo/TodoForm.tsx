// src/components/todo/TodoForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Todo, TodoFormData } from '../../types/todo';
import { useAuth } from '../../hooks/useAuth';

interface TodoFormProps {
  initialData?: Todo;
  onSubmit: (todoData: TodoFormData) => void;
  isEdit?: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({ 
  initialData, 
  onSubmit,
  isEdit = false
}) => {

    const authContext = useAuth();
    console.log('authContext TodoForm: ', authContext);
    
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setPriority(initialData.priority);
      setDueDate(initialData.dueDate);
      setCategory(initialData.category);
      setTags(initialData.tags.join(', '));
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const todoData: TodoFormData = {
        title,
        description,
        completed: initialData?.completed || false,
        priority,
        dueDate,
        category,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };
      
      onSubmit(todoData);
      navigate('/app');
    } catch (error) {
      console.error('Error submitting todo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Titre*
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            placeholder="Donnez un titre à votre tâche"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            rows={3}
            placeholder="Décrivez votre tâche en détail..."
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Priorité
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-800/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              <option value="low" className="bg-gray-800">Basse</option>
              <option value="medium" className="bg-gray-800">Moyenne</option>
              <option value="high" className="bg-gray-800">Haute</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Date d'échéance
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-800/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Catégorie
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            placeholder="Ex: Travail, Personnel, Sport..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Tags (séparés par des virgules)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="urgent, important, projet..."
            className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/10">
          <button
            type="button"
            onClick={() => navigate('/app')}
            className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Chargement...
              </div>
            ) : (
              <>
                {isEdit ? '💾 Mettre à jour' : 'Ajouter'}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default TodoForm;