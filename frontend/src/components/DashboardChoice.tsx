import React from 'react';

interface ChoiceProps {
  onSelect: (choice: 'buy' | 'sell') => void;
}

export default function DashboardChoice({ onSelect }: ChoiceProps) {
  return (
    <div className="page-container">
      <div className="dashboard-header">
        <span className="dashboard-eyebrow">Platform Dashboard</span>
        <h1 className="dashboard-title">What would you like to do?</h1>
        <p className="dashboard-subtitle">
          Select an action to continue. You can switch between buying and selling at any time from the navigation menu.
        </p>
      </div>

      <div className="dashboard-grid">
        <button
          onClick={() => onSelect('buy')}
          className="action-card"
        >
          <div className="action-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h2 className="action-card-title">Procure Materials</h2>
          <p className="action-card-desc">
            Source high-quality recycled packaging materials including cardboard, plastics, and pallets from verified sellers.
          </p>
          <div className="action-card-cta">
            Browse Marketplace →
          </div>
        </button>

        <button
          onClick={() => onSelect('sell')}
          className="action-card"
        >
          <div className="action-card-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <h2 className="action-card-title">List Surplus Inventory</h2>
          <p className="action-card-desc">
            Create listings for your excess packaging materials. Turn waste into revenue while contributing to the circular economy.
          </p>
          <div className="action-card-cta">
            Create Listing →
          </div>
        </button>
      </div>

      <div className="metrics-bar">
        <div className="metric">
          <div className="metric-val">2,450</div>
          <div className="metric-label">Active Listings</div>
        </div>
        <div className="metric-divider" />
        <div className="metric">
          <div className="metric-val">850t</div>
          <div className="metric-label">CO₂ Offset</div>
        </div>
        <div className="metric-divider" />
        <div className="metric">
          <div className="metric-val">342</div>
          <div className="metric-label">Verified Enterprises</div>
        </div>
      </div>
    </div>
  );
}