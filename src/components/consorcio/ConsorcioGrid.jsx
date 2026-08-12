import React, { useState } from 'react';
import { Save, Check, Search } from 'lucide-react';

export const ConsorcioGrid = ({ owners, payments, updatePayment, monthKey }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Local state for fast typing before saving to Supabase
  const [localEdits, setLocalEdits] = useState({});

  const handleAmountChange = (ownerId, value) => {
    setLocalEdits(prev => ({
      ...prev,
      [ownerId]: { ...prev[ownerId], amount: value }
    }));
  };

  const handleColorChange = (ownerId, color) => {
    setLocalEdits(prev => ({
      ...prev,
      [ownerId]: { ...prev[ownerId], color }
    }));
  };

  const saveEdit = (ownerId) => {
    const edit = localEdits[ownerId];
    if (edit) {
      updatePayment(ownerId, monthKey, edit.amount || 0, edit.color || 'none');
      
      // Remove from local edits to show saved state
      setLocalEdits(prev => {
        const next = { ...prev };
        delete next[ownerId];
        return next;
      });
    }
  };

  const filteredOwners = owners.filter(o => 
    o.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Buscar propietario..." 
            className="input" 
            style={{ paddingLeft: '35px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container" style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <table className="premium-table">
          <thead>
            <tr>
              <th style={{ width: '60px', textAlign: 'center' }}>Ord</th>
              <th style={{ minWidth: '200px' }}>Propietario</th>
              <th style={{ minWidth: '150px' }}>Monto Pagado ($)</th>
              <th style={{ minWidth: '150px' }}>Etiqueta (Color)</th>
              <th style={{ width: '80px', textAlign: 'center' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredOwners.map(owner => {
              const payment = payments.find(p => p.owner_id === owner.id && p.month_key === monthKey);
              const currentEdit = localEdits[owner.id];
              
              const currentAmount = currentEdit?.amount !== undefined ? currentEdit.amount : (payment?.amount || '');
              const currentColor = currentEdit?.color !== undefined ? currentEdit.color : (payment?.color || 'none');
              const hasUnsavedChanges = !!currentEdit;

              let rowBg = 'transparent';
              if (currentColor === 'yellow') rowBg = 'rgba(234, 179, 8, 0.15)';
              if (currentColor === 'green') rowBg = 'rgba(34, 197, 94, 0.15)';
              if (currentColor === 'grey') rowBg = 'rgba(107, 114, 128, 0.15)';

              return (
                <tr key={owner.id} style={{ backgroundColor: rowBg }}>
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{owner.order_num}</td>
                  <td style={{ fontWeight: 500 }}>{owner.name}</td>
                  <td>
                    <input 
                      type="number"
                      className="input"
                      style={{ padding: '0.4rem 0.5rem', width: '100px' }}
                      value={currentAmount}
                      onChange={(e) => handleAmountChange(owner.id, e.target.value)}
                      placeholder="0"
                    />
                  </td>
                  <td>
                    <select 
                      className="input"
                      style={{ padding: '0.4rem 0.5rem', width: '120px' }}
                      value={currentColor}
                      onChange={(e) => handleColorChange(owner.id, e.target.value)}
                    >
                      <option value="none">Sin color</option>
                      <option value="yellow">Amarillo</option>
                      <option value="green">Verde</option>
                      <option value="grey">Gris</option>
                    </select>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {hasUnsavedChanges ? (
                      <button 
                        onClick={() => saveEdit(owner.id)}
                        className="btn btn-primary"
                        style={{ padding: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}
                        title="Guardar cambios"
                      >
                        <Save size={16} />
                      </button>
                    ) : (
                      <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        {payment ? <Check size={18} /> : null}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
