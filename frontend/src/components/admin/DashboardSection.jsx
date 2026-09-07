import React, { useState, useEffect, useCallback } from 'react';

const DashboardSection = ({ api, userRole, badge, formatDate, truncate, showToast }) => {
  const [stats, setStats] = useState({
    totalNormas: '—',
    totalConcejales: '—',
    totalTemas: '—',
    totalBloques: '—',
  });
  const [latestNormas, setLatestNormas] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      if (userRole === 'ADMIN') {
        const data = await api('GET', '/admin/stats');
        setStats({
          totalNormas: data.totalNormas ?? '—',
          totalConcejales: data.totalConcejales ?? '—',
          totalTemas: data.totalTemas ?? '—',
          totalBloques: data.totalBloques ?? '—',
        });
        setLatestNormas(data.ultimasNormas || []);
      } else {
        // OPERADOR has no access to stats endpoint. Let's fetch public list of normas
        const data = await api('GET', '/normas');
        const normas = data.data || data || [];
        setLatestNormas(normas.slice(0, 5));
      }
    } catch (e) {
      console.error(e);
      showToast('Error al cargar dashboard', 'error');
    } finally {
      setLoading(false);
    }
  }, [api, userRole, showToast]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <div id="s-dashboard" className="section active">
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">
            {userRole === 'ADMIN' ? 'Resumen general del sistema' : 'Resumen para Operadores'}
          </div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={loadDashboard} disabled={loading}>
          🔄 {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      {userRole === 'ADMIN' ? (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="label">Total Normas</div>
            <div className="value">{stats.totalNormas}</div>
          </div>
          <div className="stat-card">
            <div className="label">Concejales Activos</div>
            <div className="value">{stats.totalConcejales}</div>
          </div>
          <div className="stat-card">
            <div className="label">Temas</div>
            <div className="value">{stats.totalTemas}</div>
          </div>
          <div className="stat-card">
            <div className="label">Bloques</div>
            <div className="value">{stats.totalBloques}</div>
          </div>
        </div>
      ) : (
        <div className="stat-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
          <div className="label" style={{ color: 'var(--warning)' }}>Modo Operador</div>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Tenés acceso de lectura y escritura para la gestión de normas, concejales y catálogos. 
            El panel de estadísticas globales requiere privilegios de Administrador.
          </p>
        </div>
      )}

      <div className="table-card">
        <div className="table-card-header">
          <h3>📄 Últimas normas cargadas</h3>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Tipo</th>
                <th>Título</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    Cargando...
                  </td>
                </tr>
              ) : latestNormas.length ? (
                latestNormas.map((n) => (
                  <tr key={n.id || n.codigoNorma}>
                    <td>
                      <code style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 600 }}>
                        {n.codigoNorma || '—'}
                      </code>
                    </td>
                    <td>
                      <span dangerouslySetInnerHTML={{ __html: badge(n.tipo, n.tipo) }} />
                    </td>
                    <td className="truncate" title={n.titulo || ''}>
                      {truncate(n.titulo, 50)}
                    </td>
                    <td>{formatDate(n.fechaSancion)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No hay normas cargadas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
