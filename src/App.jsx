import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import DashboardPage from './components/DashboardPage';
import AnalysisPage from './components/AnalysisPage';
import ScoringPage from './components/ScoringPage';
import AdminPage from './components/AdminPage';
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
                  <AnalysisPage />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/scoring" 
              element={
                <ProtectedRoute rolesPermitidos={['gestor', 'admin']}>
                  <ScoringPage />
                </ProtectedRoute>
              } 
            />

            {/* Rutas protegidas - Solo admin */}
            <Route 
              path="/usuarios" 
              element={
                <ProtectedRoute rolesPermitidos={['admin']}>
                  <AdminPage />
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
