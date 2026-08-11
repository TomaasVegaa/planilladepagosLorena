import { useState } from 'react';
import { FileDown, CalendarDays, Calculator, Search } from 'lucide-react';
import { useStore } from './store/useStore';
import { AddPlayer } from './components/AddPlayer';
import { PaymentGrid } from './components/PaymentGrid';
import { generateSingleMonthReport } from './utils/pdfGenerator';
import { MONTHS } from './utils/constants';

function App() {
  const { players, payments, addPlayer, togglePayment, editPlayer, toggleBaja } = useStore();
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0].key);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDownloadReport = () => {
    const monthObj = MONTHS.find(m => m.key === selectedMonth);
    generateSingleMonthReport(monthObj, players, payments);
  };

  const filteredPlayers = players.filter(p => {
    const fullName = `${p.name} ${p.lastName || ''}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  // Calculate some stats
  const activePlayers = players.filter(p => p.status !== 'baja');
  const totalExpected = activePlayers.length * 300000; // $300,000 por jugadora activa
  
  // Only count payments from active players for the trip total
  const activePayments = payments.filter(payment => {
    const player = players.find(p => p.id === payment.playerId);
    return player && player.status !== 'baja';
  });
  
  const totalCollected = activePayments.length * 25000;
  const percentageCollected = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CalendarDays size={32} style={{ color: 'var(--primary)' }} />
            Recaudación Viaje Básquet
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Gestión mensual de pagos - Agosto 2026 a Julio 2027 ($25.000 los 15 de cada mes)</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', backgroundColor: 'var(--surface)', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="input"
            style={{ width: 'auto', border: 'none', padding: '0.5rem' }}
          >
            {MONTHS.map(m => (
              <option key={m.key} value={m.key}>{m.label}</option>
            ))}
          </select>
          <button 
            onClick={handleDownloadReport}
            className="btn btn-primary"
            style={{ padding: '0.75rem 1rem', fontSize: '1rem' }}
            title="Generar PDF mensual"
          >
            <FileDown size={20} />
            PDF del Mes
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', padding: '1rem', borderRadius: '12px' }}>
            <Calculator size={24} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Total Recaudado (Activas)</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>${totalCollected.toLocaleString()}</h3>
          </div>
        </div>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ color: 'var(--success)', fontWeight: 700, fontSize: '1.25rem' }}>%</div>
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Progreso Total</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{percentageCollected}% <span style={{fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal'}}>de ${totalExpected.toLocaleString()}</span></h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(107, 114, 128, 0.1)', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '1.25rem' }}>{activePlayers.length}</div>
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>Jugadoras Activas</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{activePlayers.length} <span style={{fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal'}}>de {players.length}</span></h3>
          </div>
        </div>
      </div>

      <AddPlayer onAdd={addPlayer} />

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Control de Pagos</h2>
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Buscar jugadora..." 
              className="input" 
              style={{ paddingLeft: '35px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <PaymentGrid 
          players={filteredPlayers} 
          payments={payments} 
          togglePayment={togglePayment} 
          editPlayer={editPlayer}
          toggleBaja={toggleBaja}
        />
      </div>

    </div>
  );
}

export default App;
