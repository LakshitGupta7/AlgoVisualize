import { useState } from 'react';
import { ThemeProvider } from './hooks/useTheme';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { SortingPage } from './pages/SortingPage';
import { SearchingPage } from './pages/SearchingPage';
import { DataStructuresPage } from './pages/DataStructuresPage';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'sorting':
        return <SortingPage />;
      case 'searching':
        return <SearchingPage />;
      case 'datastructures':
        return <DataStructuresPage />;
      case 'graph':
        return <ComingSoon title="Graph Algorithms" icon="🔗" />;
      case 'tree':
        return <ComingSoon title="Tree Algorithms" icon="🌳" />;
      case 'dp':
        return <ComingSoon title="Dynamic Programming" icon="🧮" />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="app">
        <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="app-main">
          {renderPage()}
        </main>
      </div>
    </ThemeProvider>
  );
}

// Temporary coming soon component
function ComingSoon({ title, icon }: { title: string; icon: string }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 70px)',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <span style={{ fontSize: '5rem', marginBottom: '1rem' }}>{icon}</span>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{title}</h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem' }}>
        Coming soon! This visualization is under development.
      </p>
      <div style={{
        marginTop: '2rem',
        padding: '1rem 2rem',
        background: 'rgba(0, 240, 255, 0.1)',
        borderRadius: '12px',
        border: '1px solid rgba(0, 240, 255, 0.2)',
      }}>
        <p style={{ color: 'var(--color-primary)' }}>
          🚧 Check out the Sorting Algorithms page for a complete demo!
        </p>
      </div>
    </div>
  );
}

export default App;
