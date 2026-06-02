import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Hammer, Clock, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import './EnConstruccion.css';

const EnConstruccion = () => {
  // Page container animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <div className="en-construccion-container">
      {/* Decorative background shapes */}
      <div className="bg-circle bg-circle-1"></div>
      <div className="bg-circle bg-circle-2"></div>

      <motion.div
        className="en-construccion-card"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated Icon Container */}
        <motion.div className="icon-container" variants={itemVariants}>
          <div className="icon-pulse"></div>
          <Hammer size={40} className="spin-slow" style={{ zIndex: 3 }} />
        </motion.div>

        {/* Badge */}
        <motion.div variants={itemVariants} className="badge-construccion">
          <span className="badge badge-accent">Próximamente</span>
        </motion.div>

        {/* Title */}
        <motion.h1 className="construccion-title" variants={itemVariants}>
          Sección en Construcción
        </motion.h1>

        {/* Subtitle */}
        <motion.p className="construccion-subtitle" variants={itemVariants}>
          Estamos digitalizando y rediseñando este canal legislativo para brindarte una plataforma de
          <strong> Gobierno Abierto</strong> moderna, ágil y 100% transparente.
        </motion.p>

        {/* Professional Details Section */}
        <motion.div className="construction-details" variants={itemVariants}>
          <div className="detail-item">
            <ShieldCheck size={18} />
            <span>Integridad de datos y acceso al Boletín Oficial Municipal.</span>
          </div>
          <div className="detail-item">
            <Clock size={18} />
            <span>Habilitación planificada para el próximo período legislativo.</span>
          </div>
          <div className="detail-item">
            <Sparkles size={18} />
            <span>Nuevas herramientas interactivas de participación y control ciudadano.</span>
          </div>
        </motion.div>

        {/* Navigation Actions */}
        <motion.div className="actions-container" variants={itemVariants}>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={16} /> Volver al Inicio
          </Link>
          <Link to="/tramites" className="btn btn-secondary">
            Mesa de Entradas Digital
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EnConstruccion;
