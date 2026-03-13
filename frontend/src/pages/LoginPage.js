import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    usuario: '',
    contraseña: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.usuario.trim()) newErrors.usuario = 'Usuario es obligatorio';
    if (!formData.contraseña) newErrors.contraseña = 'Contraseña es obligatoria';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authService.login(formData.usuario, formData.contraseña);

      login(response.data.token, {
        clienteId: response.data.clienteId,
        nombre: response.data.nombre
      });

      navigate('/welcome', { state: { clienteName: response.data.nombre } });
    } catch (error) {
      setErrors({ general: error.response?.data?.error || 'Error al iniciar sesión' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h1>Inicia Sesión</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="usuario">Usuario</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleInputChange}
              placeholder="Tu usuario"
            />
            {errors.usuario && <span className="error">{errors.usuario}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contraseña">Contraseña</label>
            <input
              type="password"
              id="contraseña"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleInputChange}
              placeholder="••••••••"
            />
            {errors.contraseña && <span className="error">{errors.contraseña}</span>}
          </div>

          {errors.general && <div className="alert alert-error">{errors.general}</div>}

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="btn btn-secondary"
          >
            Volver
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
