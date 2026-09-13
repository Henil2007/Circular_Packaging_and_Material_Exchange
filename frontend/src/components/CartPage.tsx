import React, { useState } from 'react';
import { apiClient } from '../api/client';

declare global {
  interface Window {
    Razorpay: any;
  }
}

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
      // 1. Dynamically pull the user data from local storage
      const storedUserId = localStorage.getItem('userId');
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      const buyerId = storedUserId || user?.id;

      // 2. Safety Check: If we can't find their dynamic ID, stop the checkout!
      if (!buyerId) {
        alert("Authentication Error: We couldn't verify your account ID. Please sign out and sign back in.");
        setIsCheckingOut(false);
        return; 
      }
      
      const listingIds = cart.map((item) => item.id);

      // 3. Create Order on Backend
      const orderResponse = await apiClient.post('/marketplace/create-order', {
        listing_ids: listingIds
      }) as any;

      if (orderResponse.status !== 'success') {
        throw new Error('Failed to create order');
      }

      // 4. Initialize Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: "LoopX Circular Exchange",
        description: "Payment for Materials",
        // order_id: orderResponse.order_id, // Omitted for mock flow
        handler: async function (response: any) {
          try {
            // 5. Verify Payment with the completely dynamic buyerId
            const verifyResponse = await apiClient.post('/marketplace/verify-payment', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              listing_ids: listingIds,
              buyer_id: buyerId 
            }) as any;

            if (verifyResponse.status === 'success') {
              setCart([]);
              setCheckoutComplete(true);
            } else {
              alert("Payment verification failed on the server.");
            }
          } catch (verifyError) {
            console.error("Verification error:", verifyError);
            alert("Payment verification encountered an error.");
          }
        },
        prefill: {
          name: user?.name || "LoopX User",
          email: user?.email || "user@example.com",
        },
        theme: {
          color: "#10b981"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error(response.error);
        alert(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (error) {
      console.error("Checkout failed", error);
      alert("Checkout failed. Please try again.");
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