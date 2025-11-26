import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

function AdminMasterUsuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([
    { id: 1, name: 'Carlos Silva', email: 'carlos@example.com', role: 'master', status: 'ativo' },
    { id: 2, name: 'Ana Costa', email: 'ana@example.com', role: 'admin', status: 'ativo' },
    { id: 3, name: 'João Santos', email: 'joao@example.com', role: 'therapist', status: 'inativo' },
    { id: 4, name: 'Maria Oliveira', email: 'maria@example.com', role: 'patient', status: 'ativo' },
  ]);

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
      setUsuarios(usuarios.filter(u => u.id !== id));
      alert('Usuário deletado com sucesso!');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '32px 16px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <Button variant="outline" onClick={() => navigate('/admin/master')}>
          ← Voltar
        </Button>

        <h1 style={{ marginTop: '20px', marginBottom: '30px' }}>👥 Gerenciar Usuários</h1>

        <Button variant="primary" size="lg" style={{ marginBottom: '24px' }}>
          + Adicionar Usuário
        </Button>

        <Card title={`Todos os Usuários (${usuarios.length})`}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ borderBottom: '2px solid #e5e7eb' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Nome</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Função</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px' }}>{usuario.name}</td>
                    <td style={{ padding: '12px 16px' }}>{usuario.email}</td>
                    <td style={{ padding: '12px 16px' }}>{usuario.role}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge variant={usuario.status === 'ativo' ? 'primary' : 'warning'}>
                        {usuario.status}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button variant="outline" size="sm">✏️ Editar</Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(usuario.id)}>🗑️ Deletar</Button>
                      </div>
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

export default AdminMasterUsuarios;