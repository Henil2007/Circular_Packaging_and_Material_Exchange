import React, { useState } from 'react';

export default function SellPage() {
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'cardboard',
    weight: '',
    quantity: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sending to backend API (/listings):", formData);
    alert("Listing successfully submitted to the marketplace!");
    setFormData({ itemName: '', category: 'cardboard', weight: '', quantity: '', description: '' });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">List Surplus Packaging</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">Item Name</label>
          <input 
            type="text" 
            required
            value={formData.itemName}
            onChange={(e) => setFormData({...formData, itemName: e.target.value})}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
            placeholder="e.g., Heavy Duty Corrugated Boxes" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Material Category</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500"
            >
              <option value="cardboard">Cardboard</option>
              <option value="plastics">Plastics (HDPE/PET)</option>
              <option value="pallets">Wooden Pallets</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Weight (kg)</label>
            <input 
              type="number" 
              required
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500" 
              placeholder="e.g., 500" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity (Units/Pallets)</label>
          <input 
            type="number" 
            required
            value={formData.quantity}
            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500" 
            placeholder="e.g., 200" 
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition">
          Publish Listing
        </button>
      </form>
    </div>
  );
}