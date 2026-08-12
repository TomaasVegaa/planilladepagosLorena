import React, { useState } from 'react';
import { Trash2, Plus, DollarSign } from 'lucide-react';

export const ConsorcioExpenses = ({ month, expenses, finances, addExpense, deleteExpense, updateFinances }) => {
  const [newDetail, setNewDetail] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const currentExpenses = expenses.filter(e => e.month_key === month.key);
  const currentFinance = finances.find(f => f.month_key === month.key) || { 
    aportes_extra: 0, 
    rendimiento_nx: 0, 
    otros_ingresos: 0 
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (newDetail.trim() && newAmount) {
      addExpense(month.key, newDetail, newAmount);
      setNewDetail('');
      setNewAmount('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Gastos del Mes */}
      <div className="card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
          Gastos del Mes ({month.label})
        </h3>
        
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Detalle (Ej: Corte Plaza)" 
            className="input" 
            style={{ flex: 2, minWidth: '200px' }}
            value={newDetail}
            onChange={e => setNewDetail(e.target.value)}
          />
          <input 
            type="number" 
            placeholder="Monto ($)" 
            className="input" 
            style={{ flex: 1, minWidth: '150px' }}
            value={newAmount}
            onChange={e => setNewAmount(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Plus size={18} /> Agregar
          </button>
        </form>

        <div className="table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Fecha Carga</th>
                <th>Detalle</th>
                <th style={{ textAlign: 'right' }}>Monto</th>
                <th style={{ width: '50px', textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {currentExpenses.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No hay gastos cargados este mes
                  </td>
                </tr>
              ) : (
                currentExpenses.map(exp => (
                  <tr key={exp.id}>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(exp.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ fontWeight: 500 }}>{exp.detail}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--danger)' }}>
                      - ${parseFloat(exp.amount).toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        onClick={() => deleteExpense(exp.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                        title="Eliminar gasto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {currentExpenses.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan="2" style={{ textAlign: 'right', fontWeight: 700 }}>Total Gastos:</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--danger)', fontSize: '1.1rem' }}>
                    - ${currentExpenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0).toLocaleString()}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Ingresos Globales */}
      <div className="card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
          Ingresos Globales ({month.label})
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Aportes Extra</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <DollarSign size={16} />
              </div>
              <input 
                type="number" 
                className="input" 
                style={{ paddingLeft: '30px' }}
                value={currentFinance.aportes_extra || ''}
                onChange={e => updateFinances(month.key, 'aportes_extra', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Rendimiento Naranja X</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <DollarSign size={16} />
              </div>
              <input 
                type="number" 
                className="input" 
                style={{ paddingLeft: '30px' }}
                value={currentFinance.rendimiento_nx || ''}
                onChange={e => updateFinances(month.key, 'rendimiento_nx', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Otros Ingresos (Ej: Barrios/Niño)</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <DollarSign size={16} />
              </div>
              <input 
                type="number" 
                className="input" 
                style={{ paddingLeft: '30px' }}
                value={currentFinance.otros_ingresos || ''}
                onChange={e => updateFinances(month.key, 'otros_ingresos', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
