import React, { useState, useEffect, useCallback } from 'react';

const UsuariosSection = ({ api, userRole, badge, showToast }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form states
  const [uNombre, setUNombre] = useState('');
  const [uEmail, setUEmail] = useState('');
  const [uPass, setUPass] = useState('');
  const [uRol, setURol] = useState('OPERADOR');
  const [uBlo, setUBlo] = useState('');

  const loadUsuarios = useCallback(async () => {
    if (userRole !== 'ADMIN') return;
    setLoading(true);
    try {
      const [usuariosData, bloquesData] = await Promise.all([
        api('GET', '/auth/usuarios'),
        api('GET', '/bloques'),
      ]);
      setUsuarios(usuariosData || []);
      setBloques(bloquesData || []);
    } catch (e) {
      showToast('Error al cargar usuarios', 'error');
    } finally {
      setLoading(false);
    }
  }, [api, userRole, showToast]);

  useEffect(() => {
    loadUsuarios();
  }, [loadUsuarios]);

  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    const nombre = uNombre.trim();
    const email = uEmail.trim();
    const password = uPass;
    const rol = uRol;
    const idBloque = rol === 'CONCEJAL' && uBlo ? parseInt(uBlo) : undefined;

    if (!nombre || !email || !password) {
      showToast('Todos los campos son obligatorios', 'error');
      return;
    }
    if (rol === 'CONCEJAL' && !idBloque) {
      showToast('Seleccioná un bloque para el concejal', 'error');
      return;
    }

    try {
      await api('POST', '/auth/usuarios', { nombre, email, password, rol, idBloque });
      setIsCreateModalOpen(false);
      setUNombre('');
      setUEmail('');
      setUPass('');
      setURol('OPERADOR');
      setUBlo('');
      showToast('✅ Usuario creado', 'success');
      loadUsuarios();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  const handleToggleUsuario = async (id) => {
    try {
      await api('PATCH', `/auth/usuarios/${id}/toggle`);
      showToast('✅ Estado actualizado', 'success');
      loadUsuarios();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  if (userRole !== 'ADMIN') {
    return (
      <div className="section active">
        <div className="page-header">
          <div className="page-title">Acceso Denegado</div>
        </div>
        <div className="stat-card" style={{ padding: '2rem', borderLeft: '4px solid var(--danger)' }}>
          <p>No tenés los permisos necesarios para gestionar usuarios. Esta sección requiere el rol ADMIN.</p>
        </div>
      </div>
    );
  }

  return (
    <div id="s-usuarios" className="section active">
      <div className="page-header">
        <div>
          <div className="page-title">Usuarios</div>
          <div className="page-subtitle">Gestión de acceso al sistema</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setIsCreateModalOpen(true)}>
          ＋ Nuevo usuario
        </button>
      </div>

      <div className="table-card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    Cargando...
                  </td>
                </tr>
              ) : usuarios.length ? (
                usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <strong>{u.nombre}</strong>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span dangerouslySetInnerHTML={{ __html: badge(u.rol, u.rol) }} />
                    </td>
                    <td>
                      <span dangerouslySetInnerHTML={{ __html: badge(u.activo ? 'activo' : 'inactivo', u.activo ? 'Activo' : 'Inactivo') }} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleToggleUsuario(u.id)}>
                        {u.activo ? '⏸ Desactivar' : '▶ Activar'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No hay usuarios
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
            <div className="modal-title">🔐 Nuevo usuario</div>
            <form onSubmit={handleCrearUsuario}>
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nombre"
                  value={uNombre}
                  onChange={(e) => setUNombre(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="usuario@concejo.gob.ar"
                  value={uEmail}
                  onChange={(e) => setUEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={uPass}
                  onChange={(e) => setUPass(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Rol</label>
                <select className="form-input" value={uRol} onChange={(e) => setURol(e.target.value)} required>
                  <option value="OPERADOR">Operador</option>
                  <option value="CONCEJAL">Concejal</option>
                  <option value="ADMIN">Administrador</option>
                </select>
                {uRol === 'CONCEJAL' && (
                  <select className="form-input" style={{ marginTop: '0.5rem' }} value={uBlo} onChange={(e) => setUBlo(e.target.value)} required>
                    <option value="">— Seleccionar bloque —</option>
                    {bloques.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nombre}
                      </option>
                    ))}
                  </select>
                )}
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

export default UsuariosSection;
