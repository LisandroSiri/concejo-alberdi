import React, { useState, useEffect, useCallback } from 'react';

const TemasSection = ({ api, userRole, showToast }) => {
  const [temas, setTemas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [tNombre, setTNombre] = useState('');

  const loadTemas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api('GET', '/temas');
      setTemas(data || []);
    } catch (e) {
      showToast('Error al cargar temas', 'error');
    } finally {
      setLoading(false);
    }
  }, [api, showToast]);

  useEffect(() => {
    loadTemas();
  }, [loadTemas]);

  const handleCrearTema = async (e) => {
    e.preventDefault();
    const nombre = tNombre.trim();
    if (!nombre) {
      showToast('Ingresá un nombre', 'error');
      return;
    }
    try {
      await api('POST', '/temas', { nombre });
      setIsCreateModalOpen(false);
      setTNombre('');
      showToast('✅ Tema creado', 'success');
      loadTemas();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  const handleEliminarTema = async (id) => {
    if (!window.confirm('¿Eliminar este tema?')) return;
    try {
      await api('DELETE', `/temas/${id}`);
      showToast('✅ Tema eliminado', 'success');
      loadTemas();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  return (
    <div id="s-temas" className="section active">
      <div className="page-header">
        <div>
          <div className="page-title">Temas</div>
          <div className="page-subtitle">Clasificación temática de normas</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setIsCreateModalOpen(true)}>
          ＋ Nuevo tema
        </button>
      </div>

      <div className="table-card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    Cargando...
                  </td>
                </tr>
              ) : temas.length ? (
                temas.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <code style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 600 }}>
                        {t.id}
                      </code>
                    </td>
                    <td>{t.nombre}</td>
                    <td style={{ textAlign: 'right' }}>
                      {userRole === 'ADMIN' && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleEliminarTema(t.id)}>
                          🗑
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No hay temas cargados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isCreateModalOpen && (
        <div className="modal-backdrop open" onClick={(e) => e.target.classList.contains('modal-backdrop') && setIsCreateModalOpen(false)}>
          <div className="modal">
            <div className="modal-title">🏷️ Nuevo tema</div>
            <form onSubmit={handleCrearTema}>
              <div className="form-group">
                <label className="form-label">Nombre del tema</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej: Obras Públicas"
                  value={tNombre}
                  onChange={(e) => setTNombre(e.target.value)}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsCreateModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemasSection;
