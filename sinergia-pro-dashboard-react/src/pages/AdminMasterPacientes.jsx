import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

function AdminMasterPacientes() {
  const navigate = useNavigate();
  const [pacientes, setPatients] = useState([
    { id: 1, name: 'Ana Silva', therapist: 'Dr. João Silva', status: 'ativo', startDate: '2025-01-15' },
    { id: 2, name: 'Pedro Costa', therapist: 'Dra. Maria Costa', status: 'ativo', startDate: '2025-02-20' },
    { id: 3, name: 'Julia Santos', therapist: 'Dr. Carlos Santos', status: 'concluído', startDate: '2024-11-10' },
  ]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '32px 16px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <Button variant="outline" onClick={() => navigate('/admin/master')}>
          ← Voltar
        </Button>

        <h1 style={{ marginTop: '20px', marginBottom: '30px' }}>👤 Gerenciar Pacientes</h1>

        <Card title={`Total de Pacientes (${pacientes.length})`}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ borderBottom: '2px solid #e5e7eb' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Nome</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Terapeuta</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Data de Início</th>
                  <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 'bold' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map((paciente) => (
                  <tr key={paciente.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px' }}>{paciente.name}</td>
                    <td style={{ padding: '12px 16px' }}>{paciente.therapist}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge variant={paciente.status === 'ativo' ? 'primary' : 'warning'}>
                        {paciente.status}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px 16px' }}>{paciente.startDate}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button variant="outline" size="sm">👁️ Visualizar</Button>
                        <Button variant="danger" size="sm">🗑️ Remover</Button>
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

export default AdminMasterPacientes;