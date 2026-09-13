import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';

export default function EsgReport() {
  const [metrics, setMetrics] = useState({
    materialsRecycled: 0,
    carbonSaved: 0,
    treesPlanted: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEsgData = async () => {
      try {
        setLoading(true);
        
        // Retrieve the logged-in user's ID from local storage.
        const userId = localStorage.getItem('userId') || 'YOUR_TEST_USER_ID_HERE'; 
        
        // Fetching data from the correct backend route (cast to any for custom apiClient)
        const response = await apiClient.get<any>(`/marketplace/esg-report/${userId}`); 
        
        // THE FIX: Removed ".data" because your apiClient returns the payload directly!
        setMetrics({
          materialsRecycled: response?.total_materials_recycled_kg || 0,
          carbonSaved: response?.total_carbon_saved_kg || 0,
          treesPlanted: response?.equivalent_trees_planted || 0
        });
      } catch (error) {
        console.error("Failed to fetch ESG data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEsgData();
  }, []);

  return (
    <div className="page-container" style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>
        Sustainability Impact Report
      </h2>
      
      {loading ? (
        <p>Loading your environmental metrics...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          
          <div style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
            <h3 style={{ fontSize: '16px', color: '#4b5563', marginBottom: '8px' }}>Total Materials Recycled</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#059669' }}>
              {metrics.materialsRecycled} kg
            </p>
          </div>

          <div style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
            <h3 style={{ fontSize: '16px', color: '#4b5563', marginBottom: '8px' }}>Carbon Emissions Saved</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#059669' }}>
              {metrics.carbonSaved} kg CO₂e
            </p>
          </div>

          <div style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
            <h3 style={{ fontSize: '16px', color: '#4b5563', marginBottom: '8px' }}>Equivalent Trees Planted</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#059669' }}>
              {metrics.treesPlanted} 🌳
            </p>
          </div>

        </div>
      )}
    </div>
  );
}