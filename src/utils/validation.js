export function validateEmail(email) {
  if (!email) {
    return { valid: false, message: 'Email requis' };
  }
  
  if (!email.includes('@')) {
    return { valid: false, message: 'Format email invalide' };
  }
  
  if (email.length < 5) {
    return { valid: false, message: 'Email trop court' };
  }
  
  return { valid: true, message: '' };
}

export function validatePassword(password) {
  if (!password) {
    return { valid: false, message: 'Mot de passe requis' };
  }
  
  if (password.length < 8) {
    return { valid: false, message: 'Minimum 8 caractères' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Au moins une majuscule' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Au moins un chiffre' };
  }
  
  return { valid: true, message: '' };
}
