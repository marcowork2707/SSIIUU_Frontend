import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import DashboardPage from './components/DashboardPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            
            {/* Ruta principal redirige a dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Rutas protegidas - Todos los usuarios autenticados */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />

            {/* Rutas protegidas - Solo gestores y admin */}
            <Route 
              path="/analisis" 
              element={
                <ProtectedRoute rolesPermitidos={['gestor', 'admin']}>
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h1>📈 Análisis Avanzado</h1>
                    <p>Sección en desarrollo - Gráficas y análisis detallados</p>
                  </div>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/scoring" 
              element={
                <ProtectedRoute rolesPermitidos={['gestor', 'admin']}>
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h1>⚠️ Scoring de Riesgo</h1>
                    <p>Sección en desarrollo - Zonas peligrosas y scoring</p>
                  </div>
                </ProtectedRoute>
              } 
            />

            {/* Rutas protegidas - Solo admin */}
            <Route 
              path="/usuarios" 
              element={
                <ProtectedRoute rolesPermitidos={['admin']}>
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h1>👥 Gestión de Usuarios</h1>
                    <p>Sección en desarrollo - Administración de usuarios</p>
                  </div>
                </ProtectedRoute>
              } 
            />

            {/* 404 */}
            <Route path="*" element={
              <div style={{ 
                padding: '2rem', 
                textAlign: 'center',
                height: 'calc(100vh - 70px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <h1 style={{ fontSize: '6rem', margin: 0 }}>404</h1>
                <h2>Página no encontrada</h2>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
