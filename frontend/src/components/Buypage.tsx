import React, { useState } from 'react';

const mockDatabase = [
  {
    id: 1,
    name: 'Standard Wooden Pallets',
    category: 'Pallets',
    weight: 800,
    quantity: 50,
    location: 'Warehouse A, Mumbai',
    price: 'Free Pickup',
    co2: '1.2t CO₂ saved',
  },
  {
    id: 2,
    name: 'Clean Cardboard Bales',
    category: 'Cardboard',
    weight: 1200,
    quantity: 20,
    location: 'Retail Center B, Pune',
    price: '₹0.05/kg',
    co2: '2.4t CO₂ saved',
  },
  {
    id: 3,
    name: 'LDPE Shrink Wrap Rolls',
    category: 'Plastics',
    weight: 300,
    quantity: 1,
    location: 'Distribution Hub C, Delhi',
    price: 'Negotiable',
    co2: '0.8t CO₂ saved',
  },
  {
    id: 4,
    name: 'HDPE Bottles (Bulk)',
    category: 'Plastics',
    weight: 450,
    quantity: 5,
    location: 'Factory Zone D, Surat',
    price: '₹12/kg',
    co2: '0.9t CO₂ saved',
  },
  {
    id: 5,
    name: 'Double-Wall Corrugated Boxes',
    category: 'Cardboard',
    weight: 600,
    quantity: 300,
    location: 'Godown E, Chennai',
    price: 'Free Pickup',
    co2: '1.8t CO₂ saved',
  },
  {
    id: 6,
    name: 'Euro Plastic Pallets',
    category: 'Pallets',
    weight: 1000,
    quantity: 80,
    location: 'Hub F, Bangalore',
    price: '₹200/unit',
    co2: '3.1t CO₂ saved',
  },
];

const categoryClass: Record<string, string> = {
  Cardboard: 'cat-cardboard',
  Plastics: 'cat-plastics',
  Pallets: 'cat-pallets',
  Other: 'cat-other',
};

const categoryEmoji: Record<string, string> = {
  Cardboard: '📦',
  Plastics: '🧴',
  Pallets: '🪵',
  Other: '♻️',
};

export default function BuyPage() {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('');

  const filtered = mockDatabase.filter((item) => {
    const q = (activeTag || query).toLowerCase();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q)
    );
  });

  const handleTagClick = (tag: string) => {
    setActiveTag(activeTag === tag ? '' : tag);
    setQuery('');
  };

  return (
    <div className="buy-page">
      {/* Search hero */}
      <div className="search-hero">
        <div className="search-hero-content">
          <h1 className="search-title">
            Find <span className="highlight">Recyclable</span> Materials
          </h1>
          <p className="search-subtitle">
            Cut embodied carbon by sourcing certified secondary materials near you.
          </p>

          <div className="search-bar">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                id="material-search-input"
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveTag(''); }}
                className="search-input"
                placeholder="Search by material, location, or keyword…"
              />
            </div>
            <button
              id="material-search-btn"
              className="search-btn"
              onClick={() => {}}
            >
              Search
            </button>
          </div>

          <div className="search-tags">
            {['Cardboard', 'Pallets', 'Plastics', 'Free Pickup'].map((tag) => (
              <button
                key={tag}
                className="search-tag"
                style={activeTag === tag ? {
                  background: 'rgba(16,185,129,0.15)',
                  borderColor: 'rgba(16,185,129,0.4)',
                  color: '#34d399',
                } : {}}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="listings-header">
        <h2 className="listings-title">Available Listings</h2>
        <span className="listings-count">{filtered.length} results</span>
      </div>

      <div className="listings-grid">
        {filtered.map((item) => (
          <div key={item.id} className="listing-card">
            <div className={`listing-category ${categoryClass[item.category] || 'cat-other'}`}>
              {categoryEmoji[item.category]} {item.category}
            </div>
            <h3 className="listing-name">{item.name}</h3>

            <div className="listing-meta">
              <div className="listing-meta-item">
                <span className="meta-icon">📍</span>
                {item.location}
              </div>
              <div className="listing-meta-item">
                <span className="meta-icon">⚖️</span>
                {item.weight.toLocaleString()} kg available
              </div>
              <div className="listing-meta-item">
                <span className="meta-icon">📦</span>
                {item.quantity} units
              </div>
              <div className="listing-meta-item">
                <span className="meta-icon">🌿</span>
                {item.co2}
              </div>
            </div>

            <div className="listing-footer">
              <span className="listing-price">{item.price}</span>
              <button
                id={`claim-btn-${item.id}`}
                className="listing-cta"
              >
                Claim / Contact →
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--text-muted)',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
            <p style={{ fontSize: '16px' }}>No listings match your search. Try a different keyword.</p>
          </div>
        )}
      </div>
    </div>
  );
}