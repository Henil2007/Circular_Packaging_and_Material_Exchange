import { useEffect, useState } from 'react';
import { apiClient } from './api/client';
import Auth from './components/Auth';
import BuyPage from './components/BuyPage';
import CartPage from './components/CartPage';
import DashboardChoice from './components/DashboardChoice';
import EsgReport from './components/EsgReport'; // <-- Added import
import SellPage from './components/Sellpage';

// <-- Added 'esg' to the View type
type View = 'dashboard' | 'buy' | 'sell' | 'cart' | 'esg'; 

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth') === 'true';
  });
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isBackendLive, setIsBackendLive] = useState<boolean>(false);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as View;
      // <-- Added 'esg' to the allowed routes array
      if (['dashboard', 'buy', 'sell', 'cart', 'esg'].includes(hash)) { 
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

  useEffect(() => {
    const checkBackend = async () => {
      try {
        await apiClient.get('/health');
        setIsBackendLive(true);
      } catch (error) {
        setIsBackendLive(false);
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 15000); // Check every 15s
    return () => clearInterval(interval);
  }, []);

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
            LoopX
          </span>
        </button>

        <div className="navbar-actions">
          {/* <-- Added ESG Report Navigation Button --> */}
          <button 
            onClick={() => navigateTo('esg')}
            className="btn-ghost"
            style={{ fontWeight: 600 }}
          >
            ESG Report
          </button>

          <button 
            onClick={() => navigateTo('cart')}
            className="btn-ghost"
            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%' }}
            title="Cart"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cart.length > 0 && (
              <span style={{ position: 'absolute', top: 0, right: 0, background: '#ef4444', color: 'white', fontSize: '12px', fontWeight: 700, width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cart.length}
              </span>
            )}
          </button>
          
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
            <BuyPage onAddToCart={(item) => setCart([...cart, item])} />
          </div>
        )}
        {currentView === 'cart' && (
          <div style={{ position: 'relative' }}>
            <div className="page-container" style={{ paddingBottom: 0, paddingTop: '24px' }}>
              <button onClick={() => navigateTo('dashboard')} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
                ← Back to Dashboard
              </button>
            </div>
            <CartPage cart={cart} setCart={setCart} onNavigate={navigateTo} />
          </div>
        )}
        
        {/* <-- Added ESG Report Render Block --> */}
        {currentView === 'esg' && (
          <div style={{ position: 'relative' }}>
            <div className="page-container" style={{ paddingBottom: 0, paddingTop: '24px' }}>
              <button onClick={() => navigateTo('dashboard')} className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
                ← Back to Dashboard
              </button>
            </div>
            <EsgReport />
          </div>
        )}
      </main>
    </>
  );
}