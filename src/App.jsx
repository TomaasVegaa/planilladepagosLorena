import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import BasquetApp from './pages/BasquetApp';
import ConsorcioApp from './pages/ConsorcioApp';
import { LayoutDashboard, Users } from 'lucide-react';

function Navigation() {
  const location = useLocation();
  const isBasquet = location.pathname === '/basquet';
  const isConsorcio = location.pathname === '/consorcio';

  return (
    <nav style={{ 
      backgroundColor: 'var(--surface)', 
      borderBottom: '1px solid var(--border)',
      padding: '1rem 2rem',
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <Link 
        to="/consorcio" 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          textDecoration: 'none',
          color: isConsorcio ? 'white' : 'var(--text-main)',
          backgroundColor: isConsorcio ? 'var(--primary)' : 'transparent',
          fontWeight: 600,
          transition: 'all 0.2s'
        }}
      >
        <LayoutDashboard size={18} />
        Consorcio
      </Link>
      <Link 
        to="/basquet" 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          textDecoration: 'none',
          color: isBasquet ? 'white' : 'var(--text-main)',
          backgroundColor: isBasquet ? 'var(--primary)' : 'transparent',
          fontWeight: 600,
          transition: 'all 0.2s'
        }}
      >
        <Users size={18} />
        Básquet
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
        <Navigation />
        <Routes>
          <Route path="/" element={<ConsorcioApp />} />
          <Route path="/consorcio" element={<ConsorcioApp />} />
          <Route path="/basquet" element={<BasquetApp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
