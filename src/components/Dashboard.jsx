import React from 'react';
import './Dashboard.css';

function Dashboard({ kpis, loading, usuario }) {
  if (loading) {
    return (
      <div className="dashboard loading">
        <div className="spinner"></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  if (!kpis) return null;

  // Verificar rol del usuario
  const esGestor = usuario?.rol === 'gestor' || usuario?.rol === 'admin';
  const esAdmin = usuario?.rol === 'admin';

  return (
    <div className="dashboard">
      <h2>📊 Indicadores Clave</h2>
      
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon">🚨</div>
          <div className="kpi-content">
            <h3>Total Accidentes</h3>
            <p className="kpi-value">{kpis.totalAccidentes?.toLocaleString()}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">🗺️</div>
          <div className="kpi-content">
            <h3>Distritos</h3>
            <p className="kpi-value">{kpis.porDistrito?.length || 0}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">⚠️</div>
          <div className="kpi-content">
            <h3>Tipos Accidentes</h3>
            <p className="kpi-value">{kpis.porTipo?.length || 0}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">⏰</div>
          <div className="kpi-content">
            <h3>Franjas Horarias</h3>
            <p className="kpi-value">{kpis.porHora?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Top 5 Distritos más peligrosos */}
      <div className="top-distritos">
        <h3>🔴 Distritos con más accidentes</h3>
        <ul>
          {kpis.porDistrito?.slice(0, 5).map((d, idx) => (
            <li key={idx}>
              <span className="distrito-nombre">{d._id}</span>
              <span className="distrito-count">{d.count} accidentes</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Top 5 Tipos - Solo visible para gestores y admin */}
      {esGestor && (
        <div className="top-tipos protected-section">
          <div className="protected-badge">🔒 Solo Gestores</div>
          <h3>⚡ Tipos más frecuentes</h3>
          <ul>
            {kpis.porTipo?.slice(0, 5).map((t, idx) => (
              <li key={idx}>
                <span className="tipo-nombre">{t._id}</span>
                <span className="tipo-count">{t.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mensaje para usuarios no autenticados */}
      {!usuario && (
        <div className="login-prompt">
          <p>🔐 <strong>Inicia sesión</strong> para acceder a análisis avanzados</p>
        </div>
      )}

      {/* Mensaje para ciudadanos */}
      {usuario && !esGestor && (
        <div className="upgrade-prompt">
          <p>👮 Se requiere <strong>Acceso de Gestor</strong> para ver análisis detallados</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
