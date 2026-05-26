import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Send, FileText, Landmark, Clock, ShieldAlert } from 'lucide-react';
import FileUploader from '../components/FileUploader';
import './Tramites.css';

const Tramites = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    category: 'Urbanismo y Obras Públicas',
    title: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');

  const categories = [
    'Urbanismo y Obras Públicas',
    'Cultura, Educación y Deportes',
    'Hacienda y Presupuesto',
    'Salud, Ecología y Medio Ambiente',
    'Seguridad Ciudadana y Tránsito',
    'Otros Asuntos Legales'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.title || !formData.description) {
      alert("Por favor complete todos los campos obligatorios.");
      return;
    }

    setIsSubmitting(true);

    // Simulate submission to council servers
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Generate standard tracking code
      const code = "EXP-" + Math.floor(100000 + Math.random() * 900000) + "/26";
      setTrackingCode(code);
    }, 2000);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      category: 'Urbanismo y Obras Públicas',
      title: '',
      description: ''
    });
    setIsSuccess(false);
    setTrackingCode('');
  };

  return (
    <motion.div 
      className="tramites-page container section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="section-title">
        <span className="badge badge-accent">Participación Ciudadana</span>
        <h2 className="serif-title" style={{ marginTop: '0.5rem' }}>Mesa de Entradas Digital</h2>
        <p>Presenta tus propuestas de proyectos legislativos, reclamos formales o iniciativas particulares ante el Concejo Deliberante de la Ciudad.</p>
      </div>

      <div className="tramites-layout">
        {/* Left Side: Instructions and Legal Info */}
        <motion.div 
          className="tramites-info"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="card glass info-accent-card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Landmark size={20} className="primary-color" /> Guía de Presentación
            </h3>
            <p style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>
              De acuerdo con la reglamentación de <strong>Iniciativa Popular</strong>, cualquier vecino o asociación civil puede elevar propuestas para su debate legislativo en comisión.
            </p>
            <div className="steps-bullets">
              <div className="step-bullet">
                <div className="step-num">1</div>
                <div>
                  <strong>Completa tus datos:</strong> Información verídica de contacto para notificaciones oficiales.
                </div>
              </div>
              <div className="step-bullet">
                <div className="step-num">2</div>
                <div>
                  <strong>Detalla el Proyecto:</strong> Explica la fundamentación, objetivos y justificación de tu propuesta.
                </div>
              </div>
              <div className="step-bullet">
                <div className="step-num">3</div>
                <div>
                  <strong>Adjunta PDF con Firma:</strong> Sube la documentación complementaria o firmas de adhesión en formato PDF.
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ backgroundColor: 'var(--primary-light)', border: 'none' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
              <Clock size={16} /> Plazos de tramitación
            </h4>
            <p style={{ fontSize: '0.85rem' }}>
              Una vez presentado el trámite, Mesa de Entradas auditará el archivo PDF en un lapso de 48 horas hábiles. Luego se le asignará la comisión legislativa correspondiente y recibirás un mail de aviso.
            </p>
          </div>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div 
          className="tramites-form-container card"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form 
                onSubmit={handleSubmit}
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="serif-title" style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Formulario de Iniciativa Popular</h3>
                
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Nombre y Apellido *</label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-input"
                      placeholder="Ej. Juan Pérez"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Correo Electrónico *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      placeholder="Ej. jperez@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Teléfono de Contacto</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      placeholder="Ej. +54 381 555-5555"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Comisión de Interés *</label>
                    <select
                      name="category"
                      className="form-input"
                      value={formData.category}
                      onChange={handleInputChange}
                      style={{ height: '2.8rem' }}
                    >
                      {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Título del Proyecto / Asunto *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-input"
                    placeholder="Ej. Proyecto de Arbolado de Veredas en Barrio Norte"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Descripción Breve / Resumen *</label>
                  <textarea
                    name="description"
                    className="form-input"
                    rows="4"
                    placeholder="Describe de qué trata tu propuesta legislativa, cuáles son los beneficios para los vecinos y qué ordenanza planteas crear o reformar..."
                    value={formData.description}
                    onChange={handleInputChange}
                    style={{ resize: 'vertical' }}
                    required
                  />
                </div>

                {/* File Uploader Component */}
                <div className="form-group" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
                  <label className="form-label">Documentación Técnica / Firmas (PDF)</label>
                  <FileUploader />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{ width: '100%', gap: '0.8rem', height: '3.2rem', fontSize: '1rem' }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div> Procesando Presentación...
                    </>
                  ) : (
                    <>
                      Presentar Proyecto Oficial <Send size={18} />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                className="success-state text-center"
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{ padding: '2rem 1rem' }}
              >
                <div className="success-icon-wrapper" style={{ margin: '0 auto 1.5rem auto' }}>
                  <CheckCircle2 size={64} className="teal-color" />
                </div>
                
                <h2 className="serif-title" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>¡Trámite Presentado!</h2>
                <p style={{ marginBottom: '1.5rem' }}>
                  Tu iniciativa popular ha sido radicada con éxito en la Mesa de Entradas Digital del Honorable Concejo Deliberante.
                </p>

                <div className="tracking-code-box card" style={{ backgroundColor: 'var(--primary-light)', padding: '1.5rem', marginBottom: '2rem', border: '1px dashed var(--primary)' }}>
                  <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)', fontWeight: '600' }}>
                    Código de Expediente de Seguimiento
                  </span>
                  <h3 style={{ fontSize: '2rem', margin: '0.5rem 0', fontFamily: 'monospace', color: 'var(--text-main)' }}>
                    {trackingCode}
                  </h3>
                  <p style={{ fontSize: '0.8rem', margin: 0 }}>
                    Guarda este código para consultar el avance de las comisiones parlamentarias.
                  </p>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                  Hemos enviado una confirmación formal a tu casilla de correo electrónico <strong>{formData.email}</strong> con los detalles del proyecto y copia de los archivos recibidos.
                </p>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={resetForm}>
                    Presentar otro Proyecto
                  </button>
                  <a href="/normativas" className="btn btn-primary" style={{ flex: 1 }}>
                    Ver Digesto de Normativas
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Tramites;
