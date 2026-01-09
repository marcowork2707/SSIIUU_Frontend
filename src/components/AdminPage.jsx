import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminPage.css';

function AdminPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'ciudadano'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useAuth();

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const response = await fetch(`${API_URL}/usuarios`, { headers });
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const url = editingUser 
        ? `${API_URL}/usuarios/${editingUser._id}`
        : `${API_URL}/usuarios`;
      
      const method = editingUser ? 'PUT' : 'POST';

      const body = editingUser && !formData.password
        ? { nombre: formData.nombre, email: formData.email, rol: formData.rol }
        : formData;

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar usuario');
      }

      setSuccess(editingUser ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');
      setShowModal(false);
      setEditingUser(null);
      setFormData({ nombre: '', email: '', password: '', rol: 'ciudadano' });
      fetchUsuarios();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (usuario) => {
    setEditingUser(usuario);
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      password: '',
      rol: usuario.rol
    });
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'DELETE',
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar usuario');
      }

      setSuccess('Usuario eliminado correctamente');
      fetchUsuarios();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleNewUser = () => {
    setEditingUser(null);
    setFormData({ nombre: '', email: '', password: '', rol: 'ciudadano' });
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const getRolBadgeColor = (rol) => {
    switch (rol) {
      case 'admin': return '#dc2626';
      case 'gestor': return '#ea580c';
      case 'ciudadano': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>👥 Gestión de Usuarios</h1>
        <button className="btn-new-user" onClick={handleNewUser}>
          ➕ Nuevo Usuario
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="users-table-card">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario._id}>
                <td className="user-name">{usuario.nombre}</td>
                <td>{usuario.email}</td>
                <td>
                  <span 
                    className="rol-badge" 
                    style={{ backgroundColor: getRolBadgeColor(usuario.rol) }}
                  >
                    {usuario.rol}
                  </span>
                </td>
                <td>{new Date(usuario.createdAt).toLocaleDateString('es-ES')}</td>
                <td className="actions-cell">
                  <button 
                    className="btn-edit" 
                    onClick={() => handleEdit(usuario)}
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    className="btn-delete" 
                    onClick={() => handleDelete(usuario._id)}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Crear/Editar Usuario */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contraseña {editingUser && '(dejar vacío para no cambiar)'}:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!editingUser}
                />
              </div>
              <div className="form-group">
                <label>Rol:</label>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleInputChange}
                  required
                >
                  <option value="ciudadano">Ciudadano</option>
                  <option value="gestor">Gestor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">
                  {editingUser ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
