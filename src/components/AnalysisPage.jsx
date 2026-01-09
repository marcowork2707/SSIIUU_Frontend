
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './AnalysisPage.css';

function AnalysisPage() {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const headers = token ? {
        'Authorization': `Bearer ${token}`
      } : {};

      const response = await fetch(`${API_URL}/kpis/general`, { headers });
      const data = await response.json();

      setKpis(data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analysis-loading">
        <div className="spinner"></div>
        <p>Cargando análisis...</p>
      </div>
    );
  }

  if (!kpis) {
    return <div className="analysis-error">Error al cargar datos</div>;
  }

  // Preparar datos para gráficas
  // Crear array de 24 horas completo y ordenado
  const accidentesPorHora = Array.from({ length: 24 }, (_, hora) => {
    const dato = kpis.porHora?.find(h => Number(h._id) === hora);
    return {
      hora: `${String(hora).padStart(2, '0')}:00`,
      accidentes: dato ? dato.count : 0
    };
  });

  const top10Distritos = kpis.porDistrito?.slice(0, 10).map(item => ({
    distrito: item._id,
    accidentes: item.count
  })) || [];

  const top10Tipos = kpis.porTipo?.slice(0, 10).map(item => ({
    tipo: item._id?.length > 20 ? item._id.substring(0, 20) + '...' : item._id,
    cantidad: item.count
  })) || [];

  const top5Vehiculos = kpis.porVehiculo?.slice(0, 5).map(item => ({
    vehiculo: item._id,
    cantidad: item.count
  })) || [];

  // Colores para las gráficas
  const COLORS = ['#667eea', '#764ba2', '#f59e0b', '#ef4444', '#10b981'];

  return (
    <div className="analysis-page">
      <div className="analysis-header">
        <h1>📈 Análisis Avanzado de Accidentalidad</h1>
        <p>Datos históricos y tendencias de accidentes en Madrid</p>
      </div>

      <div className="analysis-grid">
        {/* Gráfica 1: Accidentes por hora del día */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>⏰ Accidentes por Hora del Día</h3>
            <p>Distribución temporal de siniestros (24 horas)</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={accidentesPorHora} margin={{ top: 20, right: 40, left: 40, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="hora" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                interval={0}
                tick={{ fontSize: 12, fill: '#374151' }}
                stroke="#9ca3af"
              />
              <YAxis 
                domain={[0, 'dataMax']}
                tick={{ fontSize: 12, fill: '#374151' }}
                stroke="#9ca3af"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
              />
              <Bar dataKey="accidentes" fill="#667eea" name="Accidentes" radius={[6, 6, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-insight">
            💡 <strong>Insight:</strong> Picos de accidentalidad entre 08:00-09:00 y 18:00-20:00 (horas punta)
          </div>
        </div>

        {/* Gráfica 2: Top 10 Distritos */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>🗺️ Top 10 Distritos con Mayor Accidentalidad</h3>
            <p>Ranking de zonas más peligrosas</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={top10Distritos} 
              layout="vertical"
              margin={{ top: 20, right: 40, left: 160, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                type="number"
                tick={{ fontSize: 12, fill: '#374151' }}
                stroke="#9ca3af"
              />
              <YAxis 
                dataKey="distrito" 
                type="category" 
                width={150}
                tick={{ fontSize: 11, fill: '#374151' }}
                stroke="#9ca3af"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
              />
              <Bar dataKey="accidentes" fill="#ef4444" name="Accidentes" radius={[0, 6, 6, 0]} />
            </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-insight">
            💡 <strong>Insight:</strong> Puente de Vallecas lidera con {top10Distritos[0]?.accidentes} accidentes
          </div>
        </div>

        {/* Gráfica 3: Top 10 Tipos de Accidentes */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>⚠️ Top 10 Tipos de Accidentes</h3>
            <p>Causas más frecuentes de siniestros</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={top10Tipos}
              margin={{ top: 20, right: 40, left: 40, bottom: 120 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="tipo" 
                angle={-45} 
                textAnchor="end" 
                height={120}
                interval={0}
                tick={{ fontSize: 10, fill: '#374151' }}
                stroke="#9ca3af"
              />
              <YAxis 
                domain={[0, 'auto']}
                tick={{ fontSize: 12, fill: '#374151' }}
                stroke="#9ca3af"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
              />
              <Bar dataKey="cantidad" fill="#f59e0b" name="Cantidad" radius={[6, 6, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-insight">
            💡 <strong>Insight:</strong> {top10Tipos[0]?.tipo} es el tipo más frecuente
          </div>
        </div>

        {/* Gráfica 4: Vehículos Implicados (Pie Chart) */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>🚗 Top 5 Vehículos Implicados</h3>
            <p>Distribución por tipo de vehículo</p>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              <Pie
                data={top5Vehiculos}
                dataKey="cantidad"
                nameKey="vehiculo"
                cx="50%"
                cy="45%"
                outerRadius={120}
                fill="#8884d8"
                label={({ vehiculo, percent }) => 
                  `${vehiculo}: ${(percent * 100).toFixed(1)}%`
                }
                labelLine={{ stroke: '#666', strokeWidth: 1 }}
              >
                {top5Vehiculos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '13px' }}
                iconType="circle"
              />
            </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-insight">
            💡 <strong>Insight:</strong> {top5Vehiculos[0]?.vehiculo} es el tipo de vehículo más accidentado
          </div>
        </div>

        {/* Resumen Estadístico */}
        <div className="stats-card full-width">
          <h3>📊 Resumen Estadístico</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total Accidentes</span>
              <span className="stat-value">{kpis.totalAccidentes?.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Distritos Analizados</span>
              <span className="stat-value">{kpis.porDistrito?.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tipos de Accidentes</span>
              <span className="stat-value">{kpis.porTipo?.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tipos de Vehículos</span>
              <span className="stat-value">{kpis.porVehiculo?.length}</span>
            </div>
          </div>
        </div>

        {/* Recomendaciones */}
        <div className="recommendations-card full-width">
          <h3>💡 Recomendaciones Basadas en Datos</h3>
          <ul>
            <li>
              <strong>🚨 Zonas de alto riesgo:</strong> Incrementar patrullas en {top10Distritos.slice(0, 3).map(d => d.distrito).join(', ')}
            </li>
            <li>
              <strong>⏰ Horas críticas:</strong> Reforzar vigilancia entre 08:00-09:00 y 18:00-20:00
            </li>
            <li>
              <strong>🚗 Vehículos vulnerables:</strong> Campañas de seguridad focalizadas en {top5Vehiculos[0]?.vehiculo}
            </li>
            <li>
              <strong>⚠️ Causas principales:</strong> Medidas preventivas contra {top10Tipos[0]?.tipo}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AnalysisPage;
