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
    <div className="sell-page">
      {/* Page header */}
      <div className="page-header">
        <div className="page-eyebrow">📦 New Listing</div>
        <h1 className="page-title">List Surplus Packaging</h1>
        <p className="page-subtitle">
          Fill in the details below to publish your materials to the marketplace. Listings go live instantly.
        </p>
      </div>

      {/* Form card */}
      <div className="form-card">
        <form onSubmit={handleSubmit} className="form-section">

          {/* Item Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="item-name">Item Name</label>
            <input
              id="item-name"
              type="text"
              required
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              className="form-input"
              placeholder="e.g., Heavy Duty Corrugated Boxes"
            />
          </div>

          {/* Category + Weight */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="category">Material Category</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-input"
              >
                <option value="cardboard">📦 Cardboard</option>
                <option value="plastics">🧴 Plastics (HDPE/PET)</option>
                <option value="pallets">🪵 Wooden Pallets</option>
                <option value="other">♻️ Other</option>
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

          {/* Quantity + Price */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="quantity">Quantity (Units)</label>
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
              <label className="form-label" htmlFor="price">Price / Offer</label>
              <input
                id="price"
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="form-input"
                placeholder="e.g., Free Pickup / ₹2/kg"
              />
            </div>
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label" htmlFor="location">Pickup Location</label>
            <input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="form-input"
              placeholder="e.g., Warehouse A, Mumbai"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="description">Additional Details (optional)</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-input"
              placeholder="Condition, special handling notes, availability dates..."
            />
          </div>

          {/* Tip */}
          <div className="form-tip">
            💡 Listings with a location and price receive 3× more responses on average.
          </div>

          {/* Submit */}
          <button type="submit" className="sell-btn" id="publish-listing-btn">
            🚀 Publish Listing
          </button>
        </form>
      </div>

      {/* Success toast */}
      {showToast && (
        <div className="toast">
          <div className="toast-icon">✅</div>
          <div className="toast-text">
            <strong>Listing Published!</strong>
            <span>Your materials are now live on the marketplace.</span>
          </div>
        </div>
      )}
    </div>
  );
}