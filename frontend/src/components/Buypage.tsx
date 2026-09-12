import React, { useState } from 'react';

const mockDatabase = [
  {
    id: 1,
    name: 'Standard Wooden Pallets (Grade A)',
    category: 'Pallets',
    weight: 800,
    quantity: 50,
    location: 'Warehouse A, Mumbai',
    price: 'Free Pickup',
    co2: '1.2t',
  },
  {
    id: 2,
    name: 'Clean Cardboard Bales',
    category: 'Cardboard',
    weight: 1200,
    quantity: 20,
    location: 'Retail Center B, Pune',
    price: '₹0.05/kg',
    co2: '2.4t',
  },
  {
    id: 3,
    name: 'LDPE Shrink Wrap Rolls',
    category: 'Plastics',
    weight: 300,
    quantity: 1,
    location: 'Distribution Hub C, Delhi',
    price: 'Negotiable',
    co2: '0.8t',
  },
  {
    id: 4,
    name: 'HDPE Bottles (Bulk)',
    category: 'Plastics',
    weight: 450,
    quantity: 5,
    location: 'Factory Zone D, Surat',
    price: '₹12/kg',
    co2: '0.9t',
  },
  {
    id: 5,
    name: 'Double-Wall Corrugated Boxes',
    category: 'Cardboard',
    weight: 600,
    quantity: 300,
    location: 'Godown E, Chennai',
    price: 'Free Pickup',
    co2: '1.8t',
  },
  {
    id: 6,
    name: 'Euro Plastic Pallets',
    category: 'Pallets',
    weight: 1000,
    quantity: 80,
    location: 'Hub F, Bangalore',
    price: '₹200/unit',
    co2: '3.1t',
  },
];

const categoryBadgeClass: Record<string, string> = {
  Cardboard: 'badge-cardboard',
  Plastics: 'badge-plastics',
  Pallets: 'badge-pallets',
  Other: 'badge-other',
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
    <div className="page-container">
      <div className="search-header">
        <h1 className="search-title">Marketplace Inventory</h1>
        
        <div className="search-bar-row">
          <div className="search-wrapper">
            <div className="search-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setActiveTag(''); }}
              className="search-input-lg"
              placeholder="Search by material, location, or keyword..."
            />
          </div>
          <button className="btn-primary">
            Search
          </button>
        </div>

        <div className="tag-list">
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginRight: '8px', display: 'flex', alignItems: 'center' }}>Popular Filters:</span>
          {['Cardboard', 'Pallets', 'Plastics', 'Free Pickup'].map((tag) => (
            <button
              key={tag}
              className={`filter-tag ${activeTag === tag ? 'active' : ''}`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="data-header">
        <h2 className="data-title">Available Materials</h2>
        <span className="data-count">{filtered.length} listings match criteria</span>
      </div>

      <div className="listing-grid">
        {filtered.map((item) => (
          <div key={item.id} className="listing-card">
            <div className="badge-row">
              <span className={`status-badge ${categoryBadgeClass[item.category] || 'badge-other'}`}>
                {item.category}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                {item.co2} CO₂ Offset
              </span>
            </div>

            <h3 className="listing-name">{item.name}</h3>

            <div className="listing-details">
              <div className="detail-item">
                <div className="detail-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                {item.location}
              </div>
              <div className="detail-item">
                <div className="detail-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                {item.weight.toLocaleString()} kg available
              </div>
              <div className="detail-item">
                <div className="detail-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                {item.quantity} units
              </div>
            </div>

            <div className="listing-action-row">
              <span className="listing-price">{item.price}</span>
              <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                View Details
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '64px 20px',
            background: 'var(--bg-surface)',
            border: '1px dashed var(--border-subtle)',
            borderRadius: '12px'
          }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>No matching inventory found</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Try adjusting your search criteria or clearing active filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}