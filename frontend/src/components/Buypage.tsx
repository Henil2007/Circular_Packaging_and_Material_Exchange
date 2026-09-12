import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

const categoryBadgeClass: Record<string, string> = {
  Cardboard: 'badge-cardboard',
  Plastics: 'badge-plastics',
  Pallets: 'badge-pallets',
  Other: 'badge-other',
};

interface BuyPageProps {
  onAddToCart?: (item: any) => void;
}

export default function BuyPage({ onAddToCart }: BuyPageProps) {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [listings, setListings] = useState<any[]>([]);
  const [selectedListing, setSelectedListing] = useState<any | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await apiClient.get<{ status: string, listings: any[] }>('/marketplace/listings');
        if (response && response.listings) {
          const mapped = response.listings.map((l: any) => ({
            id: l.id,
            name: l.title,
            category: l.material_category,
            weight: l.estimated_weight_kg,
            quantity: 1,
            location: 'Local Warehouse',
            price: `₹${(l.price * l.estimated_weight_kg).toLocaleString()}`,
            co2: `${(l.estimated_weight_kg * 1.5 / 1000).toFixed(1)}t`
          }));
          setListings(mapped);
        }
      } catch (error) {
        console.error('Failed to fetch listings:', error);
      }
    };
    fetchListings();
  }, []);

  const filtered = listings.filter((item) => {
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

  const getCategoryImage = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('cardboard')) return 'https://images.unsplash.com/photo-1589793463357-55091763ef00?auto=format&fit=crop&w=800&q=80';
    if (cat.includes('plastic')) return 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80';
    if (cat.includes('pallet')) return 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=800&q=80';
    return 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80';
  };

  if (selectedListing) {
    return (
      <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <button 
          onClick={() => setSelectedListing(null)} 
          style={{ marginBottom: '24px', cursor: 'pointer', border: 'none', background: 'none', color: 'var(--brand-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', padding: 0 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Inventory
        </button>

        <div style={{ display: 'flex', gap: '40px', background: 'var(--bg-surface)', padding: '32px', borderRadius: '16px', boxShadow: 'var(--shadow-md)', flexWrap: 'wrap' }}>
          {/* Left Side: Image */}
          <div style={{ flex: '1 1 400px', minWidth: '300px' }}>
            <div style={{ width: '100%', aspectRatio: '1/1', background: 'var(--bg-body)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
              <img 
                src={`https://jgaiqseoqgiaowtyyvas.supabase.co/storage/v1/object/public/listings/${selectedListing.id}.jpg`}
                onError={(e) => {
                  e.currentTarget.onerror = null; // Prevent infinite loop if fallback fails
                  e.currentTarget.src = getCategoryImage(selectedListing.category);
                }}
                alt={selectedListing.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Right Side: Details */}
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span className={`status-badge ${categoryBadgeClass[selectedListing.category] || 'badge-other'}`} style={{ marginBottom: '12px', display: 'inline-block' }}>
                {selectedListing.category}
              </span>
              <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.2 }}>{selectedListing.name}</h1>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Listed by Verified Supplier • ID: {selectedListing.id.substring(0,8)}</p>
            </div>

            <div style={{ padding: '20px', background: 'var(--bg-body)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--brand-primary)', marginBottom: '4px' }}>
                {selectedListing.price}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Total estimated price based on weight. Taxes and logistics calculated at checkout.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Location</strong>
                <span style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 500 }}>{selectedListing.location}</span>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Total Weight</strong>
                <span style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 500 }}>{selectedListing.weight.toLocaleString()} kg</span>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Quantity Available</strong>
                <span style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 500 }}>{selectedListing.quantity} units</span>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>CO₂ Offset Potential</strong>
                <span style={{ fontSize: '15px', color: 'var(--brand-secondary)', fontWeight: 600 }}>{selectedListing.co2} CO₂e</span>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '16px' }}>
              <button 
                className="btn-primary" 
                style={{ flex: 1, padding: '14px', fontSize: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                onClick={() => {
                  if (onAddToCart) onAddToCart(selectedListing);
                  alert("Added to cart!");
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Add to Cart
              </button>
              <button className="btn-secondary" style={{ flex: 1, padding: '14px', fontSize: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Contact Supplier
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="btn-secondary" 
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                  onClick={() => setSelectedListing(item)}
                >
                  View Details
                </button>
                <button 
                  className="btn-primary" 
                  style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => {
                    if (onAddToCart) onAddToCart(item);
                    alert("Added to cart!");
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  Add to Cart
                </button>
              </div>
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