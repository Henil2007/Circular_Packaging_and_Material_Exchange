import React, { useState } from 'react';
import Auth from './components/Auth';
import DashboardChoice from './components/DashboardChoice';
import SellPage from './components/Sellpage';
import BuyPage from './components/Buypage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'buy' | 'sell'>('dashboard');

  if (!isAuthenticated) {
    return <Auth onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div style={{ position: 'relative', minHeight: '100svh' }}>
      {/* Animated background */}
      <div className="bg-grid" />
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* Navbar */}
      <nav className="navbar">
        <button className="navbar-brand" onClick={() => setCurrentView('dashboard')}>
          <div className="navbar-logo-icon">♻️</div>
          <span className="navbar-title">
            Circular <span className="highlight">Exchange</span>
          </span>
        </button>

        <div className="navbar-actions">
          <div className="nav-badge">
            <div className="nav-badge-dot" />
            Live Market
          </div>
          <button
            id="signout-btn"
            onClick={() => { setIsAuthenticated(false); setCurrentView('dashboard'); }}
            className="btn-signout"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="z-rel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {currentView === 'dashboard' && <DashboardChoice onSelect={(choice) => setCurrentView(choice)} />}
        {currentView === 'sell' && <SellPage />}
        {currentView === 'buy' && <BuyPage />}
      </main>
    </div>
  );
}