import React, { useState, useEffect, useCallback } from 'react';

// CatalogosSection: gestiona Períodos y Áreas del Ejecutivo.
// Los estados ya no son una tabla: son el enum EstadoNorma definido en el schema.

const CatalogosSection = ({ api, badge, showToast }) => {
  const [periodos, setPeriodos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);

  const [activeModal, setActiveModal] = useState(null); // 'periodo' | 'area' | 'generar' | null

  // Periodo Form
  const [pAnio, setPAnio] = useState(new Date().getFullYear());
  const [pNum, setPNum] = useState(1);
  const [pInicio, setPInicio] = useState('');
  const [pFin, setPFin] = useState('');

  // Generar períodos automáticos
  const [gAnio, setGAnio] = useState(new Date().getFullYear());

  // Area Form
  const [aNombre, setANombre] = useState('');

  const loadCatalogos = useCallback(async () => {
    setLoading(true);
    try {
      const [periodosData, areasData] = await Promise.all([
        api('GET', '/periodos'),
        api('GET', '/registros-estado/areas'),
      ]);
      setPeriodos(periodosData || []);
      setAreas(areasData || []);
    } catch (e) {
      showToast('Error al cargar catálogos', 'error');
    } finally {
      setLoading(false);
    }
  }, [api, showToast]);

  useEffect(() => {
    loadCatalogos();
  }, [loadCatalogos]);

  const handleCrearPeriodo = async (e) => {
    e.preventDefault();
    try {
      await api('POST', '/periodos', {
        anio: parseInt(pAnio),
        numeroPeriodo: parseInt(pNum),
        fechaInicio: pInicio,
        fechaFin: pFin,
      });
      setActiveModal(null);
      setPAnio(new Date().getFullYear());
      setPNum(1);
      setPInicio('');
      setPFin('');
      showToast('✅ Período creado', 'success');
      loadCatalogos();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  const handleGenerarPeriodos = async (e) => {
    e.preventDefault();
    try {
      await api('POST', `/periodos/generar/${gAnio}`);
      setActiveModal(null);
      showToast(`✅ Períodos ${gAnio}-1 y ${gAnio}-2 creados`, 'success');
      loadCatalogos();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  const handleCrearArea = async (e) => {
    e.preventDefault();
    const nombre = aNombre.trim();
    if (!nombre) {
      showToast('Ingresá un nombre', 'error');
      return;
    }
    try {
      await api('POST', '/registros-estado/areas', { nombre });
      setActiveModal(null);
      setANombre('');
      showToast('✅ Área creada', 'success');
      loadCatalogos();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  return (
    <div id="s-catalogos" className="section active">
      <div className="page-header">
        <div>
          <div className="page-title">Catálogos</div>
          <div className="page-subtitle">Configuración de períodos y áreas</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>

        {/* PERIODOS */}
        <div className="table-card">
          <div className="table-card-header">
            <h3>📅 Períodos</h3>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveModal('generar')} title="Generar 2 períodos automáticos para un año">
                ⚡ Auto
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveModal('periodo')}>
                +
              </button>
            </div>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Año</th>
                  <th>N°</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>
                      ...
                    </td>
                  </tr>
                ) : periodos.length ? (
                  periodos.map((p) => (
                    <tr key={`${p.anio}-${p.numeroPeriodo}`}>
                      <td>{p.anio}</td>
                      <td>{p.numeroPeriodo}</td>
                      <td style={{ fontSize: '0.85rem' }}>{p.fechaInicio ? new Date(p.fechaInicio).toLocaleDateString('es-AR') : '—'}</td>
                      <td style={{ fontSize: '0.85rem' }}>{p.fechaFin ? new Date(p.fechaFin).toLocaleDateString('es-AR') : '—'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>
                      —
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AREAS */}
        <div className="table-card">
          <div className="table-card-header">
            <h3>🏢 Áreas del Ejecutivo</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveModal('area')}>
              +
            </button>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="2" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>
                      ...
                    </td>
                  </tr>
                ) : areas.length ? (
                  areas.map((a) => (
                    <tr key={a.id}>
                      <td>{a.id}</td>
                      <td>{a.nombre}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>
                      —
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ESTADOS (informativo — son un enum fijo) */}
        <div className="table-card">
          <div className="table-card-header">
            <h3>📌 Estados posibles</h3>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr><th>Estado</th></tr>
              </thead>
              <tbody>
                {['PRESENTADA', 'VIGENTE', 'PARCIALMENTE_CUMPLIDA', 'CUMPLIDA', 'INCUMPLIDA', 'DEROGADA'].map((est) => (
                  <tr key={est}>
                    <td><span dangerouslySetInnerHTML={{ __html: badge(est, est.replace(/_/g, ' ')) }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL: Generar períodos automáticos */}
      {activeModal === 'generar' && (
        <div className="modal-backdrop open" onClick={(e) => e.target.classList.contains('modal-backdrop') && setActiveModal(null)}>
          <div className="modal">
            <div className="modal-title">⚡ Generar períodos del año</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Crea automáticamente los dos períodos del año: 1 (ene–jun) y 2 (jul–dic).
            </p>
            <form onSubmit={handleGenerarPeriodos}>
              <div className="form-group">
                <label className="form-label">Año</label>
                <input className="form-input" type="number" value={gAnio} onChange={(e) => setGAnio(e.target.value)} required min="2000" max="2100" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Generar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Nuevo período manual */}
      {activeModal === 'periodo' && (
        <div className="modal-backdrop open" onClick={(e) => e.target.classList.contains('modal-backdrop') && setActiveModal(null)}>
          <div className="modal">
            <div className="modal-title">📅 Nuevo período</div>
            <form onSubmit={handleCrearPeriodo}>
              <div className="modal-grid">
                <div className="form-group">
                  <label className="form-label">Año</label>
                  <input className="form-input" type="number" value={pAnio} onChange={(e) => setPAnio(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">N° período</label>
                  <input className="form-input" type="number" value={pNum} onChange={(e) => setPNum(e.target.value)} required min="1" max="2" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Fecha inicio</label>
                <input className="form-input" type="date" value={pInicio} onChange={(e) => setPInicio(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Fecha fin</label>
                <input className="form-input" type="date" value={pFin} onChange={(e) => setPFin(e.target.value)} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Nueva área */}
      {activeModal === 'area' && (
        <div className="modal-backdrop open" onClick={(e) => e.target.classList.contains('modal-backdrop') && setActiveModal(null)}>
          <div className="modal">
            <div className="modal-title">🏢 Nueva área</div>
            <form onSubmit={handleCrearArea}>
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej: Secretaría de Obras"
                  value={aNombre}
                  onChange={(e) => setANombre(e.target.value)}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogosSection;
