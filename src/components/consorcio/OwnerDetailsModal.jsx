import React from 'react';
import { X, Calendar, DollarSign, Tag } from 'lucide-react';
import { CONSORCIO_MONTHS } from '../../utils/constants';

export const OwnerDetailsModal = ({ owner, payments, onClose }) => {
  if (!owner) return null;

  // Filter payments just for this owner
  const ownerPayments = payments.filter(p => p.owner_id === owner.id);

  // Calculate total amount paid
  const totalPaid = ownerPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  // Helper to get translated color name
  const getColorName = (color) => {
    if (color === 'yellow') return 'Amarillo';
    if (color === 'green') return 'Verde';
    if (color === 'grey') return 'Gris';
    return 'Sin color';
  };

  // Helper to get styling for the badge
  const getColorBadge = (color) => {
    let bg = 'rgba(107, 114, 128, 0.1)';
    let text = 'var(--text-muted)';
    if (color === 'yellow') {
      bg = 'rgba(234, 179, 8, 0.15)';
      text = '#ca8a04';
    }
    if (color === 'green') {
      bg = 'rgba(34, 197, 94, 0.15)';
      text = 'var(--success)';
    }
    if (color === 'grey') {
      bg = 'rgba(107, 114, 128, 0.2)';
      text = '#4b5563';
    }
    
    return (
      <span style={{ 
        backgroundColor: bg, 
        color: text, 
        padding: '0.25rem 0.5rem', 
        borderRadius: '999px', 
        fontSize: '0.75rem', 
        fontWeight: 600 
      }}>
        {getColorName(color)}
      </span>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '600px', width: '90%' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Historial de Pagos</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Propietario: <strong style={{ color: 'var(--text-main)' }}>{owner.name}</strong>
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Totalizer */}
        <div style={{ backgroundColor: 'var(--surface)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
            <DollarSign size={24} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total aportado en el año</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
              ${totalPaid.toLocaleString()}
            </p>
          </div>
        </div>

        {/* List of 12 Months */}
        <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
          <table className="premium-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}><Calendar size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }}/> Mes</th>
                <th style={{ padding: '0.75rem 0.5rem' }}><DollarSign size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }}/> Monto Pagado</th>
                <th style={{ padding: '0.75rem 0.5rem' }}><Tag size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }}/> Etiqueta</th>
              </tr>
            </thead>
            <tbody>
              {CONSORCIO_MONTHS.map(month => {
                const payment = ownerPayments.find(p => p.month_key === month.key);
                const amount = payment ? parseFloat(payment.amount || 0) : 0;
                const color = payment ? (payment.color || 'none') : 'none';
                
                return (
                  <tr key={month.key} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>{month.label}</td>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: amount > 0 ? 600 : 400, color: amount > 0 ? 'var(--text-main)' : 'var(--text-muted)' }}>
                      {amount > 0 ? `$${amount.toLocaleString()}` : '-'}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      {getColorBadge(color)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
