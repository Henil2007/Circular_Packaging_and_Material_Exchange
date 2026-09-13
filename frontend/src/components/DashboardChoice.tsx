import React, { useEffect, useRef } from 'react';

interface ChoiceProps {
  onSelect: (choice: 'buy' | 'sell') => void;
}

export default function DashboardChoice({ onSelect }: ChoiceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  /* Stagger card animations on mount */
  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.action-card');
    cards?.forEach((card, i) => {
      (card as HTMLElement).style.animationDelay = `${i * 0.08}s`;
    });
  }, []);

  return (
    <div className="page-container" ref={containerRef}>
      {/* ── Header ── */}
      <div className="dashboard-header">
        <span className="dashboard-eyebrow">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="4" fill="currentColor" opacity="0.7" />
            <circle cx="5" cy="5" r="2" fill="currentColor" className="pulse-dot-inner" />
          </svg>
          Platform Live
        </span>

        <h1 className="dashboard-title">
          The Future of{' '}
          <span className="dashboard-title-accent">Circular Commerce</span>
        </h1>
        <p className="dashboard-subtitle">
          Trade surplus packaging materials across a verified B2B network.
          Reduce waste, cut costs, and build a greener supply chain.
        </p>
      </div>

      {/* ── Action Cards ── */}
      <div className="dashboard-grid">
        {/* Buy Card */}
        <button
          onClick={() => onSelect('buy')}
          className="action-card"
          id="buy-action-card"
        >
          <div className="action-card-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h2 className="action-card-title">Procure Materials</h2>
          <p className="action-card-desc">
            Source high-quality recycled packaging materials — cardboard, plastics, pallets — from a global network of verified enterprises.
          </p>
          <div className="action-card-cta">
            Browse Marketplace
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>

          {/* decorative pill */}
          <div style={{ position: 'absolute', top: 24, right: 24, background: 'rgba(0,200,83,0.12)', border: '1px solid rgba(0,200,83,0.2)', borderRadius: '20px', padding: '4px 10px', fontSize: '11px', fontWeight: 700, color: 'var(--brand-secondary)', letterSpacing: '0.5px' }}>
            BUY
          </div>
        </button>

        {/* Sell Card */}
        <button
          onClick={() => onSelect('sell')}
          className="action-card action-card-sell"
          id="sell-action-card"
        >
          <div className="action-card-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <h2 className="action-card-title">List Surplus Inventory</h2>
          <p className="action-card-desc">
            Turn your excess packaging into revenue. AI-powered listing tools analyze your materials and match you with the closest buyers instantly.
          </p>
          <div className="action-card-cta">
            Create Listing
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>

          {/* decorative pill */}
          <div style={{ position: 'absolute', top: 24, right: 24, background: 'rgba(68,138,255,0.12)', border: '1px solid rgba(68,138,255,0.25)', borderRadius: '20px', padding: '4px 10px', fontSize: '11px', fontWeight: 700, color: '#69cdff', letterSpacing: '0.5px' }}>
            SELL
          </div>
        </button>
      </div>

      {/* ── Metrics Bar ── */}
      <div className="metrics-bar">
        <MetricItem value="2,450+" label="Active Listings" icon="📦" />
        <div className="metric-divider" />
        <MetricItem value="850 t" label="CO₂ Offset" icon="🌿" />
        <div className="metric-divider" />
        <MetricItem value="342" label="Verified Enterprises" icon="🏢" />
        <div className="metric-divider" />
        <MetricItem value="99.2%" label="Platform Uptime" icon="⚡" />
      </div>
    </div>
  );
}

function MetricItem({ value, label, icon }: { value: string; label: string; icon: string }) {
  return (
    <div className="metric">
      <div style={{ fontSize: '24px', marginBottom: '6px' }}>{icon}</div>
      <div className="metric-val">{value}</div>
      <div className="metric-label">{label}</div>
    </div>
  );
}