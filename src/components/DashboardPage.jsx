import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Dashboard from './Dashboard';
import MapView from './MapView';
import './DashboardPage.css';

function DashboardPage() {
  const [kpis, setKpis] = useState(null);
  const [accidentes, setAccidentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // KPIs generales (público)
      const kpisRes = await fetch(`${API_URL}/kpis/general`);
      const kpisData = await kpisRes.json();

      // Accidentes para mapa (público)
      const accidentesRes = await fetch(`${API_URL}/accidentes/heatmap`);
      const accidentesData = await accidentesRes.json();

      setKpis(kpisData);
      setAccidentes(accidentesData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Dashboard kpis={kpis} />
      <MapView accidentes={accidentes} loading={loading} />
    </div>
  );
}

export default DashboardPage;
