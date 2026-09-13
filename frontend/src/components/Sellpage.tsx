import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';

export default function SellPage() {
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'cardboard',
    weight: '',
    quantity: '',
    location: '',
    description: '',
    price: '',
  });
  const [showToast, setShowToast] = useState(false);
  const [notifiedCount, setNotifiedCount] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [tempImageId, setTempImageId] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [myListings, setMyListings] = useState<any[]>([]);

  // --- Helper to safely get the current User ID ---
  const getCurrentUserId = () => {
    return localStorage.getItem('userId') || 'PASTE_A_REAL_DB_USER_ID_HERE';
  };

  const fetchMyListings = async () => {
    try {
      const currentUserId = getCurrentUserId();
      const res = await apiClient.get<{ status: string; listings: any[] }>('/marketplace/listings');
      if (res && res.listings) {
        // Now filters strictly by the actual logged-in user
        setMyListings(res.listings.filter(l => l.supplier_id === currentUserId));
      }
    } catch (error) {
      console.error('Failed to fetch listings', error);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await apiClient.delete(`/marketplace/listings/${id}`);
      fetchMyListings(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete listing:', error);
      alert('Failed to delete listing.');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const data = new FormData();
      data.append('file', file);
      
      setIsAnalyzing(true);
      try {
        const res = await apiClient.post<{ message: string; generated_listing: any; temp_image_id: string }>('/marketplace/analyze-image', data);
        if (res) {
          if (res.temp_image_id) {
            setTempImageId(res.temp_image_id);
          }
          if (res.generated_listing) {
          setFormData((prev) => {
            const cat = res.generated_listing.material_category?.toLowerCase();
            const validCategory = ['cardboard', 'plastics', 'pallets', 'other'].includes(cat) ? cat : 'other';
            return {
              ...prev,
              itemName: res.generated_listing.title || prev.itemName,
              category: validCategory,
              weight: res.generated_listing.estimated_weight_kg?.toString() || prev.weight,
              description: res.generated_listing.condition || prev.description,
            };
          });
        }
        }
      } catch (err) {
        console.error('Failed to analyze image:', err);
        alert('Failed to auto-analyze image. You can still fill the form manually.');
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleLocationDetect = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setFormData(prev => ({ ...prev, location: "Current Location (Detected)" }));
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Could not detect location. Please enter manually.");
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const currentUserId = getCurrentUserId();
      
      if (currentUserId === 'PASTE_A_REAL_DB_USER_ID_HERE') {
        alert("Warning: You are using a fallback ID. Please sign out and sign back in to link this listing to your actual account.");
      }

      const payload = {
        title: formData.itemName,
        material_category: formData.category,
        condition: formData.description || 'Standard',
        estimated_weight_kg: parseInt(formData.weight) || 1,
        price: parseFloat(formData.price.replace(/[^0-9.]/g, '')) || 0,
        lat: coordinates.lat,
        lng: coordinates.lng,
        supplier_id: currentUserId // <-- FIXED: No longer hardcoded to 'user_123'
      };
      
      const url = tempImageId ? `/marketplace/listings?temp_image_id=${tempImageId}` : '/marketplace/listings';
      const res = await apiClient.post<{ status: string; message: string; notified_count?: number }>(url, payload);
      
      setNotifiedCount(res.notified_count || 0);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
      
      setFormData({ itemName: '', category: 'cardboard', weight: '', quantity: '', location: '', description: '', price: '' });
      setCoordinates({ lat: 0, lng: 0 });
      setTempImageId(null);
      fetchMyListings(); // Refresh inventory after posting
    } catch (error) {
      console.error('Failed to create listing:', error);
      alert('Failed to publish listing. Check console for errors.');
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      <div className="sell-header">
        <h1 className="sell-title">Create New Listing</h1>
        <p className="sell-subtitle">
          Enter the details of your surplus materials. Listings will be visible to all verified buyers on the exchange.
        </p>
      </div>

      <div className="sell-form-card">
        <div className="form-tip-box">
          <div className="tip-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <div className="tip-text">
            <strong>Pro Tip:</strong> Listings with precise weight measurements and clear location details receive responses 3x faster from enterprise buyers.
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="image">Material Photo <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              id="image"
              type="file"
              required
              accept=".jpg,.jpeg,.png"
              onChange={handleImageUpload}
              className="form-input file-input-styled"
            />
            {isAnalyzing && (
              <div style={{ marginTop: '8px', color: '#10b981', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                  <line x1="12" y1="2" x2="12" y2="6"></line>
                  <line x1="12" y1="18" x2="12" y2="22"></line>
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                  <line x1="2" y1="12" x2="6" y2="12"></line>
                  <line x1="18" y1="12" x2="22" y2="12"></line>
                  <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                  <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                </svg>
                AI is analyzing your image and auto-filling details...
              </div>
            )}
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>Required formats: JPG, JPEG, PNG. Upload a clear photo to increase buyer trust.</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="item-name">Listing Title</label>
            <input
              id="item-name"
              type="text"
              required
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              className="form-input"
              placeholder="e.g., Heavy Duty Corrugated Boxes (Double Wall)"
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="category">Material Category</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-input"
              >
                <option value="cardboard">Cardboard</option>
                <option value="plastics">Plastics (HDPE/PET)</option>
                <option value="pallets">Wooden Pallets</option>
                <option value="other">Other Materials</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="weight">Total Weight (kg)</label>
              <input
                id="weight"
                type="number"
                required
                min="1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="form-input"
                placeholder="e.g., 500"
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="quantity">Quantity (Units/Pallets)</label>
              <input
                id="quantity"
                type="number"
                required
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="form-input"
                placeholder="e.g., 200"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="price">Asking Price</label>
              <input
                id="price"
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="form-input"
                placeholder="e.g., Free Pickup or ₹2/kg"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="location">Facility Location</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                id="location"
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="form-input"
                style={{ flex: 1 }}
                placeholder="e.g., Warehouse A, Mumbai Industrial Area"
              />
              <button 
                type="button" 
                onClick={handleLocationDetect}
                disabled={isLocating}
                className="btn-ghost"
                style={{ whiteSpace: 'nowrap', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)' }}
              >
                {isLocating ? 'Detecting...' : 'Detect Location'}
              </button>
            </div>
            {coordinates.lat !== 0 && (
              <span style={{ fontSize: '12px', color: '#10b981', display: 'block', marginTop: '4px' }}>
                Coordinates locked: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Additional Details</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input"
              placeholder="Please describe condition, handling requirements, or availability dates..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <button type="submit" className="btn-primary" disabled={isAnalyzing}>
              {isAnalyzing ? 'Analyzing Image...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>

      <div className="sell-form-card" style={{ marginTop: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>My Inventory</h2>
        {myListings.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>You have no active listings.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {myListings.map((listing) => (
              <div key={listing.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border-subtle)', borderRadius: '8px', background: 'var(--bg-elevated)' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px 0', color: 'var(--text-primary)' }}>{listing.title || 'Untitled Listing'}</h3>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    <span style={{ textTransform: 'capitalize' }}>{listing.material_category}</span> • {listing.estimated_weight_kg}kg • ₹{listing.price}
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(listing.id)}
                  className="btn-ghost"
                  style={{ color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '6px 12px' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showToast && (
        <div className="toast">
          <div className="toast-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className="toast-body">
            <strong>Listing Published</strong>
            <span>
              Your materials are now live. 
              {notifiedCount > 0 
                ? <span style={{ color: '#10b981', fontWeight: 500, display: 'block', marginTop: '2px' }}>We've notified {notifiedCount} buyer{notifiedCount > 1 ? 's' : ''} within 50km!</span> 
                : <span style={{ display: 'block', marginTop: '2px' }}>No buyers found within 50km yet.</span>}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}