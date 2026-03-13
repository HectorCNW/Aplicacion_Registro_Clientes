import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/WelcomePage.css';

const WelcomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const clienteName = location.state?.clienteName || user?.nombre || 'Cliente';
  const isNewRegistration = location.state?.isNewRegistration || false;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>¡Bienvenido {clienteName}!</h1>
        
        {isNewRegistration && (
          <>
            <p>Tu registro ha sido completado exitosamente.</p>
            <div className="welcome-info">
              <p>Tu cuenta ha sido creada y ya puedes acceder a nuestros servicios.</p>
            </div>
          </>
        )}

        <button onClick={handleLogout} className="btn btn-primary">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
