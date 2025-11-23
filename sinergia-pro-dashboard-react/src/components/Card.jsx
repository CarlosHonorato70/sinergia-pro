import React from 'react';

export const Card = ({ title, children, style }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      ...style,
    }}>
      {title && (
        <h2 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '16px',
          color: '#1f2937',
          paddingBottom: '12px',
          borderBottom: '1px solid #e5e7eb',
        }}>
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};
