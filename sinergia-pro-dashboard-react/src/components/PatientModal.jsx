import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Modal } from './Modal';

export const PatientModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    diagnosis: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', email: '', phone: '', age: '', diagnosis: '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Paciente">
      <form onSubmit={handleSubmit}>
        <Input
          label="Nome Completo"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Telefone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <Input
          label="Idade"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
        />

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>
            Diagnóstico
          </label>
          <textarea
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontFamily: 'inherit',
              fontSize: '14px',
              minHeight: '100px',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button type="submit" variant="primary" style={{ flex: 1 }}>
            Adicionar
          </Button>
          <Button type="button" variant="outline" onClick={onClose} style={{ flex: 1 }}>
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  );
};
