import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { usuario, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRolBadge = (rol) => {
    const badges = {
      'ciudadano': { emoji: '👤', color: '#3b82f6' },
      'gestor': { emoji: '👮', color: '#f59e0b' },
      'admin': { emoji: '🔧', color: '#ef4444' }
    };
    return badges[rol] || badges.ciudadano;
  };

  if (!isAuthenticated) return null;

  const badge = getRolBadge(usuario.rol);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <Link to="/dashboard">
            <span className="brand-icon">🚦</span>
            <span className="brand-text">ANTHEM SafeMove</span>
          </Link>
        </div>

        <div className="navbar-links">
          <Link 
            to="/dashboard" 
            className={location.pathname === '/dashboard' ? 'active' : ''}
          >
            📊 Dashboard
          </Link>
          
          {(usuario.rol === 'gestor' || usuario.rol === 'admin') && (
            <>
              <Link 
                to="/analisis" 
                className={location.pathname === '/analisis' ? 'active' : ''}
              >
                📈 Análisis
              </Link>
              <Link 
                to="/scoring" 
                className={location.pathname === '/scoring' ? 'active' : ''}
              >
                ⚠️ Scoring Riesgo
              </Link>
            </>
          )}

          {usuario.rol === 'admin' && (
            <Link 
              to="/usuarios" 
              className={location.pathname === '/usuarios' ? 'active' : ''}
            >
              👥 Usuarios
            </Link>
          )}
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <span 
              className="user-badge" 
              style={{ background: badge.color }}
            >
              {badge.emoji}
            </span>
            <div className="user-details">
              <span className="user-name">{usuario.nombre}</span>
              <span className="user-rol">{usuario.rol}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            🚪 Salir
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
