import React from 'react';

interface ChoiceProps {
  onSelect: (choice: 'buy' | 'sell') => void;
}

export default function DashboardChoice({ onSelect }: ChoiceProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to the Exchange</h1>
      <p className="text-gray-600 mb-10 text-center max-w-lg">
        Join the circular carbon ecosystem. Choose whether you want to source recycled materials or list your surplus packaging.
      </p>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
        <button 
          onClick={() => onSelect('buy')}
          className="group flex flex-col items-center justify-center p-10 bg-white border-2 border-transparent rounded-2xl shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all duration-300"
        >
          <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
            🛒
          </div>
          <h2 className="text-2xl font-bold text-gray-800">I want to Buy</h2>
          <p className="text-gray-500 mt-2 text-center">Source recycled cardboard, plastics, and pallets for your business.</p>
        </button>

        <button 
          onClick={() => onSelect('sell')}
          className="group flex flex-col items-center justify-center p-10 bg-white border-2 border-transparent rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300"
        >
          <div className="h-20 w-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
            📦
          </div>
          <h2 className="text-2xl font-bold text-gray-800">I want to Sell</h2>
          <p className="text-gray-500 mt-2 text-center">List your surplus packaging and divert waste from landfills.</p>
        </button>
      </div>
    </div>
  );
}