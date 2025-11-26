import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

function AdminMasterLogs() {
  const navigate = useNavigate();
  const [logs] = useState([
    { id: 1, timestamp: '2025-11-25 10:30:45', action: 'LOGIN', user: 'carlos@example.com', status: 'sucesso' },
    { id: 2, timestamp: '2025-11-25 10:28:12', action: 'CREATE_USER', user: 'admin@example.com', status: 'sucesso' },
    { id: 3, timestamp: '2025-11-25 10:25:33', action: 'DELETE_USER', user: 'admin@example.com', status: 'sucesso' },
    { id: 4, timestamp: '2025-11-25 10:20:15', action: 'UPDATE_SETTINGS', user: 'carlos@example.com', status: 'sucesso' },
    { id: 5, timestamp: '2025-11-25 10:15:42', action: 'LOGIN_FAILED', user: 'unknown@example.com', status: 'erro' },
    { id: 6, timestamp: '2025-11-25 10:10:20', action: 'LOGOUT', user: 'maria@example.com', status: 'sucesso' },
  ]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '32px 16px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <Button variant="outline" onClick={() => navigate('/admin/master')}>
          ← Voltar
        </Button>

        <h1 style={{ marginTop: '20px', marginBottom: '30px' }}>📋 Logs do Sistema</h1>

        <Card title={`Últimas Atividades (${logs.length})`}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ borderBottom: '2px solid #e5e7eb' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Data/Hora</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Ação</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Usuário</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px' }}>{log.timestamp}</td>
                    <td style={{ padding: '12px 16px' }}>{log.action}</td>
                    <td style={{ padding: '12px 16px' }}>{log.user}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge variant={log.status === 'sucesso' ? 'primary' : 'danger'}>
                        {log.status === 'sucesso' ? '✅ Sucesso' : '❌ Erro'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AdminMasterLogs;