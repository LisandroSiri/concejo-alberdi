import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Download, Calendar, Eye, X, Filter, ArrowUpDown, RotateCcw } from 'lucide-react';
import './Normativas.css';

const Normativas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedYear, setSelectedYear] = useState('Todos');
  const [selectedMonth, setSelectedMonth] = useState('Todos');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest
  const [activePdf, setActivePdf] = useState(null);
  const [downloadingDocId, setDownloadingDocId] = useState(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (activePdf) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activePdf]);

  const documentTypes = ['Todos', 'Ordenanza', 'Resolución', 'Decreto'];
  const yearsList = ['Todos', '2026', '2025', '2024'];
  const monthsList = [
    { value: 'Todos', label: 'Todos los meses' },
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' }
  ];

  const normativasList = [
    {
      id: "ORD-2026-1024",
      type: "Ordenanza",
      title: "Plan integral de movilidad sustentable y ciclovías urbanas",
      description: "Establece el trazado definitivo de la red de ciclovías de la zona céntrica, reglamenta el uso de monopatines eléctricos y promueve el transporte no motorizado.",
      date: "14/05/2026",
      size: "2.4 MB",
      author: "Comisión de Transporte",
      contentSimulated: "ORDENANZA Nº 1024/2026\n\nArtículo 1º: Créase el Plan Integral de Movilidad Sustentable para la Ciudad, el cual tendrá por objeto promover el uso de transportes alternativos de baja emisión contaminante...\n\nArtículo 2º: Establécese el trazado obligatorio de ciclovías en las avenidas principales...\n\nArtículo 3º: Regúlese la circulación de Vehículos de Movilidad Personal (VMP)..."
    },
    {
      id: "RES-2026-0042",
      type: "Resolución",
      title: "Convocatoria a audiencia pública para el tratamiento tarifario de agua corriente",
      description: "Convoca a los vecinos y asociaciones de consumidores a participar de la audiencia pública del día 12 de Junio en el Salón de Sesiones del Honorable Concejo.",
      date: "10/05/2026",
      size: "1.1 MB",
      author: "Presidencia del Concejo",
      contentSimulated: "RESOLUCIÓN Nº 42/2026\n\nArtículo 1º: Convocar a Audiencia Pública para el tratamiento de la readecuación tarifaria del servicio de distribución de agua corriente...\n\nArtículo 2º: La misma tendrá lugar el día 12 de Junio de 2026 a las 10:00 hs en la sede del Honorable Concejo Deliberante..."
    },
    {
      id: "DEC-2026-0158",
      type: "Decreto",
      title: "Promulgación de la ordenanza de reforestación del arbolado público",
      description: "Decreto del Poder Ejecutivo Municipal que promulga y ordena publicar la Ordenanza sobre plantación obligatoria de especies nativas en frentes de viviendas.",
      date: "05/05/2026",
      size: "870 KB",
      author: "Poder Ejecutivo",
      contentSimulated: "DECRETO Nº 158/2026\n\nVISTO: La Ordenanza sancionada por el Honorable Concejo Deliberante sobre Reforestación del Arbolado Público...\n\nEL INTENDENTE MUNICIPAL DECRETA:\n\nArtículo 1º: Téngase por Ordenanza de la Ciudad la norma Nº 1021/2026. Cúmplase, comuníquese, publíquese y archívese."
    },
    {
      id: "ORD-2026-1021",
      type: "Ordenanza",
      title: "Regulación de arbolado público y especies nativas",
      description: "Regula la protección, conservación y reposición del arbolado público urbano. Obliga al uso de especies nativas para fomentar la biodiversidad y mitigar islas de calor.",
      date: "28/04/2026",
      size: "3.2 MB",
      author: "Comisión de Ecología",
      contentSimulated: "ORDENANZA Nº 1021/2026\n\nArtículo 1º: Declárase de interés público municipal el arbolado público de la ciudad...\n\nArtículo 2º: Queda prohibida la extracción de árboles públicos sin autorización escrita previa de la Dirección de Espacios Verdes...\n\nArtículo 3º: Todo frente residencial deberá contar con al menos un ejemplar arbóreo de la lista oficial de nativas..."
    },
    {
      id: "RES-2026-0038",
      type: "Resolución",
      title: "Declaración de interés municipal a las Jornadas de Software Libre",
      description: "Declara de Interés del Concejo Deliberante a las 5º Jornadas Tecnológicas Regionales de Software Libre organizadas por la Universidad local.",
      date: "20/04/2026",
      size: "950 KB",
      author: "Comisión de Cultura y Educación",
      contentSimulated: "RESOLUCIÓN Nº 38/2026\n\nArtículo 1º: Declarar de Interés Legislativo Municipal a las '5º Jornadas Regionales de Software Libre' a realizarse los días 10 y 11 de Junio...\n\nArtículo 2º: Entréguese copia en pergamino oficial a las autoridades organizadoras..."
    },
    {
      id: "ORD-2025-0995",
      type: "Ordenanza",
      title: "Presupuesto General de Gastos y Cálculo de Recursos 2026",
      description: "Aprueba el presupuesto municipal de gastos y recursos de la administración pública para el ejercicio correspondiente al año 2026.",
      date: "18/12/2025",
      size: "4.8 MB",
      author: "Comisión de Hacienda",
      contentSimulated: "ORDENANZA Nº 995/2025\n\nArtículo 1º: Apruébese el Presupuesto General de Gastos y Cálculo de Recursos para la Administración Municipal del Ejercicio 2026...\n\nArtículo 2º: Fíjase en la suma correspondiente el total de erogaciones corrientes y de capital...\n\nArtículo 3º: Estímase en la suma correspondiente el cálculo de recursos destinados a financiar..."
    },
    {
      id: "DEC-2025-0412",
      type: "Decreto",
      title: "Plan Especial de Forestación y Parquización 'Pulmones Verdes'",
      description: "Establece la plantación de 10.000 árboles nativos en espacios urbanos degradados y la creación de tres nuevos parques públicos.",
      date: "14/09/2025",
      size: "1.5 MB",
      author: "Poder Ejecutivo",
      contentSimulated: "DECRETO Nº 412/2025\n\nVISTO: La necesidad de expandir los espacios verdes de la ciudad y mitigar los efectos del cambio climático...\n\nEL INTENDENTE MUNICIPAL DECRETA:\n\nArtículo 1º: Apruébese el Plan Especial de Forestación y Parquización denominado 'Pulmones Verdes'...\n\nArtículo 2º: Desígnense las partidas correspondientes para la adquisición de ejemplares nativos..."
    },
    {
      id: "RES-2024-0012",
      type: "Resolución",
      title: "Adhesión a la Ley Nacional de Cupo Femenino en Eventos Musicales",
      description: "Adhiere a las normativas de equidad de género para todos los festivales, espectáculos artísticos y culturales financiados por la municipalidad.",
      date: "05/03/2024",
      size: "1.2 MB",
      author: "Comisión de Derechos Humanos",
      contentSimulated: "RESOLUCIÓN Nº 12/2024\n\nArtículo 1º: Adherir en todos sus términos a la Ley Nacional de Cupo Femenino y de acceso de artistas mujeres a eventos musicales...\n\nArtículo 2º: Será autoridad de aplicación la Dirección de Cultura Municipal en coordinación con las áreas correspondientes..."
    }
  ];

  // Logic to dynamically generate and download the official document transcription
  const handleDownload = (doc) => {
    setDownloadingDocId(doc.id);
    
    // Soft delay to simulate a real secure server generation (premium micro-interaction!)
    setTimeout(() => {
      const headerLine = "=".repeat(72);
      const dividerLine = "-".repeat(72);
      const textToDownload = `${headerLine}
                 HONORABLE CONCEJO DELIBERANTE DE LA CIUDAD
                         DIGESTO JURÍDICO OFICIAL
${headerLine}
REGISTRO DIGITAL OFICIAL - EXPEDIENTE: ${doc.id}

Tipo de Norma:      ${doc.type}
Número Registro:    ${doc.id}
Fecha de Sanción:   ${doc.date}
Área Iniciadora:    ${doc.author}
Validez Legal:      Firma Digital Certificada / Copia Oficial Accesible
Tamaño del Archivo: ${doc.size}

${dividerLine}
TEXTO DE ORDENANZA / RESOLUCIÓN / DECRETO:
${doc.title.toUpperCase()}
${dividerLine}

${doc.contentSimulated}

${dividerLine}
Este documento constituye una transcripción fiel y oficial del Digesto Jurídico.
Honorable Concejo Deliberante de la Ciudad. Todos los derechos reservados.
${headerLine}`;

      // Create blob, object URL, and trigger download
      const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = url;
      tempLink.download = `${doc.id}_DIGESTO_OFICIAL.txt`;
      document.body.appendChild(tempLink);
      tempLink.click();
      
      // Cleanup
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(url);
      setDownloadingDocId(null);
    }, 800);
  };

  const filteredNormativas = normativasList.filter(doc => {
    // 1. Search term
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Type
    const matchesType = selectedType === 'Todos' || doc.type === selectedType;
    
    // Parse date parts
    const dateParts = doc.date.split('/');
    const docYear = dateParts[2];
    const docMonth = dateParts[1];
    
    // 3. Year
    const matchesYear = selectedYear === 'Todos' || docYear === selectedYear;
    
    // 4. Month
    const matchesMonth = selectedMonth === 'Todos' || docMonth === selectedMonth;
    
    return matchesSearch && matchesType && matchesYear && matchesMonth;
  });

  // Sort normativas
  const sortedNormativas = [...filteredNormativas].sort((a, b) => {
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('/');
      return new Date(year, month - 1, day);
    };
    
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    
    return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const hasActiveFilters = searchTerm !== '' || selectedType !== 'Todos' || selectedYear !== 'Todos' || selectedMonth !== 'Todos' || sortBy !== 'newest';

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('Todos');
    setSelectedYear('Todos');
    setSelectedMonth('Todos');
    setSortBy('newest');
  };

  return (
    <motion.div
      className={`normativas-page container section ${activePdf ? 'modal-open' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="section-title">
        <span className="badge badge-primary">Digesto Jurídico</span>
        <h2 className="serif-title" style={{ marginTop: '0.5rem' }}>Normativas y Resoluciones</h2>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-bar card">
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '1rem' }}>
          <div style={{ display: 'flex', width: '100%', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                className="form-input search-input"
                placeholder="Buscar por número, título o palabra clave (ej. ciclovía, arbolado)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="type-filters">
              {documentTypes.map(type => (
                <button
                  key={type}
                  className={`filter-btn ${selectedType === type ? 'active' : ''}`}
                  onClick={() => setSelectedType(type)}
                >
                  {type === 'Todos' ? 'Todos' : `${type}s`}
                </button>
              ))}
            </div>
          </div>

          {/* Date and Sorting Extra Filters (Premium Feature) */}
          <div className="extra-filters">
            <div className="filter-select-group">
              <span className="filter-select-label">
                <Filter size={12} /> Filtrar por Año
              </span>
              <select
                className="filter-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {yearsList.map(year => (
                  <option key={year} value={year}>{year === 'Todos' ? 'Todos los años' : year}</option>
                ))}
              </select>
            </div>

            <div className="filter-select-group">
              <span className="filter-select-label">
                <Filter size={12} /> Filtrar por Mes
              </span>
              <select
                className="filter-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {monthsList.map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
            </div>

            <div className="filter-select-group">
              <span className="filter-select-label">
                <ArrowUpDown size={12} /> Ordenar
              </span>
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Más recientes primero</option>
                <option value="oldest">Más antiguas primero</option>
              </select>
            </div>

            <AnimatePresence>
              {hasActiveFilters && (
                <motion.button
                  className="btn btn-secondary reset-filters-btn"
                  onClick={handleResetFilters}
                  initial={{ opacity: 0, scale: 0.9, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <RotateCcw size={14} /> Limpiar Filtros
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>


      {/* Results List */}
      <div className="normativas-list" style={{ marginTop: '2rem' }}>
        <AnimatePresence mode="popLayout">
          {sortedNormativas.length > 0 ? (
            sortedNormativas.map((doc) => (
              <motion.div
                key={doc.id}
                className="card norm-card"
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <div className="norm-card-header">
                  <div className="norm-type">
                    <FileText size={24} className="primary-color" />
                    <div>
                      <span className={`badge ${doc.type === 'Ordenanza' ? 'badge-primary' :
                          doc.type === 'Resolución' ? 'badge-teal' : 'badge-accent'
                        }`}>{doc.type}</span>
                      <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.15rem' }}>{doc.id}</h3>
                    </div>
                  </div>
                  <div className="norm-date">
                    <Calendar size={14} />
                    <span>Sancionado: {doc.date}</span>
                  </div>
                </div>

                <div className="norm-card-body">
                  <h4 className="serif-title" style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{doc.title}</h4>
                  <p style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>{doc.description}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span>Iniciador: <strong>{doc.author}</strong></span>
                    <span>Tamaño: {doc.size}</span>
                  </div>
                </div>

                <div className="norm-card-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setActivePdf(doc)}
                    style={{ flex: 1 }}
                  >
                    <Eye size={16} /> Previsualizar PDF
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleDownload(doc)}
                    style={{ flex: 1 }}
                    disabled={downloadingDocId === doc.id}
                  >
                    <Download size={16} /> {downloadingDocId === doc.id ? 'Descargando...' : 'Descargar PDF'}
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              className="card text-center"
              style={{ padding: '3rem', color: 'var(--text-muted)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <FileText size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.3 }} />
              <h3>No se encontraron normativas</h3>
              <p>Prueba a cambiar los términos de búsqueda o selecciona otro filtro de documentos.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PDF View Modal */}
      <AnimatePresence>
        {activePdf && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePdf(null)}
          >
            <motion.div
              className="modal-content card glass"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <span className="badge badge-primary">{activePdf.type}</span>
                  <h3 className="serif-title" style={{ fontSize: '1.4rem' }}>{activePdf.id}</h3>
                </div>
                <button className="close-btn" onClick={() => setActivePdf(null)}>
                  <X size={20} />
                </button>
              </div>

              <div className="pdf-sim-viewport">
                <div className="pdf-page-sim">
                  <div className="pdf-sim-header">
                    <h4>HONORABLE CONCEJO DELIBERANTE</h4>
                    <span>Digesto Legislativo Oficial</span>
                  </div>
                  <hr style={{ margin: '1rem 0', borderColor: 'var(--border)' }} />

                  <div className="pdf-sim-body">
                    <h3 className="serif-title" style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.3rem' }}>
                      {activePdf.title.toUpperCase()}
                    </h3>

                    <div style={{ whiteSpace: 'pre-wrap', fontStyle: 'normal', fontSize: '0.9rem', lineHeight: '1.7', color: 'var(--text-main)' }}>
                      {activePdf.contentSimulated}
                    </div>
                  </div>

                  <div className="pdf-sim-footer">
                    <span>Página 1 de 1</span>
                    <span>Municipalidad de la Ciudad</span>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Archivo oficial firmado digitalmente • {activePdf.size}
                </span>
                <button
                  className="btn btn-primary"
                  onClick={() => { handleDownload(activePdf); setActivePdf(null); }}
                  disabled={downloadingDocId === activePdf.id}
                >
                  <Download size={16} /> {downloadingDocId === activePdf.id ? 'Descargando...' : 'Descargar Original'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Normativas;
