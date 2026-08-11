import { useState } from 'react';
import { Check, Edit2, UserMinus, UserCheck, Save, X, Share2 } from 'lucide-react';
import { MONTHS } from '../utils/constants';

export const PaymentGrid = ({ players, payments, togglePayment, editPlayer, toggleBaja }) => {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editLastName, setEditLastName] = useState('');

  const startEdit = (player) => {
    setEditingId(player.id);
    setEditName(player.name);
    setEditLastName(player.lastName || '');
  };

  const saveEdit = (id) => {
    editPlayer(id, editName, editLastName);
    setEditingId(null);
  };

  const shareMonth = (month) => {
    const activePlayers = players.filter(p => p.status !== 'baja');
    const paid = [];
    const unpaid = [];

    activePlayers.forEach(p => {
      const hasPaid = payments.some(payment => payment.playerId === p.id && payment.monthKey === month.key);
      const name = p.lastName ? `${p.lastName}, ${p.name}` : p.name;
      if (hasPaid) {
        paid.push(`- ${name}`);
      } else {
        unpaid.push(`- ${name}`);
      }
    });

    const text = `*Resumen de Pagos - ${month.label}*\n\n✅ *Pagaron (${paid.length}):*\n${paid.length > 0 ? paid.join('\n') : 'Nadie aún'}\n\n❌ *Faltan pagar (${unpaid.length}):*\n${unpaid.length > 0 ? unpaid.join('\n') : 'Ninguna'}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
      alert(`¡Resumen de ${month.label} copiado!\nYa puedes pegarlo (Ctrl+V o Pegar) en tu grupo de WhatsApp.`);
    }).catch(err => {
      // Fallback if clipboard fails
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    });
  };

  if (players.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>No hay jugadoras registradas. Agrega una para comenzar.</p>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th style={{ minWidth: '250px', position: 'sticky', left: 0, backgroundColor: 'var(--surface)', zIndex: 10 }}>
                Jugadora
              </th>
              {MONTHS.map((month) => (
                <th key={month.key} style={{ textAlign: 'center', minWidth: '100px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      {month.label}
                      <button 
                        onClick={() => shareMonth(month)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: '2px' }}
                        title={`Copiar resumen de ${month.label} para WhatsApp`}
                      >
                        <Share2 size={14} />
                      </button>
                    </div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>Día 15</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map((player) => {
              const isBaja = player.status === 'baja';
              const isEditing = editingId === player.id;
              
              // Total collected for this player
              const playerCollected = payments.filter(p => p.playerId === player.id).length * 25000;

              return (
                <tr key={player.id} style={{ opacity: isBaja ? 0.6 : 1, backgroundColor: isBaja ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
                  <td style={{ position: 'sticky', left: 0, backgroundColor: isBaja ? 'var(--surface)' : 'var(--surface)', zIndex: 9 }}>
                    
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input 
                          type="text" 
                          value={editName} 
                          onChange={(e) => setEditName(e.target.value)} 
                          className="input" 
                          style={{ padding: '4px', fontSize: '0.8rem' }}
                          placeholder="Nombre"
                        />
                        <input 
                          type="text" 
                          value={editLastName} 
                          onChange={(e) => setEditLastName(e.target.value)} 
                          className="input" 
                          style={{ padding: '4px', fontSize: '0.8rem' }}
                          placeholder="Apellido"
                        />
                        <button onClick={() => saveEdit(player.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--success)' }}>
                          <Save size={16} />
                        </button>
                        <button onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}>
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 500, textDecoration: isBaja ? 'line-through' : 'none' }}>
                            {player.lastName ? `${player.lastName}, ` : ''}{player.name}
                          </span>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button onClick={() => startEdit(player)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} title="Editar">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => toggleBaja(player.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isBaja ? 'var(--success)' : 'var(--danger)' }} title={isBaja ? 'Dar de Alta' : 'Dar de Baja (Devolver plata)'}>
                              {isBaja ? <UserCheck size={14} /> : <UserMinus size={14} />}
                            </button>
                          </div>
                        </div>
                        
                        {isBaja ? (
                          <span className="badge badge-danger" style={{ fontSize: '0.65rem', alignSelf: 'flex-start' }}>
                            Baja - Se devuelven ${playerCollected.toLocaleString()}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            Ahorro: ${playerCollected.toLocaleString()} / $300.000
                          </span>
                        )}
                      </div>
                    )}

                  </td>
                  {MONTHS.map((month) => {
                    const hasPaid = payments.some(
                      (p) => p.playerId === player.id && p.monthKey === month.key
                    );
                    return (
                      <td key={month.key} style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => togglePayment(player.id, month.key)}
                          disabled={isBaja}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            border: `1px solid ${hasPaid ? 'var(--success)' : 'var(--border)'}`,
                            backgroundColor: hasPaid ? (isBaja ? 'transparent' : 'rgba(16, 185, 129, 0.1)') : 'transparent',
                            color: hasPaid ? (isBaja ? 'var(--text-muted)' : 'var(--success)') : 'var(--border)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: isBaja ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease',
                            opacity: isBaja ? 0.5 : 1
                          }}
                          title={hasPaid ? 'Pagado' : 'Marcar como pagado'}
                        >
                          {hasPaid ? <Check size={18} /> : <span style={{ opacity: 0.5 }}>-</span>}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
