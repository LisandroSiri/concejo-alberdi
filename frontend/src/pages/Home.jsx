import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Landmark,
  Calendar,
  FileText,
  Users,
  ArrowRight,
  Info,
  BadgeCheck,
  Play,
  X,
  ExternalLink,
  Clock,
  MapPin,
  Mail,
  Phone,
  Radio,
  Video,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSesionesRecientes } from '../data/agendaData';
import { fetchYouTubeBroadcasts } from '../services/youtubeService';
import './Home.css';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const recentSessions = getSesionesRecientes(4);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados dinámicos de YouTube Data API (live y completed)
  const [activeTab, setActiveTab] = useState('completed'); // 'completed' | 'live'
  const [completedVideos, setCompletedVideos] = useState([]);
  const [liveVideo, setLiveVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const [liveRes, completedRes] = await Promise.all([
        fetchYouTubeBroadcasts({ eventType: 'live', maxResults: 1 }),
        fetchYouTubeBroadcasts({ eventType: 'completed', maxResults: 8 })
      ]);

      setLiveVideo(liveRes.items?.[0] || null);
      setCompletedVideos(completedRes.items || []);
      setStatusMessage(completedRes.isFallback && completedRes.message ? completedRes.message : null);
    } catch (err) {
      console.error('Error al actualizar transmisiones de YouTube:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    Promise.all([
      fetchYouTubeBroadcasts({ eventType: 'live', maxResults: 1 }),
      fetchYouTubeBroadcasts({ eventType: 'completed', maxResults: 8 })
    ])
      .then(([liveRes, completedRes]) => {
        if (ignore) return;
        setLiveVideo(liveRes.items?.[0] || null);
        setCompletedVideos(completedRes.items || []);
        setStatusMessage(completedRes.isFallback && completedRes.message ? completedRes.message : null);
        setIsLoading(false);
      })
      .catch((err) => {
        if (ignore) return;
        console.error('Error al cargar transmisiones de YouTube:', err);
        setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <motion.main
      className="home-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <section className="hero-banner section">
        <div className="hero-bg">
          <img src="src/assets/consejo-hero.jpg" alt="Municipalidad" />
          <div className="hero-overlay"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <motion.div variants={itemVariants} className="badge badge-accent" style={{ gap: '0.5rem' }}>
              <BadgeCheck size={18} />
              Portal Oficial del concejo
            </motion.div>
            <motion.div variants={itemVariants} className="hero-buttons">
              <Link to="/normativas" className="btn btn-primary">
                Buscar Ordenanzas <FileText size={18} />
              </Link>
              <Link to="/tramites" className="btn btn-hero">
                Subir Proyecto Vecinal <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
        <div className="hero-bg-accent"></div>
      </section>

      {/* Access Cards */}
      <section className="quick-access section">
        <div className="container">
          <div className="grid grid-3">
            <motion.div variants={itemVariants} className="card text-center">
              <div className="icon-wrapper">
                <Landmark size={32} className="card-icon primary-color" />
              </div>
              <h3>El Concejo</h3>
              <p>Institución democrática dedicada a sancionar ordenanzas y resoluciones para el bienestar social.</p>
              <Link to="/concejales" className="card-link">Conocer concejales &rarr;</Link>
            </motion.div>

            <motion.div variants={itemVariants} className="card text-center">
              <div className="icon-wrapper">
                <FileText size={32} className="card-icon accent-color" />
              </div>
              <h3>Digesto Digital</h3>
              <p>Busca en tiempo real el registro oficial de ordenanzas, resoluciones, decretos y comunicaciones vigentes.</p>
              <Link to="/normativas" className="card-link">Explorar digesto &rarr;</Link>
            </motion.div>

            <motion.div variants={itemVariants} className="card text-center">
              <div className="icon-wrapper">
                <Users size={32} className="card-icon teal-color" />
              </div>
              <h3>Participación</h3>
              <p>El portal ciudadano te permite radicar iniciativas del vecindario, ideas legislativas y subir tus proyectos en PDF.</p>
              <Link to="/tramites" className="card-link">Iniciar trámite &rarr;</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Info & Next Session Section */}
      <section className="sessions-news section" style={{ backgroundColor: 'var(--primary-light)' }}>
        <div className="container">
          <div className="sessions-grid">
            <motion.div variants={itemVariants} className="session-left card">
              <span className="badge badge-primary">Agenda Legislativa</span>
              <h2 className="serif-title" style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>Próximas Sesiones</h2>
              <div className="sessions-list">
                {recentSessions.map((session) => (
                  <div key={session.id} className="session-item">
                    <div className="session-info">
                      <h4>{session.title}</h4>
                      <span>{session.fechaDisplay}</span>
                    </div>
                    <span className={`badge ${session.status === 'Próxima' ? 'badge-accent' : 'badge-primary'}`}>
                      {session.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="session-right">
              <div className="values-badge">
                Transparencia Activa
              </div>
              <h2 className="serif-title">Compromiso con el Ciudadano</h2>
              <p>
                Este concejo promueve un gobierno abierto. Todos los debates son de carácter público, y los archivos legislativos están disponibles en formatos PDF abiertos para libre consulta de toda la sociedad civil.
              </p>
              <div className="features-checklist">
                <div className="check-item">
                  <div className="bullet"></div>
                  <span>Acceso inmediato a normativas históricas y vigentes.</span>
                </div>
                <div className="check-item">
                  <div className="bullet"></div>
                  <span>Presentación digital de proyectos de vecinos.</span>
                </div>
                <div className="check-item">
                  <div className="bullet"></div>
                  <span>Sesiones en vivo y transmisión transparente de debates parlamentarios.</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECCIÓN: MULTIMEDIA / TRANSMISIONES (YouTube Data API v3) */}
      <section className="multimedia-section section">
        <div className="container">
          <div className="section-title">
            <span className="badge badge-accent">Multimedia</span>
            <h2 className="serif-title" style={{ marginTop: '0.5rem' }}>
              {activeTab === 'live' ? 'En Vivo Ahora' : 'Emisiones Pasadas'}
            </h2>
            <p>
              {activeTab === 'live'
                ? 'Sigue las sesiones y debates del concejo deliberante emitidos en tiempo real.'
                : 'Accede a las sesiones grabadas de nuestro concejo deliberante.'}
            </p>
          </div>

          {/* Banner si hay transmisión en vivo activa detectada */}
          {liveVideo && activeTab !== 'live' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="live-alert-banner"
            >
              <div className="live-alert-info">
                <span className="live-tag-badge">
                  <span className="live-pulse-dot"></span> EN VIVO
                </span>
                <h4 className="live-alert-title">{liveVideo.title}</h4>
              </div>
              <button
                className="btn btn-primary"
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                onClick={() => {
                  setSelectedVideo(liveVideo);
                  setIsModalOpen(true);
                }}
              >
                <Play size={16} fill="currentColor" /> Ver Transmisión en Vivo
              </button>
            </motion.div>
          )}

          {/* Selector de pestañas para segmentar contenido */}
          <div className="tabs-container">
            <div className="tabs-list">
              <button
                type="button"
                className={`tab-trigger ${activeTab === 'completed' ? 'active' : ''}`}
                onClick={() => setActiveTab('completed')}
              >
                <Video size={16} />
                <span>Emisiones Pasadas</span>
                {completedVideos.length > 0 && (
                  <span style={{ opacity: 0.85, fontSize: '0.75rem' }}>({completedVideos.length})</span>
                )}
              </button>

              <button
                type="button"
                className={`tab-trigger ${activeTab === 'live' ? 'active' : ''}`}
                onClick={() => setActiveTab('live')}
              >
                <Radio size={16} />
                <span>En Vivo Ahora</span>
                {liveVideo && <span className="live-pulse-dot" title="Transmisión activa"></span>}
              </button>
            </div>
          </div>

          {/* Aviso informativo de contingencia o ayuda si falta configurar variables */}
          {statusMessage && (
            <div className="fallback-badge-banner">
              <Info size={16} style={{ flexShrink: 0, color: 'var(--accent)' }} />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Renderizado condicional según estado y pestaña activa */}
          {isLoading ? (
            <div className="video-grid">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="video-skeleton-card">
                  <div className="skeleton-thumb"></div>
                  <div className="skeleton-body">
                    <div className="skeleton-line" style={{ width: '80%' }}></div>
                    <div className="skeleton-line" style={{ width: '60%' }}></div>
                    <div className="skeleton-line" style={{ width: '40%', marginTop: 'auto' }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === 'completed' ? (
            completedVideos.length === 0 ? (
              <div className="empty-multimedia">
                <div className="empty-multimedia-icon">
                  <Video size={28} />
                </div>
                <h3>Sin emisiones pasadas</h3>
                <p>No se encontraron registros de directos finalizados en el canal oficial.</p>
                <button className="btn btn-primary" onClick={handleRefresh}>
                  <RefreshCw size={16} /> Reintentar
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="video-grid"
              >
                {completedVideos.map((video) => (
                  <div
                    key={video.id}
                    className="video-card"
                    onClick={() => {
                      setSelectedVideo(video);
                      setIsModalOpen(true);
                    }}
                  >
                    <div className="video-thumbnail-container">
                      <span className="badge badge-primary video-badge">{video.category}</span>
                      <img
                        src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                        alt={video.title}
                        className="video-thumbnail"
                        loading="lazy"
                      />
                      <div className="play-overlay">
                        <div className="play-icon-btn">
                          <Play size={20} fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    <div className="video-card-body">
                      <h3 className="video-card-title">{video.title}</h3>
                      <div className="video-card-meta">
                        <div className="meta-item">
                          <Calendar size={14} />
                          <span>{video.dateDisplay}</span>
                        </div>
                        <div className="meta-item">
                          <Clock size={14} />
                          <span>{video.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )
          ) : (
            /* Pestaña: EN VIVO AHORA (eventType: 'live') */
            liveVideo ? (
              <div className="video-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '820px', margin: '0 auto' }}>
                <div
                  className="video-card"
                  onClick={() => {
                    setSelectedVideo(liveVideo);
                    setIsModalOpen(true);
                  }}
                >
                  <div className="video-thumbnail-container" style={{ aspectRatio: '16/9' }}>
                    <span className="live-tag-badge video-badge" style={{ zIndex: 3 }}>
                      <span className="live-pulse-dot"></span> EN DIRECTO AHORA
                    </span>
                    <img
                      src={liveVideo.thumbnailUrl || `https://img.youtube.com/vi/${liveVideo.youtubeId}/hqdefault.jpg`}
                      alt={liveVideo.title}
                      className="video-thumbnail"
                    />
                    <div className="play-overlay" style={{ opacity: 1, background: 'rgba(0, 0, 0, 0.35)' }}>
                      <div className="play-icon-btn" style={{ width: '64px', height: '64px' }}>
                        <Play size={28} fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="video-card-body">
                    <h3 className="video-card-title" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                      {liveVideo.title}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                      {liveVideo.description}
                    </p>
                    <div className="video-card-meta">
                      <div className="meta-item">
                        <Radio size={15} style={{ color: '#ef4444' }} />
                        <span style={{ color: '#ef4444', fontWeight: 600 }}>Emitiendo en tiempo real</span>
                      </div>
                      <div className="meta-item">
                        <MapPin size={15} />
                        <span>{liveVideo.locationName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-multimedia">
                <div className="empty-multimedia-icon">
                  <Radio size={28} />
                </div>
                <h3>Sin transmisiones en vivo en este momento</h3>
                <p>
                  El Concejo Deliberante no tiene emisiones en directo activas en este instante.
                  Las sesiones parlamentarias se transmiten de manera pública durante los días y horarios fijados por la agenda legislativa.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" onClick={() => setActiveTab('completed')}>
                    <Video size={16} /> Ver Emisiones Pasadas
                  </button>
                  <button className="btn btn-hero" onClick={handleRefresh}>
                    <RefreshCw size={16} /> Actualizar Estado
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* SECCIÓN: UBICACIÓN DEL RECINTO (Mapa) */}
      <section className="multimedia-section section" style={{ backgroundColor: 'var(--primary-light)' }}>
        <div className="container">
          <div className="section-title">
            <span className="badge badge-teal">Ubicación</span>
            <h2 className="serif-title" style={{ marginTop: '0.5rem' }}>Ubicación del Recinto</h2>
            <p>Conoce la ubicación exacta de nuestro recinto legislativo.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="map-grid"
          >
            <div className="card map-info-card">
              <div className="map-info-header">
                <span className="badge badge-teal">Contacto y Sede</span>
                <h3 className="serif-title" style={{ marginTop: '0.75rem' }}>Honorable Concejo Deliberante</h3>
                <p>Nuestra sede legislativa está abierta para la participación de todos los vecinos.</p>
              </div>
              <div className="map-info-list">
                <div className="map-info-item">
                  <div className="icon-box">
                    <MapPin size={20} />
                  </div>
                  <div className="map-info-text">
                    <h4>Dirección Sede</h4>
                    <p>Lidoro Quinteros y Manuel Campero</p>
                    <span>Juan Bautista Alberdi, Tucumán, Argentina</span>
                  </div>
                </div>
                <div className="map-info-item">
                  <div className="icon-box">
                    <Phone size={20} />
                  </div>
                  <div className="map-info-text">
                    <h4>Teléfono de Atención</h4>
                    <p>+54 (381) 888-8888</p>
                    <span>Lunes a Viernes de 8:00 a 13:00 hs</span>
                  </div>
                </div>
                <div className="map-info-item">
                  <div className="icon-box">
                    <Mail size={20} />
                  </div>
                  <div className="map-info-text">
                    <h4>Correo Electrónico</h4>
                    <a href="mailto:info@consejo.gob.ar" style={{ color: 'var(--primary)', fontWeight: 500 }}>
                      info@consejo.gob.ar
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="map-container">
              <iframe
                title="Mapa de ubicación del Concejo Deliberante"
                className="map-iframe"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d566.5126258366333!2d-65.6165325043218!3d-27.587393202438044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9423e8fe4762c315%3A0x992a4002d031a4f3!2sMunicipalidad%20de%20Juan%20Bautista%20Alberdi!5e1!3m2!1ses-419!2sar!4v1782266596284!5m2!1ses-419!2sar"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Preview Lightbox/Modal */}
      {isModalOpen && selectedVideo && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)} aria-label="Cerrar reproductor">
              <X size={18} />
            </button>
            <div className="modal-video-container">
              <iframe
                title={selectedVideo.title}
                className="modal-video-iframe"
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="modal-body">
              <div className="modal-meta-row">
                <span
                  className="badge badge-accent"
                  style={
                    selectedVideo.isLive
                      ? { backgroundColor: '#ef4444', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }
                      : {}
                  }
                >
                  {selectedVideo.isLive && <span className="live-pulse-dot" style={{ width: '7px', height: '7px' }}></span>}
                  {selectedVideo.isLive ? 'EN VIVO AHORA' : selectedVideo.category}
                </span>
                <div className="meta-item" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                  <Calendar size={14} style={{ marginRight: '0.25rem' }} />
                  {selectedVideo.dateDisplay}
                </div>
                <div className="meta-item" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                  <Clock size={14} style={{ marginRight: '0.25rem' }} />
                  Duración: {selectedVideo.duration}
                </div>
              </div>
              <h3 className="modal-title">{selectedVideo.title}</h3>
              <p className="modal-desc">{selectedVideo.description}</p>
            </div>
            <div className="modal-footer">
              <div className="modal-location">
                <MapPin size={16} style={{ color: 'var(--accent)' }} />
                <span>Lugar de sesión: {selectedVideo.locationName}</span>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
              >
                Ver en YouTube <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </motion.main>
  );
};

export default Home;