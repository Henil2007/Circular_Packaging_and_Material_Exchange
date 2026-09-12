import React, { useState } from 'react';
import { apiClient } from '../api/client';

interface CartItem {
  id: string;
  name: string;
  category: string;
  weight: number;
  price: string;
  quantity: number;
}

interface CartPageProps {
  cart: any[];
  setCart: React.Dispatch<React.SetStateAction<any[]>>;
  onNavigate: (view: 'dashboard' | 'buy' | 'sell' | 'cart') => void;
}

export default function CartPage({ cart, setCart, onNavigate }: CartPageProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      // Database expects a valid UUID for buyer_id
      const buyerId = user?.id || '00000000-0000-0000-0000-000000000000';

      // Call the buy endpoint for each item in the cart
      for (const item of cart) {
        await apiClient.put(`/marketplace/listings/${item.id}/buy?buyer_id=${buyerId}`, {});
      }

      setCart([]); // Clear cart
      setCheckoutComplete(true);
    } catch (error) {
      console.error("Checkout failed", error);
      alert("Checkout failed. Some items might no longer be available.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (checkoutComplete) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '64px 20px' }}>
        <div style={{ color: '#10b981', marginBottom: '16px' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Checkout Successful!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Your request has been sent to the suppliers. Logistics routing will begin shortly.</p>
        <button className="btn-primary" onClick={() => onNavigate('dashboard')}>
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="search-header">
        <h1 className="search-title">Your Cart</h1>
        <p className="dashboard-subtitle">Review your selected materials before checkout.</p>
      </div>

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 20px', background: 'var(--bg-surface)', border: '1px dashed var(--border-subtle)', borderRadius: '12px' }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Your cart is empty</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Browse the marketplace to find materials you need.</p>
          <button className="btn-primary" onClick={() => onNavigate('buy')}>
            Browse Marketplace
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="listing-grid" style={{ gridTemplateColumns: '1fr' }}>
            {cart.map((item, index) => (
              <div key={`${item.id}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}>
                <div>
                  <span className="status-badge badge-other" style={{ marginBottom: '8px', display: 'inline-block' }}>{item.category}</span>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px 0' }}>{item.name}</h3>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {item.location} • {item.weight?.toLocaleString() || item.weight} kg
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-primary)' }}>{item.price}</div>
                  <button 
                    onClick={() => setCart(cart.filter((_, i) => i !== index))}
                    className="btn-ghost" 
                    style={{ color: '#ef4444', padding: '8px' }}
                    title="Remove from cart"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: '24px', background: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Total Items: {cart.length}</div>
              <div style={{ fontSize: '20px', fontWeight: 700 }}>Ready for routing</div>
            </div>
            <button 
              className="btn-primary" 
              onClick={handleCheckout} 
              disabled={isCheckingOut}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {isCheckingOut ? 'Processing...' : 'Secure Checkout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
