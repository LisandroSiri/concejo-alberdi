import React, { useState, useEffect, useCallback } from 'react';

// Reemplaza SeguimientosSection. Ahora muestra el historial de estados de normas
// usando el endpoint /registros-estado.

const ESTADOS = ['PRESENTADA', 'VIGENTE', 'PARCIALMENTE_CUMPLIDA', 'CUMPLIDA', 'INCUMPLIDA', 'DEROGADA'];

const RegistrosEstadoSection = ({ api, userRole, badge, formatDate, truncate, showToast }) => {
  const [registros, setRegistros] = useState([]);
  const [normas, setNormas] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filtros
  const [filtroNorma, setFiltroNorma] = useState('');
  const [filtroPeriodo, setFiltroPeriodo] = useState('');

  // Modal nuevo registro
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rNorma, setRNorma] = useState('');
  const [rPeriodo, setRPeriodo] = useState('');
  const [rEstado, setREstado] = useState('PRESENTADA');
  const [rObservacion, setRObservacion] = useState('');
  const [rArea, setRArea] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtroNorma) params.append('normaId', filtroNorma);
      if (filtroPeriodo) params.append('periodoId', filtroPeriodo);

      const [registrosData, normasData, periodosData, areasData] = await Promise.all([
        api('GET', `/registros-estado?${params}`),
        api('GET', '/normas?limit=200'),
        api('GET', '/periodos'),
        api('GET', '/registros-estado/areas'),
      ]);
      setRegistros(registrosData || []);
      setNormas(normasData?.data || normasData || []);
      setPeriodos(periodosData || []);
      setAreas(areasData || []);
    } catch (e) {
      showToast('Error al cargar registros', 'error');
    } finally {
      setLoading(false);
    }
  }, [api, showToast, filtroNorma, filtroPeriodo]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCrearRegistro = async (e) => {
    e.preventDefault();
    try {
      await api('POST', '/registros-estado', {
        idNorma: parseInt(rNorma),
        idPeriodo: parseInt(rPeriodo),
        estado: rEstado,
        observacion: rObservacion || null,
        idArea: rArea ? parseInt(rArea) : null,
      });
      setIsModalOpen(false);
      setRNorma('');
      setRPeriodo('');
      setREstado('PRESENTADA');
      setRObservacion('');
      setRArea('');
      showToast('✅ Estado registrado', 'success');
      loadData();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este registro?')) return;
    try {
      await api('DELETE', `/registros-estado/${id}`);
      showToast('✅ Registro eliminado', 'success');
      loadData();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  return (
    <div id="s-seguimientos" className="section active">
      <div className="page-header">
        <div>
          <div className="page-title">Historial de Estados</div>
          <div className="page-subtitle">Seguimiento histórico del estado de cada norma</div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={loadData} disabled={loading}>
            🔄 {loading ? 'Cargando...' : 'Actualizar'}
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>
            ＋ Registrar estado
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <select
          value={filtroNorma}
          onChange={(e) => setFiltroNorma(e.target.value)}
          style={{ flex: 1 }}
        >
          <option value="">— Todas las normas —</option>
          {normas.map((n) => (
            <option key={n.id} value={n.id}>{n.codigoNorma} · {n.titulo?.slice(0, 40)}</option>
          ))}
        </select>
        <select
          value={filtroPeriodo}
          onChange={(e) => setFiltroPeriodo(e.target.value)}
          style={{ flex: 1 }}
        >
          <option value="">— Todos los períodos —</option>
          {periodos.map((p) => (
            <option key={p.id} value={p.id}>{p.anio}-{p.numeroPeriodo}</option>
          ))}
        </select>
      </div>

      <div className="table-card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Norma</th>
                <th>Período</th>
                <th>Estado</th>
                <th>Área</th>
                <th>Fecha</th>
                <th>Observación</th>
                {userRole === 'ADMIN' && <th style={{ textAlign: 'right' }}>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '2rem' }}>
                    Cargando...
                  </td>
                </tr>
              ) : registros.length ? (
                registros.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <code style={{ background: 'var(--admin-surface)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                        {r.norma?.codigoNorma || '—'}
                      </code>
                      <div style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', marginTop: '0.15rem' }}>
                        {truncate(r.norma?.titulo || '', 35)}
                      </div>
                    </td>
                    <td>{r.periodo ? `${r.periodo.anio}-${r.periodo.numeroPeriodo}` : '—'}</td>
                    <td>
                      <span dangerouslySetInnerHTML={{ __html: badge(r.estado, r.estado) }} />
                    </td>
                    <td>{r.area?.nombre || '—'}</td>
                    <td>{formatDate(r.creadoEn)}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                      {truncate(r.observacion || '—', 30)}
                    </td>
                    {userRole === 'ADMIN' && (
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(r.id)}>
                          🗑
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '2rem' }}>
                    No hay registros de estado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop open" onClick={(e) => e.target.classList.contains('modal-backdrop') && setIsModalOpen(false)}>
          <div className="modal">
            <div className="modal-title">📋 Registrar cambio de estado</div>
            <form onSubmit={handleCrearRegistro}>
              <div className="form-group">
                <label>Norma</label>
                <select value={rNorma} onChange={(e) => setRNorma(e.target.value)} required>
                  <option value="">— Seleccionar norma —</option>
                  {normas.map((n) => (
                    <option key={n.id} value={n.id}>{n.codigoNorma} · {n.titulo?.slice(0, 50)}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Período</label>
                <select value={rPeriodo} onChange={(e) => setRPeriodo(e.target.value)} required>
                  <option value="">— Seleccionar período —</option>
                  {periodos.map((p) => (
                    <option key={p.id} value={p.id}>{p.anio}-{p.numeroPeriodo}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select value={rEstado} onChange={(e) => setREstado(e.target.value)} required>
                  {ESTADOS.map((est) => (
                    <option key={est} value={est}>{est.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Área responsable (opcional)</label>
                <select value={rArea} onChange={(e) => setRArea(e.target.value)}>
                  <option value="">— Sin área —</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>{a.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Observación (opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: Aprobada en sesión ordinaria"
                  value={rObservacion}
                  onChange={(e) => setRObservacion(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrosEstadoSection;
