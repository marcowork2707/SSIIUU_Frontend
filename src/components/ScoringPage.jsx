import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './ScoringPage.css';

function ScoringPage() {
  const [scoring, setScoring] = useState([]);
  const [zonasRiesgo, setZonasRiesgo] = useState([]);
  const [patronesHorarios, setPatronesHorarios] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [distritoSeleccionado, setDistritoSeleccionado] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const { token } = useAuth();

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchScoring();
  }, []);

  useEffect(() => {
    // Cuando se cargan las zonas de riesgo, seleccionar automáticamente el distrito #1
    if (zonasRiesgo.length > 0 && !distritoSeleccionado) {
      setDistritoSeleccionado(zonasRiesgo[0].distrito);
    }
  }, [zonasRiesgo]);

  const fetchScoring = async () => {
    try {
      setLoading(true);

      const headers = token ? {
        'Authorization': `Bearer ${token}`
      } : {};

      const response = await fetch(`${API_URL}/kpis/riesgo`, { headers });
      const data = await response.json();

      setScoring(data.scoring || []);
      setZonasRiesgo(data.zonasRiesgo || []);
      setPatronesHorarios(data.patronesHorarios || []);
      setMetadata(data.metadata || null);
    } catch (error) {
      console.error('Error cargando scoring:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (nivel) => {
    switch (nivel) {
      case 'Crítico': return '#dc2626';
      case 'Alto': return '#ea580c';
      case 'Medio': return '#f59e0b';
      case 'Bajo': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getRiskEmoji = (nivel) => {
    switch (nivel) {
      case 'Crítico': return '🔴';
      case 'Alto': return '🟠';
      case 'Medio': return '🟡';
      case 'Bajo': return '🟢';
      default: return '⚪';
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedScoring = () => {
    // Filtrar por distrito seleccionado
    console.log('=== DEBUG SCORING ===');
    console.log('Distrito seleccionado:', distritoSeleccionado);
    console.log('Total items en scoring:', scoring.length);
    console.log('Primer item:', scoring[0]);
    console.log('Ejemplo de items con distrito:', scoring.filter(item => item.distrito === distritoSeleccionado).slice(0, 3));
    
    const scoringDelDistrito = distritoSeleccionado 
      ? scoring.filter(item => item.distrito === distritoSeleccionado)
      : [];

    console.log('Items filtrados para distrito:', scoringDelDistrito.length);
    console.log('Datos filtrados:', scoringDelDistrito.slice(0, 5));

    // Asegurar que tenemos las 24 horas completas
    const horasCompletas = Array.from({ length: 24 }, (_, hora) => {
      const datoExistente = scoringDelDistrito.find(item => item.hora === hora);
      if (datoExistente) {
        return datoExistente;
      }
      // Si no hay datos para esta hora, crear entrada vacía
      return {
        distrito: distritoSeleccionado,
        hora: hora,
        totalAccidentes: 0,
        graves: 0,
        fallecidos: 0,
        conAlcohol: 0,
        score: 0,
        nivelRiesgo: 'Bajo',
        tendencia: 'N/A',
        probabilidadAccidente: 0
      };
    });

    if (!sortConfig.key) return horasCompletas;

    const sorted = [...horasCompletas].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      // Handle numeric values
      if (sortConfig.key === 'hora' || sortConfig.key === 'totalAccidentes' || sortConfig.key === 'graves' || 
          sortConfig.key === 'fallecidos' || sortConfig.key === 'conAlcohol' || 
          sortConfig.key === 'score' || sortConfig.key === 'probabilidadAccidente') {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      }

      // Handle string values (tendencia, nivelRiesgo)
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '⬆️' : '⬇️';
  };

  if (loading) {
    return (
      <div className="scoring-loading">
        <div className="spinner"></div>
        <p>Calculando scoring de riesgo...</p>
      </div>
    );
  }

  return (
    <div className="scoring-page">
      <div className="scoring-header">
        <h1>⚠️ Modelo Predictivo de Riesgo Vial</h1>
        <p>Sistema de Machine Learning para predicción de accidentalidad</p>
        {metadata && (
          <div className="model-badge">
            🤖 Modelo: {metadata.modelo} · Normalización: {metadata.normalizacion}
          </div>
        )}
      </div>

      {/* Top 10 Zonas de Riesgo */}
      <div className="risk-zones-card">
        <h2>🚨 Top 10 Zonas de Mayor Riesgo</h2>
        <div className="risk-zones-grid">
          {zonasRiesgo.map((zona, idx) => (
            <div 
              key={zona.distrito} 
              className={`risk-zone-item ${distritoSeleccionado === zona.distrito ? 'selected' : ''}`}
              onClick={() => setDistritoSeleccionado(zona.distrito)}
              style={{ cursor: 'pointer' }}
            >
              <div className="zone-rank">#{idx + 1}</div>
              <div className="zone-info">
                <h3>{zona.distrito}</h3>
                <p>{zona.totalAccidentes} accidentes · {zona.graves} graves · {zona.fallecidos} fallecidos</p>
                <p className="tasa-gravedad">Tasa gravedad: {zona.tasaGravedad || 0}%</p>
              </div>
              <div className="zone-score">
                <span className="score-value">{zona.scoreRiesgo}</span>
                <span className="score-label">/100</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patrones Horarios */}
      {patronesHorarios.length > 0 && (
        <div className="patterns-card">
          <h2>⏰ Patrones Horarios de Alto Riesgo</h2>
          <p className="subtitle">Predicción basada en análisis histórico</p>
          <div className="patterns-grid">
            {patronesHorarios.map((patron, idx) => (
              <div key={idx} className="pattern-item">
                <div className="pattern-time">{String(patron.hora).padStart(2, '0')}:00</div>
                <div className="pattern-count">{patron.accidentes} accidentes</div>
                <div className={`pattern-risk risk-${patron.riesgo.toLowerCase().replace(' ', '-')}`}>
                  {patron.riesgo}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabla de Scoring */}
      <div className="scoring-table-card">
        <h2>📊 Análisis Horario: {distritoSeleccionado || 'Seleccione un distrito'}</h2>
        <p className="formula-info">
          💡 <strong>Modelo Predictivo:</strong> Densidad (2x) + Severidad (graves×15 + fallecidos×30) + Alcohol (8x) + Diversidad (3x)
        </p>
        {!distritoSeleccionado && (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            👆 Haz clic en uno de los distritos del Top 10 para ver su análisis horario
          </p>
        )}
        {distritoSeleccionado && (
          <div className="table-container">
            <table className="scoring-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('hora')} style={{ cursor: 'pointer' }}>
                    Hora {getSortIcon('hora')}
                  </th>
                  <th onClick={() => handleSort('totalAccidentes')} style={{ cursor: 'pointer' }}>
                    Accidentes {getSortIcon('totalAccidentes')}
                  </th>
                  <th onClick={() => handleSort('graves')} style={{ cursor: 'pointer' }}>
                    Graves {getSortIcon('graves')}
                  </th>
                  <th onClick={() => handleSort('fallecidos')} style={{ cursor: 'pointer' }}>
                    Fallecidos {getSortIcon('fallecidos')}
                  </th>
                  <th onClick={() => handleSort('conAlcohol')} style={{ cursor: 'pointer' }}>
                    Con Alcohol {getSortIcon('conAlcohol')}
                  </th>
                  <th onClick={() => handleSort('score')} style={{ cursor: 'pointer' }}>
                    Score IA {getSortIcon('score')}
                  </th>
                  <th onClick={() => handleSort('nivelRiesgo')} style={{ cursor: 'pointer' }}>
                    Riesgo {getSortIcon('nivelRiesgo')}
                  </th>
                  <th onClick={() => handleSort('tendencia')} style={{ cursor: 'pointer' }}>
                    Tendencia {getSortIcon('tendencia')}
                  </th>
                  <th onClick={() => handleSort('probabilidadAccidente')} style={{ cursor: 'pointer' }}>
                    Probabilidad {getSortIcon('probabilidadAccidente')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {getSortedScoring().map((item, idx) => (
                  <tr key={idx} className={`risk-${item.nivelRiesgo.toLowerCase()}`}>
                    <td><strong>{String(item.hora).padStart(2, '0')}:00</strong></td>
                    <td>{item.totalAccidentes}</td>
                    <td>{item.graves}</td>
                    <td>{item.fallecidos}</td>
                    <td>{item.conAlcohol || 0}</td>
                    <td className="score-cell">
                      <span className="score-badge" style={{ backgroundColor: getRiskColor(item.nivelRiesgo) }}>
                        {item.score}
                      </span>
                    </td>
                    <td className="risk-cell">
                      {getRiskEmoji(item.nivelRiesgo)} {item.nivelRiesgo}
                    </td>
                    <td className="tendencia-cell">
                      {item.tendencia === 'Creciente' && '📈'}
                      {item.tendencia === 'Estable' && '➡️'}
                      {item.tendencia === 'Decreciente' && '📉'}
                      {item.tendencia === 'N/A' && '⚪'}
                      {' '}{item.tendencia}
                    </td>
                    <td className="prob-cell">{item.probabilidadAccidente}%</td>
                  </tr>
                ))}
              </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Recomendaciones */}
      <div className="recommendations-card">
        <h2>💡 Recomendaciones Estratégicas</h2>
        <div className="recommendations-grid">
          <div className="recommendation-item critical">
            <h3>🔴 Zonas Críticas</h3>
            <ul>
              {zonasRiesgo.slice(0, 3).map(zona => (
                <li key={zona.distrito}>
                  <strong>{zona.distrito}:</strong> Aumentar patrullas y control de velocidad
                </li>
              ))}
            </ul>
          </div>
          <div className="recommendation-item high">
            <h3>🟠 Horarios de Riesgo</h3>
            <ul>
              <li>Reforzar vigilancia entre 08:00-09:00 (entrada al trabajo)</li>
              <li>Control especial 18:00-20:00 (salida del trabajo)</li>
              <li>Patrullas nocturnas 23:00-02:00 (ocio nocturno)</li>
            </ul>
          </div>
          <div className="recommendation-item medium">
            <h3>🟡 Medidas Preventivas</h3>
            <ul>
              <li>Instalar cámaras de velocidad en zonas de alto scoring</li>
              <li>Mejorar señalización en puntos negros identificados</li>
              <li>Campañas de concienciación focalizadas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScoringPage;
