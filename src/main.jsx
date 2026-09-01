import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Bioforce Medical App Error Boundary:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'sans-serif',
          background: '#06152b',
          color: '#ffffff',
          textAlign: 'center'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '2.5rem',
            maxWidth: '480px',
            color: '#0f172a',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ color: '#06152b', marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: '900' }}>
              BIOFORCE MEDICAL CENTER
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1.5rem', fontWeight: '500' }}>
              Se ha actualizado la versión de la plataforma. Presiona el botón a continuación para recargar la interfaz limpia.
            </p>
            <button
              onClick={this.handleReset}
              style={{
                background: 'linear-gradient(135deg, #00b865 0%, #0077ff 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '0.95rem 2rem',
                borderRadius: '12px',
                fontWeight: '800',
                fontSize: '0.95rem',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              🔄 Recargar e Iniciar Plataforma
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
