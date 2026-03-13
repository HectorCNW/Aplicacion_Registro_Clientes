import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/InitialPage.css';

const InitialPage = () => {
  const navigate = useNavigate();

  return (
    <div className="initial-container">
      <div className="initial-content">
        <h1>Bienvenido</h1>
        <p>Selecciona una opción para continuar</p>
        
        <div className="button-group">
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            Ya soy cliente
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/register')}>
            Soy nuevo cliente
          </button>
        </div>
      </div>
    </div>
  );
};

export default InitialPage;
