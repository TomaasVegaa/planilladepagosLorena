import React, { useState } from 'react';
import { Save, Check, Search, Eye, Edit2, Trash2, X } from 'lucide-react';
import { OwnerDetailsModal } from './OwnerDetailsModal';

export const ConsorcioGrid = ({ 
  owners, 
  payments, 
  updatePayment, 
  monthKey,
  onEditOwner,
  onDeleteOwner 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOwnerForDetails, setSelectedOwnerForDetails] = useState(null);
  
  // State for editing owner name
  const [editingOwnerId, setEditingOwnerId] = useState(null);
  const [editingOwnerName, setEditingOwnerName] = useState('');

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

  const startEditOwner = (owner) => {
    setEditingOwnerId(owner.id);
    setEditingOwnerName(owner.name);
  };

  const cancelEditOwner = () => {
    setEditingOwnerId(null);
    setEditingOwnerName('');
  };

  const handleSaveOwnerName = async (id) => {
    if (!editingOwnerName.trim() || !onEditOwner) return;
    await onEditOwner(id, editingOwnerName.trim());
    setEditingOwnerId(null);
    setEditingOwnerName('');
  };

  const handleDeleteOwner = async (owner) => {
    if (!onDeleteOwner) return;
    const confirmed = window.confirm(
      `¿Estás seguro de que deseas eliminar a "${owner.name}"?\nEsta acción eliminará a la persona de la planilla y todos sus pagos registrados.`
    );
    if (confirmed) {
      await onDeleteOwner(owner.id);
    }
  };

  const sortedAndFilteredOwners = [...owners]
    .sort((a, b) => (a.name || '').localeCompare(b.name || '', 'es', { sensitivity: 'base' }))
    .filter(o => (o.name || '').toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      
      {selectedOwnerForDetails && (
        <OwnerDetailsModal 
          owner={selectedOwnerForDetails} 
          payments={payments} 
          onClose={() => setSelectedOwnerForDetails(null)} 
        />
      )}
      
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
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
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Total registrados: <strong style={{ color: 'var(--text-main)' }}>{owners.length}</strong>
        </div>
      </div>

      <div className="table-container" style={{ maxHeight: '600px', overflowY: 'auto' }}>
        <table className="premium-table">
          <thead>
            <tr>
              <th style={{ width: '60px', textAlign: 'center' }}>Ord</th>
              <th style={{ minWidth: '240px' }}>Propietario / Persona</th>
              <th style={{ minWidth: '150px' }}>Monto Pagado ($)</th>
              <th style={{ minWidth: '150px' }}>Etiqueta (Color)</th>
              <th style={{ width: '80px', textAlign: 'center' }}>Guardar</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredOwners.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No se encontraron propietarios con esa búsqueda.
                </td>
              </tr>
            ) : (
              sortedAndFilteredOwners.map((owner, index) => {
                const payment = payments.find(p => p.owner_id === owner.id && p.month_key === monthKey);
                const currentEdit = localEdits[owner.id];
                
                const currentAmount = currentEdit?.amount !== undefined ? currentEdit.amount : (payment?.amount || '');
                const currentColor = currentEdit?.color !== undefined ? currentEdit.color : (payment?.color || 'none');
                const hasUnsavedChanges = !!currentEdit;
                const isEditingThisOwner = editingOwnerId === owner.id;

                let rowBg = 'transparent';
                if (currentColor === 'yellow') rowBg = 'rgba(234, 179, 8, 0.15)';
                if (currentColor === 'green') rowBg = 'rgba(34, 197, 94, 0.15)';
                if (currentColor === 'grey') rowBg = 'rgba(107, 114, 128, 0.15)';

                return (
                  <tr key={owner.id} style={{ backgroundColor: rowBg }}>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{index + 1}</td>
                    <td style={{ fontWeight: 500 }}>
                      {isEditingThisOwner ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input 
                            type="text" 
                            className="input" 
                            value={editingOwnerName}
                            onChange={(e) => setEditingOwnerName(e.target.value)}
                            style={{ padding: '0.35rem 0.5rem', fontSize: '0.9rem', flex: '1 1 auto' }}
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveOwnerName(owner.id);
                              if (e.key === 'Escape') cancelEditOwner();
                            }}
                          />
                          <button 
                            onClick={() => handleSaveOwnerName(owner.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--success)', padding: '0.25rem' }}
                            title="Guardar nombre"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={cancelEditOwner}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '0.25rem' }}
                            title="Cancelar"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                          <span>{owner.name}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <button 
                              onClick={() => setSelectedOwnerForDetails(owner)}
                              style={{ 
                                background: 'none', 
                                border: 'none', 
                                cursor: 'pointer', 
                                color: 'var(--primary)', 
                                padding: '0.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px'
                              }}
                              title="Ver historial de pagos"
                              className="hover-bg-primary-light"
                            >
                              <Eye size={17} />
                            </button>
                            <button 
                              onClick={() => startEditOwner(owner)}
                              style={{ 
                                background: 'none', 
                                border: 'none', 
                                cursor: 'pointer', 
                                color: 'var(--text-muted)', 
                                padding: '0.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px'
                              }}
                              title="Editar nombre"
                              className="hover-bg-primary-light"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteOwner(owner)}
                              style={{ 
                                background: 'none', 
                                border: 'none', 
                                cursor: 'pointer', 
                                color: 'var(--danger)', 
                                padding: '0.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px',
                                opacity: 0.8
                              }}
                              title="Eliminar persona de la planilla"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                    <td>
                      <input 
                        type="number"
                        className="input"
                        style={{ padding: '0.4rem 0.5rem', width: '120px' }}
                        value={currentAmount}
                        onChange={(e) => handleAmountChange(owner.id, e.target.value)}
                        placeholder="0"
                      />
                    </td>
                    <td>
                      <select 
                        className="input"
                        style={{ padding: '0.4rem 0.5rem', width: '130px' }}
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
                          title="Guardar cambios de pago"
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
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
