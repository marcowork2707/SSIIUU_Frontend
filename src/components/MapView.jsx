import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

function MapView({ accidentes, loading }) {
  const center = [40.4168, -3.7038]; // Centro de Madrid/Anthem

  const getRiskColor = (lesividad) => {
    // cod_lesividad puede ser: "1", "2", "3", "4", "5", "6", "7", "14", "77", null
    if (lesividad === '4') return '#dc2626'; // Fallecido - ROJO
    if (lesividad === '3') return '#ea580c'; // Grave - NARANJA  
    if (lesividad === '1' || lesividad === '2' || lesividad === '5' || 
        lesividad === '6' || lesividad === '7') return '#fbbf24'; // Leve - AMARILLO
    return '#9ca3af'; // Sin datos o sin asistencia - GRIS
  };

  const getRadius = (lesividad) => {
    if (lesividad === '4') return 7; // Fallecido más grande
    if (lesividad === '3') return 6; // Grave mediano
    return 4; // Leve pequeño
  };

  const getLesividadText = (lesividad) => {
    const mapping = {
      '1': '🟡 Leve - Urgencias sin ingreso',
      '2': '🟡 Leve - Ingreso ≤24h',
      '3': '🟠 Grave - Ingreso >24h',
      '4': '🔴 Fallecido en 24h',
      '5': '🟡 Leve - Asistencia posterior',
      '6': '🟡 Leve - Centro de salud',
      '7': '🟡 Leve - Solo en lugar',
      '14': '⚪ Sin asistencia',
      '77': '❓ Desconocido'
    };
    return mapping[lesividad] || '⚪ Sin datos';
  };

  if (loading) {
    return (
      <div className="map-view loading">
        <div className="spinner"></div>
        <p>Cargando mapa...</p>
      </div>
    );
  }

  // Contar por gravedad
  const fallecidos = accidentes.filter(a => a.lesividad === '4').length;
  const graves = accidentes.filter(a => a.lesividad === '3').length;
  const leves = accidentes.filter(a => a.lesividad && a.lesividad !== '3' && a.lesividad !== '4' && a.lesividad !== '14' && a.lesividad !== '77').length;

  return (
    <div className="map-view">
      <div className="map-header">
        <div>
          <h2>🗺️ Mapa de Accidentalidad</h2>
          <p className="map-stats">
            Total: {accidentes.length} | 
            🔴 {fallecidos} | 
            🟠 {graves} | 
            🟡 {leves}
          </p>
        </div>
        <div className="legend">
          <div className="legend-item">
            <span className="legend-color" style={{background: '#dc2626'}}></span>
            <span>Fallecido</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{background: '#ea580c'}}></span>
            <span>Grave</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{background: '#fbbf24'}}></span>
            <span>Leve</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{background: '#9ca3af'}}></span>
            <span>Sin datos</span>
          </div>
        </div>
      </div>

      <MapContainer 
        center={center} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {accidentes.map((acc, idx) => {
          if (!acc.lat || !acc.lng) return null;
          
          // Validar coordenadas de Madrid
          if (acc.lat < 40 || acc.lat > 41 || acc.lng < -4 || acc.lng > -3) return null;
          
          return (
            <CircleMarker
              key={idx}
              center={[acc.lat, acc.lng]}
              radius={getRadius(acc.lesividad)}
              fillColor={getRiskColor(acc.lesividad)}
              color="#fff"
              weight={1}
              opacity={0.9}
              fillOpacity={0.7}
            >
              <Popup>
                <div className="popup-content">
                  <strong>{acc.tipo_accidente || 'Accidente'}</strong>
                  <div className="popup-details">
                    <p><strong>Distrito:</strong> {acc.distrito}</p>
                    <p><strong>Gravedad:</strong> {getLesividadText(acc.lesividad)}</p>
                    {acc.lesividadTexto && <p><em>{acc.lesividadTexto}</em></p>}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default MapView;
