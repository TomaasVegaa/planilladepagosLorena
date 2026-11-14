import React, { useState } from 'react';
import { UserPlus, X, Check } from 'lucide-react';

export const AddOwner = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAdd(name.trim());
      setName('');
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => setIsOpen(true)}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <UserPlus size={18} />
          Agregar Propietario / Persona
        </button>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in" style={{ marginBottom: '1.5rem', border: '1px solid var(--primary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserPlus size={20} style={{ color: 'var(--primary)' }} />
          Nueva Persona / Propietario para la Planilla
        </h3>
        <button
          onClick={() => { setIsOpen(false); setName(''); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          title="Cerrar"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 280px' }}>
          <input
            type="text"
            className="input"
            placeholder="Nombre completo o Dpto (ej: PEREZ JUAN o Dpto 4B)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
            disabled={isSubmitting}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !name.trim()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Check size={16} />
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => { setIsOpen(false); setName(''); }}
            disabled={isSubmitting}
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
