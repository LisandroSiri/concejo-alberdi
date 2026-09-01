import React, { useState, useEffect, useCallback } from 'react';

const BloquesSection = ({ api, userRole, showToast }) => {
  const [bloques, setBloques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form states
  const [bNombre, setBNombre] = useState('');
  const [bSigla, setBSigla] = useState('');
  const [bColor, setBColor] = useState('#6366f1');

  const loadBloques = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api('GET', '/bloques');
      setBloques(data || []);
    } catch (e) {
      showToast('Error al cargar bloques', 'error');
    } finally {
      setLoading(false);
    }
  }, [api, showToast]);

  useEffect(() => {
    loadBloques();
  }, [loadBloques]);

  const handleCrearBloque = async (e) => {
    e.preventDefault();
    const nombre = bNombre.trim();
    const sigla = bSigla.trim().toUpperCase();
    const colorHex = bColor;

    if (!nombre) {
      showToast('El nombre es obligatorio', 'error');
      return;
    }
    if (!sigla) {
      showToast('La sigla es obligatoria', 'error');
      return;
    }

    try {
      await api('POST', '/bloques', { nombre, sigla, colorHex });
      setIsCreateModalOpen(false);
      setBNombre('');
      setBSigla('');
      setBColor('#6366f1');
      showToast('✅ Bloque creado', 'success');
      loadBloques();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  const handleEliminarBloque = async (id) => {
    if (!window.confirm('¿Eliminar este bloque?')) return;
    try {
      await api('DELETE', `/bloques/${id}`);
      showToast('✅ Bloque eliminado', 'success');
      loadBloques();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  return (
    <div id="s-bloques" className="section active">
      <div className="page-header">
        <div>
          <div className="page-title">Bloques Políticos</div>
          <div className="page-subtitle">Agrupaciones del concejo</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setIsCreateModalOpen(true)}>
          ＋ Nuevo bloque
        </button>
      </div>

      <div className="table-card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Sigla</th>
                <th>Color</th>
                <th>Concejales</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colspan="5" style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '2rem' }}>
                    Cargando...
                  </td>
                </tr>
              ) : bloques.length ? (
                bloques.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <strong>{b.nombre}</strong>
                    </td>
                    <td>
                      <code style={{ background: 'var(--admin-surface)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                        {b.sigla}
                      </code>
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          width: '20px',
                          height: '20px',
                          borderRadius: '6px',
                          background: b.colorHex || '#666',
                          border: '1px solid var(--admin-border)',
                        }}
                      />
                    </td>
                    <td>{b.concejales?.length || 0}</td>
                    <td style={{ textAlign: 'right' }}>
                      {userRole === 'ADMIN' && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleEliminarBloque(b.id)}>
                          🗑
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colspan="5" style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '2rem' }}>
                    No hay bloques cargados
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
            <div className="modal-title">🏛️ Nuevo bloque</div>
            <form onSubmit={handleCrearBloque}>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  placeholder="Ej: Unión por Alberdi"
                  value={bNombre}
                  onChange={(e) => setBNombre(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Sigla</label>
                <input
                  type="text"
                  placeholder="UPA"
                  style={{ textTransform: 'uppercase' }}
                  value={bSigla}
                  onChange={(e) => setBSigla(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Color</label>
                <input
                  type="color"
                  value={bColor}
                  onChange={(e) => setBColor(e.target.value)}
                  style={{ height: '44px', padding: 0, border: 'none', background: 'transparent', cursor: 'pointer' }}
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

export default BloquesSection;
