import React, { useState } from 'react';
import { LayoutDashboard, Receipt, DollarSign, Wallet, FileDown } from 'lucide-react';
import { useConsorcioStore } from '../store/useConsorcioStore';
import { CONSORCIO_MONTHS } from '../utils/constants';
import { ConsorcioGrid } from '../components/consorcio/ConsorcioGrid';
import { ConsorcioExpenses } from '../components/consorcio/ConsorcioExpenses';
import { generateConsorcioReport } from '../utils/pdfGenerator';

function ConsorcioApp() {
  const { 
    owners, payments, finances, expenses, isLoaded, 
    updatePayment, updateFinances, addExpense, deleteExpense 
  } = useConsorcioStore();
  
  const [selectedMonth, setSelectedMonth] = useState(CONSORCIO_MONTHS[0].key);
  const [activeTab, setActiveTab] = useState('ingresos'); // 'ingresos' | 'egresos'

  if (!isLoaded) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando datos del consorcio...</div>;
  }

  const monthObj = CONSORCIO_MONTHS.find(m => m.key === selectedMonth);
  const monthIndex = CONSORCIO_MONTHS.findIndex(m => m.key === selectedMonth);
  const monthsUpToSelected = CONSORCIO_MONTHS.slice(0, monthIndex + 1).map(m => m.key);

  // --- Calculations for CURRENT MONTH ---
  const currentPayments = payments.filter(p => p.month_key === selectedMonth);
  const totalPagosMes = currentPayments.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
  
  const currentFinance = finances.find(f => f.month_key === selectedMonth) || {};
  const totalAportes = parseFloat(currentFinance.aportes_extra || 0);
  const totalRendimiento = parseFloat(currentFinance.rendimiento_nx || 0);
  const totalOtros = parseFloat(currentFinance.otros_ingresos || 0);
  
  const totalIngresosMes = totalPagosMes + totalAportes + totalRendimiento + totalOtros;

  const currentExpenses = expenses.filter(e => e.month_key === selectedMonth);
  const totalGastosMes = currentExpenses.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

  // --- Cumulative Calculations (Saldo Acumulado) ---
  let acumulado = 0;
  // Añadimos el saldo anterior inicial (asumiremos que está cargado en el primer mes)
  const primerMesFinance = finances.find(f => f.month_key === CONSORCIO_MONTHS[0].key);
  if (primerMesFinance && primerMesFinance.saldo_anterior) {
    acumulado += parseFloat(primerMesFinance.saldo_anterior);
  }

  monthsUpToSelected.forEach(mKey => {
    // Ingresos
    const mPayments = payments.filter(p => p.month_key === mKey);
    acumulado += mPayments.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
    
    const mFinance = finances.find(f => f.month_key === mKey);
    if (mFinance) {
      acumulado += parseFloat(mFinance.aportes_extra || 0);
      acumulado += parseFloat(mFinance.rendimiento_nx || 0);
      acumulado += parseFloat(mFinance.otros_ingresos || 0);
    }

    // Gastos
    const mExpenses = expenses.filter(e => e.month_key === mKey);
    acumulado -= mExpenses.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
  });

  const handleDownloadPDF = () => {
    const totals = {
      ingresos: totalIngresosMes,
      gastos: totalGastosMes,
      acumulado: acumulado
    };
    generateConsorcioReport(monthObj, owners, currentPayments, currentFinance, currentExpenses, totals);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header & Month Selector */}
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <LayoutDashboard size={32} style={{ color: 'var(--primary)' }} />
            Administración Consorcio
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Control de ingresos, expensas y gastos mensuales</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', backgroundColor: 'var(--surface)', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="input"
            style={{ width: 'auto', border: 'none', padding: '0.5rem', fontWeight: 600 }}
          >
            {CONSORCIO_MONTHS.map(m => (
              <option key={m.key} value={m.key}>{m.label}</option>
            ))}
          </select>
          <button 
            onClick={handleDownloadPDF}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
            title="Descargar Informe PDF"
          >
            <FileDown size={18} />
            PDF
          </button>
        </div>
      </header>

      {/* Dashboard Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--success)' }}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '12px' }}>
            <DollarSign size={24} style={{ color: 'var(--success)' }} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Ingresos del Mes</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>${totalIngresosMes.toLocaleString()}</h3>
          </div>
        </div>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--danger)' }}>
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '12px' }}>
            <Receipt size={24} style={{ color: 'var(--danger)' }} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Gastos del Mes</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>${totalGastosMes.toLocaleString()}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: `4px solid ${acumulado >= 0 ? 'var(--primary)' : 'var(--danger)'}` }}>
          <div style={{ backgroundColor: acumulado >= 0 ? 'rgba(79, 70, 229, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '12px' }}>
            <Wallet size={24} style={{ color: acumulado >= 0 ? 'var(--primary)' : 'var(--danger)' }} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Saldo Acumulado (a {monthObj.label})</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: acumulado < 0 ? 'var(--danger)' : 'inherit' }}>
              ${acumulado.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        <button 
          onClick={() => setActiveTab('ingresos')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'ingresos' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'ingresos' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Ingresos (Cobranzas)
        </button>
        <button 
          onClick={() => setActiveTab('egresos')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'egresos' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'egresos' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Egresos (Gastos)
        </button>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'ingresos' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Input for Saldo Inicial if we are in January */}
            {selectedMonth === CONSORCIO_MONTHS[0].key && (
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'rgba(234, 179, 8, 0.05)' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Saldo Anterior (Arrastre a Enero 2026)</label>
                  <div style={{ position: 'relative', maxWidth: '300px' }}>
                    <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                      <DollarSign size={16} />
                    </div>
                    <input 
                      type="number" 
                      className="input" 
                      style={{ paddingLeft: '30px' }}
                      value={currentFinance.saldo_anterior || ''}
                      onChange={e => updateFinances(selectedMonth, 'saldo_anterior', e.target.value)}
                      placeholder="Ej: -32367"
                    />
                  </div>
                </div>
              </div>
            )}
            
            <ConsorcioGrid 
              owners={owners} 
              payments={payments} 
              updatePayment={updatePayment} 
              monthKey={selectedMonth} 
            />
          </div>
        ) : (
          <ConsorcioExpenses 
            month={monthObj}
            expenses={expenses}
            finances={finances}
            addExpense={addExpense}
            deleteExpense={deleteExpense}
            updateFinances={updateFinances}
          />
        )}
      </div>

    </div>
  );
}

export default ConsorcioApp;
