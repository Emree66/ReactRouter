function Badge({ children, color = 'blue', size = 'md' }) {
  const baseClass = 'badge';
  const colorClass = `badge-${color}`;
  const sizeClass = `badge-${size}`;
  
  return (
    <span className={`${baseClass} ${colorClass} ${sizeClass}`}>
      {children}
    </span>
  );
}

export default Badge; 