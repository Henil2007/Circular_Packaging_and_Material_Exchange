import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import DashboardChoice from './components/DashboardChoice';
import SellPage from './components/Sellpage';
import BuyPage from './components/Buypage';

type View = 'dashboard' | 'buy' | 'sell';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth') === 'true';
  });
  const [currentView, setCurrentView] = useState<View>('dashboard');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as View;
      if (['dashboard', 'buy', 'sell'].includes(hash)) {
        setCurrentView(hash);
      } else if (isAuthenticated) {
        // If hash is empty or invalid, replace it cleanly without adding to history stack
        window.history.replaceState(null, '', '#dashboard');
        setCurrentView('dashboard');
      }
    };

    if (isAuthenticated) {
      if (!window.location.hash || window.location.hash === '#') {
        window.history.replaceState(null, '', '#dashboard');
        setCurrentView('dashboard');
      } else {
        handleHashChange();
      }
      window.addEventListener('hashchange', handleHashChange);
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated]);

  const login = () => {
    localStorage.setItem('auth', 'true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setIsAuthenticated(false);
    window.history.replaceState(null, '', ' '); // clear hash
  };

  const navigateTo = (view: View) => {
    window.location.hash = view;
  };

  if (!isAuthenticated) {
    return <Auth onSuccess={login} />;
  }

  return (
    <>
      <nav className="navbar">
        <button className="navbar-brand" onClick={() => navigateTo('dashboard')}>
          <div className="navbar-logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2v6h-6"></path>
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
              <path d="M3 22v-6h6"></path>
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
            </svg>
          </div>
          <span className="navbar-title">
            Circular Exchange
          </span>
        </button>

        <div className="navbar-actions">
          <div className="nav-badge">
            <div className="nav-badge-dot" />
            Live Market
          </div>
          <button
            onClick={logout}
            className="btn-ghost"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main>
        {currentView === 'dashboard' && <DashboardChoice onSelect={(choice) => navigateTo(choice)} />}
        {currentView === 'sell' && (
          <div style={{ position: 'relative' }}>
            <div className="page-container" style={{ paddingBottom: 0, paddingTop: '24px' }}>
              <button onClick={() => navigateTo('dashboard')} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
                ← Back to Dashboard
              </button>
            </div>
            <SellPage />
          </div>
        )}
        {currentView === 'buy' && (
          <div style={{ position: 'relative' }}>
            <div className="page-container" style={{ paddingBottom: 0, paddingTop: '24px' }}>
              <button onClick={() => navigateTo('dashboard')} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
                ← Back to Dashboard
              </button>
            </div>
            <BuyPage />
          </div>
        )}
      </main>
    </>
  );
}