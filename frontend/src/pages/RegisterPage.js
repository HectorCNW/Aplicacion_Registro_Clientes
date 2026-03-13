import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import AppleSignin from 'react-apple-signin-auth';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import '../styles/RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [registrationMethod, setRegistrationMethod] = useState('manual');
  const [step, setStep] = useState('form'); // method, form, complete
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    usuario: '',
    contraseña: '',
    confirmarContraseña: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleMethodSelect = (method) => {
    setRegistrationMethod(method);
    if (method === 'google') {
      // OAuth Google
      setStep('complete');
    } else if (method === 'manual') {
      setStep('form');
    }
  };

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

    if (!formData.dni.trim()) newErrors.dni = 'DNI es obligatorio';
    if (!formData.nombre.trim()) newErrors.nombre = 'Nombre es obligatorio';
    if (!formData.apellidos.trim()) newErrors.apellidos = 'Apellidos son obligatorios';
    if (!formData.telefono.trim()) newErrors.telefono = 'Teléfono es obligatorio';

    if (registrationMethod === 'manual') {
      if (!formData.usuario.trim()) newErrors.usuario = 'Usuario es obligatorio';
      if (!formData.contraseña) newErrors.contraseña = 'Contraseña es obligatoria';
      if (formData.contraseña !== formData.confirmarContraseña) {
        newErrors.confirmarContraseña = 'Las contraseñas no coinciden';
      }
    }

    if (registrationMethod === 'google' || registrationMethod === 'facebook') {
      if (!formData.email.trim()) newErrors.email = 'Email es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      let response;

      if (registrationMethod === 'manual') {
        // Registro manual tradicional
        response = await authService.register({
          ...formData,
          metodo: registrationMethod
        });
      } else if (registrationMethod === 'google') {
        // Registro Google OAuth
        response = await authService.googleOAuth({
          dni: formData.dni,
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          email: formData.email,
          telefono: formData.telefono
        });
      } else if (registrationMethod === 'facebook') {
        // Registro Facebook OAuth
        response = await authService.register({
          dni: formData.dni,
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          email: formData.email,
          telefono: formData.telefono,
          metodo: registrationMethod
        });
      }

      login(response.data.token, {
        clienteId: response.data.clienteId,
        nombre: formData.nombre
      });

      navigate('/welcome', { state: { clienteName: formData.nombre, isNewRegistration: true } });
    } catch (error) {
      setErrors({ general: error.response?.data?.error || 'Error al registrar' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await authService.verifyGoogleToken(credentialResponse.credential);
      
      login(response.data.token, {
        clienteId: response.data.clienteId,
        nombre: response.data.nombre
      });

      navigate('/welcome', { state: { clienteName: response.data.nombre, isNewRegistration: response.data.isNewUser } });
    } catch (error) {
      setErrors({ general: error.response?.data?.error || 'Error al registrarse con Google' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrors({ general: 'Error al conectar con Google' });
  };

  const handleAppleSuccess = async (response) => {
    setLoading(true);
    try {
      const res = await authService.verifyAppleToken(response.authorization.id_token);
      login(res.data.token, { clienteId: res.data.clienteId, nombre: res.data.nombre });
      navigate('/welcome', { state: { clienteName: res.data.nombre, isNewRegistration: res.data.isNewUser } });
    } catch (error) {
      setErrors({ general: error.response?.data?.error || 'Error al registrarse con Apple' });
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSuccess = async (response) => {
    setLoading(true);
    try {
      const res = await authService.verifyFacebookToken(response.accessToken, response.userID);
      login(res.data.token, { clienteId: res.data.clienteId, nombre: res.data.nombre });
      navigate('/welcome', { state: { clienteName: res.data.nombre, isNewRegistration: res.data.isNewUser } });
    } catch (error) {
      setErrors({ general: error.response?.data?.error || 'Error al registrarse con Facebook' });
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookError = () => {
    setErrors({ general: 'Error al conectar con Facebook' });
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <h1>Registro de Nuevo Cliente</h1>

        {step === 'method' && (
          <div className="method-selection">
            <p>Elige tu método de registro:</p>
            <div className="method-buttons">
              <button 
                className="method-btn"
                onClick={() => handleMethodSelect('manual')}
              >
                Registro Manual
              </button>
              <button 
                className="method-btn"
                onClick={() => handleMethodSelect('google')}
              >
                Google
              </button>
            </div>
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="dni">DNI *</label>
              <input
                type="text"
                id="dni"
                name="dni"
                value={formData.dni}
                onChange={handleInputChange}
                placeholder="12345678A"
              />
              {errors.dni && <span className="error">{errors.dni}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Juan"
              />
              {errors.nombre && <span className="error">{errors.nombre}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="apellidos">Apellidos *</label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleInputChange}
                placeholder="García López"
              />
              {errors.apellidos && <span className="error">{errors.apellidos}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="telefono">Teléfono *</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="600123456"
              />
              {errors.telefono && <span className="error">{errors.telefono}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="usuario">Usuario *</label>
              <input
                type="text"
                id="usuario"
                name="usuario"
                value={formData.usuario}
                onChange={handleInputChange}
                placeholder="jgarcia"
              />
              {errors.usuario && <span className="error">{errors.usuario}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="contraseña">Contraseña *</label>
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

            <div className="form-group">
              <label htmlFor="confirmarContraseña">Confirmar Contraseña *</label>
              <input
                type="password"
                id="confirmarContraseña"
                name="confirmarContraseña"
                value={formData.confirmarContraseña}
                onChange={handleInputChange}
                placeholder="••••••••"
              />
              {errors.confirmarContraseña && <span className="error">{errors.confirmarContraseña}</span>}
            </div>

            {errors.general && <div className="alert alert-error">{errors.general}</div>}

            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>

            <div className="divider-text">O continúa con</div>

            <div className="oauth-buttons">
              <div className="google-login-container">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  width="100%"
                />
              </div>

              <div className="apple-login-container">
                <AppleSignin
                  authOptions={{
                    clientId: 'com.example.app', // Placeholder
                    scope: 'email name',
                    redirectURI: 'http://localhost:3000',
                    state: 'state',
                    nonce: 'nonce',
                    usePopup: true,
                  }}
                  onSuccess={handleAppleSuccess}
                  onError={(error) => setErrors({ general: 'Error al conectar con Apple' })}
                  render={(props) => (
                    <button className="btn btn-apple" style={{
                      width: '100%',
                      padding: '12px 24px',
                      backgroundColor: '#fff',
                      color: '#3c4043',
                      border: '1px solid #dadce0',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '500',
                      fontFamily: "'Roboto', sans-serif",
                      letterSpacing: '0.25px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '40px',
                      textDecoration: 'none',
                      boxShadow: 'none',
                      margin: 0
                    }} onClick={props.onClick}>
                      <svg viewBox="0 0 24 24" width="18" height="18" style={{marginRight: '12px'}}>
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="#000"/>
                      </svg>
                      Registrate con Apple
                    </button>
                  )}
                />
              </div>

              <div className="facebook-login-container">
                <FacebookLogin
                  appId="1234567890123456"
                  autoLoad={false}
                  fields="name,email,picture,id"
                  callback={handleFacebookSuccess}
                  onFailure={handleFacebookError}
                  render={(renderProps) => (
                    <button 
                      style={{
                        width: '100%',
                        padding: '12px 24px',
                        backgroundColor: '#fff',
                        color: '#3c4043',
                        border: '1px solid #dadce0',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: '500',
                        fontFamily: "'Roboto', sans-serif",
                        letterSpacing: '0.25px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '40px',
                        textDecoration: 'none',
                        boxShadow: 'none',
                        margin: 0,
                        opacity: loading ? 0.6 : 1
                      }}
                      onClick={renderProps.onClick}
                      disabled={loading}
                      onMouseEnter={(e) => {
                        if (!loading) {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fff';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" style={{marginRight: '12px'}}>
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877f2"/>
                      </svg>
                      Registrate con Facebook
                    </button>
                  )}
                />
              </div>
            </div>

            <button 
              type="button" 
              onClick={() => navigate('/')}
              className="btn btn-secondary"
            >
              Volver al Inicio
            </button>
          </form>
        )}

        {step === 'complete' && (
          <div className="complete-data">
            <p>Por favor, completa tus datos para registrarte con {registrationMethod.charAt(0).toUpperCase() + registrationMethod.slice(1)}:</p>
            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-group">
                <label htmlFor="dni">DNI *</label>
                <input
                  type="text"
                  id="dni"
                  name="dni"
                  value={formData.dni}
                  onChange={handleInputChange}
                  placeholder="12345678A"
                />
                {errors.dni && <span className="error">{errors.dni}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="nombre">Nombre *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Juan"
                />
                {errors.nombre && <span className="error">{errors.nombre}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="apellidos">Apellidos *</label>
                <input
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleInputChange}
                  placeholder="García López"
                />
                {errors.apellidos && <span className="error">{errors.apellidos}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Teléfono *</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="600123456"
                />
                {errors.telefono && <span className="error">{errors.telefono}</span>}
              </div>

              {errors.general && <div className="alert alert-error">{errors.general}</div>}

              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Completando...' : 'Completar Registro'}
              </button>

              <button 
                type="button" 
                onClick={() => setStep('method')}
                className="btn btn-secondary"
              >
                Volver
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
