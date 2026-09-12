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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-xl text-emerald-700 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
          Circular Exchange
        </h1>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          Sign Out
        </button>
      </nav>

      <main>
        {currentView === 'dashboard' && <DashboardChoice onSelect={(choice) => setCurrentView(choice)} />}
        {currentView === 'sell' && <SellPage />}
        {currentView === 'buy' && <BuyPage />}
      </main>
    </div>
  );
}