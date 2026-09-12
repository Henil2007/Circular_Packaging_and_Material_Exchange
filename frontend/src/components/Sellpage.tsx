import React, { useState } from 'react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending to backend API (/listings):', formData);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
    setFormData({ itemName: '', category: 'cardboard', weight: '', quantity: '', location: '', description: '', price: '' });
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
            <input
              id="location"
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="form-input"
              placeholder="e.g., Warehouse A, Mumbai Industrial Area"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="image">Material Photo <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              id="image"
              type="file"
              required
              accept=".jpg,.jpeg,.png"
              className="form-input file-input-styled"
            />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Required formats: JPG, JPEG, PNG. Upload a clear photo to increase buyer trust.</span>
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
            <button type="submit" className="btn-primary">
              Publish Listing
            </button>
          </div>
        </form>
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
            <span>Your materials are now live on the marketplace.</span>
          </div>
        </div>
      )}
    </div>
  );
}