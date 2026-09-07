import React, { useState } from 'react';

const LoginOverlay = ({ api, onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@concejo.gob.ar');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Completá ambos campos');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const data = await api('POST', '/auth/login', { email, password });
      if (data && data.token) {
        onLoginSuccess(data.token);
      } else {
        throw new Error('No se recibió token del servidor');
      }
    } catch (e) {
      setError(e.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-overlay" className="modal-backdrop open">
      <div className="modal" style={{ maxWidth: '380px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>⚖</div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Panel Admin
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Concejo Deliberante de Alberdi
          </p>
        </div>

        {error && (
          <div className="toast toast-error" style={{ display: 'flex', marginBottom: '1rem', width: '100%', position: 'static' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@concejo.gob.ar"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1.25rem' }}>
          Credenciales por defecto: admin@concejo.gob.ar / admin123
        </p>
      </div>
    </div>
  );
};

export default LoginOverlay;
