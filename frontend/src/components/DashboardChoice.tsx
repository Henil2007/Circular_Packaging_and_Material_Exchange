import React from 'react';

interface ChoiceProps {
  onSelect: (choice: 'buy' | 'sell') => void;
}

export default function DashboardChoice({ onSelect }: ChoiceProps) {
  return (
    <div className="dashboard-page">
      {/* Hero text */}
      <div className="dashboard-hero">
        <div className="dashboard-eyebrow">
          🌿 Circular Economy Platform
        </div>
        <h1 className="dashboard-heading">
          Trade <span className="highlight">Recycled</span><br />
          Packaging Materials
        </h1>
        <p className="dashboard-description">
          Join the circular carbon ecosystem. Source or list surplus packaging to reduce waste and cut embodied carbon from your supply chain.
        </p>
      </div>

      {/* Action cards */}
      <div className="dashboard-cards">
        {/* Buy Card */}
        <button
          id="choose-buy-btn"
          onClick={() => onSelect('buy')}
          className="choice-card choice-card-buy"
        >
          <div className="choice-card-icon icon-buy">🛒</div>
          <h2 className="choice-card-title">I want to Buy</h2>
          <p className="choice-card-desc">
            Source recycled cardboard, plastics, and pallets. Reduce procurement costs while lowering your environmental footprint.
          </p>
          <div className="choice-card-cta cta-buy">
            Browse listings →
          </div>
          <div className="choice-card-corner corner-buy" />
        </button>

        {/* Sell Card */}
        <button
          id="choose-sell-btn"
          onClick={() => onSelect('sell')}
          className="choice-card choice-card-sell"
        >
          <div className="choice-card-icon icon-sell">📦</div>
          <h2 className="choice-card-title">I want to Sell</h2>
          <p className="choice-card-desc">
            List surplus packaging and divert industrial waste from landfills. Turn your excess materials into value for another business.
          </p>
          <div className="choice-card-cta cta-sell">
            Create a listing →
          </div>
          <div className="choice-card-corner corner-sell" />
        </button>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="stat-item">
          <div className="stat-value">2.4K+</div>
          <div className="stat-label">Active Listings</div>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <div className="stat-value">850t</div>
          <div className="stat-label">CO₂ Saved</div>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <div className="stat-value">340+</div>
          <div className="stat-label">Businesses</div>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <div className="stat-value">98%</div>
          <div className="stat-label">Satisfaction</div>
        </div>
      </div>
    </div>
  );
}