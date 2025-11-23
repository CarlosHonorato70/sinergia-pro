import React from 'react';

export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  disabled = false,
  onClick,
  type = 'button',
  title,
  style,
  ...props 
}) => {
  const baseStyles = {
    border: 'none',
    borderRadius: '6px',
    fontWeight: '500',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.5 : 1,
    fontSize: 'inherit',
    fontFamily: 'inherit',
    ...style,
  };

  const sizes = {
    sm: { padding: '6px 12px', fontSize: '12px' },
    md: { padding: '10px 16px', fontSize: '14px' },
    lg: { padding: '12px 20px', fontSize: '16px' },
  };

  const variants = {
    primary: {
      backgroundColor: '#0066CC',
      color: 'white',
      border: '1px solid #0066CC',
      '&:hover': { backgroundColor: '#0052A3', boxShadow: '0 4px 12px rgba(0, 102, 204, 0.3)' },
    },
    secondary: {
      backgroundColor: '#00AA44',
      color: 'white',
      border: '1px solid #00AA44',
      '&:hover': { backgroundColor: '#008833', boxShadow: '0 4px 12px rgba(0, 170, 68, 0.3)' },
    },
    outline: {
      backgroundColor: 'white',
      color: '#0066CC',
      border: '1px solid #d1d5db',
      '&:hover': { backgroundColor: '#f3f4f6', borderColor: '#0066CC' },
    },
    danger: {
      backgroundColor: '#DC2626',
      color: 'white',
      border: '1px solid #DC2626',
      '&:hover': { backgroundColor: '#B91C1C', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)' },
    },
  };

  const buttonStyles = {
    ...baseStyles,
    ...sizes[size],
    ...variants[variant],
  };

  return (
    <button
      type={type}
      style={buttonStyles}
      disabled={disabled}
      onClick={onClick}
      title={title}
      onMouseEnter={(e) => {
        if (!disabled) {
          const variantHover = variants[variant]['&:hover'];
          Object.assign(e.target.style, variantHover);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          Object.assign(e.target.style, {
            backgroundColor: variants[variant].backgroundColor,
            boxShadow: 'none',
            borderColor: variants[variant].borderColor || variants[variant].border.split(' ')[2],
          });
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};
