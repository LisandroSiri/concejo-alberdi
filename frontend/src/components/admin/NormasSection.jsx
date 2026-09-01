import React, { useState, useEffect, useCallback } from 'react';

const NormasSection = ({ api, userRole, badge, showToast }) => {
  const [normas, setNormas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter States
  const [fTipo, setFTipo] = useState('');
  const [fAno, setFAno] = useState('');
  const [fVigente, setFVigente] = useState('');

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [nTipo, setNTipo] = useState('ORDENANZA');
  const [nOrigen, setNOrigen] = useState('CONCEJO');
  const [nNumero, setNNumero] = useState('');
  const [nAno, setNAno] = useState(new Date().getFullYear());
  const [nTitulo, setNTitulo] = useState('');
  const [nFecha, setNFecha] = useState('');

  // PDF Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfNormaId, setPdfNormaId] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFilename, setPdfFilename] = useState('');

  const loadNormas = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (fTipo) params.set('tipo', fTipo);
    if (fAno) params.set('año', fAno);
    if (fVigente !== '') params.set('vigente', fVigente);

    try {
      const data = await api('GET', `/normas?${params}`);
      const list = data.data || data || [];
      setNormas(list);
    } catch (e) {
      showToast('Error al cargar normas: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [api, fTipo, fAno, fVigente, showToast]);

  useEffect(() => {
    loadNormas();
  }, [loadNormas]);

  const resetFilters = () => {
    setFTipo('');
    setFAno('');
    setFVigente('');
  };

  const handleCrearNorma = async (e) => {
    e.preventDefault();
    try {
      const data = {
        tipo: nTipo,
        origen: nOrigen,
        numero: parseInt(nNumero),
        año: parseInt(nAno),
        titulo: nTitulo.trim(),
        fechaSancion: nFecha,
      };

      if (!data.titulo) throw new Error('El título es obligatorio');
      if (!data.numero) throw new Error('El número es obligatorio');
      if (!data.fechaSancion) throw new Error('La fecha es obligatoria');

      await api('POST', '/normas', data);
      setIsCreateModalOpen(false);
      showToast('✅ Norma creada correctamente', 'success');
      
      // Reset form
      setNNumero('');
      setNTitulo('');
      setNFecha('');
      
      loadNormas();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  const handleEliminarNorma = async (id) => {
    if (!window.confirm('¿Eliminar esta norma permanentemente?')) return;
    try {
      await api('DELETE', `/normas/${id}`);
      showToast('✅ Norma eliminada', 'success');
      loadNormas();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  const openPdfModal = (id) => {
    setPdfNormaId(id);
    setPdfFile(null);
    setPdfFilename('');
    setIsPdfModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
      setPdfFilename(`📎 ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    } else {
      setPdfFile(null);
      setPdfFilename('');
    }
  };

  const handleSubirPdf = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      showToast('Seleccioná un archivo PDF', 'error');
      return;
    }
    if (pdfFile.type !== 'application/pdf') {
      showToast('Solo se admiten archivos PDF', 'error');
      return;
    }

    const fd = new FormData();
    fd.append('pdf', pdfFile);
    try {
      await api('POST', `/normas/${pdfNormaId}/pdf`, fd, true);
      setIsPdfModalOpen(false);
      showToast('✅ PDF subido correctamente', 'success');
      loadNormas();
    } catch (e) {
      showToast('Error: ' + e.message, 'error');
    }
  };

  return (
    <div id="s-normas" className="section active">
      <div className="page-header">
        <div>
          <div className="page-title">Normas</div>
          <div className="page-subtitle">Gestión del digesto municipal</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setIsCreateModalOpen(true)}>
          ＋ Nueva norma
        </button>
      </div>

      <div className="filters-bar" id="normas-filters">
        <select value={fTipo} onChange={(e) => setFTipo(e.target.value)}>
          <option value="">Todos</option>
          <option value="ORDENANZA">ORDENANZA</option>
          <option value="DECRETO">DECRETO</option>
          <option value="RESOLUCION">RESOLUCION</option>
          <option value="COMUNICACION">COMUNICACION</option>
        </select>
        <input
          type="number"
          placeholder="Año"
          style={{ width: '90px' }}
          value={fAno}
          onChange={(e) => setFAno(e.target.value)}
        />
        <select value={fVigente} onChange={(e) => setFVigente(e.target.value)}>
          <option value="">Vigencia</option>
          <option value="true">Vigente</option>
          <option value="false">No vigente</option>
        </select>
        <button className="btn btn-secondary btn-sm" onClick={loadNormas}>
          🔍 Buscar
        </button>
        <button className="btn btn-secondary btn-sm" onClick={resetFilters}>
          ↺ Limpiar
        </button>
      </div>

      <div className="table-card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Tipo</th>
                <th>Año</th>
                <th>Título</th>
                <th>Vigente</th>
                <th>PDF</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colspan="7" style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '2rem' }}>
                    Cargando...
                  </td>
                </tr>
              ) : normas.length ? (
                normas.map((n) => (
                  <tr key={n.id}>
                    <td>
                      <code style={{ background: 'var(--admin-surface)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                        {n.codigoNorma || '—'}
                      </code>
                    </td>
                    <td>
                      <span dangerouslySetInnerHTML={{ __html: badge(n.tipo, n.tipo) }} />
                    </td>
                    <td>{n.año || '—'}</td>
                    <td className="truncate" title={n.titulo || ''}>
                      {n.titulo}
                    </td>
                    <td>
                      <span dangerouslySetInnerHTML={{ __html: badge(String(n.vigente), n.vigente ? 'Vigente' : 'No vigente') }} />
                    </td>
                    <td>
                      {n.rutaPdf ? (
                        <a href={n.rutaPdf} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--admin-accent-light)', textDecoration: 'none' }}>
                          📄 Ver
                        </a>
                      ) : (
                        <button className="btn btn-secondary btn-sm" onClick={() => openPdfModal(n.id)}>
                          Subir
                        </button>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {userRole === 'ADMIN' && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleEliminarNorma(n.id)}>
                          🗑
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colspan="7" style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '2rem' }}>
                    No hay normas que coincidan con los filtros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <div className="modal-backdrop open" onClick={(e) => e.target.classList.contains('modal-backdrop') && setIsCreateModalOpen(false)}>
          <div className="modal">
            <div className="modal-title">📄 Nueva norma</div>
            <form onSubmit={handleCrearNorma}>
              <div className="modal-grid">
                <div className="form-group">
                  <label>Tipo</label>
                  <select value={nTipo} onChange={(e) => setNTipo(e.target.value)}>
                    <option value="ORDENANZA">ORDENANZA</option>
                    <option value="DECRETO">DECRETO</option>
                    <option value="RESOLUCION">RESOLUCION</option>
                    <option value="COMUNICACION">COMUNICACION</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Origen</label>
                  <select value={nOrigen} onChange={(e) => setNOrigen(e.target.value)}>
                    <option value="CONCEJO">CONCEJO</option>
                    <option value="EJECUTIVO">EJECUTIVO</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Número</label>
                  <input type="number" min="1" value={nNumero} onChange={(e) => setNNumero(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Año</label>
                  <input type="number" value={nAno} onChange={(e) => setNAno(e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label>Título</label>
                <input
                  type="text"
                  placeholder="Título de la norma"
                  value={nTitulo}
                  onChange={(e) => setNTitulo(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Fecha de sanción</label>
                <input type="date" value={nFecha} onChange={(e) => setNFecha(e.target.value)} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsCreateModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Crear norma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF MODAL */}
      {isPdfModalOpen && (
        <div className="modal-backdrop open" onClick={(e) => e.target.classList.contains('modal-backdrop') && setIsPdfModalOpen(false)}>
          <div className="modal">
            <div className="modal-title">📎 Subir PDF</div>
            <form onSubmit={handleSubirPdf}>
              <label className="upload-zone" htmlFor="pdf-file-input">
                <span className="icon-big">📄</span>
                <div>Hacé clic para seleccionar tu PDF</div>
                <div style={{ fontSize: '0.7rem', marginTop: '0.25rem', color: 'var(--admin-text-muted)' }}>
                  Máx. 10 MB
                </div>
                <input id="pdf-file-input" type="file" accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
              <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--admin-text-muted)', textAlign: 'center' }}>
                {pdfFilename}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsPdfModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Subir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NormasSection;
