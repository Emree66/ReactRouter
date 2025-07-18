function Button({ children, onClick, disabled, variant = 'primary' }) {
    const className = `btn btn-${variant} ${disabled ? 'btn-disabled' : 
''}`; 
return ( 
<button  
onClick={onClick}  
disabled={disabled} 
className={className} 
    > 
      {children} 
</button> 
  ); 
} 
export default Button; 