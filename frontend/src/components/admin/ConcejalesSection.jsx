import React, { useState, useEffect, useCallback } from 'react';

// Concejales ahora son Usuarios con rol=CONCEJAL.
// Se gestionan a través de /api/auth/usuarios filtrando por rol.

const ConcejalesSection = ({ api, userRole, badge, showToast }) => {
  const [concejales, setConcejales] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [loading, setLoading] = useState(false);

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [cNombre, setCNombre] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [cBloque, setCBloque] = useState('');

  const [resetModalConcejal, setResetModalConcejal] = useState(null);
  const [nuevaClave, setNuevaClave] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [usuariosList, bloquesList] = await Promise.all([
        api('GET', '/auth/usuarios'),
        api('GET', '/bloques'),
      ]);
      // Filtrar solo los que tienen rol CONCEJAL
      setConcejales((usuariosList || []).filter((u) => u.rol === 'CONCEJAL'));
      setBloques(bloquesList || []);
      if (bloquesList && bloquesList.length > 0) {
        setCBloque(bloquesList[0].id);
      }
    } catch (e) {
      showToast('Error al cargar datos de concejales', 'error');
    } finally {
      setLoading(false);
    }
  }, [api, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCrearConcejal = async (e) => {
    e.preventDefault();
    const nombre = cNombre.trim();
    const email = cEmail.trim();
    const idBloque = parseInt(cBloque);

    if (!nombre || !email || !cPassword) {
      showToast('Nombre, email y contraseña son obligatorios', 'error');
      return;
    }
    if (!idBloque) {
      showToast('Seleccioná un bloque', 'error');
      return;
    }

    try {
      await api('POST', '/auth/usuarios', {
        nombre,
        email,
        password: cPassword,
        rol: 'CONCEJAL',
        idBloque,
      });
      setIsCreateModalOpen(false);
      setCNombre('');
      setCEmail('');
      setCPassword('');
      showToast('✅ Concejal creado', 'success');
      loadData();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  const handleToggleConcejal = async (id, activo) => {
    try {
      await api('PATCH', `/auth/usuarios/${id}/toggle`);
      showToast(`✅ Concejal ${activo ? 'desactivado' : 'activado'}`, 'success');
      loadData();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!nuevaClave || nuevaClave.length < 4) {
      showToast('La contraseña debe tener al menos 4 caracteres', 'error');
      return;
    }
    try {
      await api('PATCH', `/auth/usuarios/${resetModalConcejal.id}/password`, { password: nuevaClave });
      showToast(` Contraseña de ${resetModalConcejal.nombre} actualizada`, 'success');
      setResetModalConcejal(null);
      setNuevaClave('');
    } catch (e) {
      showToast('Error al restablecer contraseña: ' + e.message, 'error');
    }
  };

  return (
    <div id="s-concejales" className="section active">
      <div className="page-header">
        <div>
          <div className="page-title">Concejales</div>
          <div className="page-subtitle">Legisladores activos del concejo</div>
        </div>
        {userRole === 'ADMIN' && (
          <button className="btn btn-primary btn-sm" onClick={() => setIsCreateModalOpen(true)}>
            ＋ Nuevo concejal
          </button>
        )}
      </div>

      <div className="table-card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Bloque</th>
                <th>Estado</th>
                {userRole === 'ADMIN' && <th style={{ textAlign: 'right' }}>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    Cargando...
                  </td>
                </tr>
              ) : concejales.length ? (
                concejales.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.nombre}</strong>
                    </td>
                    <td>{c.email || '—'}</td>
                    <td>{c.bloque?.nombre || '—'}</td>
                    <td>
                      <span dangerouslySetInnerHTML={{ __html: badge(c.activo ? 'activo' : 'inactivo', c.activo ? 'Activo' : 'Inactivo') }} />
                    </td>
                    {userRole === 'ADMIN' && (
                      <td style={{ textAlign: 'right', display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          title="Restablecer contraseña"
                          onClick={() => {
                            setResetModalConcejal(c);
                            setNuevaClave('');
                          }}
                        >
                           Reset Clave
                        </button>
                        <button
                          className={`btn btn-sm ${c.activo ? 'btn-secondary' : 'btn-primary'}`}
                          onClick={() => handleToggleConcejal(c.id, c.activo)}
                        >
                          {c.activo ? '⏸ Desactivar' : '▶ Activar'}
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No hay concejales cargados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL RESET PASSWORD */}
      {resetModalConcejal && (
        <div className="modal-backdrop open" onClick={(e) => e.target.classList.contains('modal-backdrop') && setResetModalConcejal(null)}>
          <div className="modal">
            <div className="modal-title"> Restablecer contraseña</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Estás asignando una nueva contraseña para el concejal <strong>{resetModalConcejal.nombre}</strong> ({resetModalConcejal.email}).
            </p>
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label className="form-label">Nueva contraseña</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Mínimo 4 caracteres"
                  value={nuevaClave}
                  onChange={(e) => setNuevaClave(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setResetModalConcejal(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar nueva contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCreateModalOpen && (
        <div className="modal-backdrop open" onClick={(e) => e.target.classList.contains('modal-backdrop') && setIsCreateModalOpen(false)}>
          <div className="modal">
            <div className="modal-title">👤 Nuevo concejal</div>
            <form onSubmit={handleCrearConcejal}>
              <div className="form-group">
                <label className="form-label">Nombre completo</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nombre Apellido"
                  value={cNombre}
                  onChange={(e) => setCNombre(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="concejal@concejo.gob.ar"
                  value={cEmail}
                  onChange={(e) => setCEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Contraseña inicial</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Contraseña"
                  value={cPassword}
                  onChange={(e) => setCPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Bloque</label>
                <select className="form-input" value={cBloque} onChange={(e) => setCBloque(e.target.value)} required>
                  {bloques.length ? (
                    bloques.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nombre}
                      </option>
                    ))
                  ) : (
                    <option value="">— Sin bloques —</option>
                  )}
                </select>
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

export default ConcejalesSection;
