import { useState } from 'react';
import { UserPlus } from 'lucide-react';

export const AddPlayer = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !lastName.trim()) return;
    
    onAdd(name.trim(), lastName.trim());
    setName('');
    setLastName('');
  };

  return (
    <div className="card animate-fade-in" style={{ marginBottom: '2rem' }}>
      <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <UserPlus size={20} style={{ color: 'var(--primary)' }} />
        Agregar Jugadora
      </h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px' }}>
          <input
            type="text"
            className="input"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <input
            type="text"
            className="input"
            placeholder="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ flex: '0 1 auto' }}>
          Guardar
        </button>
      </form>
    </div>
  );
};
