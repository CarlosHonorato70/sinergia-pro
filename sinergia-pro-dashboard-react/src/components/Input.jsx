import React from 'react';

export const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  required = false,
  name,
  style,
}) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '8px',
          color: '#1f2937',
        }}>
          {label} {required && <span style={{ color: '#DC2626' }}>*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          width: '100%',
          padding: '10px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontFamily: 'inherit',
          fontSize: '14px',
          transition: 'all 0.2s ease',
          boxSizing: 'border-box',
          ...style,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#0066CC';
          e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 204, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#d1d5db';
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
};
