import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, Calendar, FileText, Users, ArrowRight, ShieldCheck, FlameKindling, Info, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSesionesRecientes } from '../data/agendaData';
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
        {/* Abstract decorative shapes in CSS */}
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
              <h3> Digesto Digital</h3>
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
                <ShieldCheck size={20} /> Transparencia Activa
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
    </motion.main>
  );
};

export default Home;
