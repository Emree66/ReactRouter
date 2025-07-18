// src/utils/helpers.js
export function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    // Moins d'une minute
    if (diffInMinutes < 1) {
      return "À l'instant";
    }
    
    // Moins d'une heure
    if (diffInHours < 1) {
      return `Il y a ${diffInMinutes}min`;
    }
    
    // Moins de 24 heures
    if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    }
    
    // Hier
    if (diffInDays === 1) {
      return 'Hier';
    }
    
    // Plus ancien - format jour/mois
    const months = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 
                   'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day} ${month}`;
    
  } catch (error) {
    return 'Date invalide';
  }
}

export function filterTodos(todos, filter) {
  if (!todos || !Array.isArray(todos)) {
    return [];
  }
  
  switch (filter) {
    case 'all':
      return todos;
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return [];
  }
}
