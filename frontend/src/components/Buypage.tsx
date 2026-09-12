import React, { useState } from 'react';

const mockDatabase = [
  { id: 1, name: 'Standard Wooden Pallets', category: 'Pallets', weight: 800, quantity: 50, location: 'Warehouse A', price: 'Free Pickup' },
  { id: 2, name: 'Clean Cardboard Bales', category: 'Cardboard', weight: 1200, quantity: 20, location: 'Retail Center B', price: '$0.05/kg' },
  { id: 3, name: 'LDPE Shrink Wrap', category: 'Plastics', weight: 300, quantity: 1, location: 'Distribution Hub C', price: 'Negotiable' },
];

export default function BuyPage() {
  const [requirement, setRequirement] = useState('');

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10">
      <div className="bg-emerald-700 rounded-xl p-8 text-white mb-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Find Recyclable Packaging</h2>
        <p className="mb-6 opacity-90">Cut embodied carbon by sourcing secondary materials near you.</p>
        
        <div className="flex gap-4">
          <input 
            type="text" 
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-300" 
            placeholder="What are you looking for? (e.g., Cardboard, Pallets)" 
          />
          <button className="bg-emerald-900 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-800 transition">
            Search
          </button>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-4">Available Listings</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {mockDatabase.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{item.category}</span>
            <h4 className="text-lg font-semibold text-gray-900 mt-1 mb-2">{item.name}</h4>
            
            <div className="text-sm text-gray-600 space-y-1 mb-4">
              <p>📍 {item.location}</p>
              <p>⚖️ {item.weight} kg available</p>
              <p>📦 {item.quantity} units</p>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="font-medium text-gray-900">{item.price}</span>
              <button className="text-sm bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800">
                Claim / Contact
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}