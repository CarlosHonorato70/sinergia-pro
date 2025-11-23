import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Badge } from './Badge';

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'sessão', message: 'Sua sessão começa em 1 hora', timestamp: '09:00', read: false },
    { id: 2, type: 'diário', message: 'Não esqueça de registrar seus sentimentos', timestamp: '08:30', read: false },
    { id: 3, type: 'risco', message: 'Alerta: Paciente com risco elevado', timestamp: '07:00', read: true },
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'sessão': return '📅';
      case 'diário': return '📔';
      case 'risco': return '⚠️';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch(type) {
      case 'sessão': return '#0066CC';
      case 'diário': return '#00AA44';
      case 'risco': return '#DC2626';
      default: return '#666';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        style={{
          position: 'relative',
          backgroundColor: 'transparent',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            backgroundColor: '#DC2626',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div style={{
          position: 'absolute',
          top: '40px',
          right: 0,
          width: '320px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          zIndex: 100,
          maxHeight: '400px',
          overflowY: 'auto',
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>Notificações</h3>
          </div>

          <div>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: notif.read ? 'white' : '#f0f4f8',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>{getNotificationIcon(notif.type)}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '500' }}>
                      {notif.message}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>{notif.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
